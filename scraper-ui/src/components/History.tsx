import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScrapingHistoryItem {
  url: string;
  action: string;
  timestamp: string;
  data: any;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScrapingHistoryItem[]>([]);
  const navigate = useNavigate();

  // Load history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scrapingHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Clear all history
  const clearHistory = () => {
    localStorage.removeItem('scrapingHistory');
    setHistory([]);
  };

  // Delete a specific history item
  const deleteHistoryItem = (index: number) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    localStorage.setItem('scrapingHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  // Copy data to clipboard in Markdown format
  const copyDataToClipboard = (data: any) => {
    const markdown = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    navigator.clipboard.writeText(markdown);
    alert('Data copied to clipboard in Markdown format!');
  };

  return (
    <div className="history-container">
      <div className="history-header">
      {/* <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Home
      </button> */}
        <h2>Scraping History</h2>
        <button className="clear-history-button" onClick={clearHistory}>
          Clear All History
        </button>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">No history found.</div>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-card">
              <div className="history-card-header">
                <h3 className="history-card-title">{item.url}</h3>
                <span className="history-card-timestamp">{item.timestamp}</span>
              </div>
              <div className="history-card-content">
                <pre>{JSON.stringify(item.data, null, 2)}</pre>
              </div>
              <div className="history-card-actions">
                <button
                  className="history-card-button"
                  onClick={() => navigate('/view-data', { state: { data: item.data } })}
                >
                  See Data
                </button>
                <button
                  className="history-card-button"
                  onClick={() => copyDataToClipboard(item.data)}
                >
                  Copy Data
                </button>
                <button
                  className="history-card-button"
                  onClick={() => deleteHistoryItem(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;