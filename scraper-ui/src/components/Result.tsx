import React, { useState } from 'react';

interface ResultProps {
  data: any;
}

const Result: React.FC<ResultProps> = ({ data }) => {
  const [view, setView] = useState<'json' | 'links' | 'related'>('json');
  
  if (data.error) {
    return <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">Error: {data.error}</div>;
  }

  // Determine if the data has links or related links
  const hasLinks = data.links || data.all_links;
  const hasRelatedLinks = data.related_links;
  
  // Get the appropriate links array based on the data structure
  const getLinks = () => {
    if (data.links) return data.links;
    if (data.all_links) return data.all_links;
    return [];
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Result</h2>
      
      {/* View toggle buttons if we have links */}
      {(hasLinks || hasRelatedLinks) && (
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-3 py-1 rounded ${view === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('json')}
          >
            JSON View
          </button>
          {hasLinks && (
            <button 
              className={`px-3 py-1 rounded ${view === 'links' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setView('links')}
            >
              Links
            </button>
          )}
          {hasRelatedLinks && (
            <button 
              className={`px-3 py-1 rounded ${view === 'related' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setView('related')}
            >
              Related Links
            </button>
          )}
        </div>
      )}
      
      {/* Display the appropriate view */}
      {view === 'json' && (
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[70vh]">
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      {view === 'links' && hasLinks && (
        <div className="bg-white border rounded p-4 overflow-auto max-h-[70vh]">
          <h3 className="text-lg font-semibold mb-2">Links ({getLinks().length})</h3>
          <ul className="divide-y">
            {getLinks().map((link: string, index: number) => (
              <li key={index} className="py-2">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {view === 'related' && hasRelatedLinks && (
        <div className="bg-white border rounded p-4 overflow-auto max-h-[70vh]">
          <h3 className="text-lg font-semibold mb-2">Related Links ({data.related_links.length})</h3>
          <ul className="divide-y">
            {data.related_links.map((link: string, index: number) => (
              <li key={index} className="py-2">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Show stats if available */}
      {data.total_found !== undefined && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">
          Found {data.total_found} of {data.total_requested} requested URLs
        </div>
      )}
    </div>
  );
};

export default Result;