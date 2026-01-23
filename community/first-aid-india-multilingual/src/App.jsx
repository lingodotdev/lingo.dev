import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import EmergencyDetail from './pages/EmergencyDetail';
import SearchPage from './pages/Search';
import Categories from './pages/Categories';
import { HelmetProvider } from 'react-helmet-async';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/emergency/:slug" element={<EmergencyDetail />} />
        </Routes>
      </Layout>
    </HelmetProvider>
  );
}

export default App;
