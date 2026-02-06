import React, { useState, useEffect, useRef } from 'react';
import './Bubble.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const ICON_SETS = {
  easy: [
    { color: '#A8E063', symbol: '🌱' }, // Seedling
    { color: '#B7F8DB', symbol: '🍃' }, // Leaf Fluttering
    { color: '#B2F7EF', symbol: '🌿' }, // Herb
    { color: '#C3E6CB', symbol: '🍀' }, // Clover
    { color: '#D4FC79', symbol: '🌵' }, // Cactus
  ],
  medium: [
    { color: '#FFF9A5', symbol: '🌞' }, // Sun
    { color: '#E0ECFF', symbol: '☁️' }, // Cloud
    { color: '#F7CAC9', symbol: '🌈' }, // Rainbow
    { color: '#B2EBF2', symbol: '💧' }, // Droplet
    { color: '#FFE082', symbol: '🌻' }, // Sunflower
  ],
  hard: [
    { color: '#A7FFEB', symbol: '🏔️' }, // Earth
    { color: '#B3E5FC', symbol: '🦜' }, // Wave
    { color: '#FFD59E', symbol: '🌾' }, // Fallen Leaf
    { color: '#E1BEE7', symbol: '🐚' }, // Butterfly
    { color: '#AED581', symbol: '🪴' }, // Tree
  ]
};

const LEVELS = {
  easy: { rows: 8, cols: 6, iconCount: 3, speed: 8, gameOverY: 500, canvasWidth: 600, canvasHeight: 600 },
  medium: { rows: 10, cols: 8, iconCount: 4, speed: 10, gameOverY: 450, canvasWidth: 800, canvasHeight: 600 },
  hard: { rows: 12, cols: 10, iconCount: 4, speed: 12, gameOverY: 400, canvasWidth: 1000, canvasHeight: 600 }
};

const BUBBLE_SIZE = 50;
const BUBBLE_RADIUS = BUBBLE_SIZE / 2;

// FloatingBubblesBackground component
const FloatingBubblesBackground = () => {
  const [bubbles, setBubbles] = useState([]);

const Bubble = () => {
  const [isHit, setIsHit] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (isHit) {
      setBursting(true);
      setTimeout(() => {
        setBursting(false);
      }, 1000); // adjust the duration of the animation
    }
  }, [isHit]);

  useEffect(() => {
    if (!isConnected) {
      // make the bubble fall down
      document.querySelector('.bubble').classList.add('fall-down');
    }
  }, [isConnected]);

  const handleHit = () => {
    setIsHit(true);
  };

  const handleConnectionCheck = () => {
    // check if the bubble is connected to another bubble
    const isConnected = /* your logic to check connection */
    setIsConnected(isConnected);
  };

  return (
    <div>
      <TransitionGroup>
        {bursting && (
          <CSSTransition
            key="burst"
            timeout={1000}
            classNames="burst"
          >
            <div className="burst-effect" />
          </CSSTransition>
        )}
      </TransitionGroup>
      <div
        className={`bubble ${isConnected ? '' : 'fall-down'}`}
        onClick={handleHit}
      />
    </div>
  );
};

  useEffect(() => {
    // Generate random bubbles
    const bubbleCount = 18;
    const newBubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
      left: Math.random() * 100, // percent
      size: 40 + Math.random() * 60, // px
      duration: 8 + Math.random() * 8, // seconds
      delay: Math.random() * 8, // seconds
      opacity: 0.15 + Math.random() * 0.15,
      id: i,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="floating-bubbles-bg">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="floating-bubble-bg"
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  );
};

const BubbleShooter = ({ setScore, paused, setPaused, onLevelSelect, onGameFinish }) => {
  const [bubbles, setBubbles] = useState([]);
  const [currentBubble, setCurrentBubble] = useState(null);
  const [score, _setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(LEVELS.easy.canvasWidth);
  const [iconSet, setIconSet] = useState(ICON_SETS.easy);
  const [burstAnimations, setBurstAnimations] = useState([]);
  const canvasRef = useRef(null);
  const [shooterAngle, setShooterAngle] = useState(0); // angle in radians

  // Game mode: "classic", "mission", "timed"
  const [gameMode, setGameMode] = useState("classic");
  // Mission mode state
  const [missionGoal, setMissionGoal] = useState(null); // e.g., { color: "#A8E063", symbol: "🌱", count: 10, shots: 15 }
  const [missionProgress, setMissionProgress] = useState({ cleared: 0, shots: 0 });
  // Timed mode state
  const [timeLeft, setTimeLeft] = useState(60); // seconds
  const [timedActive, setTimedActive] = useState(false);

  // Shooter image removed as per user request

  // Initialize game for selected level
  const startLevel = (selectedLevel) => {
    if (onLevelSelect) onLevelSelect();
    setLevel(selectedLevel);
    setScore(0);
    setGameOver(false);
    setIconSet(ICON_SETS[selectedLevel]);
    const { rows, iconCount, canvasWidth: originalCanvasWidth, canvasHeight } = LEVELS[selectedLevel];
    // Calculate max columns so all bubbles are fully visible in the canvas
    const canvasWidth = originalCanvasWidth;
    const dynamicCols = Math.floor((canvasWidth - BUBBLE_SIZE) / BUBBLE_SIZE) + 1;
    const initialBubbles = [];
    for (let row = 0; row < rows / 2; row++) {
      for (let col = 0; col < dynamicCols; col++) {
        const icon = ICON_SETS[selectedLevel][Math.floor(Math.random() * iconCount)];
        // Place bubbles from BUBBLE_RADIUS to canvasWidth - BUBBLE_RADIUS
        const x = BUBBLE_RADIUS + col * BUBBLE_SIZE + (row % 2 ? BUBBLE_SIZE / 2 : 0);
        if (x + BUBBLE_RADIUS <= canvasWidth) {
          initialBubbles.push({
            x: x,
            y: row * BUBBLE_SIZE * 0.866 + BUBBLE_SIZE / 2,
            color: icon.color,
            symbol: icon.symbol
          });
        }
      }
    }
    setBubbles(initialBubbles);
    const newIcon = ICON_SETS[selectedLevel][Math.floor(Math.random() * iconCount)];
    setCurrentBubble({
      x: canvasWidth / 2,
      y: canvasHeight - 100,
      color: newIcon.color,
      symbol: newIcon.symbol,
      dx: 0,
      dy: 0,
      moving: false,
    });
    setCanvasWidth(canvasWidth);
  };

  // Handle canvas click to shoot
  const handleClick = (e) => {
    if (!currentBubble || currentBubble.moving || gameOver || !level) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Use shooter base as origin for angle
    const shooterBaseX = canvas.width / 2;
    const shooterBaseY = canvas.height - 60;
    const barrelLength = 60;
    let angle = Math.atan2(mouseY - shooterBaseY, mouseX - shooterBaseX);
    // No angle clamp: allow aiming and shooting in all directions
    setShooterAngle(angle);

    // Set bubble at mouth of shooter, with velocity along barrel
    // Always shoot from the fixed shooter base
    setCurrentBubble((prev) => ({
      ...prev,
      x: shooterBaseX,
      y: shooterBaseY,
      dx: Math.cos(angle) * LEVELS[level].speed,
      dy: Math.sin(angle) * LEVELS[level].speed,
      moving: true,
    }));
  };

  // Game loop
  useEffect(() => {
    if (!currentBubble || paused || !level) return;
    const interval = setInterval(() => {
      setCurrentBubble((prev) => {
        if (!prev) return null;

        // If not moving, always position at mouth of shooter
        if (!prev.moving) {
          const canvas = canvasRef.current;
          const shooterBaseX = canvas.width / 2;
          const shooterBaseY = canvas.height - 60;
          // Keep the bubble fixed at the shooter base
          return {
            ...prev,
            x: shooterBaseX,
            y: shooterBaseY,
            dx: 0,
            dy: 0,
          };
        }

        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;

        // Wall collisions
        if (newX - BUBBLE_RADIUS < 0 || newX + BUBBLE_RADIUS > canvasRef.current.width) {
          prev.dx = -prev.dx;
          newX = prev.x + prev.dx;
        }
        if (newY - BUBBLE_RADIUS < 0) {
          prev.dy = -prev.dy;
          newY = prev.y + prev.dy;
        }

        // Check collision with other bubbles
        for (let bubble of bubbles) {
          const dist = Math.sqrt((newX - bubble.x) ** 2 + (newY - bubble.y) ** 2);
          if (dist < BUBBLE_SIZE) {
            // Snap to grid
            const row = Math.round((newY - BUBBLE_SIZE / 2) / (BUBBLE_SIZE * 0.866));
            const col = Math.round((newX - (row % 2 ? BUBBLE_SIZE / 2 : 0) - BUBBLE_SIZE / 2) / BUBBLE_SIZE);
            const snappedX = col * BUBBLE_SIZE + (row % 2 ? BUBBLE_SIZE / 2 : 0) + BUBBLE_SIZE / 2;
            const snappedY = row * BUBBLE_SIZE * 0.866 + BUBBLE_SIZE / 2;

            const newBubbles = [...bubbles, { x: snappedX, y: snappedY, color: prev.color, symbol: prev.symbol }];
            const cluster = findCluster(newBubbles, snappedX, snappedY, prev.color);
            if (cluster.length >= 3) {
              // Create burst animations for each bubble in the cluster
              const newBurstAnimations = cluster.map((bubble, index) => ({
                id: Date.now() + index,
                x: bubble.x,
                y: bubble.y,
                color: bubble.color,
                symbol: bubble.symbol
              }));
              setBurstAnimations(prev => [...prev, ...newBurstAnimations]);
              
              // Remove burst animations after animation completes
              setTimeout(() => {
                setBurstAnimations(prev =>
                  prev.filter(burst => !newBurstAnimations.some(newBurst => newBurst.id === burst.id))
                );
              }, 800);

              _setScore((s) => {
                const newScore = s + cluster.length * 10;
                setScore(newScore);
                return newScore;
              });
              const remainingBubbles = newBubbles.filter((b) => !cluster.some((c) => c.x === b.x && c.y === b.y));
              setBubbles(remainingBubbles);
              // If all bubbles are cleared, finish the game
              if (remainingBubbles.length === 0 && onGameFinish) {
                onGameFinish();
                return prev;
              }
            } else {
              setBubbles(newBubbles);
            }

            // Check game over
            if (newBubbles.some((b) => b.y > LEVELS[level].gameOverY)) {
              setGameOver(true);
            }

            // New bubble
            const newIcon = iconSet[Math.floor(Math.random() * LEVELS[level].iconCount)];
            return {
              x: LEVELS[level].canvasWidth / 2,
              y: LEVELS[level].canvasHeight - 100,
              color: newIcon.color,
              symbol: newIcon.symbol,
              dx: 0,
              dy: 0,
              moving: false,
            };
          }
        }

        // Out of bounds
        if (newY + BUBBLE_RADIUS > canvasRef.current.height) {
          const newIcon = iconSet[Math.floor(Math.random() * LEVELS[level].iconCount)];
          return {
            x: LEVELS[level].canvasWidth / 2,
            y: LEVELS[level].canvasHeight - 100,
            color: newIcon.color,
            symbol: newIcon.symbol,
            dx: 0,
            dy: 0,
            moving: false,
          };
        }

        return { ...prev, x: newX, y: newY };
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [currentBubble, bubbles, level, iconSet, paused]);

  // Find connected bubbles of the same color
  const findCluster = (bubbles, x, y, color) => {
    const cluster = [];
    const visited = new Set();
    const stack = [{ x, y }];

    while (stack.length) {
      const { x, y } = stack.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const bubble = bubbles.find((b) => Math.abs(b.x - x) < 1 && Math.abs(b.y - y) < 1);
      if (bubble && bubble.color === color) {
        cluster.push(bubble);
        const neighbors = getNeighbors(bubble.x, bubble.y);
        neighbors.forEach((n) => {
          if (!visited.has(`${n.x},${n.y}`)) stack.push(n);
        });
      }
    }
    return cluster;
  };

  // Get neighboring positions
  const getNeighbors = (x, y) => {
    const row = Math.round((y - BUBBLE_SIZE / 2) / (BUBBLE_SIZE * 0.866));
    const offsets = row % 2 ? [
      [-BUBBLE_SIZE, 0], [BUBBLE_SIZE, 0],
      [-BUBBLE_SIZE / 2, -BUBBLE_SIZE * 0.866], [BUBBLE_SIZE / 2, -BUBBLE_SIZE * 0.866],
      [-BUBBLE_SIZE / 2, BUBBLE_SIZE * 0.866], [BUBBLE_SIZE / 2, BUBBLE_SIZE * 0.866]
    ] : [
      [-BUBBLE_SIZE, 0], [BUBBLE_SIZE, 0],
      [-BUBBLE_SIZE / 2, -BUBBLE_SIZE * 0.866], [BUBBLE_SIZE / 2, -BUBBLE_SIZE * 0.866],
      [-BUBBLE_SIZE / 2, BUBBLE_SIZE * 0.866], [BUBBLE_SIZE / 2, BUBBLE_SIZE * 0.866]
    ];
    return offsets.map(([dx, dy]) => ({ x: x + dx, y: y + dy }));
  };

  // Draw game
  useEffect(() => {
    if (!level) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Shooter image removed as per user request
      const shooterBaseX = canvas.width / 2;
      const shooterBaseY = canvas.height - 60;
      const baseRadius = 32;
      const barrelLength = 60;

      // Draw bubbles
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.strokeStyle = '#145A32';
        ctx.stroke();
        ctx.fillStyle = '#145A32';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.symbol, bubble.x, bubble.y);
      });
      // Draw moving bubble (if in flight)
      if (currentBubble && currentBubble.moving) {
        ctx.beginPath();
        ctx.arc(currentBubble.x, currentBubble.y, BUBBLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = currentBubble.color;
        ctx.fill();
        ctx.strokeStyle = '#145A32';
        ctx.stroke();
        ctx.fillStyle = '#145A32';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentBubble.symbol, currentBubble.x, currentBubble.y);
      }

      // Draw "next" bubble always at the tip of the shooter
      if (currentBubble && !gameOver) {
        // Draw the shooter bubble at a fixed position (bottom center)
        ctx.save();
        ctx.globalAlpha = currentBubble.moving ? 0.4 : 1.0;
        ctx.beginPath();
        ctx.arc(shooterBaseX, shooterBaseY, BUBBLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = currentBubble.color;
        ctx.fill();
        ctx.strokeStyle = '#145A32';
        ctx.stroke();
        ctx.fillStyle = '#145A32';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentBubble.symbol, shooterBaseX, shooterBaseY);
        ctx.restore();
      }

      // Draw faded aiming line (trajectory guide)
      // Faded aiming line removed as per user request
      if (paused && !gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
      } else if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
      }
    };
    draw();
    return () => {};
  }, [bubbles, currentBubble, gameOver, score, level, paused, shooterAngle]);
  return (
    <div className="bubble-shooter-container">
      {/* Burst Animations */}
      {burstAnimations.map((burst) => (
        <div
          key={burst.id}
          className="burst-animation"
          style={{
            position: 'absolute',
            left: `${burst.x - BUBBLE_RADIUS}px`,
            top: `${burst.y - BUBBLE_RADIUS}px`,
            width: `${BUBBLE_SIZE}px`,
            height: `${BUBBLE_SIZE}px`,
            backgroundColor: burst.color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          {burst.symbol}
        </div>
      ))}
      
      {!level && (
        <>
          <div style={{
            maxWidth: 700,
            margin: '40px auto 24px auto',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 18,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '32px 28px',
            textAlign: 'left',
            color: '#145a32',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontSize: '1.1em',
            lineHeight: 1.7
          }}>
            <h2 style={{marginTop:0, color:'#219653', fontWeight:700, fontSize:'2em'}}>Eco Bubble Shooter</h2>
            <p><b>About:</b> <br/>
            Eco Bubble Shooter is a fun, relaxing game where you shoot eco-themed bubbles to match and clear them from the board. Each level has a unique set of icons inspired by nature and the environment!</p>
            <p><b>How to Play:</b><br/>
            • Click anywhere on the canvas to shoot the current bubble in that direction.<br/>
            • Match 3 or more bubbles of the same type to clear them and earn coins.<br/>
            • The game ends if bubbles reach the bottom.<br/>
            • Use the <span style={{fontWeight:700}}>⏸️</span> button to pause and <span style={{fontWeight:700}}>🔄</span> to restart at any time (after starting a level).</p>
            <p><b>Rules:</b><br/>
            • Only groups of 3 or more matching bubbles will pop.<br/>
            • The score is shown as coins <span role="img" aria-label="coin">🪙</span> at the top right.<br/>
            • Try to clear all bubbles for a high score!</p>
            <div className="level-selection" style={{ justifyContent: 'center', marginTop: 32 }}>
              <button className="level-button" onClick={() => startLevel('easy')}>Easy</button>
              <button className="level-button" onClick={() => startLevel('medium')}>Medium</button>
              <button className="level-button" onClick={() => startLevel('hard')}>Hard</button>
            </div>
          </div>
        </>
      )}
      {level && (
        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={LEVELS[level].canvasHeight}
            onClick={handleClick}
            onMouseMove={(e) => {
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const mouseY = e.clientY - rect.top;
              const shooterBaseX = canvas.width / 2;
              const shooterBaseY = canvas.height - 60;
              // Allow aiming everywhere: no clamp
              let angle = Math.atan2(mouseY - shooterBaseY, mouseX - shooterBaseX);
              setShooterAngle(angle);
            }}
            style={{ cursor: "crosshair" }}
          ></canvas>
          {gameOver && (
            <div className="game-over">
              <h2>Carbon Reduction Failed!</h2>
              <p>Your Score: <span role="img" aria-label="coin">🪙</span> {score}</p>
              <button
                className="level-button"
                onClick={() => startLevel(level)}
                style={{ margin: '0 auto' }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  // Use a state hook to get the score from BubbleShooter
  const [score, setScore] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  // Helper to determine if a level is selected
  const [levelSelected, setLevelSelected] = React.useState(false);
  // Listen for level selection in BubbleShooter
  const handleLevelSelect = React.useCallback(() => setLevelSelected(true), []);
  // Pass setScore and pause state to BubbleShooter as props
  const [showCongrats, setShowCongrats] = React.useState(false);
  return (
    <>
      {paused !== null && window.location && (
        levelSelected && <>
          <button
            style={{
              position: 'fixed',
              top: 12,
              left: 18,
              zIndex: 101,
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '50%',
              padding: '7px 10px',
              fontWeight: 700,
              fontSize: '1.3em',
              color: '#333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume' : 'Pause'}
          >
            {paused ? '▶️' : '⏸️'}
          </button>
          <button
            style={{
              position: 'fixed',
              top: 12,
              left: 62,
              zIndex: 101,
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '50%',
              padding: '7px 10px',
              fontWeight: 700,
              fontSize: '1.3em',
              color: '#333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => window.location.reload()}
            aria-label="Restart"
          >
            {'🔄'}
          </button>
        </>
      )}
      {levelSelected && (
        <div style={{
          position: 'fixed',
          top: 12,
          right: 18,
          zIndex: 100,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '18px',
          padding: '5px 12px',
          fontWeight: 700,
          fontSize: '1em',
          color: '#FFD700',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span role="img" aria-label="coin">🪙</span> {score}
        </div>
      )}
      <BubbleShooter setScore={setScore} paused={paused} setPaused={setPaused} onLevelSelect={handleLevelSelect} onGameFinish={() => setShowCongrats(true)} />
      {showCongrats && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2 style={{ color: '#fff', fontSize: '2.5em', marginBottom: 16 }}>🎉 Congratulations!</h2>
          <p style={{ color: '#fff', fontSize: '1.5em', marginBottom: 32 }}>You finished the game!</p>
          <button
            className="level-button"
            style={{ fontSize: '1.2em', padding: '12px 32px' }}
            onClick={() => window.location.reload()}
          >
            Restart Game
          </button>
        </div>
      )}
    </>
  );
}