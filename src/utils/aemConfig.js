const STORAGE_KEY = 'aem_config';

const DEFAULTS = {
  authorHost: process.env.REACT_APP_DEFAULT_AUTHOR_HOST || '',
  publishHost: process.env.REACT_APP_DEFAULT_PUBLISH_HOST || '',
  serviceToken: process.env.REACT_APP_SERVICE_TOKEN || '',
};

export function getAemConfig() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULTS, ...JSON.parse(stored) };
    }
  } catch (_) {}
  return { ...DEFAULTS };
}

export function setAemConfig(config) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (_) {}
}

export function clearAemConfig() {
  sessionStorage.removeItem(STORAGE_KEY);
}
