import React, { useState } from 'react';
import CourseGrid from './CourseGrid';
import FeaturedInsights from './FeaturedInsights';
import { useCart } from '../context/CartContext';

const DURATION_FILTERS = [
  { label: 'All', value: 'all' },
  { label: '< 2 hours', value: '< 2' },
  { label: '2–5 hours', value: '2–5' },
  { label: '5–8 hours', value: '5–8' },
  { label: '8+ hours', value: '8' },
];

function Home({ onAemError }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const { items } = useCart();

  return (
    <>
      <header className="topbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search courses…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search courses"
        />
        <div className="topbar-actions">
          <button className="icon-btn" title="Shopping Cart" aria-label="Shopping Cart">
            🛒
            {items.length > 0 && <span className="cart-badge">{items.length}</span>}
          </button>
          <button className="icon-btn" title="Notifications" aria-label="Notifications">🔔</button>
          <button className="icon-btn" title="Messages" aria-label="Messages">✉️</button>
          <div className="avatar" title="Profile">SL</div>
        </div>
      </header>

      <div className="page-head">
        <div>
          <h1>Courses</h1>
          <p className="muted">Browse the Siemens industrial automation learning catalogue</p>
        </div>
        <div className="chips" role="group" aria-label="Filter by duration">
          {DURATION_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`chip ${durationFilter === f.value ? 'active' : ''}`}
              onClick={() => setDurationFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <CourseGrid
        searchQuery={searchQuery}
        durationFilter={durationFilter === 'all' ? '' : durationFilter}
      />

      <FeaturedInsights onError={onAemError} />
    </>
  );
}

export default Home;
