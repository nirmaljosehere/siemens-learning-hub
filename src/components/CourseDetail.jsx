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
          <div className="material">
            <h4>Course Material</h4>
            {courseMaterial?._publishUrl ? (
              <button
                className="btn-primary"
                onClick={() => window.open(courseMaterial._publishUrl, '_blank')}
                data-aue-prop="courseMaterial"
                data-aue-type="media"
              >
                Download PDF
                <span className="mat-name">{courseMaterial._path?.split('/').pop()}</span>
              </button>
            ) : (
              <p>No downloadable material available for this course.</p>
            )}
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
