// Lesson data structure for radiologic positioning lessons
export const radiologicLessons = {
  "Fuchs Method & AP Dens Projection": {
    title: "Radiologic Positioning: Fuchs Method & AP Dens Projection",
    description: "This interactive lesson teaches the Fuchs Method using an engaging body-movement-based animation. The focus is on understanding radiologic positioning through real-time anatomical interaction.",
    learningObjectives: [
      "Understand AP projection positioning for the dens using the Fuchs Method",
      "Visualize key body movements involved in the positioning (chin extension, supine posture)",
      "Identify anatomical landmarks: chin tip, mastoid tip, foramen magnum",
      "Learn when and why this method is used in clinical practice"
    ],
    steps: [
      {
        id: 1,
        title: "Zoom into Head/Neck Region",
        description: "Zoom into the upper cervical spine and skull. Highlight the chin, mastoid tips, and cervical vertebrae.",
        cameraAction: {
          type: "zoom",
          target: "head",
          duration: 2000,
          position: [0, 2, 3],
          lookAt: [0, 1.5, 0]
        },
        highlights: [
          { part: "chin", color: "#ff6b6b", duration: 3000 },
          { part: "mastoid", color: "#4ecdc4", duration: 3000 },
          { part: "cervical_spine", color: "#45b7d1", duration: 3000 }
        ]
      },
      {
        id: 2,
        title: "Show Initial Supine Position",
        description: "Display a model lying supine on the table. Label important landmarks: chin tip, mastoid process, IR plane.",
        labels: [
          { text: "Chin Tip", position: [0, 2.2, 0.1], color: "#ff6b6b" },
          { text: "Mastoid Process", position: [-0.15, 1.9, 0.1], color: "#4ecdc4" },
          { text: "IR Plane", position: [0, 1.5, -0.5], color: "#95a5a6" }
        ]
      },
      {
        id: 3,
        title: "Demonstrate Chin Extension",
        description: "Animate the patient extending the chin so the chin tip and mastoid tip form a line perpendicular to the IR.",
        visualGuide: {
          type: "line",
          from: [0, 2.2, 0.1],
          to: [-0.15, 1.9, 0.1],
          color: "#f39c12",
          thickness: 3
        }
      },
      {
        id: 4,
        title: "Emphasize Mid-Sagittal Plane Alignment",
        description: "Rotate view to confirm the MSP is perpendicular to the image receptor.",
        cameraAction: {
          type: "rotate",
          angle: 45,
          duration: 1500,
          axis: "y"
        },
        highlights: [
          { part: "mid_sagittal_plane", color: "#e74c3c", duration: 2000 }
        ]
      },
      {
        id: 5,
        title: "Highlight Central Ray Direction",
        description: "Add a visual CR line directed perpendicular to the IR, passing just distal to the chin tip.",
        visualGuide: {
          type: "central_ray",
          from: [0, 2.2, 2],
          to: [0, 2.2, -0.5],
          color: "#e67e22",
          thickness: 5,
          animated: true
        }
      },
      {
        id: 6,
        title: "Show Radiographic Goal",
        description: "Reveal internal view showing the dens projected within the foramen magnum.",
        cameraAction: {
          type: "internal_view",
          target: "dens",
          duration: 2000
        },
        highlights: [
          { part: "dens", color: "#9b59b6", duration: 3000 },
          { part: "foramen_magnum", color: "#3498db", duration: 3000 }
        ]
      },
      {
        id: 7,
        title: "Clinical Use Case",
        description: "Pop-up tip: Use this method when the upper half of the dens is not clearly seen in the open-mouth view.",
        tip: {
          type: "clinical_tip",
          text: "Use this method when the upper half of the dens is not clearly seen in the open-mouth view.",
          position: "top-right",
          duration: 5000
        }
      }
    ],
    clinicalContext: {
      indication: "When upper half of dens not clearly visualized in open-mouth view",
      contraindications: ["Severe cervical spine injury", "Patient unable to extend neck"],
      alternativeMethods: ["Open-mouth view", "Swimmer's view"]
    }
  },
  
  "Cervical Spine AP Projection": {
    title: "Cervical Spine AP Projection",
    description: "Learn proper positioning for AP cervical spine radiography with emphasis on patient positioning and technical factors.",
    learningObjectives: [
      "Understand proper patient positioning for AP cervical spine",
      "Identify key anatomical landmarks for positioning",
      "Learn technical factors for optimal image quality",
      "Recognize common positioning errors"
    ],
    steps: [
      {
        id: 1,
        title: "Initial Positioning",
        description: "Position patient supine with head in neutral position."
      },
      {
        id: 2,
        title: "Head Alignment",
        description: "Ensure MSP is perpendicular to IR and chin is slightly elevated."
      },
      {
        id: 3,
        title: "Central Ray Positioning",
        description: "Direct CR perpendicular to C4 vertebra.",
        visualGuide: {
          type: "central_ray",
          from: [0, 1.8, 2],
          to: [0, 1.8, -0.5],
          color: "#e67e22",
          thickness: 5
        }
      }
    ]
  },

  "Thoracic Spine Lateral": {
    title: "Thoracic Spine Lateral Projection",
    description: "Master the lateral positioning technique for thoracic spine radiography.",
    learningObjectives: [
      "Position patient for lateral thoracic spine",
      "Understand importance of arm positioning",
      "Learn to minimize superimposition of shoulders",
      "Identify optimal exposure factors"
    ],
    steps: [
      {
        id: 1,
        title: "Lateral Positioning",
        description: "Position patient in lateral recumbent position."
      },
      {
        id: 2,
        title: "Arm Positioning",
        description: "Elevate arms to reduce shoulder superimposition."
      },
      {
        id: 3,
        title: "Central Ray Alignment",
        description: "Direct CR perpendicular to T7 vertebra.",
        visualGuide: {
          type: "central_ray",
          from: [2, 1.2, 0],
          to: [-2, 1.2, 0],
          color: "#e67e22",
          thickness: 5
        }
      }
    ]
  }
};

// Helper function to get lesson by title
export const getLessonByTitle = (title) => {
  return radiologicLessons[title] || null;
};

// Helper function to get all lesson titles
export const getAllLessonTitles = () => {
  return Object.keys(radiologicLessons);
};

// Helper function to get lessons by category
export const getLessonsByCategory = (category) => {
  const categoryLessons = {
    "Cervical Positioning": ["Fuchs Method & AP Dens Projection", "Cervical Spine AP Projection"],
    "Thoracic Positioning": ["Thoracic Spine Lateral"],
    "Lumbar Positioning": [],
    "Special Techniques": []
  };
  
  return categoryLessons[category] || [];
};
