// Camera preset configurations for different anatomical views
// Naming convention: [anatomy]_[view_type]_[zoom_level]
// Examples: cervicalSpine_lateral_close, shoulder_anteriorOblique_wide
export const cameraPresets = {
  // Cervicothoracic Junction (C7-T1) Views
  cervicalSpine_lateral_close: {
    position: [0, 2, 5],
    lookAt: [0, 0, 0],
    fov: 30,
    description: 'Posterior view of full cervical spine C1-C7 for anatomy study'
  },
  
  // Default fallback
  default: {
    position: [0, 2, 5],
    lookAt: [0, 0, 0],
    fov: 50,
    description: 'Default full body anterior view'
  }
};

// Helper function to get camera preset
export const getCameraPreset = (presetName) => {
  return cameraPresets[presetName] || cameraPresets.default;
};
