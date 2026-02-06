import React from 'react';
import './Memory.css';
import ThemeDescription from './ThemeDescription.jsx';

// Sound effects
const soundFiles = {
  flip: '/game/memorygame/FLIP.mp3',
  match: '/game/memorygame/Match.mp3',
  win: '/game/memorygame/WIN.mp3',
  background: '/game/memorygame/Memory.mp3'
};

// Add confetti utility
function launchConfetti() {
  const confettiColors = ['#2ecc40', '#ffdc00', '#ff4136', '#0074d9', '#b10dc9', '#ff851b'];
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = 0;
  confettiContainer.style.left = 0;
  confettiContainer.style.width = '100vw';
  confettiContainer.style.height = '100vh';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = 3000;
  document.body.appendChild(confettiContainer);
  const confettiCount = 80;
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '12px';
      confetti.style.height = '12px';
      confetti.style.borderRadius = '50%';
      confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-20px';
      confetti.style.opacity = 0.85;
      confetti.style.transition = 'transform 5.5s cubic-bezier(.23,1.01,.32,1), opacity 5.5s';
      confettiContainer.appendChild(confetti);
      setTimeout(() => {
        confetti.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = 0;
      }, 20);
    }, i * 80); // Stagger each confetti by 80ms
  }
  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
    }
  }, 7000);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      flipped: [],
      solved: [],
      moves: 0,
      gameComplete: false,
      time: 0,
      isRunning: false,
      difficulty: 'medium',
      score: 0,
      soundEnabled: true,
      musicEnabled: false,
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      gameStarted: false,
      showThemeDescription: false,
      selectedTheme: '',
      theme: 'renewableEnergy',
      backgroundMusic: null,
      showMoveLimitModal: false,
      showCelebrationModal: false
    };
    this.timerInterval = null;
    this.themeDescriptions = {
      renewableEnergy: ['☀ Solar', '🌬 Wind', '💧 Hydro', '🌋 Geothermal', '🌊 Tidal', '⚡ Bioenergy', '🔋 Storage', '♻ Recycled'],
      carbonReduction: ['🌳 Trees', '🚲 Cycling', '🚆 Trains', '🏡 Insulation', '💡 LEDs', '📉 Emissions', '🌍 Awareness', '🔄 Recycling'],
      sustainabilityGoals: [
        '1️⃣ No Poverty',
        '2️⃣ Zero Hunger',
        '3️⃣ Good Health',
        '4️⃣ Quality Education',
        '5️⃣ Gender Equality',
        '6️⃣ Clean Water',
        '7️⃣ Clean Energy',
        '8️⃣ Good Jobs'
      ],
      ecoFriendly: ['🛒 Reusable', '🚯 No Waste', '🚰 Save Water', '🌾 Organic', '🐝 Pollinators', '🦋 Biodiversity', '🍀 Green Spaces', '🏭 Clean Industry']
    };
    this.difficulties = {
      easy: { pairs: 4, gridColumns: 4, cardWidth: '100px', cardHeight: '120px' },
      medium: { pairs: 6, gridColumns: 4, cardWidth: '100px', cardHeight: '120px' },
      hard: { pairs: 8, gridColumns: 5, cardWidth: '90px', cardHeight: '110px' },
      expert: { pairs: 10, gridColumns: 5, cardWidth: '80px', cardHeight: '100px' }
    };
    this.moveLimits = {
      easy: 28,
      medium: 25,
      hard: 20,
      expert: 15
    };
  }

  componentDidMount() {
    const music = new Audio(soundFiles.background);
    music.loop = true;
    music.volume = 0.1;
    this.setState({ backgroundMusic: music });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.difficulty !== this.state.difficulty || prevState.theme !== this.state.theme || prevState.gameStarted !== this.state.gameStarted) && this.state.gameStarted) {
      this.initializeGame();
    }
    if ((prevState.isRunning !== this.state.isRunning || prevState.gameStarted !== this.state.gameStarted) && this.state.isRunning && this.state.gameStarted) {
      this.startTimer();
    } else if ((!this.state.isRunning || !this.state.gameStarted) && this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  componentWillUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.state.backgroundMusic) {
      this.state.backgroundMusic.pause();
      this.state.backgroundMusic.currentTime = 0;
    }
  }

  startTimer = () => {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.setState(prevState => ({ time: prevState.time + 1 }));
    }, 1000);
  };

  playSound = (soundType) => {
    if (!this.state.soundEnabled) return;
    try {
      const sound = new Audio(soundFiles[soundType]);
      sound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  toggleBackgroundMusic = () => {
    const { backgroundMusic, musicEnabled, audioContext } = this.state;
    if (!backgroundMusic) return;
    if (musicEnabled) {
      backgroundMusic.pause();
    } else {
      audioContext.resume().then(() => {
        backgroundMusic.play().catch(e => {
          console.error("Background music error:", e);
        });
      });
    }
    this.setState({ musicEnabled: !musicEnabled });
  };

  initializeGame = () => {
    const { theme, difficulty } = this.state;
    const { pairs } = this.difficulties[difficulty];
    let selectedTheme = this.themeDescriptions[theme].slice(0, pairs);
    if (theme === 'sustainabilityGoals') {
      selectedTheme = this.themeDescriptions.sustainabilityGoals.slice(0, pairs);
    }
    const cardPairs = [...selectedTheme, ...selectedTheme];
    // Fisher-Yates shuffle
    const shuffledCards = [...cardPairs];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    const cardsWithIds = shuffledCards.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false
    }));
    this.setState({
      cards: cardsWithIds,
      flipped: [],
      solved: [],
      moves: 0,
      time: 0,
      isRunning: true,
      gameComplete: false,
      score: 0
    });
  };

  handleCardClick = (id) => {
    const { isRunning, flipped, solved, cards, moves, difficulty } = this.state;
    if (!isRunning) return;
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) {
      return;
    }
    // Check move limit before allowing another move
    if (moves >= this.moveLimits[difficulty]) {
      this.setState({ showMoveLimitModal: true, isRunning: false });
      return;
    }
    this.playSound('flip');
    const newFlipped = [...flipped, id];
    this.setState({ flipped: newFlipped });
    if (newFlipped.length === 2) {
      this.setState({ moves: moves + 1 });
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      if (firstCard.emoji === secondCard.emoji) {
        this.playSound('match');
        this.setState(prevState => ({
          solved: [...prevState.solved, firstId, secondId],
          flipped: [],
          score: prevState.score + 10
        }), () => {
          if (this.state.solved.length === this.state.cards.length) {
            this.playSound('win');
            this.setState({ isRunning: false, gameComplete: true, showCelebrationModal: true }, () => {
              launchConfetti();
            });
          }
        });
      } else {
        setTimeout(() => {
          this.setState({ flipped: [] });
        }, 1000);
      }
    }
  };

  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  startGame = () => {
    this.setState({
      gameStarted: true,
      difficulty: 'easy',
      theme: 'renewableEnergy',
      selectedTheme: 'renewableEnergy',
      showThemeDescription: true
    });
  };

  renderStartScreen = () => (
    <div className="eco-start-screen">
      <div className="eco-start-content">
        <h1>Eco Memory Game</h1>
        <div className="eco-game-logo">🌍♻</div>
        <div className="eco-game-about">
          <h2>About the Game</h2>
          <p>
            Test your memory while learning about sustainability and environmental conservation!
            Match pairs of cards featuring different eco-friendly concepts and sustainable development goals.
          </p>
        </div>
        <div className="eco-game-rules">
          <h2>How to Play</h2>
          <ul>
            <li>Click on cards to flip them over</li>
            <li>Match two identical cards to make a pair</li>
            <li>Try to find all pairs with the fewest moves</li>
            <li>Complete the game as fast as possible for higher scores</li>
            <li>Choose different themes to learn about various sustainability topics</li>
            <li>Each difficulty has a move limit: Easy (28), Medium (25), Hard (20), Expert (15)</li>
          </ul>
        </div>
        <button className="eco-start-button" onClick={this.startGame}>
          Start Game
        </button>
        <div className="eco-game-footer">
          <p>Have fun and learn about our planet!</p>
        </div>
      </div>
    </div>
  );

  render() {
    const { gameStarted, difficulty, theme, showThemeDescription, selectedTheme, soundEnabled, musicEnabled, time, moves, score, gameComplete, cards, flipped, solved, isRunning, showMoveLimitModal, showCelebrationModal } = this.state;
    const { gridColumns, cardWidth, cardHeight } = this.difficulties[difficulty];
    if (!gameStarted) {
      return this.renderStartScreen();
    }
    return (
      <div className="eco-memory-game">
        {/* Move Limit Modal */}
        {showMoveLimitModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'white',
              borderRadius: 10,
              padding: '32px 24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              textAlign: 'center',
              minWidth: 280
            }}>
              <h2 style={{ color: '#d32f2f', marginBottom: 16 }}>Out of Moves!</h2>
              <p style={{ marginBottom: 24 }}>
                You have used all your {this.moveLimits[difficulty]} moves.<br />
                Would you like to start again?
              </p>
              <button
                style={{
                  background: '#2e8b57',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  padding: '10px 24px',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  this.setState({ showMoveLimitModal: false });
                  this.initializeGame();
                }}
              >
                Start New Game
              </button>
            </div>
          </div>
        )}
        {showCelebrationModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500
          }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: '40px 28px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              textAlign: 'center',
              minWidth: 320,
              position: 'relative'
            }}>
              <h2 style={{ color: '#2e8b57', marginBottom: 18, fontSize: 28 }}>🎉 Congratulations! 🎉</h2>
              <p style={{ marginBottom: 28, fontSize: 18 }}>
                You matched all the cards!<br />
                Well done!
              </p>
              <button
                style={{
                  background: '#2e8b57',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  padding: '12px 28px',
                  fontSize: 18,
                  cursor: 'pointer',
                  marginTop: 8
                }}
                onClick={() => {
                  this.setState({ showCelebrationModal: false });
                  this.initializeGame();
                }}
              >
                Start New Game
              </button>
            </div>
          </div>
        )}
        <div className="eco-game-top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', padding: '16px 0 8px 0' }}>
          <button
            style={{ background: '#3399cc', border: 'none', width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', marginRight: 18, color: 'white' }}
            onClick={() => this.setState({ gameStarted: false })}
            aria-label="Back to Menu"
          >
            ⬅
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <span style={{ fontWeight: 'bold', color: '#2e8b57', fontSize: '1.1rem' }}>Score: {score}</span>
            <span style={{ fontWeight: 'bold', color: '#2e8b57', fontSize: '1.1rem' }}>Moves: {moves}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ fontWeight: 'bold', color: '#2e8b57', fontSize: '1.1rem' }}>Time: {this.formatTime(time)}</span>
            <button
              className="eco-pause-button"
              onClick={() => this.setState({ isRunning: !isRunning })}
              style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer' }}
              aria-label={isRunning ? 'Pause Game' : 'Resume Game'}
            >
              {isRunning ? '⏸' : '▶'}
            </button>
          </div>
        </div>
       
        <h1>Eco Memory Game</h1>
        <div className="eco-game-settings">
          <div>
            <label>Difficulty: </label>
            <select value={difficulty} onChange={e => this.setState({ difficulty: e.target.value })}>
              <option value="easy">Easy (4 pairs)</option>
              <option value="medium">Medium (6 pairs)</option>
              <option value="hard">Hard (8 pairs)</option>
              <option value="expert">Expert (10 pairs)</option>
            </select>
          </div>
          <div>
            <label>Theme: </label>
            <select
              value={theme}
              onChange={e => this.setState({ theme: e.target.value, selectedTheme: e.target.value, showThemeDescription: true })}
            >
              <option value="renewableEnergy">Renewable Energy</option>
              <option value="carbonReduction">Carbon Reduction</option>
              <option value="sustainabilityGoals">Sustainability Goals</option>
              <option value="ecoFriendly">Eco-Friendly Living</option>
            </select>
            {showThemeDescription && (
              <ThemeDescription
                theme={selectedTheme}
                difficulty={difficulty}
                onClose={() => {
                  this.setState({ showThemeDescription: false }, () => {
                    this.startTimer();
                  });
                }}
              />
            )}
          </div>
          <div className="eco-sound-controls">
            <button onClick={() => this.setState({ soundEnabled: !soundEnabled })}>
              {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
            <button onClick={this.toggleBackgroundMusic}>
              {musicEnabled ? '🎵 Music On' : '🎵 Music Off'}
            </button>
          </div>
        </div>
        {gameComplete && (
          <div className="eco-game-complete">
            <h2>Congratulations! You won!</h2>
            <p>Time: {this.formatTime(time)} | Moves: {moves}</p>
            <p>Final Score: {score}</p>
          </div>
        )}
        <div
          className="eco-cards-container"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, ${cardWidth})`,
            gap: '10px',
            padding: '10px',
            margin: '0 auto',
            maxWidth: 'fit-content'
          }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              className={`eco-card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => this.handleCardClick(card.id)}
              style={{
                width: cardWidth,
                height: cardHeight,
                fontSize: '1.5rem'
              }}
            >
              <div className="eco-card-front">
                {theme === 'sustainabilityGoals' ? (
                  <div className="eco-sdg-card">
                    <div className="eco-sdg-number">{card.emoji.split(' ')[0]}</div>
                    <div className="eco-sdg-title">{card.emoji.split(' ').slice(1).join(' ')}</div>
                  </div>
                ) : (
                  <div className="eco-theme-card">
                    <div className="eco-card-emoji">{card.emoji.split(' ')[0]}</div>
                    <div className="eco-card-label">{card.emoji.split(' ').slice(1).join(' ')}</div>
                  </div>
                )}
              </div>
              <div className="eco-card-back">
                ?
              </div>
            </div>
          ))}
        </div>
        <div className="eco-game-tips">
          <p>Match all pairs while learning about sustainability! Fewer moves and faster time mean higher scores!</p>
        </div>
      </div>
    );
  }
}

export default MemoryGame;