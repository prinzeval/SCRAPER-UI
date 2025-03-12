import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ContentItem {
  title?: string;
  content?: string;
  media_links?: string;
  url?: string;
}

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = (location.state as { data: ContentItem[] }) || { data: [] };

  // Handle no data case
  if (!data || data.length === 0) {
    return (
      <div className="container">
        <h1>NO DATA AVAILABLE</h1>
        <p>No content was retrieved from the target URL.</p>
        <button onClick={() => navigate("/")}>RETURN TO SCANNER</button>
      </div>
    );
  }

  // Format media links into array
  const formatMediaLinks = (links: string = "") => {
    if (!links) return [];
    return links.split(",").map(link => link.trim()).filter(Boolean);
  };

  return (
    <div className="container">
      <h1>SCAN RESULTS</h1>
      <div className="scan-summary">
        <p>Retrieved {data.length} item{data.length !== 1 ? 's' : ''}</p>
        <button onClick={() => navigate("/")} className="return-button">
          NEW SCAN
        </button>
      </div>

      <div className="results-container">
        {data.map((item: ContentItem, index: number) => {
          const { title, content, media_links, url } = item;
          const mediaLinksArray = formatMediaLinks(media_links);
          
          return (
            <div key={index} className="result-item">
              <h2 className="result-title">
                {title || `Result ${index + 1}`}
              </h2>
              
              {url && (
                <div className="result-source">
                  <span className="label">SOURCE:</span>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    {url}
                  </a>
                </div>
              )}
              
              {content && (
                <div className="result-section">
                  <h3>CONTENT</h3>
                  <pre className="result-content">{content}</pre>
                </div>
              )}
              
              {mediaLinksArray.length > 0 && (
                <div className="result-section">
                  <h3>MEDIA ASSETS</h3>
                  <ul className="link-list">
                    {mediaLinksArray.map((link, linkIndex) => (
                      <li key={linkIndex} className="link-item">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          {link.split('/').pop() || link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Result;