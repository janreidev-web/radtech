import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, BookOpen, ArrowRight } from 'lucide-react';
import AnatomyPointer from './AnatomyPointer';
import { useLessonAnimations } from './LessonAnimationContext';
import { getCameraPreset } from './cameraPresets';

function FlashcardViewer({ flashcards, categoryTitle, onClose, onFocusChange, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { triggerCameraAnimation } = useLessonAnimations();

  const currentCard = flashcards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === flashcards.length - 1;

  const handleCardChange = (newIndex) => {
    setCurrentIndex(newIndex);
    
    // Trigger camera animation if the card has a camera preset
    const newCard = flashcards[newIndex];
    if (newCard.cameraPreset) {
      const preset = getCameraPreset(newCard.cameraPreset);
      triggerCameraAnimation({
        position: preset.position,
        lookAt: preset.lookAt,
        duration: 1000
      });
    }
    
    // Trigger focus change callback
    if (onFocusChange && newCard.focusTarget) {
      onFocusChange(newCard.focusTarget);
    }
  };

  const handleComplete = () => {
    // First trigger reset if available, then close
    if (onReset) {
      onReset();
      setTimeout(() => {
        onClose();
      }, 100);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    if (!isLast) {
      handleCardChange(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      handleCardChange(currentIndex - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' && !isLast) handleNext();
    if (e.key === 'ArrowLeft' && !isFirst) handlePrevious();
    if (e.key === 'Escape') onClose();
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <>
      {/* Animated Anatomy Pointer - Points from card to 3D model anatomy */}
      {currentCard.focusTarget && (
        <AnatomyPointer focusTarget={currentCard.focusTarget} />
      )}

      {/* Side Panel Flashcard */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-full max-w-lg mx-4 sm:mx-0 sm:w-[480px]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <div>
                  <h2 className="text-lg font-bold">{categoryTitle}</h2>
                  <p className="text-xs text-teal-100">
                    Card {currentIndex + 1} of {flashcards.length}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close flashcards"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>

          {/* Card Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {/* Arrow indicator pointing to model */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-shrink-0 bg-cyan-100 p-2 rounded-full">
                <ArrowRight className="text-cyan-600" size={20} />
              </div>
              <div className="text-sm font-semibold text-cyan-700">
                Looking at: {currentCard.focusTarget}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {currentCard.title}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {currentCard.content}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 bg-white border-t border-gray-100">
            {/* Progress Dots */}
            <div className="flex justify-center space-x-1.5 mb-4">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardChange(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-teal-500 w-6'
                      : index < currentIndex
                      ? 'bg-teal-300 w-2'
                      : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <button
                onClick={handlePrevious}
                disabled={isFirst}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                  isFirst
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                onClick={isLast ? handleComplete : handleNext}
                className="flex items-center space-x-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition-colors flex-shrink-0"
              >
                <span>{isLast ? 'Complete' : 'Next'}</span>
                {!isLast && <ChevronRight size={16} />}
              </button>
            </div>

            {/* Keyboard Hints */}
            <div className="text-center text-xs text-gray-500">
              Use arrow keys • Press ESC to close
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlashcardViewer;
