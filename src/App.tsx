import React, { useState, useCallback } from 'react';
import { FileText, Link, Search, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import SwaggerParser from '@apidevtools/swagger-parser';
import yaml from 'js-yaml';
import CodeEditor from './components/CodeEditor';
import URLLoader from './components/URLLoader';
import ExtractionInput from './components/ExtractionInput';
import ResultDisplay from './components/ResultDisplay';

type LoadMethod = 'editor' | 'url';

interface ParsedDocument {
  original: any;
  parsed: any;
}

function App() {
  const [activeTab, setActiveTab] = useState<LoadMethod>('editor');
  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const [extractionQuery, setExtractionQuery] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parseDocument = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Try to parse as JSON first, then YAML
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch {
        parsedContent = yaml.load(content);
      }

      // Use swagger-parser to validate and resolve references
      const api = await SwaggerParser.validate(parsedContent);
      
      setDocument({
        original: parsedContent,
        parsed: api
      });
      setSuccess('OpenAPI document loaded and validated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse document');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromURL = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const content = await response.text();
      await parseDocument(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load from URL');
      setIsLoading(false);
    }
  }, [parseDocument]);

  const extractData = useCallback(() => {
    if (!document || !extractionQuery.trim()) return;

    try {
      const query = extractionQuery.trim();
      const parts = query.split('.');
      let result = document.parsed;

      for (const part of parts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          throw new Error(`Property '${part}' not found in document`);
        }
      }

      setExtractedData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data');
      setExtractedData(null);
    }
  }, [document, extractionQuery]);

  const downloadResult = useCallback(() => {
    if (!extractedData) return;

    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `openapi-extract-${extractionQuery.replace(/\./g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [extractedData, extractionQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">OpenAPI Parser & Extractor</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Load OpenAPI/Swagger specifications from code or URL, then extract specific parts 
              like paths, schemas, or any nested property using dot notation.
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6">
              {/* Input Method Tabs */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('editor')}
                      className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'editor'
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Code Editor
                    </button>
                    <button
                      onClick={() => setActiveTab('url')}
                      className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'url'
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Link className="w-4 h-4 inline mr-2" />
                      URL Loader
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'editor' ? (
                    <CodeEditor onParse={parseDocument} isLoading={isLoading} />
                  ) : (
                    <URLLoader onLoad={loadFromURL} isLoading={isLoading} />
                  )}
                </div>
              </div>

              {/* Extraction Input */}
              {document && (
                <ExtractionInput
                  value={extractionQuery}
                  onChange={setExtractionQuery}
                  onExtract={extractData}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {document && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Document Info</h3>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Validated
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Version:</span>
                      <span className="font-medium">{document.parsed.openapi || document.parsed.swagger || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Title:</span>
                      <span className="font-medium">{document.parsed.info?.title || 'Untitled'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Paths:</span>
                      <span className="font-medium">{Object.keys(document.parsed.paths || {}).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Schemas:</span>
                      <span className="font-medium">
                        {Object.keys(document.parsed.components?.schemas || document.parsed.definitions || {}).length}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {extractedData && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Extracted: <span className="text-blue-600">{extractionQuery}</span>
                    </h3>
                    <button
                      onClick={downloadResult}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                  <ResultDisplay data={extractedData} />
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="bg-white rounded-lg shadow-sm border p-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Processing...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Extract Data</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Common Extractions:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li><code className="bg-blue-100 px-1 rounded">paths</code> - All API endpoints</li>
                  <li><code className="bg-blue-100 px-1 rounded">components.schemas</code> - Data models</li>
                  <li><code className="bg-blue-100 px-1 rounded">info</code> - API metadata</li>
                  <li><code className="bg-blue-100 px-1 rounded">servers</code> - Server configurations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Advanced Examples:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li><code className="bg-blue-100 px-1 rounded">paths./users.get</code> - Specific endpoint</li>
                  <li><code className="bg-blue-100 px-1 rounded">components.schemas.User</code> - User schema</li>
                  <li><code className="bg-blue-100 px-1 rounded">paths./users.get.responses</code> - Response definitions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;