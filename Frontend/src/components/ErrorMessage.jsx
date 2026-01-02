import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 