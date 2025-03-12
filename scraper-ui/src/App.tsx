import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">HOME</Link>
          <Link to="/about">ABOUT</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;