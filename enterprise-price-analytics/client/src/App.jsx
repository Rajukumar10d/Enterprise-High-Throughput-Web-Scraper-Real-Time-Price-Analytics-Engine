import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import SourcesPage from './pages/SourcesPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
