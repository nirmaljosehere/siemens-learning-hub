import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGraphQL from '../api/useGraphQL';
import { useSampleData } from '../utils/fetchData';
import { getSampleCourseDetail } from '../utils/sampleData';
import Loading from './base/Loading';
import Error from './base/Error';

function difficultyClass(level) {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l === 'beginner') return 'badge-beginner';
  if (l === 'intermediate') return 'badge-intermediate';
  if (l === 'advanced') return 'badge-advanced';
  return '';
}

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split('\n').filter(Boolean);
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
  } = course;

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    itemFilter: 'cf',
  };

  const objectives = toList(learningObjectives);
  const prereqs = toList(prerequisites);

  return (
    <div className="detail-shell" {...editorProps}>
      <div
        className="detail-hero"
        data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
        data-aue-type="reference"
      >
        <div className="detail-meta">
          <span className={`badge ${difficultyClass(difficultyLevel)}`} data-aue-prop="difficultyLevel" data-aue-type="text">
            {difficultyLevel}
          </span>
          {duration && (
            <span className="pill">
              ⏱ <span data-aue-prop="duration" data-aue-type="text">{duration}</span>
            </span>
          )}
        </div>
        <h1 data-aue-prop="title" data-aue-type="text">{title}</h1>
        {shortDescription && (
          <p className="detail-lead" data-aue-prop="shortDescription" data-aue-type="text">
            {shortDescription}
          </p>
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
          <div className="material">
            <h4>Course Material</h4>
            {courseMaterial ? (
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

function CourseDetailAEM() {
  const { encodedPath } = useParams();
  const path = decodeURIComponent(encodedPath);
  const persistentQuery = `siemens-learning/course-by-path;path=${encodeURIComponent(path)}`;
  const { data, errorMessage } = useGraphQL(persistentQuery);

  if (errorMessage) return <Error errorMessage={errorMessage} />;
  if (!data) return <Loading />;

  const course = data?.courseByPath?.item;
  if (!course) return <NotFound />;

  return <CourseDetailRender course={course} />;
}

function CourseDetailSample() {
  const { encodedPath } = useParams();
  const path = decodeURIComponent(encodedPath);
  const course = getSampleCourseDetail(path);

  if (!course) return <NotFound />;
  return <CourseDetailRender course={course} />;
}

function CourseDetail() {
  const isSample = useSampleData();
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Siemens Learning Hub
        </button>
      </header>
      {isSample ? <CourseDetailSample /> : <CourseDetailAEM />}
    </>
  );
}

export default CourseDetail;
