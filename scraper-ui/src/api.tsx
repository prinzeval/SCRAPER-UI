import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // Replace with your backend URL

// Fetch data for a single URL
export const fetchData = async (url: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch`, { params: { url } });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Fetch data for multiple URLs
export const fetchMultipleData = async (urls: string[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch_multiple`, { urls });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple data:', error);
    throw error;
  }
};

// Scrape a single page
export const scrapeSinglePage = async (url: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scrape_single_page`, { url });
    return response.data;
  } catch (error) {
    console.error('Error scraping single page:', error);
    throw error;
  }
};

// Extract media from a single page
export const extractMediaFromSinglePage = async (url: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/single_page_media`, { url });
    return response.data;
  } catch (error) {
    console.error('Error extracting media:', error);
    throw error;
  }
};

// Scrape multiple pages for media
export const scrapeMultiplePagesMedia = async (url: string, whitelist: string[], blacklist: string[], linkLimit: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/multiple_page_media`, {
      url,
      whitelist,
      blacklist,
      link_limit: linkLimit,
    });
    return response.data;
  } catch (error) {
    console.error('Error scraping multiple pages:', error);
    throw error;
  }
};

export const scrapeWebsite = async (url: string, whitelist: string[], blacklist: string[], linkLimit: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scrape`, {
      url,
      whitelist,
      blacklist,
      link_limit: linkLimit,
    });
    return response.data;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
};

export const extractAllLinksInPage = async (url: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract_links`, { url });
    return response.data;
  } catch (error) {
    console.error('Error extracting links:', error);
    throw error;
  }
};

export const extractAllRelatedLinksInPage = async (url: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract_related_links`, { url });
    return response.data;
  } catch (error) {
    console.error('Error extracting related links:', error);
    throw error;
  }
};

// New functions for multiple links and related links
export const extractAllLinksInMultiplePages = async (url: string, whitelist: string[], blacklist: string[], linkLimit: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract_multiple_links`, {
      url,
      whitelist,
      blacklist,
      link_limit: linkLimit,
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting multiple links:', error);
    throw error;
  }
};

export const extractAllRelatedLinksInMultiplePages = async (url: string, whitelist: string[], blacklist: string[], linkLimit: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract_multiple_related_links`, {
      url,
      whitelist,
      blacklist,
      link_limit: linkLimit,
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting multiple related links:', error);
    throw error;
  }
};