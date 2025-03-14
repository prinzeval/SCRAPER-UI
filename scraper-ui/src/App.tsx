import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HistoryPage from './components/History';
import ViewDataPage from './components/ViewDataPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/view-data" element={<ViewDataPage />} />
      </Routes>
    </Router>
  );
};

export default App;