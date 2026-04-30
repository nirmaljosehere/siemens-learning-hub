import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAemQuery from '../api/useAemQuery';
import { getAemConfig } from '../utils/aemConfig';
import { AEM_CONFIG_EVENT } from '../App';

function FeaturedInsights({ onError }) {
  const { data, errorMessage, loading } = useAemQuery(
    'wknd-shared/ing-articles-by-articletype;articleType=Lab'
  );

  useEffect(() => {
    if (errorMessage) onError?.();
  }, [errorMessage, onError]);

  return (
    <section className="featured-insights">
      <div className="section-header">
        <h2 className="section-title">Featured Insights</h2>
        <span className="aem-badge">Live from AEM</span>
      </div>

      {loading && (
        <ul className="insights-list">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="insight-card skeleton">
              <div className="skeleton-block insight-img" />
              <div className="insight-body">
                <div className="skeleton-line w40" />
                <div className="skeleton-line w80" />
                <div className="skeleton-line w60" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && errorMessage && (
        <div className="insights-error">
          <span className="insights-error-icon">⚠️</span>
          <div>
            <strong>Could not connect to AEM</strong>
            <p>A valid local development token is required to fetch live content.</p>
            <button
              className="aem-btn-primary"
              style={{ display: 'inline-flex', width: 'auto', marginTop: 8 }}
              onClick={() => window.dispatchEvent(new Event(AEM_CONFIG_EVENT))}
            >
              ⚙️ Configure AEM token
            </button>
          </div>
        </div>
      )}

      {!loading && data && (
        <ul className="insights-list">
          {data.ingArticleList?.items?.map((article) => (
            <InsightCard key={article._path} article={article} />
          ))}
        </ul>
      )}
    </section>
  );
}

function InsightCard({ article }) {
  const { _path, title, summary, slug, primaryImage, articleType } = article;
  const { publishHost } = getAemConfig();

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    'data-aue-filter': 'cf',
    'data-aue-label': title,
  };

  const imgSrc = primaryImage?._publishUrl
    ? primaryImage._publishUrl.startsWith('http')
      ? primaryImage._publishUrl
      : `${publishHost}${primaryImage._publishUrl}`
    : null;

  return (
    <li className="insight-card" {...editorProps}>
      <div className="insight-img">
        {imgSrc ? (
          <img src={imgSrc} alt={title} data-aue-prop="primaryImage" data-aue-type="media" />
        ) : (
          <div className="insight-img-placeholder">{title?.slice(0, 2).toUpperCase()}</div>
        )}
      </div>
      <div className="insight-body">
        {articleType && <span className="badge">{articleType}</span>}
        <h3 className="insight-title" data-aue-prop="title" data-aue-type="text">{title}</h3>
        {summary?.plaintext && (
          <p className="insight-summary" data-aue-prop="summary" data-aue-type="text">
            {summary.plaintext}
          </p>
        )}
        <Link
          to={`/ing/articles/${slug}${window.location.search}`}
          className="insight-link"
        >
          Read more →
        </Link>
      </div>
    </li>
  );
}

export default FeaturedInsights;
