import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation to the History page
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
  extractAllRelatedLinksInMultiplePages,
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
  const [validationError, setValidationError] = useState<string>('');
  const [fetchingAdditional, setFetchingAdditional] = useState<boolean>(false);

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Validate input based on action
  const validateInput = (): boolean => {
    // Reset validation error
    setValidationError('');

    if (action === 'fetch_multiple') {
      const urlList = urls.split(',').map(url => url.trim()).filter(Boolean);

      if (urlList.length === 0) {
        setValidationError('Please enter at least one URL');
        return false;
      }

      const invalidUrls = urlList.filter(url => !isValidUrl(url));
      if (invalidUrls.length > 0) {
        setValidationError(`Invalid URL format: ${invalidUrls.join(', ')}`);
        return false;
      }
    } else {
      // For single URL actions
      if (!url.trim()) {
        setValidationError('Please enter a URL');
        return false;
      }

      if (!isValidUrl(url)) {
        setValidationError('Invalid URL format. Please enter a valid URL (e.g., https://example.com)');
        return false;
      }

      // Check if user accidentally entered multiple URLs in single URL field
      if (url.includes(',')) {
        setValidationError('Multiple URLs detected. For single URL actions, please enter only one URL');
        return false;
      }
    }

    return true;
  };

  // Save result to history
  const saveToHistory = (url: string, action: string, data: any) => {
    const historyItem = {
      url,
      action,
      timestamp: new Date().toLocaleString(),
      data,
    };

    // Get existing history from local storage
    const savedHistory = localStorage.getItem('scrapingHistory');
    const history = savedHistory ? JSON.parse(savedHistory) : [];

    // Add new item to history
    history.unshift(historyItem);

    // Save updated history back to local storage
    localStorage.setItem('scrapingHistory', JSON.stringify(history));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input before proceeding
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setResult(null);

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
          const urlList = urls.split(',').map((url) => url.trim()).filter(Boolean);
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

      // Save the result to history
      saveToHistory(url, action, response);

      setResult(response);
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        error: error.response?.data?.detail || error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching a single URL from result
  const handleFetchSingleURL = async (urlToFetch: string) => {
    setFetchingAdditional(true);
    try {
      const response = await fetchData(urlToFetch);
      setResult(response);
      // Update the URL input to match what we just fetched
      setUrl(urlToFetch);
      setAction('fetch');
    } catch (error: any) {
      console.error('Error fetching single URL:', error);
      setResult({
        error: error.response?.data?.detail || error.message || `Failed to fetch data for ${urlToFetch}`,
      });
    } finally {
      setFetchingAdditional(false);
    }
  };

  // Handle fetching multiple URLs from results
  const handleFetchMultipleURLs = async (urlsToFetch: string[]) => {
    setFetchingAdditional(true);
    try {
      const response = await fetchMultipleData(urlsToFetch);
      setResult(response);
      // Update the form to reflect what we just did
      setUrls(urlsToFetch.join(','));
      setAction('fetch_multiple');
    } catch (error: any) {
      console.error('Error fetching multiple URLs:', error);
      setResult({
        error: error.response?.data?.detail || error.message || 'Failed to fetch data for multiple URLs',
      });
    } finally {
      setFetchingAdditional(false);
    }
  };

  // Check if the current action needs additional parameters
  const needsAdditionalParams = [
    'scrape_with_params',
    'scrape_multiple_media',
    'extract_multiple_links',
    'extract_multiple_related_links',
  ].includes(action);

  // Check if the current action requires multiple URLs
  const isMultipleUrlAction = action === 'fetch_multiple';

  // Reset URL fields when switching between single and multiple URL modes
  const handleActionChange = (newAction: string) => {
    setAction(newAction);
    setValidationError('');

    // Reset URL fields when switching modes
    if (newAction === 'fetch_multiple' && action !== 'fetch_multiple') {
      setUrl('');
    } else if (newAction !== 'fetch_multiple' && action === 'fetch_multiple') {
      setUrls('');
    }
  };

  // Determine if a fetch single button should be shown with results
  const shouldShowFetchSingleButton = result &&
    !result.error &&
    (result.url || (action === 'scrape' && url)); // Show for single-page scraping results

  // Determine if a fetch multiple button should be shown with results
  const shouldShowFetchMultipleButton = result &&
    !result.error &&
    ((result.all_links && result.all_links.length > 0) ||
      (result.links && result.links.length > 0) ||
      (result.related_links && result.related_links.length > 0));

  // Get the appropriate links array for fetching multiple
  const getLinksArrayForFetch = () => {
    if (result.all_links && result.all_links.length > 0) {
      return result.all_links;
    }
    if (result.links && result.links.length > 0) {
      return result.links;
    }
    if (result.related_links && result.related_links.length > 0) {
      return result.related_links;
    }
    return [];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Web Scraper UI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Action selection */}
        <div>
          <label className="block mb-2 font-medium">Action</label>
          <select
            className="w-full p-2 border rounded"
            value={action}
            onChange={(e) => handleActionChange(e.target.value)}
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

        {/* Input for single URL or multiple URLs */}
        {isMultipleUrlAction ? (
          <div>
            <label className="block mb-2 font-medium">Multiple URLs</label>
            <textarea
              className={`w-full p-2 border rounded ${validationError && urls === '' ? 'border-red-500' : ''}`}
              placeholder="Enter URLs (comma-separated, e.g., https://example.com, https://another.com)"
              value={urls}
              onChange={(e) => {
                setUrls(e.target.value);
                if (validationError) setValidationError('');
              }}
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter multiple URLs separated by commas
            </p>
          </div>
        ) : (
          <div>
            <label className="block mb-2 font-medium">URL</label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${validationError && url === '' ? 'border-red-500' : ''}`}
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError('');
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a single URL for this action
            </p>
          </div>
        )}

        {/* Validation error message */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <p className="font-medium">Error</p>
            <p>{validationError}</p>
          </div>
        )}

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
              <p className="text-xs text-gray-500 mt-1">
                Only include URLs containing these terms
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                Exclude URLs containing these terms
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of links to process (1-1000)
              </p>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading || fetchingAdditional}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {/* Fetch buttons for result actions */}
      {(shouldShowFetchSingleButton || shouldShowFetchMultipleButton) && (
        <div className="mt-4 p-3 bg-gray-50 border rounded flex flex-wrap gap-2">
          <h3 className="w-full font-medium mb-1">Quick Actions:</h3>

          {shouldShowFetchSingleButton && (
            <button
              onClick={() => handleFetchSingleURL(result.url || url)} // Use result.url or the current URL
              disabled={fetchingAdditional}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 text-sm"
            >
              {fetchingAdditional ? 'Fetching...' : 'Fetch This URL'}
            </button>
          )}

          {shouldShowFetchMultipleButton && (
            <button
              onClick={() => handleFetchMultipleURLs(getLinksArrayForFetch())}
              disabled={fetchingAdditional}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300 text-sm"
            >
              {fetchingAdditional ? 'Fetching...' : `Fetch All ${getLinksArrayForFetch().length} URLs`}
            </button>
          )}
        </div>
      )}

      {/* Display results */}
      {result && <Result data={result} />}

      {/* Link to History page */}
      <Link
        to="/history"
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        View History
      </Link>
    </div>
  );
};

export default Home;