import React, { useState } from 'react';

export default function NameGate({ onConfirm, onClose }) {
  const [name, setName]   = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name to continue.'); return; }
    onConfirm(trimmed);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid #374151',
          borderRadius: '18px',
          padding: '40px 36px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '14px', right: '16px',
              background: 'none', border: 'none', color: '#6b7280',
              fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              padding: '4px 6px', borderRadius: '6px',
            }}
            aria-label="Close"
          >✕</button>
        )}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📝</div>
          <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '22px', fontWeight: '700' }}>
            Before You Begin
          </h2>
          <p style={{ color: '#9ca3af', marginTop: '8px', fontSize: '14px', lineHeight: '1.6' }}>
            Enter your name to track your score on the leaderboard.<br />
            Each section has a{' '}
            <strong style={{ color: '#34d399' }}>10-minute timer</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="Your name"
            autoFocus
            maxLength={40}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              border: `2px solid ${error ? '#ef4444' : '#374151'}`,
              background: '#1f2937',
              color: '#f1f5f9',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '13px',
              background: 'linear-gradient(90deg, #0d9488, #0891b2)',
              border: 'none',
              borderRadius: '9px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            Start Assessment →
          </button>
        </form>
      </div>
    </div>
  );
}
