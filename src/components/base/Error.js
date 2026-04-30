import React from 'react';

const Error = ({ errorMessage }) => (
  <div className="error" role="alert">
    <strong>Error:</strong> {errorMessage}
  </div>
);

export default Error;
