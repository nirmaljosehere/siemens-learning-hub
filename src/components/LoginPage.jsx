import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import siemensLogo from '../images/siemens-logo.svg';

function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(password);
      if (!ok) setError('Incorrect password. Please try again.');
      setLoading(false);
    }, 300);
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <img src={siemensLogo} alt="Siemens" className="login-logo" />
          <h1 className="login-title">Learning Hub</h1>
          <p className="login-subtitle">Enter the password to continue</p>
        </div>

        <div className="login-demo-banner">
          🧪 This app is built for <strong>demo purposes only</strong> and is not intended for production use.
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-pass-wrap">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !password}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>

      <p className="login-footer">
        Siemens AG · Demo only · Not for production use
      </p>
    </div>
  );
}

export default LoginPage;
