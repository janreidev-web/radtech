import React from 'react';

function ModelToolTip({ name, x, y, z }) {
  return (
    <div style={{
      padding: '8px',
      fontSize: '12px',
      textAlign: 'center',
      color: '#333'
    }}>
      <p style={{ margin: '2px 0' }}>
        <strong>Part:</strong> {name}
      </p>
      <p style={{ margin: '2px 0', fontSize: '11px' }}>
        x: {x}, y: {y}, z: {z}
      </p>
    </div>
  );
}

export default ModelToolTip;
