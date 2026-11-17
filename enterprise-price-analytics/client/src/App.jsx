import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScraperProvider } from './context/ScraperContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Matrix from './pages/Matrix';
import ProductDetail from './pages/ProductDetail';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import ScraperStatus from './pages/ScraperStatus';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <ScraperProvider>
        <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/matrix" element={<Matrix />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/scraper-status" element={<ScraperStatus />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
        </div>
      </ScraperProvider>
    </BrowserRouter>
  );
}
