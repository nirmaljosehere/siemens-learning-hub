import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAemQuery from '../api/useAemQuery';
import { getSampleCourseDetail } from '../utils/sampleData';
import Loading from './base/Loading';
import Error from './base/Error';
import { useCart } from '../context/CartContext';

function difficultyClass(level) {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l === 'beginner') return 'badge-beginner';
  if (l === 'intermediate') return 'badge-intermediate';
  if (l === 'advanced') return 'badge-advanced';
  return '';
}

function parseHtmlList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value.html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value.html, 'text/html');
    const items = Array.from(doc.querySelectorAll('li')).map((li) => li.textContent.trim());
    return items.length ? items : [];
  }
  if (typeof value === 'string') return value.split('\n').filter(Boolean);
  return [];
}

function stripTagNamespace(tag) {
  return typeof tag === 'string' ? tag.replace(/^[^:]+:/, '') : tag;
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDuration(duration) {
  if (!duration) return duration;
  return duration.replace(/(\d+)\s*([hdw])/gi, (_, num, unit) => {
    const n = parseInt(num, 10);
    const map = { h: 'Hour', d: 'Day', w: 'Week' };
    const label = map[unit.toLowerCase()] || unit;
    return `${n} ${label}${n !== 1 ? 's' : ''}`;
  });
}

function CourseDetailRender({ course }) {
  const {
    _path,
    title,
    duration,
    difficultyLevel,
    shortDescription,
    learningObjectives,
    prerequisites,
    courseMaterial,
    courseImage,
    tags,
  } = course;

  const { addToCart } = useCart();

  const editorProps = _path ? {
    'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    itemFilter: 'cf',
  } : {};

  const objectives = parseHtmlList(learningObjectives);
  const prereqs = parseHtmlList(prerequisites);

  const heroImg = courseImage?._publishUrl || courseImage?._authorUrl;

  return (
    <div className="detail-shell" {...editorProps}>
      <div
        className="detail-hero"
        data-aue-resource={_path ? `urn:aemconnection:${_path}/jcr:content/data/master` : undefined}
        data-aue-type={_path ? 'reference' : undefined}
      >
        <div className="detail-meta">
          <span className={`badge ${difficultyClass(difficultyLevel)}`} data-aue-prop="difficultyLevel" data-aue-type="text">
            {capitalize(difficultyLevel)}
          </span>
          {duration && (
            <span className="pill">
              ⏱ <span data-aue-prop="duration" data-aue-type="text">{formatDuration(duration)}</span>
            </span>
          )}
        </div>
        <h1 data-aue-prop="title" data-aue-type="text">{title}</h1>
        {shortDescription && (
          <p className="detail-lead" data-aue-prop="shortDescription" data-aue-type="text">
            {shortDescription}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="tags" style={{ marginTop: 12 }}>
            {tags.map((tag) => (
              <span key={tag} className="tag">{stripTagNamespace(tag)}</span>
            ))}
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          {objectives.length > 0 && (
            <>
              <h3>Learning Objectives</h3>
              <ul className="bullets">
                {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </>
          )}
          {prereqs.length > 0 && (
            <>
              <h3>Prerequisites</h3>
              <ul className="bullets">
                {prereqs.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </>
          )}
          <div className="material">
            <h3>Course Material</h3>
            {Array.isArray(courseMaterial) && courseMaterial.length > 0 ? (
              <div className="material-grid">
                {courseMaterial.map((item, i) => {
                  const url = item._publishUrl || item._authorUrl;
                  const filename = decodeURIComponent(item._path?.split('/').pop() || 'Download');
                  const isPdf = item.format === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');
                  return url ? (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`material-card${isPdf ? ' material-card--pdf' : ''}`}
                      data-aue-prop="courseMaterial"
                      data-aue-type="media"
                      download
                    >
                      <div className="material-thumb">
                        {isPdf ? (
                          <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect width="40" height="48" rx="4" fill="#E8F4F8"/>
                            <path d="M8 0h18l14 14v30a4 4 0 01-4 4H8a4 4 0 01-4-4V4a4 4 0 014-4z" fill="#fff" stroke="#cfd6dc" strokeWidth="1"/>
                            <path d="M26 0l14 14H30a4 4 0 01-4-4V0z" fill="#cfd6dc"/>
                            <rect x="6" y="28" width="28" height="14" rx="2" fill="#E53935"/>
                            <text x="20" y="39" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial,sans-serif">PDF</text>
                            <line x1="10" y1="20" x2="30" y2="20" stroke="#cfd6dc" strokeWidth="1.5"/>
                            <line x1="10" y1="24" x2="24" y2="24" stroke="#cfd6dc" strokeWidth="1.5"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M8 0h18l14 14v30a4 4 0 01-4 4H8a4 4 0 01-4-4V4a4 4 0 014-4z" fill="#fff" stroke="#cfd6dc" strokeWidth="1"/>
                            <path d="M26 0l14 14H30a4 4 0 01-4-4V0z" fill="#cfd6dc"/>
                            <line x1="10" y1="20" x2="30" y2="20" stroke="#cfd6dc" strokeWidth="1.5"/>
                            <line x1="10" y1="26" x2="30" y2="26" stroke="#cfd6dc" strokeWidth="1.5"/>
                            <line x1="10" y1="32" x2="22" y2="32" stroke="#cfd6dc" strokeWidth="1.5"/>
                          </svg>
                        )}
                      </div>
                      <div className="material-info">
                        <span className="material-name">{filename}</span>
                        <span className="material-type">{isPdf ? 'PDF Document' : 'Download'}</span>
                      </div>
                      <div className="material-dl-icon" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </a>
                  ) : null;
                })}
              </div>
            ) : (
              <p>No downloadable material available for this course.</p>
            )}
          </div>
        </div>

        <div className="detail-side">
          <div className="detail-actions">
            <button className="btn-add-cart" aria-label="Add to Cart" onClick={() => addToCart(course)}>
              🛒 Add to Cart
            </button>
            <button className="btn-bookmark" aria-label="Bookmark as Favorite">
              ⭐ Bookmark as Favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="empty">
      <h3>Course not found</h3>
      <p>The course you are looking for does not exist or has been moved.</p>
      <button className="btn-secondary" onClick={() => navigate(-1)}>← Go back</button>
    </div>
  );
}

function CourseDetailContent() {
  const { slug } = useParams();
  const { data, errorMessage, loading } = useAemQuery(
    `Siemens-learning/getCourseBySlug;slug=${slug}`
  );

  if (loading) return <Loading />;
  if (errorMessage && !data) {
    const sampleCourse = getSampleCourseDetail(slug);
    if (sampleCourse) return <CourseDetailRender course={sampleCourse} />;
    return <Error errorMessage={errorMessage} />;
  }

  const course =
    data?.courseList?.items?.[0] ||
    data?.getCourseBySlug?.item ||
    data?.courseBySlug?.item ||
    null;

  if (!course) {
    const sampleCourse = getSampleCourseDetail(slug);
    if (sampleCourse) return <CourseDetailRender course={sampleCourse} />;
    return <NotFound />;
  }

  return <CourseDetailRender course={course} />;
}

function CourseDetail() {
  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <>
      <header className="topbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search courses…"
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
      <nav className="detail-breadcrumb">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back to Courses
        </button>
      </nav>
      <CourseDetailContent />
    </>
  );
}

export default CourseDetail;
