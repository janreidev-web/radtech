// src/components/LessonHandler/LessonDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLessonAnimations } from './LessonAnimationContext';

// Icons for the accordion open/close state
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const anatomyCategories = [
  { 
    title: "Vertebral column", 
    lessons: ["Cervical Region", "Thoracic Region", "Lumbar Region", "Sacrum & Pelvic Region"] 
  },
  { 
    title: "Spinal curvatures", 
    lessons: ["Cervical & Lumbar Curve", "Thoracic & Pelvic Curve", "Scoliosis"] 
  },
  { 
    title: "Atlanto-occipital joints", 
    lessons: ["Articular Surfaces", "Ligaments", "Movements (Nodding)"] 
  },
  { 
    title: "Dens", 
    lessons: ["Structure of the Dens", "Articulation with Atlas", "Transverse Ligament"] 
  },
  { 
    title: "Atlas & axis", 
    lessons: ["Anatomy of C1 (Atlas)", "Anatomy of C2 (Axis)", "Atlanto-axial Joint"] 
  },
  { 
    title: "Cervical vertebrae", 
    lessons: ["Typical Cervical (C3-C6)", "Atypical Cervical (C1, C2, C7)", "Foramina Transversaria"] 
  },
  { 
    title: "Thoracic vertebrae", 
    lessons: ["Costal Facets", "Spinous Process Shape", "Articulation with Ribs"] 
  },
  { 
    title: "Lumbar & lumbosacral vertebrae", 
    lessons: ["Large Vertebral Body", "Lumbar Spine Biomechanics", "Lumbosacral Angle"] 
  },
  { 
    title: "L5-s1 lumbosacral junction", 
    lessons: ["Anatomy of L5", "Anatomy of S1", "Intervertebral Disc and Ligaments"] 
  },
  { 
    title: "Zygapophyseal joints", 
    lessons: ["Also known as Facet Joints", "Joint Capsule", "Clinical Significance"] 
  },
  { 
    title: "Lumbosacral joints & sacral joints", 
    lessons: ["Lumbosacral Articulation", "Sacrococcygeal Joint", "Median Sacral Crest"] 
  },
  { 
    title: "Sacroiliac joints", 
    lessons: ["Articulation with Pelvis", "Supporting Ligaments", "SI Joint Dysfunction"] 
  },
  { 
    title: "Pubic symphysis", 
    lessons: ["Cartilaginous Joint", "Role in Pelvic Girdle", "Changes During Pregnancy"] 
  },
  { 
    title: "Sacrum", 
    lessons: ["Fused Vertebrae (S1-S5)", "Sacral Foramina", "Sacral Canal"] 
  },
  { 
    title: "Coccyx", 
    lessons: ["Tailbone Anatomy", "Vestigial Structure", "Coccygeal Ligaments"] 
  },
  { 
    title: "Lumbar intervertebral disks", 
    lessons: ["Annulus Fibrosus", "Nucleus Pulposus", "Disc Herniation"] 
  },
];

function LessonDashboard({ onLessonSelected, onReset }) {
  // ✅ State to track which accordion item is currently open. '-1' means all are closed.
  const [openIndex, setOpenIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Get animation handlers from context
  const { triggerCameraAnimation } = useLessonAnimations();

  // ✅ Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Function to handle clicking a category header
  const handleToggle = (index) => {
    // If the clicked item is already open, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // ✅ Function to handle lesson click
  const handleLessonClick = (lessonName, categoryTitle) => {
    console.log('Lesson clicked:', lessonName, 'Mobile:', isMobile);

    // Zoom out camera when lesson is clicked
    const zoomOutAnimation = {
      position: [0, 2, 8], // Zoom out further from [0, 2, 5]
      lookAt: [0, 0, 0],
      duration: 2000
    };
    triggerCameraAnimation(zoomOutAnimation);

    // Notify parent to handle lesson selection
    if (onLessonSelected) {
      onLessonSelected({
        lessonName,
        description: `${lessonName} is part of ${categoryTitle}. This lesson introduces the key anatomy and concepts you will explore next. Use the steps and camera controls to examine structures and their clinical relevance.`
      });
    }
  };

  // ✅ Function to handle reset button click
  const handleResetClick = () => {
    console.log('Reset clicked, Mobile:', isMobile);
    
    // Reset to exact initial camera position from ModelLoader
    const resetAnimation = {
      position: [0, 2, 5], // Initial camera position from Canvas (centered front view)
      lookAt: [0, 0, 0],
      duration: 2000
    };
    
    // Trigger the camera animation to reset position
    triggerCameraAnimation(resetAnimation);
    
    // Call the parent reset handler to hide table and reset model
    if (onReset) {
      onReset();
    }
  };

  return (
    <>
    <div className="flex flex-col h-40 md:h-100">
      {/* Header with Lessons title and Reset button */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-md md:text-xl font-bold">Lessons</h2>
        <button
          onClick={handleResetClick}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
          title="Reset camera to original position"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        {anatomyCategories.map((category, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            {/* Category Header Button */}
            <button
              onClick={() => handleToggle(index)}
              className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm md:font-semibold text-gray-800">{category.title}</span>
              <span className={openIndex === index ? 'rotate-180' : ''}>
                <ChevronDownIcon />
              </span>
            </button>

            {/* Collapsible Lesson List */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <ul className="py-2 pl-6 pr-3">
                {category.lessons.map((lesson, lessonIndex) => (
                <li
                  key={lessonIndex}
                  className="text-gray-700 text-sm md:text-xs p-2 rounded-md hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleLessonClick(lesson, category.title)}
                  title={`Click to zoom to ${lesson}`}
                >
                  {lesson}
                </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default LessonDashboard;