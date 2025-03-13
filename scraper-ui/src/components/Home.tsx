import React, { useState } from 'react';
import {
  fetchData,
  fetchMultipleData,
  scrapeSinglePage,
  scrapeWebsite,
  extractMediaFromSinglePage,
  scrapeMultiplePagesMedia,
  extractLinksOnly,
  extractRelatedLinks, // Add this new function
} from '../api';
import Result from './Result';

const Home: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<string>(''); // For multiple URLs
  const [action, setAction] = useState<string>('fetch');
  const [whitelist, setWhitelist] = useState<string>('');
  const [blacklist, setBlacklist] = useState<string>('');
  const [linkLimit, setLinkLimit] = useState<number>(10);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      switch (action) {
        case 'fetch':
          response = await fetchData(url);
          break;
        case 'fetch_multiple':
          const urlList = urls.split(',').map((url) => url.trim());
          response = await fetchMultipleData(urlList);
          break;
        case 'scrape':
          response = await scrapeSinglePage(url);
          break;
        case 'scrape_with_params':
          const whitelistArray = whitelist.split(',').map((item) => item.trim());
          const blacklistArray = blacklist.split(',').map((item) => item.trim());
          response = await scrapeWebsite(url, whitelistArray, blacklistArray, linkLimit);
          break;
        case 'extract_media':
          response = await extractMediaFromSinglePage(url);
          break;
        case 'scrape_multiple_media':
          response = await scrapeMultiplePagesMedia(url, [], [], linkLimit);
          break;
        case 'extract_links':
          response = await extractLinksOnly(url);
          break;
        case 'extract_related_links': // New action
          response = await extractRelatedLinks(url);
          break;
        default:
          throw new Error('Invalid action');
      }
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Web Scraper UI</h1>
      <form onSubmit={handleSubmit}>
        {/* Input for single URL or multiple URLs */}
        {action === 'fetch_multiple' ? (
          <textarea
            placeholder="Enter URLs (comma-separated)"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            required
          />
        ) : (
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        )}

        {/* Dropdown for action selection */}
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="fetch">Fetch Data</option>
          <option value="fetch_multiple">Fetch Multiple URLs</option>
          <option value="scrape">Scrape Single Page</option>
          <option value="scrape_with_params">Scrape with Parameters</option>
          <option value="extract_media">Extract Media</option>
          <option value="scrape_multiple_media">Scrape Multiple Pages Media</option>
          <option value="extract_links">Extract Links Only</option>
          <option value="extract_related_links">Extract Related Links</option> {/* New option */}
        </select>

        {/* Additional inputs for whitelist, blacklist, and link limit */}
        {action === 'scrape_with_params' && (
          <>
            <input
              type="text"
              placeholder="Whitelist (comma-separated)"
              value={whitelist}
              onChange={(e) => setWhitelist(e.target.value)}
            />
            <input
              type="text"
              placeholder="Blacklist (comma-separated)"
              value={blacklist}
              onChange={(e) => setBlacklist(e.target.value)}
            />
            <input
              type="number"
              placeholder="Link Limit"
              value={linkLimit}
              onChange={(e) => setLinkLimit(Number(e.target.value))}
            />
          </>
        )}

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Display results */}
      {result && <Result data={result} />}
    </div>
  );
};

export default Home;