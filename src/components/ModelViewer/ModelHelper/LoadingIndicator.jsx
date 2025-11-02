import React from 'react';

const LoadingIndicator = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(240, 240, 240, 0.9)',
      zIndex: 100
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '1rem'
      }}>
        Loading Model...
      </div>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #e0e0e0',
        borderTop: '5px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
