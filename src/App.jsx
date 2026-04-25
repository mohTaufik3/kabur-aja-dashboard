import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/organisms/Navbar';
import DashboardPage from './pages/DashboardPage';
import SentimentPage from './pages/SentimentPage';
import TopicPage from './pages/TopicPage';
import BpsPage from './pages/BpsPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sentiment" element={<SentimentPage />} />
            <Route path="/topic" element={<TopicPage />} />
            <Route path="/bps" element={<BpsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
