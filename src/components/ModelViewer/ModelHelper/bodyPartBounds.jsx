// utils/bodyPartBounds.jsx

// Desktop view bounds (original data)
export const bodyPartBoundsDesktop = {
  Head: {
    min: { x: -0.21, y: 1.81, z: -0.21 },
    max: { x: 0.20, y: 2.38, z: 0.25 }
  },
  Body: {
    min: { x: -0.43, y: 0.45, z: -0.45 },
    max: { x: 0.37, y: 1.70, z: 0.32 }
  },
  "Right Arm": {
    min: { x: -1.76, y: 0.79, z: -0.06 },
    max: { x: -0.17, y: 1.60, z: 0.74 }
  },
  "Left Arm": {
    min: { x: 0.41, y: 0.84, z: -0.95 },
    max: { x: 1.58, y: 1.70, z: -0.20 }
  },
  Groin: {
    min: { x: -0.42, y: -0.08, z: -0.37 },
    max: { x: 0.40, y: 0.30, z: 0.34 }
  },
  "Right Leg": {
    min: { x: -0.36, y: -2.10, z: -0.11 },
    max: { x: 0.04, y: -0.14, z: 0.44 }
  },
  "Left Leg": {
    min: { x: -0.40, y: -2.10, z: -0.40 },
    max: { x: 0.45, y: -0.15, z: 0.39 }
  }
};

// Mobile view bounds (calculated from mobile data)
export const bodyPartBoundsMobile = {
  Head: {
    min: { x: -0.15, y: 0.65, z: -0.17 },
    max: { x: 0.13, y: 0.96, z: 0.16 }
  },
  Body: {
    min: { x: -0.28, y: -0.27, z: -0.29 },
    max: { x: 0.28, y: 0.49, z: 0.23 }
  },
  "Right Arm": {
    min: { x: -1.25, y: -0.18, z: -0.02 },
    max: { x: -0.30, y: 0.45, z: 0.54 }
  },
  "Left Arm": {
    min: { x: 0.29, y: -0.18, z: -0.95 },
    max: { x: 1.58, y: 1.61, z: -0.10 }
  },
  Groin: {
    min: { x: -0.29, y: -0.71, z: -0.26 },
    max: { x: 0.29, y: -0.45, z: 0.25 }
  },
  "Right Leg": {
    min: { x: -0.26, y: -2.06, z: -0.08 },
    max: { x: 0.06, y: -0.84, z: 0.32 }
  },
  "Left Leg": {
    min: { x: 0.04, y: -2.10, z: -0.30 },
    max: { x: 0.29, y: -0.79, z: 0.30 }
  }
};

// Helper function to check if a point is inside a bounding box
export const isPointInBounds = (point, bounds) => {
  return (
    point.x >= bounds.min.x && point.x <= bounds.max.x &&
    point.y >= bounds.min.y && point.y <= bounds.max.y &&
    point.z >= bounds.min.z && point.z <= bounds.max.z
  );
};

// Function to identify which body part was clicked
// Now accepts isMobile parameter to use correct bounds
export const identifyBodyPart = (clickPoint, isMobile = false) => {
  const boundsToUse = isMobile ? bodyPartBoundsMobile : bodyPartBoundsDesktop;
  
  for (const [partName, bounds] of Object.entries(boundsToUse)) {
    if (isPointInBounds(clickPoint, bounds)) {
      return partName;
    }
  }
  return "Unknown";
};
