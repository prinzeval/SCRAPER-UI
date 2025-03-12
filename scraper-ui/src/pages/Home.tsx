import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Home: React.FC = () => {
  const [url, setUrl] = useState("");
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("scrape");
  const navigate = useNavigate();

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to scrape");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      switch (selectedTool) {
        case "scrape":
          response = await api.post("/scrape/", {
            url,
            whitelist,
            blacklist,
          });
          break;
        case "scrape_single_page":
          response = await api.post("/scrape_single_page/", { url });
          break;
        case "single_page_media":
          response = await api.post("/single_page_media/", { url });
          break;
        case "multiple_page_media":
          response = await api.post("/multiple_page_media/", {
            url,
            whitelist,
            blacklist,
          });
          break;
        default:
          throw new Error("Invalid tool selected");
      }
      
      // Navigate to result page with the data
      navigate("/result", { state: { data: Array.isArray(response.data) ? response.data : [response.data] } });
    } catch (err) {
      console.error(err);
      setError("An error occurred during scraping. Please check the URL and try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to fetch");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/fetch/", {
        params: { url },
      });
      navigate("/result", { state: { data: Array.isArray(response.data) ? response.data : [response.data] } });
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrape();
    }
  };

  return (
    <div className="container">
      <h1>NEURAL WEB SCRAPER</h1>
      <div className="form-container">
        <div className="input-group">
          <label htmlFor="url">TARGET URL</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to scan..."
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label htmlFor="whitelist">WHITELIST DOMAINS</label>
          <input
            id="whitelist"
            type="text"
            value={whitelist.join(", ")}
            onChange={(e) =>
              setWhitelist(e.target.value.split(",").map((item) => item.trim()).filter(Boolean))
            }
            placeholder="Enter allowed domains (comma-separated)"
          />
        </div>

        <div className="input-group">
          <label htmlFor="blacklist">BLACKLIST DOMAINS</label>
          <input
            id="blacklist"
            type="text"
            value={blacklist.join(", ")}
            onChange={(e) =>
              setBlacklist(e.target.value.split(",").map((item) => item.trim()).filter(Boolean))
            }
            placeholder="Enter blocked domains (comma-separated)"
          />
        </div>

        <div className="radio-container">
          <label className="radio-label">
            <input
              type="radio"
              value="scrape"
              checked={selectedTool === "scrape"}
              onChange={() => setSelectedTool("scrape")}
            />
            MULTI-PAGE SCAN
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="scrape_single_page"
              checked={selectedTool === "scrape_single_page"}
              onChange={() => setSelectedTool("scrape_single_page")}
            />
            SINGLE PAGE SCAN
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="single_page_media"
              checked={selectedTool === "single_page_media"}
              onChange={() => setSelectedTool("single_page_media")}
            />
            MEDIA EXTRACTION
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="multiple_page_media"
              checked={selectedTool === "multiple_page_media"}
              onChange={() => setSelectedTool("multiple_page_media")}
            />
            MULTI-PAGE MEDIA
          </label>
        </div>

        <div className="button-container">
          <button onClick={handleScrape} disabled={loading}>
            INITIATE SCAN
          </button>
          <button onClick={handleFetch} disabled={loading}>
            FETCH DATA
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-text">SCANNING TARGET...</p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Home;