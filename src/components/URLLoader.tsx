import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

interface URLLoaderProps {
  onLoad: (url: string) => void;
  isLoading: boolean;
}

const URLLoader: React.FC<URLLoaderProps> = ({ onLoad, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleLoad = () => {
    if (url.trim()) {
      onLoad(url);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim()) {
      handleLoad();
    }
  };

  const sampleURLs = [
    {
      name: 'Swagger Petstore',
      url: 'https://petstore3.swagger.io/api/v3/openapi.json'
    },
    {
      name: 'JSONPlaceholder API',
      url: 'https://jsonplaceholder.typicode.com/swagger.json'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <Globe className="w-4 h-4 inline mr-1" />
        OpenAPI Document URL
      </label>
      
      <div className="flex space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://api.example.com/openapi.json"
        />
        <button
          onClick={handleLoad}
          disabled={!url.trim() || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Load'
          )}
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500">Sample URLs:</p>
        <div className="flex flex-wrap gap-2">
          {sampleURLs.map((sample) => (
            <button
              key={sample.name}
              onClick={() => setUrl(sample.url)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default URLLoader;