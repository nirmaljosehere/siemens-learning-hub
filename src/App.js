import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import { getProtocol, getAuthorHost, getService } from './utils/fetchData';
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

function Sidebar() {
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

      <div className="promo">
        <strong>Powered by AEM Headless</strong>
        <p>Content managed in Adobe Experience Manager and delivered via GraphQL.</p>
      </div>
    </aside>
  );
}

function App() {
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
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses/:encodedPath" element={<CourseDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
