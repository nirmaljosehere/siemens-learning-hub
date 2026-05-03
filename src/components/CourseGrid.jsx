import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAemQuery from '../api/useAemQuery';
import { getAemConfig } from '../utils/aemConfig';
import { SAMPLE_COURSES } from '../utils/sampleData';
import { useCart } from '../context/CartContext';

function stripTagNamespace(tag) {
  return typeof tag === 'string' ? tag.replace(/^[^:]+:/, '') : tag;
}

function difficultyClass(level) {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l === 'beginner') return 'badge-beginner';
  if (l === 'intermediate') return 'badge-intermediate';
  if (l === 'advanced') return 'badge-advanced';
  return '';
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

function CardPlaceholder({ title, difficultyLevel }) {
  const hue = difficultyLevel === 'Advanced' ? '#b35900' : difficultyLevel === 'Intermediate' ? '#1f6fb2' : '#009999';
  const initials = title
    ? title.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'SL';

  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009999" />
          <stop offset="100%" stopColor={hue} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#g-${initials})`} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="rgba(255,255,255,0.35)"
        fontSize="64"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        letterSpacing="-2"
      >
        {initials}
      </text>
    </svg>
  );
}

function CourseCard({ course }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { _path, slug, title, duration, difficultyLevel, tags, shortDescription, courseImage } = course;
  const { publishHost } = getAemConfig();
  const imgSrc = courseImage?._path ? `${publishHost}${courseImage._path}` : null;

  const editorProps = _path ? {
    'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    'data-aue-filter': 'cf',
    'data-aue-label': title,
  } : {};

  const courseSlug = slug || _path?.split('/').pop() || encodeURIComponent(title);

  return (
    <article
      className="card"
      onClick={() => navigate(`/courses/${courseSlug}${window.location.search}`)}
      {...editorProps}
    >
      <div className="card-media">
        {imgSrc ? (
          <img src={imgSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <CardPlaceholder title={title} difficultyLevel={difficultyLevel} />
        )}
        <button
          className="card-media-cart-btn"
          title="Add to Cart"
          aria-label="Add to Cart"
          onClick={(e) => { e.stopPropagation(); addToCart(course); }}
        >
          🛒
        </button>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className={`badge ${difficultyClass(difficultyLevel)}`} data-aue-prop="difficultyLevel" data-aue-type="text">
            {capitalize(difficultyLevel)}
          </span>
          {duration && (
            <span className="pill">
              <span className="icon">⏱</span>
              <span data-aue-prop="duration" data-aue-type="text">{formatDuration(duration)}</span>
            </span>
          )}
        </div>
        <h3 className="card-title" data-aue-prop="title" data-aue-type="text">{title}</h3>
        {shortDescription && (
          <p className="card-teaser" data-aue-prop="shortDescription" data-aue-type="text">
            {shortDescription}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">{stripTagNamespace(tag)}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="card skeleton">
      <div className="skeleton-block card-media" />
      <div className="card-body">
        <div className="skeleton-line w40" />
        <div className="skeleton-line w80" />
        <div className="skeleton-line w60" />
      </div>
    </div>
  );
}

function CourseGrid({ searchQuery, durationFilter }) {
  const { data, errorMessage, loading } = useAemQuery('Siemens-learning/getAllCourse');

  const aemCourses = data
    ? (data.getAllCourseList?.items || data.courseList?.items || data.siemensLearningList?.items || null)
    : null;
  const rawCourses = aemCourses ?? ((!loading && (errorMessage || data)) ? SAMPLE_COURSES : null);

  if (loading || !rawCourses) {
    return (
      <section className="course-grid" aria-live="polite">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </section>
    );
  }

  const filtered = rawCourses.filter((course) => {
    const q = searchQuery?.toLowerCase() || '';
    const matchesSearch =
      !q ||
      course.title?.toLowerCase().includes(q) ||
      course.shortDescription?.toLowerCase().includes(q) ||
      course.tags?.some((t) => t.toLowerCase().includes(q));

    const matchesDuration =
      !durationFilter ||
      durationFilter === 'all' ||
      (course.duration || '').toLowerCase().includes(durationFilter.toLowerCase());

    return matchesSearch && matchesDuration;
  });

  if (filtered.length === 0) {
    return (
      <section className="course-grid" aria-live="polite">
        <div className="empty">
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="course-grid" aria-live="polite">
      {filtered.map((course) => (
        <CourseCard key={course._path || course.slug || course.title} course={course} />
      ))}
    </section>
  );
}

export default CourseGrid;
