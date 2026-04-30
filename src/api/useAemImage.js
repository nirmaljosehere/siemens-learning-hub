import { useState, useEffect } from 'react';
import { getAemConfig } from '../utils/aemConfig';

function useAemImage(imageUrl) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;

    const { serviceToken } = getAemConfig();
    const headers = serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {};

    let revoked = false;
    fetch(imageUrl, { headers })
      .then((r) => {
        if (!r.ok) throw new Error(`Image fetch failed: ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        if (!revoked) setObjectUrl(URL.createObjectURL(blob));
      })
      .catch(() => {});

    return () => {
      revoked = true;
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [imageUrl]);

  return objectUrl;
}

export default useAemImage;
