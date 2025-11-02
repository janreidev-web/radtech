// src/components/LessonHandler/LessonDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLessonAnimations } from './LessonAnimationContext';

// Icons for the accordion open/close state
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const Categories = [
  { 
    title: "Lateral Cervical Spine (Grandy Method)", 
    lessons: [
      "Purpose and Clinical Use",
      "Patient Positioning and Body Alignment",
      "Head and Neck Placement",
      "Central Ray (CR) Direction and Level",
      "Evaluation Criteria for C1–C7",
      "Common Errors and Corrections"
    ] 
  },
  { 
    title: "Lateral Cervicothoracic Spine (Swimmer’s View - Twinning Method)", 
    lessons: [
      "Purpose and Indications (C7–T1 Visualization)",
      "Patient Position (Upright Lateral)",
      "Arm and Shoulder Positioning",
      "CR Centering and Beam Alignment",
      "Image Evaluation and Landmarks",
      "Positioning Errors and Correction Techniques"
    ] 
  },
  { 
    title: "Lateral Cervicothoracic Spine (Swimmer’s View - Pawlow Method)", 
    lessons: [
      "Purpose and Patient Considerations",
      "Recumbent Lateral Setup",
      "Arm Placement and Shoulder Depression",
      "CR Angulation and Centering",
      "Evaluation Criteria (C7–T1 Clarity)",
      "Correction and Safety Measures"
    ] 
  },
  { 
    title: "Monda Modification (Cephalad Angulation)", 
    lessons: [
      "Purpose of CR Angulation Adjustment",
      "When to Apply Cephalad Angle (5–15°)",
      "Technique for Shoulder Overlap Correction",
      "Positioning Tips for Disk Space Visibility",
      "Image Quality and Evaluation Points"
    ] 
  },
  { 
    title: "Lateral Thoracic Spine Projection", 
    lessons: [
      "Purpose and Anatomical Coverage (T1–T12)",
      "Patient Position and Support Aids",
      "Arm Elevation and Body Alignment",
      "CR Centering at T7",
      "Breathing Technique and Exposure Control",
      "Evaluation Criteria and Common Errors"
    ] 
  },
  { 
    title: "Comparative Analysis of Lateral Spine Techniques", 
    lessons: [
      "Differences Between Cervical, Cervicothoracic, and Thoracic Views",
      "Challenges Faced by Radiologic Technology Interns",
      "Proper Positioning Strategies for Difficult Patients",
      "Techniques to Reduce Shoulder Superimposition",
      "Importance of Correct CR Angulation",
      "Recommendations for Clinical Improvement"
    ] 
  }
];


function LessonDashboard({ onLessonSelected, onReset }) {
  // ✅ State to track which accordion item is currently open. '-1' means all are closed.
  const [openIndex, setOpenIndex] = useState(-1);
  const [_isMobile, _setIsMobile] = useState(false);

  // ✅ Get animation handlers from context
  const { triggerCameraAnimation } = useLessonAnimations();

  // ✅ Detect mobile screen size
  useEffect(() => {
  const checkMobile = () => _setIsMobile(window.innerWidth <= 768);
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
    // console removed

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
    // console removed
    
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
        {Categories.map((category, index) => (
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