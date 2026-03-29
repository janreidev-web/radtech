import React from 'react';

function AnatomyPointer({ focusTarget, position = 'center' }) {
  // Define pointer paths based on anatomy focus target
  const getPointerPath = () => {
    // Positions are relative to viewport - adjusted based on camera angle and 3D model position
    const paths = {
      'Cervical': {
        start: { x: 60, y: 38 },
        end: { x: 50, y:30 },   // Cervical spine region (C1-C7)
        label: 'Cervical Spine (C1-C7)',
        curveOffset: { x: -10, y: -5 },
        marker: { color: '#ff0000', width: 18, height: 30, lineLength: 5.5, indicatorType: 'bracket' }
      },
      'Thoracic': {
        start: { x: 60, y: 42 },
        end: { x: 50, y: 39 },   // Thoracic spine region (T1-T12)
        label: 'Thoracic Spine (T1-T12)',
        curveOffset: { x: -10, y: -2 },
        marker: { color: '#ff0000', width: 18, height: 18, lineLength: 14, indicatorType: 'bracket' }
      },
      'CT_Junction': {
        start: { x: 60, y: 39 },
        end: { x: 50, y: 32 },   // C7-T1 junction area
        label: 'C7-T1 Junction',
        curveOffset: { x: -10, y: -4 },
        marker: { color: '#ff0000', width: 18, height: 18, lineLength: 2, indicatorType: 'bracket' }
      },
      'Atlas': {
        start: { x: 60, y: 36 },
        end: { x: 50, y: 27 },   // C1 Atlas - uppermost cervical
        label: 'Atlas (C1)',
        curveOffset: { x: -10, y: -6 }, 
        marker: { color: '#ff0000', width: 18, height: 18, lineLength: 4, indicatorType: 'circle' }
      },
      'Axis': {
        start: { x: 60, y: 37 },
        end: { x: 50, y: 27.5 },   // C2 Axis - just below Atlas
        label: 'Axis (C2)',
        curveOffset: { x: -10, y: -6 },
        marker: { color: '#ff0000', width: 18, height: 18, lineLength: 4, indicatorType: 'circle' }
      },
      'CervicalAP': {
        start: { x: 60, y: 38 },
        end: { x: 50, y: 25 },
        label: 'Cervical Spine (AP)',
        curveOffset: { x: -10, y: -5 },
        marker: { color: '#22c55e', width: 18, height: 18, lineLength: 8, indicatorType: 'bracket' }
      },
      'CervicalOblique': {
        start: { x: 60, y: 38 },
        end: { x: 48, y: 25 },
        label: 'Cervical Foramina',
        curveOffset: { x: -8, y: -5 },
        marker: { color: '#f97316', width: 18, height: 18, lineLength: 8, indicatorType: 'bracket' }
      },
      'default': {
        start: { x: 60, y: 40 },
        end: { x: 35, y: 32 },
        label: focusTarget,
        curveOffset: { x: -10, y: -5 },
        marker: { color: '#0891b2', width: 18, height: 18, lineLength: 8, indicatorType: 'circle' }
      }
    };

    return paths[focusTarget] || paths.default;
  };

  const pointer = getPointerPath();

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-45"
      style={{ mixBlendMode: 'normal' }}
    >
      <defs>
        {/* Per-target gradient */}
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pointer.marker.color} stopOpacity="0.3" />
          <stop offset="50%" stopColor={pointer.marker.color} stopOpacity="1" />
          <stop offset="100%" stopColor={pointer.marker.color} stopOpacity="1" />
        </linearGradient>

        {/* Per-target arrowhead marker */}
        <marker
          id="arrowhead-pointer"
          markerWidth={pointer.marker.width}
          markerHeight={pointer.marker.height}
          refX="10"
          refY="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 12 6 L 0 12 L 3 6 Z"
            fill={pointer.marker.color}
          />
        </marker>

        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Curved arrow path */}
      <path
        d={`M ${pointer.start.x}% ${pointer.start.y}% 
            Q ${(pointer.start.x + pointer.end.x) / 2 + (pointer.curveOffset?.x || -8)}% ${(pointer.start.y + pointer.end.y) / 2 + (pointer.curveOffset?.y || -5)}%, 
            ${pointer.end.x}% ${pointer.end.y}%`}
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        fill="none"
        markerEnd="url(#arrowhead-pointer)"
        filter="url(#glow)"
        strokeDasharray="8,4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="12"
          to="0"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Different indicators based on focus target */}
      {pointer.marker?.indicatorType === 'circle' ? (
        // Pulsating circle for CT Junction
        <g>
          {/* Outer pulsing ring */}
          <circle
            cx={`${pointer.end.x}%`}
            cy={`${pointer.end.y}%`}
            r="12"
            fill="none"
            stroke={pointer.marker.color}
            strokeWidth="3"
            opacity="0.8"
          >
            <animate
              attributeName="r"
              from="12"
              to="20"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.8"
              to="0"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Middle pulsing circle */}
          <circle
            cx={`${pointer.end.x}%`}
            cy={`${pointer.end.y}%`}
            r="8"
            fill="none"
            stroke={pointer.marker.color}
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              from="8"
              to="16"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>

          {/* Inner solid circle */}
          <circle
            cx={`${pointer.end.x}%`}
            cy={`${pointer.end.y}%`}
            r="6"
            fill={pointer.marker.color}
            className="drop-shadow-lg"
          >
            <animate
              attributeName="r"
              from="6"
              to="8"
              dur="0.6s"
              repeatCount="indefinite"
              direction="alternate"
            />
          </circle>
        </g>
      ) : (
        // Vertical line bracket for regions
        <g>
          {/* Calculate line length based on anatomical region */}
          {(() => {
            const lineLength = pointer.marker?.lineLength ?? 8;
            
            return (
              <>
                {/* Main vertical line */}
                <line
                  x1={`${pointer.end.x}%`}
                  y1={`${pointer.end.y - lineLength/2}%`}
                  x2={`${pointer.end.x}%`}
                  y2={`${pointer.end.y + lineLength/2}%`}
                  stroke="#14b8a6"
                  strokeWidth="4"
                  className="drop-shadow-lg"
                >
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="1"
                    dur="1s"
                    repeatCount="indefinite"
                    direction="alternate"
                  />
                </line>

                {/* Top bracket cap */}
                <line
                  x1={`${pointer.end.x - 1}%`}
                  y1={`${pointer.end.y - lineLength/2}%`}
                  x2={`${pointer.end.x + 1}%`}
                  y2={`${pointer.end.y - lineLength/2}%`}
                  stroke="#14b8a6"
                  strokeWidth="3"
                  className="drop-shadow-lg"
                />

                {/* Bottom bracket cap */}
                <line
                  x1={`${pointer.end.x - 1}%`}
                  y1={`${pointer.end.y + lineLength/2}%`}
                  x2={`${pointer.end.x + 1}%`}
                  y2={`${pointer.end.y + lineLength/2}%`}
                  stroke="#14b8a6"
                  strokeWidth="3"
                  className="drop-shadow-lg"
                />

                {/* Subtle glow effect */}
                <line
                  x1={`${pointer.end.x}%`}
                  y1={`${pointer.end.y - lineLength/2}%`}
                  x2={`${pointer.end.x}%`}
                  y2={`${pointer.end.y + lineLength/2}%`}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  opacity="0.4"
                  filter="url(#glow)"
                />
              </>
            );
          })()}
        </g>
      )}

      {/* Label at endpoint */}
      <g transform={`translate(${pointer.end.x}%, ${pointer.end.y}%)`}>
        <rect
          x="-40"
          y="-30"
          width="80"
          height="20"
          rx="10"
          fill="#0891b2"
          className="drop-shadow-xl"
        />
        <text
          x="0"
          y="-15"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          className="pointer-events-none"
        >
          {pointer.label}
        </text>
      </g>
    </svg>
  );
}

export default AnatomyPointer;
