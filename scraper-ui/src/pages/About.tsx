import React from "react";

const About: React.FC = () => {
  return (
    <div className="container">
      <h1>ABOUT THE WEB SCRAPER</h1>
      
      <div className="about-section">
        <h2>SYSTEM OVERVIEW</h2>
        <p>
          The Web Scraper is a data extraction tool designed to navigate and collect 
          information from websites. Built with efficient scanning algorithms, the system can 
          traverse both single pages and complex multi-page structures to retrieve data.
        </p>
      </div>
      
      <div className="about-section">
        <h2>CORE CAPABILITIES</h2>
        <div className="capability-grid">
          <div className="capability-item">
            <h3>MULTI-PAGE SCAN</h3>
            <p>Navigate through linked pages within domain constraints to build a comprehensive dataset.</p>
          </div>
          
          <div className="capability-item">
            <h3>SINGLE PAGE SCAN</h3>
            <p>Extract all content from a single URL without following additional links.</p>
          </div>
          
          <div className="capability-item">
            <h3>MEDIA EXTRACTION</h3>
            <p>Identify and collect media assets including images, videos, and audio files.</p>
          </div>
          
          <div className="capability-item">
            <h3>DOMAIN FILTERING</h3>
            <p>Customize scan parameters with whitelist and blacklist domain controls.</p>
          </div>
        </div>
      </div>
      
      <div className="about-section">
        <h2>USAGE INSTRUCTIONS</h2>
        <ol className="protocol-list">
          <li>Enter the target URL in the designated input field</li>
          <li>Select appropriate scanning method based on extraction requirements</li>
          <li>Specify domain constraints if necessary (optional)</li>
          <li>Click SCRAPE and wait for results</li>
          <li>Review extracted data in the results section</li>
        </ol>
      </div>
      
      <div className="about-footer">
        <p>SYSTEM VERSION: 2.7.0</p>
        <p>LAST UPDATED: 2025-03-12</p>
      </div>
    </div>
  );
};

export default About;