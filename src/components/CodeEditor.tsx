import React, { useState } from 'react';
import { Code, Upload, Loader2 } from 'lucide-react';

interface CodeEditorProps {
  onParse: (content: string) => void;
  isLoading: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onParse, isLoading }) => {
  const [content, setContent] = useState('');

  const handleParse = () => {
    if (content.trim()) {
      onParse(content);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setContent(result);
      };
      reader.readAsText(file);
    }
  };

  const sampleOpenAPI = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API for demonstration
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <Code className="w-4 h-4 inline mr-1" />
          OpenAPI Document (YAML or JSON)
        </label>
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
            <Upload className="w-4 h-4 inline mr-1" />
            Upload File
            <input
              type="file"
              accept=".json,.yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setContent(sampleOpenAPI)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Load Sample
          </button>
        </div>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
        placeholder="Paste your OpenAPI specification here..."
      />
      
      <button
        onClick={handleParse}
        disabled={!content.trim() || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Parsing...
          </>
        ) : (
          'Parse Document'
        )}
      </button>
    </div>
  );
};

export default CodeEditor;