import React, { useEffect, useRef } from 'react';

export default function HighScoreBanner({ champion, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!champion) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onDismiss(), 5000);
    return () => clearTimeout(timerRef.current);
  }, [champion, onDismiss]);

  if (!champion) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '76px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(90deg, #064e3b 0%, #065f46 100%)',
        border: '1px solid #10b981',
        borderRadius: '10px',
        padding: '9px 20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 6px 24px rgba(16,185,129,0.3)',
        whiteSpace: 'nowrap',
        maxWidth: '90vw',
        animation: 'hsSlideIn 0.35s ease',
      }}
    >
      <span style={{ fontSize: '16px' }}>🏆</span>
      <span style={{ color: '#a7f3d0', fontSize: '13px', fontWeight: '600' }}>
        <strong style={{ color: '#34d399' }}>{champion.name}</strong>
        {' '}scored{' '}
        <strong style={{ color: '#fbbf24' }}>
          {champion.finalScore}/{champion.totalPossible}
        </strong>
        {champion.pct > 0 && (
          <>
            , beating{' '}
            <strong style={{ color: '#34d399' }}>{champion.pct}%</strong>
            {' '}of all players
          </>
        )}
        !
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#6ee7b7',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          padding: '0 0 0 6px',
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
