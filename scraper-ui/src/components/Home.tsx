import React, { useState } from 'react';
import {
  fetchData,
  fetchMultipleData,
  scrapeSinglePage,
  scrapeWebsite,
  extractMediaFromSinglePage,
  scrapeMultiplePagesMedia,
  extractAllLinksInPage,
  extractAllRelatedLinksInPage,
  extractAllLinksInMultiplePages,
  extractAllRelatedLinksInMultiplePages
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
      // Parse whitelist and blacklist for actions that need them
      const whitelistArray = whitelist.split(',').map((item) => item.trim()).filter(Boolean);
      const blacklistArray = blacklist.split(',').map((item) => item.trim()).filter(Boolean);
      
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
          response = await scrapeWebsite(url, whitelistArray, blacklistArray, linkLimit);
          break;
        case 'extract_media':
          response = await extractMediaFromSinglePage(url);
          break;
        case 'scrape_multiple_media':
          response = await scrapeMultiplePagesMedia(url, whitelistArray, blacklistArray, linkLimit);
          break;
        case 'extract_links':
          response = await extractAllLinksInPage(url);
          break;
        case 'extract_related_links':
          response = await extractAllRelatedLinksInPage(url);
          break;
        case 'extract_multiple_links':
          response = await extractAllLinksInMultiplePages(url, whitelistArray, blacklistArray, linkLimit);
          break;
        case 'extract_multiple_related_links':
          response = await extractAllRelatedLinksInMultiplePages(url, whitelistArray, blacklistArray, linkLimit);
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

  // Check if the current action needs additional parameters
  const needsAdditionalParams = [
    'scrape_with_params', 
    'scrape_multiple_media', 
    'extract_multiple_links', 
    'extract_multiple_related_links'
  ].includes(action);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Web Scraper UI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input for single URL or multiple URLs */}
        {action === 'fetch_multiple' ? (
          <div>
            <label className="block mb-2">Multiple URLs</label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter URLs (comma-separated)"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={4}
              required
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2">URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        )}

        {/* Dropdown for action selection */}
        <div>
          <label className="block mb-2">Action</label>
          <select 
            className="w-full p-2 border rounded"
            value={action} 
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="fetch">Fetch Data</option>
            <option value="fetch_multiple">Fetch Multiple URLs</option>
            <option value="scrape">Scrape Single Page</option>
            <option value="scrape_with_params">Scrape with Parameters</option>
            <option value="extract_media">Extract Media</option>
            <option value="scrape_multiple_media">Scrape Multiple Pages Media</option>
            <option value="extract_links">Extract All Links In Page</option>
            <option value="extract_related_links">Extract All Related Links In Page</option>
            <option value="extract_multiple_links">Extract All Links In Multiple Pages</option>
            <option value="extract_multiple_related_links">Extract All Related Links In Multiple Pages</option>
          </select>
        </div>

        {/* Additional inputs for whitelist, blacklist, and link limit */}
        {needsAdditionalParams && (
          <div className="space-y-3 p-3 border rounded bg-gray-50">
            <h3 className="font-semibold">Additional Parameters</h3>
            <div>
              <label className="block mb-1">Whitelist (comma-separated)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="e.g., blog, article, news"
                value={whitelist}
                onChange={(e) => setWhitelist(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Blacklist (comma-separated)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="e.g., login, signup, admin"
                value={blacklist}
                onChange={(e) => setBlacklist(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Link Limit</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Maximum number of links to process"
                value={linkLimit}
                min={1}
                max={1000}
                onChange={(e) => setLinkLimit(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {/* Display results */}
      {result && <Result data={result} />}
    </div>
  );
};

export default Home;