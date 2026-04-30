import React, { useState, useEffect } from 'react';
import { getAemConfig, setAemConfig, clearAemConfig } from '../utils/aemConfig';

function AemConfigModal({ isOpen, onClose, onSave }) {
  const [config, setConfig] = useState({ authorHost: '', publishHost: '', serviceToken: '' });
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getAemConfig());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    setAemConfig(config);
    setSaved(true);
    setTimeout(() => {
      onSave();
      onClose();
    }, 600);
  }

  function handleClear() {
    clearAemConfig();
    setConfig({ authorHost: '', publishHost: '', serviceToken: '' });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div className="aem-modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="aem-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="AEM Configuration">
        <div className="aem-modal-header">
          <div className="aem-modal-title">
            <span className="aem-modal-icon">⚙️</span>
            <div>
              <h2>AEM Configuration</h2>
              <p>Stored in <code>sessionStorage</code> — cleared when the tab closes.</p>
            </div>
          </div>
          <button className="aem-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="aem-modal-body">
          <div className="aem-field">
            <label htmlFor="authorHost">Author Host</label>
            <input
              id="authorHost"
              type="url"
              placeholder="https://author-pXXX-eYYY.adobeaemcloud.com"
              value={config.authorHost}
              onChange={(e) => setConfig({ ...config, authorHost: e.target.value })}
            />
          </div>

          <div className="aem-field">
            <label htmlFor="publishHost">Publish Host</label>
            <input
              id="publishHost"
              type="url"
              placeholder="https://publish-pXXX-eYYY.adobeaemcloud.com"
              value={config.publishHost}
              onChange={(e) => setConfig({ ...config, publishHost: e.target.value })}
            />
          </div>

          <div className="aem-field">
            <label htmlFor="serviceToken">
              Local Development Token
              <a
                href="https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/authentication/local-development-access-token.html"
                target="_blank"
                rel="noreferrer"
                className="aem-field-help"
              >
                How to get a token ↗
              </a>
            </label>
            <div className="aem-token-row">
              <input
                id="serviceToken"
                type={showToken ? 'text' : 'password'}
                placeholder="eyJhbGciOi..."
                value={config.serviceToken}
                onChange={(e) => setConfig({ ...config, serviceToken: e.target.value })}
                className="aem-token-input"
              />
              <button
                type="button"
                className="aem-toggle-btn"
                onClick={() => setShowToken((v) => !v)}
                aria-label={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="aem-field-note">
              Generate from <strong>AEM Developer Console</strong> → Get Local Development Token. Valid for 24 hours.
            </p>
          </div>
        </div>

        <div className="aem-modal-footer">
          <button className="aem-btn-ghost" onClick={handleClear}>Clear saved config</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="aem-btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className={`aem-btn-primary ${saved ? 'aem-btn-saved' : ''}`}
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? '✓ Saved' : 'Save & Reload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AemConfigModal;
