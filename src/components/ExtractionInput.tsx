import React from 'react';
import { Search, HelpCircle } from 'lucide-react';

interface ExtractionInputProps {
  value: string;
  onChange: (value: string) => void;
  onExtract: () => void;
  isLoading: boolean;
}

const ExtractionInput: React.FC<ExtractionInputProps> = ({
  value,
  onChange,
  onExtract,
  isLoading
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onExtract();
    }
  };

  const quickExtracts = [
    { label: 'Paths', value: 'paths' },
    { label: 'Schemas', value: 'components.schemas' },
    { label: 'Info', value: 'info' },
    { label: 'Servers', value: 'servers' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Extract Data</h3>
        <div className="ml-auto group relative">
          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 z-10">
            Use dot notation to extract nested properties (e.g., "components.schemas.User")
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., paths, components.schemas, info"
          />
          <button
            onClick={onExtract}
            disabled={!value.trim() || isLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Extract
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Quick extracts:</p>
          <div className="flex flex-wrap gap-2">
            {quickExtracts.map((extract) => (
              <button
                key={extract.value}
                onClick={() => {
                  onChange(extract.value);
                  setTimeout(onExtract, 100);
                }}
                className="text-sm px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors"
              >
                {extract.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionInput;