import React, { useState } from 'react';
import './AssessmentContent.css';

const AssessmentContent = () => {
  const [activeSection, setActiveSection] = useState('theory');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const theoryContent = {
    technicalFactors: {
      title: 'Technical Factors in Radiography',
      content: [
        {
          topic: 'kVp (Kilovoltage Peak)',
          formula: 'body thickness (in cm) × 2 + machine constant (40) = ____ kVp',
          explanation: 'kVp controls the penetrating power of the x-ray beam. Higher kVp creates more penetrating x-rays that can pass through denser body parts.',
          example: 'For a body part measuring 20 cm thick: 20 × 2 + 40 = 80 kVp'
        },
        {
          topic: 'mAs (Milliamperage-seconds)',
          formula: 'For every 4-5 cm thickness, increase mAs by factor of 2',
          explanation: 'mAs controls the quantity of x-rays produced. Thicker body parts require more mAs to ensure adequate penetration and image quality.',
          example: 'For 20 cm thickness: 4 segments of 5cm = 2×2×2×2 = 16 mAs'
        },
        {
          topic: 'Distance and Density',
          formula: 'mAs ∝ distance²',
          explanation: 'When distance doubles, mAs must increase by factor of 4 to maintain exposure.',
          example: 'If distance increases from 100cm to 200cm, mAs must increase 4x'
        }
      ]
    }
  };

  const testQuestions = [
    // Set 1: Basic kVp Calculations
    {
      id: 1,
      type: 'calculation',
      question: 'Calculate the appropriate kVp for a patient with an abdominal thickness of 18 cm.',
      image: null,
      solution: {
        steps: [
          'Body thickness = 18 cm',
          'Formula: thickness × 2 + 40',
          'Calculation: 18 × 2 + 40',
          'Result: 36 + 40 = 76 kVp'
        ],
        answer: '76 kVp'
      }
    },
    {
      id: 2,
      type: 'calculation',
      question: 'A patient\'s chest measures 22 cm in thickness. Calculate the required kVp.',
      image: null,
      solution: {
        steps: [
          'Body thickness = 22 cm',
          'Formula: thickness × 2 + 40',
          'Calculation: 22 × 2 + 40',
          'Result: 44 + 40 = 84 kVp'
        ],
        answer: '84 kVp'
      }
    },
    {
      id: 3,
      type: 'calculation',
      question: 'For a lateral skull projection with 15 cm thickness, what kVp should be used?',
      image: null,
      solution: {
        steps: [
          'Body thickness = 15 cm',
          'Formula: thickness × 2 + 40',
          'Calculation: 15 × 2 + 40',
          'Result: 30 + 40 = 70 kVp'
        ],
        answer: '70 kVp'
      }
    },
    
    // Set 2: mAs Calculations
    {
      id: 4,
      type: 'calculation',
      question: 'A patient\'s chest measures 20 cm in thickness. Calculate the required mAs if base is 2 mAs.',
      image: null,
      solution: {
        steps: [
          'Body thickness = 20 cm',
          'Number of 5cm segments: 20 ÷ 5 = 4 segments',
          'mAs multiplier: 2 × 2 × 2 × 2 = 16',
          'New mAs: 2 × 16 = 32 mAs'
        ],
        answer: '32 mAs'
      }
    },
    {
      id: 5,
      type: 'calculation',
      question: 'Calculate mAs for a 25 cm thick abdomen with base mAs of 3.',
      image: null,
      solution: {
        steps: [
          'Body thickness = 25 cm',
          'Number of 5cm segments: 25 ÷ 5 = 5 segments',
          'mAs multiplier: 2⁵ = 32',
          'New mAs: 3 × 32 = 96 mAs'
        ],
        answer: '96 mAs'
      }
    },
    {
      id: 6,
      type: 'calculation',
      question: 'A 30 cm thick lateral lumbar spine requires what mAs if base is 4 mAs?',
      image: null,
      solution: {
        steps: [
          'Body thickness = 30 cm',
          'Number of 5cm segments: 30 ÷ 5 = 6 segments',
          'mAs multiplier: 2⁶ = 64',
          'New mAs: 4 × 64 = 256 mAs'
        ],
        answer: '256 mAs'
      }
    },

    // Set 3: Distance and Grid Calculations
    {
      id: 7,
      type: 'calculation',
      question: 'If SID increases from 100cm to 200cm, how much should mAs change?',
      image: null,
      solution: {
        steps: [
          'Distance doubles (100cm → 200cm)',
          'Formula: mAs ∝ distance²',
          'Distance factor: (200 ÷ 100)² = 2² = 4',
          'mAs must increase by factor of 4'
        ],
        answer: 'Increase mAs by 4x'
      }
    },
    {
      id: 8,
      type: 'calculation',
      question: 'A technique uses 10 mAs at 40" SID. What mAs is needed at 72" SID?',
      image: null,
      solution: {
        steps: [
          'Convert to consistent units: 40" = 101.6cm, 72" = 182.9cm',
          'Distance ratio: 182.9 ÷ 101.6 = 1.8',
          'mAs factor: 1.8² = 3.24',
          'New mAs: 10 × 3.24 = 32.4 mAs'
        ],
        answer: '32.4 mAs'
      }
    },
    {
      id: 9,
      type: 'calculation',
      question: 'Using a 12:1 grid instead of no grid, how much should mAs increase?',
      image: null,
      solution: {
        steps: [
          'Grid conversion factors: No grid = 1, 12:1 grid = 5',
          'mAs increase factor: 5 ÷ 1 = 5',
          'Original mAs × 5 = new mAs'
        ],
        answer: 'Increase mAs by 5x'
      }
    },

    // Set 4: Complex Word Problems
    {
      id: 10,
      type: 'wordproblem',
      question: 'A radiographer needs to image a lateral lumbar spine. The patient measures 25 cm thick. If the standard technique is 80 kVp at 10 mAs, what adjustments should be made?',
      image: null,
      solution: {
        steps: [
          'Calculate kVp: 25 × 2 + 40 = 90 kVp',
          'Calculate mAs segments: 25 ÷ 5 = 5 segments',
          'mAs multiplier: 2⁵ = 32',
          'New mAs: 10 × 32 = 320 mAs'
        ],
        answer: '90 kVp at 320 mAs'
      }
    },
    {
      id: 11,
      type: 'wordproblem',
      question: 'An AP chest exam normally uses 70 kVp at 5 mAs for a 20 cm patient. A new patient measures 24 cm and requires a 10:1 grid. Calculate the new technique.',
      image: null,
      solution: {
        steps: [
          'Calculate kVp: 24 × 2 + 40 = 88 kVp',
          'Calculate mAs segments: 24 ÷ 5 = 4.8 ≈ 5 segments',
          'mAs multiplier: 2⁵ = 32',
          'Base mAs: 5 × 32 = 160 mAs',
          'Grid factor (10:1): 4',
          'Final mAs: 160 × 4 = 640 mAs'
        ],
        answer: '88 kVp at 640 mAs'
      }
    },
    {
      id: 12,
      type: 'wordproblem',
      question: 'A pediatric patient has a 12 cm thick abdomen. Standard adult technique is 80 kVp at 20 mAs. What pediatric technique should be used?',
      image: null,
      solution: {
        steps: [
          'Calculate kVp: 12 × 2 + 40 = 64 kVp',
          'Calculate mAs segments: 12 ÷ 5 = 2.4 ≈ 2 segments',
          'mAs multiplier: 2² = 4',
          'New mAs: 20 × 4 = 80 mAs',
          'Pediatric reduction: typically 50-70% of adult',
          'Adjusted mAs: 80 × 0.6 = 48 mAs'
        ],
        answer: '64 kVp at 48 mAs'
      }
    },

    // Set 5: Advanced Clinical Scenarios
    {
      id: 13,
      type: 'wordproblem',
      question: 'A trauma patient with a 28 cm thick abdomen needs an urgent supine abdomen. Standard erect technique is 85 kVp at 40 mAs. The patient has an abdominal wound requiring a 12:1 grid. Calculate the appropriate technique.',
      image: null,
      solution: {
        steps: [
          'Calculate kVp: 28 × 2 + 40 = 96 kVp',
          'Calculate mAs segments: 28 ÷ 5 = 5.6 ≈ 6 segments',
          'mAs multiplier: 2⁶ = 64',
          'Base mAs: 40 × 64 = 2560 mAs',
          'Grid factor (12:1): 5',
          'Final mAs: 2560 × 5 = 12800 mAs',
          'Practical adjustment: Use AEC or reduce to manageable levels'
        ],
        answer: '96 kVp at 12800 mAs (practically use AEC)'
      }
    },
    {
      id: 14,
      type: 'wordproblem',
      question: 'Compare techniques for the same patient imaged at 40" SID vs 72" SID. Patient thickness is 22 cm, base technique is 75 kVp at 8 mAs at 40".',
      image: null,
      solution: {
        steps: [
          'kVp remains same: 75 kVp (thickness unchanged)',
          'Distance ratio: 72 ÷ 40 = 1.8',
          'mAs factor: 1.8² = 3.24',
          'New mAs: 8 × 3.24 = 25.9 mAs'
        ],
        answer: '75 kVp at 25.9 mAs (72" SID)'
      }
    },
    {
      id: 15,
      type: 'wordproblem',
      question: 'A patient with ascites has an abdomen measuring 32 cm thick. Standard technique for normal abdomen (25 cm) is 90 kVp at 25 mAs with 8:1 grid. Calculate the new technique.',
      image: null,
      solution: {
        steps: [
          'Calculate kVp: 32 × 2 + 40 = 104 kVp',
          'Calculate mAs segments: 32 ÷ 5 = 6.4 ≈ 6 segments',
          'mAs multiplier: 2⁶ = 64',
          'Base mAs: 25 × 64 = 1600 mAs',
          'Grid factor remains same (8:1): 3',
          'Final mAs: 1600 × 3 = 4800 mAs'
        ],
        answer: '104 kVp at 4800 mAs'
      }
    }
  ];

  const recapContent = {
    assessment: {
      title: 'Assessment Recap',
      points: [
        'Always measure patient thickness before setting exposure factors',
        'kVp affects image contrast and penetration',
        'mAs affects image density and brightness',
        'The 15% rule: 15% increase in kVp ≈ doubling of mAs',
        'Grid ratio affects required mAs (higher grid = more mAs)'
      ]
    },
    technical: {
      title: 'Technical Aspects Recap',
      points: [
        'Technical factors are interconnected and must be balanced',
        'Patient size and pathology require factor adjustments',
        'Always consider automatic exposure control (AEC) when available',
        'Document all technique factors for quality control',
        'Follow ALARA principle (As Low As Reasonably Achievable)'
      ]
    }
  };

  const handleAnswerSubmit = () => {
    setShowSolution(true);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % testQuestions.length);
    setShowSolution(false);
    setUserAnswer('');
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + testQuestions.length) % testQuestions.length);
    setShowSolution(false);
    setUserAnswer('');
  };

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h1>RadTechnology Assessment</h1>
        <p>Master the fundamentals of radiographic exposure factors</p>
      </div>

      <div className="section-tabs">
        <button
          className={`tab-button ${activeSection === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveSection('theory')}
        >
          Theory
        </button>
        <button
          className={`tab-button ${activeSection === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveSection('practice')}
        >
          Practice Tests
        </button>
        <button
          className={`tab-button ${activeSection === 'recap' ? 'active' : ''}`}
          onClick={() => setActiveSection('recap')}
        >
          Recap
        </button>
      </div>

      <div className="content-area">
        {activeSection === 'theory' && (
          <div className="theory-section">
            <h2>Technical Factors Theory</h2>
            {theoryContent.technicalFactors.content.map((item, index) => (
              <div key={index} className="theory-card">
                <h3>{item.topic}</h3>
                <div className="formula-box">
                  <strong>Formula:</strong> {item.formula}
                </div>
                <p className="explanation">{item.explanation}</p>
                <div className="example-box">
                  <strong>Example:</strong> {item.example}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'practice' && (
          <div className="practice-section">
            <h2>Practice Problems</h2>
            <div className="question-counter">
              Question {currentQuestion + 1} of {testQuestions.length}
            </div>
            
            <div className="question-card">
              <h3>{testQuestions[currentQuestion].question}</h3>
              
              {testQuestions[currentQuestion].image && (
                <div className="question-image">
                  <img src={testQuestions[currentQuestion].image} alt="Question visual" />
                </div>
              )}

              <div className="answer-input">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer here..."
                  rows={4}
                />
              </div>

              <div className="question-actions">
                <button onClick={handleAnswerSubmit} className="submit-btn">
                  Show Solution
                </button>
                <div className="navigation-buttons">
                  <button onClick={prevQuestion} className="nav-btn">
                    Previous
                  </button>
                  <button onClick={nextQuestion} className="nav-btn">
                    Next
                  </button>
                </div>
              </div>

              {showSolution && (
                <div className="solution-box">
                  <h4>Solution:</h4>
                  <ol>
                    {testQuestions[currentQuestion].solution.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                  <div className="final-answer">
                    <strong>Answer:</strong> {testQuestions[currentQuestion].solution.answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'recap' && (
          <div className="recap-section">
            <h2>Assessment & Technical Recap</h2>
            
            <div className="recap-card">
              <h3>{recapContent.assessment.title}</h3>
              <ul>
                {recapContent.assessment.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="recap-card">
              <h3>{recapContent.technical.title}</h3>
              <ul>
                {recapContent.technical.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="quick-reference">
              <h3>Quick Reference Formulas</h3>
              <div className="formula-grid">
                <div className="formula-item">
                  <strong>kVp:</strong> Thickness × 2 + 40
                </div>
                <div className="formula-item">
                  <strong>mAs:</strong> Base × 2^(segments of 5cm)
                </div>
                <div className="formula-item">
                  <strong>Distance:</strong> mAs ∝ distance²
                </div>
                <div className="formula-item">
                  <strong>15% Rule:</strong> 15% kVp ↑ ≈ 2× mAs
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentContent;
