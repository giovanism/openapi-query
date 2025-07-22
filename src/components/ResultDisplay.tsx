import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface ResultDisplayProps {
  data: any;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={copyToClipboard}
          className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 border rounded shadow-sm transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono">
        <JsonView data={data} />
      </pre>
    </div>
  );
};

interface JsonViewProps {
  data: any;
  level?: number;
}

const JsonView: React.FC<JsonViewProps> = ({ data, level = 0 }) => {
  const [collapsed, setCollapsed] = useState(level > 2);

  if (data === null) {
    return <span className="text-red-500">null</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="text-blue-600">{data.toString()}</span>;
  }

  if (typeof data === 'number') {
    return <span className="text-green-600">{data}</span>;
  }

  if (typeof data === 'string') {
    return <span className="text-orange-600">"{data}"</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span>[]</span>;
    }

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <span className="text-gray-500">[{data.length}]</span>
        {!collapsed && (
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="my-1">
                <span className="text-gray-400">{index}: </span>
                <JsonView data={item} level={level + 1} />
                {index < data.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return <span>{'{}'}</span>;
    }

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <span className="text-gray-500">{'{'}keys: {keys.length}{'}'}</span>
        {!collapsed && (
          <div className="ml-4">
            {keys.map((key, index) => (
              <div key={key} className="my-1">
                <span className="text-purple-600">"{key}"</span>
                <span className="text-gray-400">: </span>
                <JsonView data={data[key]} level={level + 1} />
                {index < keys.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return <span>{String(data)}</span>;
};

export default ResultDisplay;