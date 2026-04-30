const {
  REACT_APP_DEFAULT_AUTHOR_HOST,
  REACT_APP_DEFAULT_PUBLISH_HOST,
  REACT_APP_SERVICE_TOKEN,
} = process.env;

export const getAuthorHost = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('authorHost') || REACT_APP_DEFAULT_AUTHOR_HOST;
};

export const getPublishHost = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('publishHost') || REACT_APP_DEFAULT_PUBLISH_HOST;
};

export const getProtocol = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('protocol') || 'aem';
};

export const getService = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('service') || null;
};

export const useSampleData = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('sampleData')) return params.get('sampleData') === 'true';
  return process.env.REACT_APP_USE_SAMPLE_DATA === 'true';
};

export const getRequestOptions = () => {
  const isLocalhost = window?.location?.host?.startsWith('localhost');
  if (!isLocalhost) return {};
  return REACT_APP_SERVICE_TOKEN
    ? { headers: { Authorization: `Bearer ${REACT_APP_SERVICE_TOKEN}` } }
    : { credentials: 'include' };
};
