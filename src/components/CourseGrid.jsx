import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGraphQL from '../api/useGraphQL';
import { useSampleData } from '../utils/fetchData';
import { SAMPLE_COURSES } from '../utils/sampleData';
import Error from './base/Error';

function difficultyClass(level) {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l === 'beginner') return 'badge-beginner';
  if (l === 'intermediate') return 'badge-intermediate';
  if (l === 'advanced') return 'badge-advanced';
  return '';
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
  const { _path, title, duration, difficultyLevel, tags, shortDescription } = course;

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    'data-aue-filter': 'cf',
    'data-aue-label': title,
  };

  const encodedPath = encodeURIComponent(_path);

  return (
    <article
      className="card"
      onClick={() => navigate(`/courses/${encodedPath}${window.location.search}`)}
      {...editorProps}
    >
      <div className="card-media">
        <CardPlaceholder title={title} difficultyLevel={difficultyLevel} />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className={`badge ${difficultyClass(difficultyLevel)}`} data-aue-prop="difficultyLevel" data-aue-type="text">
            {difficultyLevel}
          </span>
          {duration && (
            <span className="pill">
              <span className="icon">⏱</span>
              <span data-aue-prop="duration" data-aue-type="text">{duration}</span>
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
              <span key={tag} className="tag">{tag}</span>
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
  const persistentQuery = 'siemens-learning/courses-all';
  const { data, errorMessage } = useGraphQL(persistentQuery);
  const isSample = useSampleData();

  const rawCourses = isSample
    ? SAMPLE_COURSES
    : data?.courseList?.items || null;

  if (!isSample && errorMessage) return <Error errorMessage={errorMessage} />;
  if (!rawCourses) {
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
        <CourseCard key={course._path} course={course} />
      ))}
    </section>
  );
}

export default CourseGrid;
