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

  // Cervical Spine Anterior (AP) View
  cervicalSpine_anterior_close: {
    position: [0, 2, -5],
    lookAt: [0, 0, 0],
    fov: 30,
    description: 'Anterior view of cervical spine C1-C7 for AP projection study'
  },

  // Cervical Spine Superior (Open-Mouth) View
  cervicalSpine_openmouth: {
    position: [0, 5, 2],
    lookAt: [0, 2, 0],
    fov: 25,
    description: 'Superior-anterior view targeting C1-C2 Atlas-Axis region'
  },

  // Cervical Spine Oblique View
  cervicalSpine_oblique_close: {
    position: [3, 2, 4],
    lookAt: [0, 0, 0],
    fov: 30,
    description: 'Oblique view of cervical spine showing intervertebral foramina'
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
