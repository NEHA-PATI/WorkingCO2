import "./ScoreBoard.css"

const SingleScoreBoard = ({ playerNumber, points, correct, incorrect, emoji, color }) => (
  <div className="glass-scoreboard" style={{ borderLeft: `4px solid ${color}` }}>
    <h3>
      {emoji} Player {playerNumber}
    </h3>
    <div className="score-grid">
      <div className="score-item">
        <span className="label">⭐ Points</span>
        <span className="value points">{points}</span>
      </div>
      <div className="score-item">
        <span className="label">✅ Correct</span>
        <span className="value">{correct}</span>
      </div>
      <div className="score-item">
        <span className="label">❌ Incorrect</span>
        <span className="value">{incorrect}</span>
      </div>
    </div>
  </div>
)

const ScoreBoard = ({ playerCount = 1, playersData = [] }) => {
  const PLAYER_EMOJIS = ["🐘", "🦒", "🐢", "🦜"]
  const PLAYER_COLORS = ["#66bb6a", "#2196f3", "#ff9800", "#e91e63"]

  // Ensure playersData length matches playerCount
  const data = Array.from({ length: playerCount }, (_, i) => playersData[i] || { points: 0, correct: 0, incorrect: 0 })

  return (
    <div className="scoreboard-container">
      {data.map((player, idx) => (
        <SingleScoreBoard
          key={idx}
          playerNumber={idx + 1}
          points={player.points}
          correct={player.correct}
          incorrect={player.incorrect}
          emoji={PLAYER_EMOJIS[idx]}
          color={PLAYER_COLORS[idx]}
        />
      ))}
    </div>
  )
}

export default ScoreBoard