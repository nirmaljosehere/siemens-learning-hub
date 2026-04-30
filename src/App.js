import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import AemConfigModal from './components/AemConfigModal';
import { getProtocol, getAuthorHost, getService } from './utils/fetchData';
import { getAemConfig } from './utils/aemConfig';
import siemensLogo from './images/siemens-logo.svg';
import './App.scss';

const NAV_ITEMS = [
  { label: 'Courses', to: '/' },
  { label: 'My Learning', to: '/my-learning' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Instructor-Led', to: '/instructor-led' },
];

const NAV_HELP = [
  { label: 'Help & Support', to: '/help' },
  { label: 'Community', to: '/community' },
];

// Broadcast channel so any component can request the config modal to open
export const AEM_CONFIG_EVENT = 'aem:open-config';

function Sidebar({ onOpenConfig, aemStatus }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="/">
        <img src={siemensLogo} alt="Siemens" />
        <span>Learning Hub</span>
      </a>

      <nav className="nav" aria-label="Main navigation">
        <h6>Learn</h6>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={`${item.to}${window.location.search}`}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
        <h6>Resources</h6>
        {NAV_HELP.map((item) => (
          <a key={item.to} href={item.to} className="nav-item">
            {item.label}
          </a>
        ))}
      </nav>

      <button
        className={`aem-config-btn ${aemStatus}`}
        onClick={onOpenConfig}
        title="Configure AEM connection"
      >
        <span className="aem-dot" />
        <span>
          {aemStatus === 'connected' ? 'AEM Connected' : aemStatus === 'error' ? 'AEM Error — configure' : 'Configure AEM'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 14 }}>⚙️</span>
      </button>

      <div className="promo">
        <strong>Powered by AEM Headless</strong>
        <p>Content managed in Adobe Experience Manager and delivered via GraphQL.</p>
      </div>
    </aside>
  );
}

function App() {
  const [configOpen, setConfigOpen] = useState(false);
  const [aemStatus, setAemStatus] = useState('idle'); // idle | connected | error

  // Listen for any component requesting the config modal
  useEffect(() => {
    const handler = () => setConfigOpen(true);
    window.addEventListener(AEM_CONFIG_EVENT, handler);
    return () => window.removeEventListener(AEM_CONFIG_EVENT, handler);
  }, []);

  // Seed status from existing sessionStorage config
  useEffect(() => {
    const { serviceToken, authorHost } = getAemConfig();
    if (serviceToken || authorHost) setAemStatus('connected');
  }, []);

  function handleSave() {
    setAemStatus('connected');
    // Reload to re-trigger all useAemQuery hooks with the new token
    window.location.reload();
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta
          name="urn:adobe:aue:system:aemconnection"
          content={`${getProtocol()}:${getAuthorHost()}`}
        />
        <meta
          name="urn:adobe:aue:config:extensions"
          content="https://47679-workflowextension.adobeio-static.net"
        />
        {getService() && (
          <meta name="urn:adobe:aue:config:service" content={getService()} />
        )}
      </Helmet>

      <Router>
        <div className="app-shell">
          <Sidebar
            onOpenConfig={() => setConfigOpen(true)}
            aemStatus={aemStatus}
          />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home onAemError={() => setAemStatus('error')} />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
            </Routes>
          </main>
        </div>
      </Router>

      <AemConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        onSave={handleSave}
      />
    </HelmetProvider>
  );
}

export default App;
