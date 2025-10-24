import React, { useState, useEffect, useRef } from 'react';
import { radiologicLessons } from './lessonData';
import { useLessonAnimations } from './LessonAnimationContext';

const LessonPlayer = ({ lessonTitle, onClose }) => {
  const lesson = radiologicLessons[lessonTitle];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const animationRef = useRef(null);
  const tipTimeoutRef = useRef(null);
  
  // Get animation handlers from context
  const { triggerCameraAnimation, triggerVisualGuide } = useLessonAnimations();

  const currentStepData = lesson?.steps[currentStep];
  const totalSteps = lesson?.steps.length || 0;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps) {
      const stepDuration = currentStepData?.cameraAction?.duration || 3000;
      animationRef.current = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, stepDuration);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps, currentStepData]);

  // Progress calculation
  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Handle tip display
  useEffect(() => {
    if (currentStepData?.tip) {
      setShowTip(true);
      tipTimeoutRef.current = setTimeout(() => {
        setShowTip(false);
      }, currentStepData.tip.duration || 5000);
    } else {
      setShowTip(false);
    }

    return () => {
      if (tipTimeoutRef.current) {
        clearTimeout(tipTimeoutRef.current);
      }
    };
  }, [currentStepData]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    triggerStepAnimations(stepIndex);
  };

  const triggerStepAnimations = (stepIndex) => {
    const step = lesson.steps[stepIndex];
    if (!step) return;

    // Trigger camera animation if present
    if (step.cameraAction) {
      triggerCameraAnimation(step.cameraAction);
    }

    // Trigger visual guide if present
    if (step.visualGuide) {
      triggerVisualGuide(step.visualGuide);
    }

    // Trigger highlights if present
    if (step.highlights) {
      step.highlights.forEach(highlight => {
        triggerVisualGuide({
          type: 'highlight',
          ...highlight
        });
      });
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Show error if lesson not found
  if (!lesson) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">The requested lesson could not be found.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="text-sm opacity-90 mt-1">{lesson.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[60vh]">
          {/* Lesson Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Step {currentStep + 1} of {totalSteps}: {currentStepData?.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentStepData?.description}</p>
              
              {/* Learning Objectives */}
              {currentStep === 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Learning Objectives:</h4>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    {lesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-sm">{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step-specific content */}
              {currentStepData && (
                <div className="space-y-4">
                  {/* Camera Action */}
                  {currentStepData.cameraAction && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="font-medium text-green-800">Camera Action</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        {currentStepData.cameraAction.type === 'zoom' && 'Zooming into target area...'}
                        {currentStepData.cameraAction.type === 'rotate' && 'Rotating view...'}
                        {currentStepData.cameraAction.type === 'internal_view' && 'Switching to internal view...'}
                      </p>
                    </div>
                  )}

                  {/* Visual Guide */}
                  {currentStepData?.visualGuide && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className="font-medium text-purple-800">Visual Guide</span>
                      </div>
                      <p className="text-purple-700 text-sm">
                        {currentStepData.visualGuide.type === 'central_ray' && 'Displaying central ray direction...'}
                        {currentStepData.visualGuide.type === 'line' && 'Showing alignment line...'}
                      </p>
                    </div>
                  )}

                  {/* Highlights */}
                  {currentStepData.highlights && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="font-medium text-yellow-800">Anatomical Highlights</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentStepData.highlights.map((highlight, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: highlight.color, color: 'white' }}
                          >
                            {highlight.part.replace('_', ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Labels */}
                  {currentStepData.labels && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                        <span className="font-medium text-gray-800">Anatomical Labels</span>
                      </div>
                      <div className="space-y-1">
                        {currentStepData.labels.map((label, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: label.color }}
                            ></div>
                            <span className="text-sm text-gray-700">{label.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:w-80 bg-gray-50 p-4 border-l">
            {/* Step Navigation */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Lesson Steps</h4>
              <div className="space-y-2">
                {lesson.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      index === currentStep
                        ? 'bg-blue-500 text-white'
                        : index < currentStep
                        ? 'bg-green-100 text-green-800'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs opacity-75 mt-1">{step.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Controls</h4>
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  Restart
                </button>
                <button
                  onClick={handlePlayPause}
                  className={`flex-1 px-3 py-2 rounded text-sm ${
                    isPlaying 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === totalSteps - 1}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Clinical Context */}
            {lesson.clinicalContext && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Clinical Context</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-green-600">Indication:</span>
                    <p className="text-gray-600">{lesson.clinicalContext.indication}</p>
                  </div>
                  {lesson.clinicalContext.contraindications && (
                    <div>
                      <span className="font-medium text-red-600">Contraindications:</span>
                      <ul className="text-gray-600 list-disc list-inside">
                        {lesson.clinicalContext.contraindications.map((contra, index) => (
                          <li key={index}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tip Overlay */}
        {showTip && currentStepData?.tip && (
          <div className="absolute top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💡</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-yellow-800">Clinical Tip</h4>
                <p className="text-yellow-700 text-sm mt-1">{currentStepData.tip.text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
