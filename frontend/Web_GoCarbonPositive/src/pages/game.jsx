import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/game.css';

const games = [
  {
    key: 'eco-voyage',
    title: 'Eco Voyage: Reach the Peak',
    image: '/public/game/ecovoyage/snake.png',
    description: 'Embark on an eco-adventure! Play a quiz game enabled with Snakes and Ladders, for every right answer you move up and for every wrong answer you move down.',
    color: '#10b981'
  },
  {
    key: 'memory',
    title: 'Memory Game',
    image: '/public/game/memorygame/memory.png',
    description: 'Test your memory and learn about the environment! Flip cards, find pairs, and discover fun eco-facts as you play.',
    color: '#3b82f6'
  },
  {
    key: 'eco-shooter',
    title: 'Eco-Shooter',
    image: 'shooter.png',
    description: 'Aim and shoot to clean up pollution! Hit the polluters, save the planet, and learn about environmental threats in this action-packed game.',
    color: '#f97316',
    id: "img3"
  }
];

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="games-page">
    <h1 className ="heading">Games</h1>
      {/* Full-page animated waves */}
      <div className="wave-container">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>

      {/* Game Sections */}
      {games.map((game, index) => (
        <section 
          className="wavy-section" 
          key={game.key}
          style={{ 
            marginTop: index === 0 ? '37px' : '40px',
            backgroundColor: `rgba(255, 255, 255, 0.85)`
          }}
        >
          {/* Animated background elements */}
          <div className="wavy-balls-bg">
            <div className={`wavy-ball ball-${index % 2 === 0 ? 'primary' : 'secondary'}`} />
            <div className={`wavy-ball ball-${index % 2 === 0 ? 'accent1' : 'accent2'}`} />
            <div className={`wavy-ball ball-${index % 2 === 0 ? 'accent2' : 'primary'}`} />
            {/* Bubbles */}
            <div className="floating-bubble bubble1" />
            <div className="floating-bubble bubble2" />
            <div className="floating-bubble bubble3" />
            <div className="floating-bubble bubble4" />
          </div>

          {/* Content */}
          <div className="wavy-content">
            <div className="wavy-left">
              <h2 className="wavy-title">{game.title}</h2>
              <p className="wavy-desc">{game.description}</p>
              <button 
                className="wavy-btn" 
                onClick={() => navigate(`/games/${game.key}`)}
                style={{ 
                  backgroundColor: game.color,
                  color: 'white'
                }}
              >
                Start Game
              </button>
            </div>
            <div className="wavy-right">
              <img 
                src={game.image} 
                alt={game.title} 
                className="wavy-img" 
                
                style={{
                  border: `3px solid ${game.color}`,
                  boxShadow: `0 10px 20px ${game.color}40`
            
                }}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Games;