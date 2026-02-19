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

  const [questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(true);
const [backendResult, setBackendResult] = useState(null);


useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5008/api/v1/quiz/questions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      const data = await res.json();

      if (data.success) {
        // Convert backend format to frontend format
        const formatted = data.data.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: Object.entries(q.options).map(([key, value]) => ({
            id: key,
            text: value
          }))
        }));

        setQuestions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);



  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }else if (timeLeft === 0 && !quizCompleted) {
  if (currentQuestion === questions.length - 1) {
    handleSubmit();
  } else {
    handleNext();
  }
}

  }, [timeLeft, quizStarted, quizCompleted, currentQuestion, questions.length]);


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

 const handleSubmit = async () => {
  try {
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([index, selectedOption]) => ({
        id: questions[index].id,
        selectedOption
      })
    );

    const res = await fetch("http://localhost:5008/api/v1/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify(formattedAnswers)
    });

    const data = await res.json();

    if (data.success) {
      setBackendResult(data.data);
      setQuizCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

  } catch (err) {
    console.error("Submit failed:", err);
  }
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

  if (loading) {
  return <div className="quiz-container">Loading quiz...</div>;
}

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
              <div className="stat-number">{questions.length}
</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div className="stat-number">{questions.length}</div>
<div className="stat-label">Total Marks</div>

            </div>
            <div className="stat-card">
              <FaBolt className="stat-icon" />
              <div className="stat-number">+1</div>
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
                <span>Each question carries equal marks (1 point each).</span>

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
    const score = backendResult;
    const totalQuestions = questions.length;
const correct = score.totalCorrect;
const attempted = score.totalQuestionsAttempted;
const skipped = totalQuestions - attempted;
const totalMarks = correct;
const scorePercentage = Math.round((correct / totalQuestions) * 100);

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
            <div className="score-number">{totalMarks}</div>
            <div className="score-total">out of {questions.length}</div>

            <div className="score-percentage">{scorePercentage}%</div>
          </div>

          <div className="score-breakdown">
          <div className="score-item correct">
  <FaCheckCircle className="score-icon" />
  <div className="score-value">{correct}</div>
  <div className="score-label">Correct</div>
</div>

<div className="score-item wrong">
  <FaTimesCircle className="score-icon" />
  <div className="score-value">{attempted - correct}</div>
  <div className="score-label">Wrong</div>
</div>

<div className="score-item skipped">
  <FaMinusCircle className="score-icon" />
  <div className="score-value">{skipped}</div>
  <div className="score-label">Skipped</div>
</div>

          </div>

          <div className="coins-earned">
            <div className="coins-header">✨ 🎊 Coins Earned! ✨</div>
            <div className="coins-amount">
              <FaCoins className="coins-icon" />
              <span className="coins-value">+{score.pointsAdded}
</span>
            </div>
            <div className="coins-calculation">
              {correct} correct answers × 1 coins each
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
        <div className="answered-count">
  {answeredCount} / {questions.length} answered
</div>
      </div>

      <div className="quiz-content">
        <div className="question-section">
          <div className="question-header">
            <div className="question-badge">
              Question {currentQuestion + 1}
            </div>
            <span className="question-total">of {questions.length}</span>

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
              <span>Attempted ({answeredCount})</span>

            </div>
            <div className="legend-item">
              <div className="legend-box not-attempted"></div>
              <span>Not Attempted ({questions.length - answeredCount})</span>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenTechQuiz;
