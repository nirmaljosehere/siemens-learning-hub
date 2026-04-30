import { useState, useEffect } from 'react';
import { getAemConfig } from '../utils/aemConfig';

const { AEMHeadless } = require('@adobe/aem-headless-client-js');
const { GRAPHQL_ENDPOINT } = process.env;

/**
 * Executes an AEM persisted query against the live AEM instance.
 * Auth token and hosts are read from sessionStorage (set via the AEM
 * config panel) so nothing sensitive is ever committed to the repo.
 */
function useAemQuery(persistentQueryPath) {
  const [data, setData] = useState(null);
  const [errorMessage, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { authorHost, publishHost, serviceToken } = getAemConfig();
    const isLocalhost = window?.location?.host?.startsWith('localhost');
    const serviceURL = isLocalhost ? authorHost : publishHost;

    if (!serviceURL) {
      setError('AEM host is not configured. Click ⚙️ in the sidebar to set it up.');
      setLoading(false);
      return;
    }

    const sdk = new AEMHeadless({
      serviceURL,
      endpoint: GRAPHQL_ENDPOINT || '/graphql/execute.json',
    });

    const requestOptions = serviceToken
      ? { headers: { Authorization: `Bearer ${serviceToken}` } }
      : { credentials: 'include' };

    const cacheBustedPath = `${persistentQueryPath}?cb=${Date.now()}`;

    sdk.runPersistedQuery(cacheBustedPath, {}, requestOptions)
      .then(({ data, errors }) => {
        if (errors) setError(errors.map((e) => e.message).join(', '));
        if (data) setData(data);
      })
      .catch((err) => {
        console.error('[AEM]', err);
        setError(err.message || String(err));
      })
      .finally(() => setLoading(false));
  }, [persistentQueryPath]);

  return { data, errorMessage, loading };
}

export default useAemQuery;
