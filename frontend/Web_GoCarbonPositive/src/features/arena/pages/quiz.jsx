import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/quiz.css";
import { 
  FaBook, 
  FaTrophy, 
  FaClock, 
  FaBolt,
  FaCheckCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaMinusCircle,
  FaCoins,
  FaCalendarAlt
} from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';

const GreenTechQuiz = () => {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Which renewable energy source generates electricity using photovoltaic cells?",
      options: [
        { id: 'A', text: 'Wind Energy' },
        { id: 'B', text: 'Solar Energy' },
        { id: 'C', text: 'Hydropower' },
        { id: 'D', text: 'Geothermal Energy' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 2,
      question: "What does the term 'carbon footprint' refer to?",
      options: [
        { id: 'A', text: 'The amount of carbon dioxide emitted by a person or organization' },
        { id: 'B', text: 'The physical imprint of carbon atoms' },
        { id: 'C', text: 'The density of carbon in soil' },
        { id: 'D', text: 'A measurement of carbon monoxide in air' }
      ],
      correctAnswer: 'A'
    },
    {
      id: 3,
      question: "Which gas is primarily responsible for the greenhouse effect?",
      options: [
        { id: 'A', text: 'Oxygen' },
        { id: 'B', text: 'Nitrogen' },
        { id: 'C', text: 'Carbon Dioxide' },
        { id: 'D', text: 'Hydrogen' }
      ],
      correctAnswer: 'C'
    },
    {
      id: 4,
      question: "What is the most efficient way to reduce energy consumption at home?",
      options: [
        { id: 'A', text: 'Using LED bulbs' },
        { id: 'B', text: 'Improving insulation' },
        { id: 'C', text: 'Installing solar panels' },
        { id: 'D', text: 'Using smart thermostats' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 5,
      question: "Which material takes the longest to decompose in a landfill?",
      options: [
        { id: 'A', text: 'Paper' },
        { id: 'B', text: 'Plastic bottles' },
        { id: 'C', text: 'Food waste' },
        { id: 'D', text: 'Glass' }
      ],
      correctAnswer: 'D'
    },
    {
      id: 6,
      question: "What percentage of Earth's water is fresh water?",
      options: [
        { id: 'A', text: '1%' },
        { id: 'B', text: '2.5%' },
        { id: 'C', text: '10%' },
        { id: 'D', text: '25%' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 7,
      question: "Which technology captures and stores carbon dioxide from the atmosphere?",
      options: [
        { id: 'A', text: 'Carbon sequestration' },
        { id: 'B', text: 'Carbon trading' },
        { id: 'C', text: 'Carbon offsetting' },
        { id: 'D', text: 'Carbon neutrality' }
      ],
      correctAnswer: 'A'
    },
    {
      id: 8,
      question: "What is the primary benefit of electric vehicles over traditional cars?",
      options: [
        { id: 'A', text: 'Lower cost' },
        { id: 'B', text: 'Zero direct emissions' },
        { id: 'C', text: 'Faster acceleration' },
        { id: 'D', text: 'Longer range' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 9,
      question: "Which sustainable practice helps reduce water usage in agriculture?",
      options: [
        { id: 'A', text: 'Flood irrigation' },
        { id: 'B', text: 'Drip irrigation' },
        { id: 'C', text: 'Sprinkler systems' },
        { id: 'D', text: 'Manual watering' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 10,
      question: "What does 'biodegradable' mean?",
      options: [
        { id: 'A', text: 'Can be broken down by living organisms' },
        { id: 'B', text: 'Made from biological materials' },
        { id: 'C', text: 'Safe for human consumption' },
        { id: 'D', text: 'Recyclable material' }
      ],
      correctAnswer: 'A'
    }
  ];

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNext();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  useEffect(() => {
    if (quizStarted || quizCompleted) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [quizStarted, currentQuestion, quizCompleted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
    }
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleNavigate = (index) => {
    if (index <= currentQuestion) {
      return; // Prevent going back
    }
    if (index < questions.length && selectedAnswers[index] !== undefined) {
      setCurrentQuestion(index);
      setTimeLeft(20);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === undefined) {
        skipped++;
      } else if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, skipped, total: correct * 4 };
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <h1 className="quiz-title">Green Tech Awareness Quiz</h1>
          <p className="quiz-description">
            Test your knowledge about sustainable technology, renewable energy, and eco-friendly
            innovations shaping our future.
          </p>

          <div className="quiz-stats">
            <div className="stat-card">
              <FaBook className="stat-icon" />
              <div className="stat-number">10</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div className="stat-number">40</div>
              <div className="stat-label">Total Marks</div>
            </div>
            <div className="stat-card">
              <FaBolt className="stat-icon" />
              <div className="stat-number">+4</div>
              <div className="stat-label">Per Question</div>
            </div>
            <div className="stat-card">
              <FaClock className="stat-icon" />
              <div className="stat-number">20s</div>
              <div className="stat-label">Time/Question</div>
            </div>
          </div>

          <div className="time-challenge">
            <FaClock className="challenge-icon" />
            <span>Time Challenge: You have 20 seconds per question. Auto-advances when time runs out!</span>
          </div>

          <div className="rules-section">
            <div className="rules-header">
              <FaShieldAlt className="rules-icon" />
              <h2>Rules & Instructions</h2>
            </div>
            <div className="rules-grid">
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Each question carries equal marks (4 marks each).</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Only one attempt is allowed per quiz session.</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Once submitted, answers cannot be changed or reviewed.</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Do not refresh or close the browser during the quiz.</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Use the navigator panel to jump between questions.</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>Unanswered questions will be marked as 0.</span>
              </div>
              <div className="rule-item">
                <FaCheckCircle className="rule-check" />
                <span>The quiz will auto-submit when the timer runs out.</span>
              </div>
            </div>
          </div>

          <button className="start-button" onClick={handleStartQuiz}>
            <FaBolt /> Start Quiz Now
          </button>
          <p className="ready-text">Ready to test your knowledge? Let's begin! 🚀</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const score = calculateScore();
    const scorePercentage = Math.round((score.total / 40) * 100);
    return (
      <div className="quiz-container results-page">
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}></div>
            ))}
          </div>
        )}
        <div className="results-container">
          <button
            type="button"
            className="results-back-button"
            onClick={() => navigate('/arena-standalone')}
          >
            Back to Arena
          </button>
          <div className="trophy-container">
            <FaTrophy className="trophy-icon" />
            <div className="trophy-badge">
              <GiPartyPopper className="party-icon" />
            </div>
          </div>
          <h1 className="results-title">🎉 Quiz Completed!</h1>
          <p className="results-subtitle">Congratulations! Here's your performance summary</p>

          <div className="score-circle" style={{ '--score-progress': `${scorePercentage}%` }}>
            <div className="score-number">{score.total}</div>
            <div className="score-total">out of 40</div>
            <div className="score-percentage">{scorePercentage}%</div>
          </div>

          <div className="score-breakdown">
            <div className="score-item correct">
              <FaCheckCircle className="score-icon" />
              <div className="score-value">{score.correct}</div>
              <div className="score-label">Correct</div>
            </div>
            <div className="score-item wrong">
              <FaTimesCircle className="score-icon" />
              <div className="score-value">{score.wrong}</div>
              <div className="score-label">Wrong</div>
            </div>
            <div className="score-item skipped">
              <FaMinusCircle className="score-icon" />
              <div className="score-value">{score.skipped}</div>
              <div className="score-label">Skipped</div>
            </div>
          </div>

          <div className="coins-earned">
            <div className="coins-header">✨ 🎊 Coins Earned! ✨</div>
            <div className="coins-amount">
              <FaCoins className="coins-icon" />
              <span className="coins-value">+{score.correct * 10}</span>
            </div>
            <div className="coins-calculation">
              {score.correct} correct answers × 10 coins each
            </div>
          </div>

          <div className="comeback-message">
            <FaCalendarAlt className="calendar-icon" />
            <h3>Come Back Tomorrow!</h3>
            <p>Visit again tomorrow to take another quiz and earn more coins. Daily quizzes help you grow your knowledge and rewards!</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-header-title">Green Tech Awareness Quiz</h2>
        <p className="quiz-header-subtitle">Answer all questions carefully</p>
        <div className="answered-count">{answeredCount} / 10 answered</div>
      </div>

      <div className="quiz-content">
        <div className="question-section">
          <div className="question-header">
            <div className="question-badge">
              Question {currentQuestion + 1}
            </div>
            <span className="question-total">of 10</span>
            <div className="timer-badge">
              <FaClock className="timer-icon" />
              <span className="timer-text">{timeLeft}s</span>
            </div>
          </div>

          <div className="progress-bars">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-bar-fill blue" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="question-text">{questions[currentQuestion].question}</h3>

          <div className="options-container">
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.id}
                className={`option-card ${selectedAnswers[currentQuestion] === option.id ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="option-label">{option.id}</div>
                <div className="option-text">{option.text}</div>
                <div className="option-radio">
                  {selectedAnswers[currentQuestion] === option.id && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="navigation-buttons">
            <button 
              className="nav-button back-button" 
              onClick={() => handleNavigate(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              ← Back
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button 
                className="nav-button submit-button" 
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                className="nav-button next-button" 
                onClick={handleNext}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <div className="navigator-section">
          <div className="navigator-header">
            <FaMapMarkerAlt className="navigator-icon" />
            <h3>NAVIGATOR</h3>
          </div>
          <p className="navigator-subtitle">Click to jump to any question</p>

          <div className="question-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-number ${
                  index === currentQuestion ? 'current' : ''
                } ${
                  selectedAnswers[index] !== undefined ? 'attempted' : 'not-attempted'
                } ${
                  index > currentQuestion ? 'disabled' : ''
                }`}
                onClick={() => handleNavigate(index)}
                disabled={index > currentQuestion}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="legend">
            <h4>LEGEND</h4>
            <div className="legend-item">
              <div className="legend-box current"></div>
              <span>Current Question</span>
            </div>
            <div className="legend-item">
              <div className="legend-box attempted"></div>
              <span>Attempted (0)</span>
            </div>
            <div className="legend-item">
              <div className="legend-box not-attempted"></div>
              <span>Not Attempted (10)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenTechQuiz;
