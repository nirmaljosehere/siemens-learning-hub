import { useState, useEffect } from 'react';
import { getAuthorHost, getPublishHost, getRequestOptions } from '../utils/fetchData';

const { AEMHeadless } = require('@adobe/aem-headless-client-js');
const { GRAPHQL_ENDPOINT } = process.env;

function useGraphQL(path) {
  const [data, setData] = useState(null);
  const [errorMessage, setErrors] = useState(null);

  useEffect(() => {
    function makeRequest() {
      const isLocalhost = window?.location?.host?.startsWith('localhost');
      const serviceURL = isLocalhost ? getAuthorHost() : getPublishHost();
      const sdk = new AEMHeadless({ serviceURL, endpoint: GRAPHQL_ENDPOINT });
      const cacheParam = `cb=${Date.now()}`;
      const cacheBustedPath = path.includes('?') ? `${path}&${cacheParam}` : `${path}?${cacheParam}`;

      sdk.runPersistedQuery(cacheBustedPath, {}, getRequestOptions())
        .then(({ data, errors }) => {
          if (errors) setErrors(errors.map((e) => e.message).join(', '));
          if (data) setData(data);
        })
        .catch((err) => {
          console.error(err);
          setErrors(err.message || String(err));
        });
    }

    makeRequest();
  }, [path]);

  return { data, errorMessage };
}

export default useGraphQL;
