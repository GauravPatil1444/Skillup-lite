import React from 'react';

const Loader: React.FC = () => {
  const loaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const spinnerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(165, 190, 252, 0.2)', 
    borderTop: '4px solid rgb(25, 42, 86)', 
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const textStyle: React.CSSProperties = {
    marginTop: '12px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: 'rgb(25, 42, 86)',
    fontWeight: '500',
  };

  return (
    <div style={loaderStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>Loading...</p>
    </div>
  );
};

export default Loader;