"use client"

import { useState, useRef } from "react"
import "../EcoVoyage/EcovoyageGame.css"
import ScoreBoard from "./ScoreBoard"

const BOARD_SIZE = 10
const PLAYER_EMOJIS = ["🐘", "🦒", "🐢", "🦜"]
const PLAYER_COLORS = ["#66bb6a", "#2196f3", "#ff9800", "#e91e63"]
const PLAYER_BORDERS = ["#2e7d32", "#1565c0", "#e65100", "#ad1457"]

const CARBON_LOSSES = [
  { from: 95, to: 24, name: "Air Pollution", emoji: "🏭" },
  { from: 92, to: 69, name: "Deforestation", emoji: "🪓" },
  { from: 55, to: 25, name: "Melting Ice Caps", emoji: "🧊" },
  { from: 48, to: 29, name: "Soil Degradation", emoji: "🏜️" },
  { from: 73, to: 34, name: "Ocean Acidification", emoji: "🌊" },
]

const NATURAL_RESOURCES = [
  { from: 2, to: 38, name: "Forests", emoji: "🌳" },
  { from: 16, to: 36, name: "Rivers", emoji: "💧" },
  { from: 21, to: 42, name: "Solar Energy", emoji: "☀️" },
  { from: 43, to: 64, name: "Wind Energy", emoji: "🌬️" },
  { from: 66, to: 85, name: "Biodiversity", emoji: "🦋" },
  { from: 28, to: 84, name: "Wetlands", emoji: "🌾" },
  { from: 36, to: 44, name: "Clean Air", emoji: "💨" },
  { from: 51, to: 67, name: "Coral Reefs", emoji: "🐠" },
  { from: 71, to: 91, name: "Soil Fertility", emoji: "🌱" },
  { from: 78, to: 98, name: "Geothermal Energy", emoji: "🌋" },
  { from: 87, to: 94, name: "Grasslands", emoji: "🌿" },
]

function EcovoyageGame() {
  const [numPlayers, setNumPlayers] = useState(2)
  const [gameStarted, setGameStarted] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [quizFlipped, setQuizFlipped] = useState(false)
  const [showDice, setShowDice] = useState(false)
  const [diceNumber, setDiceNumber] = useState(1)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [questionReady, setQuestionReady] = useState(true)
  const [paused, setPaused] = useState(false)
  const [lastCorrectPoints, setLastCorrectPoints] = useState(0)
  const [winner, setWinner] = useState(null)
  const [showWinCard, setShowWinCard] = useState(false)
  const winCardTimeout = useRef(null)
  const [showPlayerDetails, setShowPlayerDetails] = useState(false)
  const [playerDetails, setPlayerDetails] = useState([
    { name: '', age: '', mode: 'medium' },
    { name: '', age: '', mode: 'medium' },
    { name: '', age: '', mode: 'medium' },
    { name: '', age: '', mode: 'medium' },
  ])

  // All 4 players, but only use slice(0, numPlayers)
  const allPlayers = [
    {
      name: "Player 1",
      emoji: PLAYER_EMOJIS[0],
      color: PLAYER_COLORS[0],
      border: PLAYER_BORDERS[0],
      pos: 1,
      points: 0,
      correct: 0,
      incorrect: 0,
    },
    {
      name: "Player 2",
      emoji: PLAYER_EMOJIS[1],
      color: PLAYER_COLORS[1],
      border: PLAYER_BORDERS[1],
      pos: 1,
      points: 0,
      correct: 0,
      incorrect: 0,
    },
    // {
    //   name: "Player 3",
    //   emoji: PLAYER_EMOJIS[2],
    //   color: PLAYER_COLORS[2],
    //   border: PLAYER_BORDERS[2],
    //   pos: 1,
    //   points: 0,
    //   correct: 0,
    //   incorrect: 0,
    // },
    // {
    //   name: "Player 4",
    //   emoji: PLAYER_EMOJIS[3],
    //   color: PLAYER_COLORS[3],
    //   border: PLAYER_BORDERS[3],
    //   pos: 1,
    //   points: 0,
    //   correct: 0,
    //   incorrect: 0,
    // },
  ]

  const [players, setPlayers] = useState(allPlayers)

// Easy questions (30 unique, 1-6 points)
const easyQuestions = [
  { question: "What is one way to save electricity at home?", options: ["Leave lights on all day", "Turn off lights when not needed", "Use more appliances", "Waste energy"], answer: "Turn off lights when not needed", points: 1 },
  { question: "Which of these is a renewable energy source?", options: ["Coal", "Natural Gas", "Wind", "Oil"], answer: "Wind", points: 2 },
  { question: "What should you do with plastic bottles after use?", options: ["Throw them in the river", "Recycle them", "Burn them", "Bury them"], answer: "Recycle them", points: 3 },
  { question: "Which gas is most responsible for global warming?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Carbon Dioxide", points: 4 },
  { question: "What is the best way to save water?", options: ["Leave the tap running", "Fix leaking taps", "Take long showers", "Water the garden at noon"], answer: "Fix leaking taps", points: 5 },
  { question: "Which of these is biodegradable?", options: ["Plastic bag", "Banana peel", "Aluminum can", "Glass bottle"], answer: "Banana peel", points: 6 },
  { question: "Which animal is most affected by melting ice caps?", options: ["Polar Bear", "Camel", "Elephant", "Lion"], answer: "Polar Bear", points: 3 },
  { question: "Which is the cleanest form of transport?", options: ["Car", "Bicycle", "Motorbike", "Airplane"], answer: "Bicycle", points: 2 },
  { question: "What is composting?", options: ["Burning waste", "Burying plastic", "Turning organic waste into fertilizer", "Throwing waste in water"], answer: "Turning organic waste into fertilizer", points: 4 },
  { question: "What is the main benefit of using public transport?", options: ["Increases pollution", "Reduces traffic and emissions", "Costs more", "Wastes time"], answer: "Reduces traffic and emissions", points: 3 },
]

// Medium questions (30 unique, 1-6 points)
const mediumQuestions = [
  { question: "Which of these is NOT a renewable resource?", options: ["Wind", "Solar", "Coal", "Hydro"], answer: "Coal", points: 2 },
  { question: "What can you do to save paper?", options: ["Print everything", "Use both sides of paper", "Throw away notes", "Ignore recycling"], answer: "Use both sides of paper", points: 4 },
  { question: "Which is the best way to reduce plastic waste?", options: ["Use single-use bags", "Use reusable bags", "Burn plastic", "Litter"], answer: "Use reusable bags", points: 6 },
  { question: "What is the greenhouse effect?", options: ["Cooling of Earth", "Warming due to trapped gases", "Rainfall increase", "Earthquake cause"], answer: "Warming due to trapped gases", points: 1 },
  { question: "Which of these helps conserve water?", options: ["Watering garden at noon", "Fixing leaks", "Leaving tap on", "Washing car daily"], answer: "Fixing leaks", points: 3 },
  { question: "What is e-waste?", options: ["Electronic waste", "Edible waste", "Energy waste", "Earth waste"], answer: "Electronic waste", points: 3 },
  { question: "Which animal is endangered due to poaching?", options: ["Dog", "Tiger", "Cow", "Sheep"], answer: "Tiger", points: 4 },
  { question: "What is the best way to travel short distances?", options: ["Car", "Bicycle", "Plane", "Ship"], answer: "Bicycle", points: 2 },
  { question: "Which of these is a fossil fuel?", options: ["Wind", "Solar", "Oil", "Hydro"], answer: "Oil", points: 6 },
  { question: "What is the main cause of air pollution in cities?", options: ["Trees", "Vehicles", "Rivers", "Mountains"], answer: "Vehicles", points: 4 },
  { question: "Which practice helps reduce water pollution?", options: ["Dumping oil in drains", "Using eco-friendly detergents", "Throwing trash in rivers", "Burning plastic"], answer: "Using eco-friendly detergents", points: 5 },
  { question: "What is the best way to reduce electronic waste?", options: ["Throw electronics in trash", "Donate or recycle old devices", "Burn old gadgets", "Store them forever"], answer: "Donate or recycle old devices", points: 5 },
  { question: "Which of these is a sustainable farming practice?", options: ["Monoculture", "Crop rotation", "Overuse of pesticides", "Burning stubble"], answer: "Crop rotation", points: 5 },
  { question: "What is the main benefit of rainwater harvesting?", options: ["Increases flooding", "Saves water for later use", "Wastes water", "Pollutes groundwater"], answer: "Saves water for later use", points: 4 },
  { question: "Which of these is a major cause of soil erosion?", options: ["Planting trees", "Overgrazing", "Composting", "Mulching"], answer: "Overgrazing", points: 4 },
]

// Hard questions (30 unique, 1-6 points)
const hardQuestions = [
  { question: "Which international agreement aims to limit global warming to well below 2°C?", options: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Geneva Convention"], answer: "Paris Agreement", points: 5 },
  { question: "What is the main purpose of carbon trading?", options: ["Increase emissions", "Allow polluters to pay for extra emissions", "Reduce carbon emissions cost-effectively", "Ban fossil fuels"], answer: "Reduce carbon emissions cost-effectively", points: 3 },
  { question: "Which gas has the highest global warming potential?", options: ["CO2", "Methane", "Nitrous Oxide", "Ozone"], answer: "Nitrous Oxide", points: 6 },
  { question: "What is the main function of a wetland in an ecosystem?", options: ["Increase flooding", "Filter pollutants and store water", "Produce fossil fuels", "Cause droughts"], answer: "Filter pollutants and store water", points: 2 },
  { question: "Which of these is a negative impact of ocean acidification?", options: ["More fish", "Coral bleaching", "Cleaner water", "Faster plant growth"], answer: "Coral bleaching", points: 4 },
  { question: "What is the main cause of ozone layer depletion?", options: ["CO2 emissions", "CFCs and halons", "Deforestation", "Plastic waste"], answer: "CFCs and halons", points: 7 },
  { question: "Which country is the largest emitter of CO2 as of 2023?", options: ["USA", "China", "India", "Russia"], answer: "China", points: 7 },
  { question: "What is the concept of 'carbon footprint'?", options: ["Amount of carbon in soil", "Total greenhouse gases emitted by an individual or group", "Footprints in carbon", "None of these"], answer: "Total greenhouse gases emitted by an individual or group", points: 7 },
  { question: "Which renewable energy source has the highest global installed capacity?", options: ["Wind", "Solar", "Hydro", "Geothermal"], answer: "Hydro", points: 7 },
  { question: "What is the main goal of the UN Sustainable Development Goals (SDGs)?", options: ["Economic growth only", "Environmental protection only", "End poverty, protect the planet, ensure prosperity for all", "Space exploration"], answer: "End poverty, protect the planet, ensure prosperity for all", points: 8 },
]

// Helper to get group mode
function getGroupMode() {
  const selected = playerDetails.slice(0, numPlayers)
  let groupMode = 'easy'
  if (selected.some(p => p.mode === 'hard')) groupMode = 'hard'
  else if (selected.some(p => p.mode === 'medium')) groupMode = 'medium'
  return groupMode
}

// On game start, select questions according to group mode (no repeats, no mixing)
const [questions, setQuestions] = useState(easyQuestions)

  const [questionIdx, setQuestionIdx] = useState(0)
  const currentQuestion = questions[questionIdx]

function getCellCoords(num) {
    // Calculate which row the number is in (0 = bottom row, 9 = top row)
    const boardRow = Math.floor((num - 1) / 10)
    // Calculate position within that row (0-9)
    const posInRow = (num - 1) % 10

    // For display, we need to flip the row (0 should be at bottom)
    const displayRow = 9 - boardRow

    // Even rows go left to right (1,2,3...), odd rows go right to left (...19,18,17)
    const isEvenRow = boardRow % 2 === 0
    const gridCol = isEvenRow ? posInRow : 9 - posInRow

  return {
    left: `${gridCol * 10}%`,
      top: `${displayRow * 10}%`,
    }
}

  const getCellType = (num) => {
    const loss = CARBON_LOSSES.find((l) => l.from === num)
    if (loss) return { type: "carbon-loss-cell", emoji: loss.emoji, title: `${loss.name}: slides to ${loss.to}` }
    const res = NATURAL_RESOURCES.find((r) => r.from === num)
    if (res) return { type: "natural-resource-cell", emoji: res.emoji, title: `${res.name}: climbs to ${res.to}` }
    return { type: "", emoji: "", title: "" }
  }

  const handleNumPlayersChange = (e) => {
    setNumPlayers(Number(e.target.value))
  }

  // Helper to play a sound by id
  function playSound(id) {
    const audio = document.getElementById(id)
    if (audio) {
      audio.currentTime = 0
      audio.play()
    }
  }

const handleStartGame = () => {
    setShowPlayerDetails(true)
}

const handlePlayerDetailChange = (idx, field, value) => {
  setPlayerDetails((prev) => {
    const updated = [...prev]
    updated[idx] = { ...updated[idx], [field]: value }
    // Auto-select mode based on age
    let ageNum = parseInt(updated[idx].age)
    if (field === 'age') {
      if (!value) {
        updated[idx].mode = 'medium'
      } else if (ageNum >= 1 && ageNum <= 10) {
        updated[idx].mode = 'easy'
      } else if (ageNum >= 11 && ageNum <= 15) {
        updated[idx].mode = 'medium'
      } else if (ageNum > 15) {
        updated[idx].mode = 'hard'
      } else {
        updated[idx].mode = 'medium'
      }
    }
    return updated
  })
}

const handlePlayerDetailsSubmit = (e) => {
  e.preventDefault()
  setGameStarted(true)
  setQuizFlipped(false)
  setShowDice(false)
  setCurrentPlayerIdx(0)
  setPaused(false)
  setLastCorrectPoints(0)
  setPlayers(allPlayers.map((p, i) => ({
    ...p,
    name: playerDetails[i].name || `Player ${i + 1}`,
    pos: 1,
    points: 0,
    correct: 0,
    incorrect: 0,
    mode: playerDetails[i].mode || 'medium',
    age: playerDetails[i].age || '',
  })))
  setQuestionReady(true)
  setQuestionIdx(0)
  setShowPlayerDetails(false)
  setTimeout(() => playSound("backgroundSound"), 100)
  // Set questions based on group mode (no repeats, no mixing)
  const groupMode = getGroupMode()
  let selectedQuestions = []
  if (groupMode === 'easy') selectedQuestions = easyQuestions
  else if (groupMode === 'medium') selectedQuestions = mediumQuestions
  else if (groupMode === 'hard') selectedQuestions = hardQuestions
  // Shuffle and cycle questions if needed
  setQuestions([...selectedQuestions].sort(() => Math.random() - 0.5))
}

  // Reset win state on restart
  const handleRestart = () => {
    setGameStarted(false)
    setPaused(false)
    setQuizFlipped(false)
    setShowDice(false)
    setCurrentPlayerIdx(0)
    setQuestionReady(true)
    setQuestionIdx(0)
    setPlayers(allPlayers.map((p) => ({ ...p, pos: 1, points: 0, correct: 0, incorrect: 0 })))
    setWinner(null)
    setShowWinCard(false)
    // Stop background music
    const bgAudio = document.getElementById("backgroundSound")
    if (bgAudio) {
      bgAudio.pause()
      bgAudio.currentTime = 0
    }
  }

  // Add state for new points and move message
  const [newPoints, setNewPoints] = useState(0)
  const [moveMessage, setMoveMessage] = useState("")
  // Add a state to control visibility of the player's turn message
  // const [showTurnMessage, setShowTurnMessage] = useState(true) // Removed

  // Update movePlayer to handle delayed points and messages
const movePlayer = (steps) => {
  if (paused) return
  setQuestionReady(false)
  setMoveMessage("")
  let startPos = players[currentPlayerIdx].pos
  let squaresLeft = 100 - startPos
  // Only move if dice roll is less than or equal to squares left
  if (steps > squaresLeft) {
    setMoveMessage(`You need exactly ${squaresLeft} or less to win! No move this turn.`)
    setTimeout(() => {
      setMoveMessage("")
      setCurrentPlayerIdx((prev) => (prev + 1) % numPlayers)
      setTimeout(() => {
        if (!paused) setQuestionReady(true)
      }, 1000)
    }, 1500)
    return
  }
  let moved = 0
  let endPos = startPos
  function animateStep() {
    if (paused) return
    setPlayers((prevPlayers) =>
      prevPlayers.map((p, idx) => {
        if (idx === currentPlayerIdx) {
          let newPos = p.pos + 1
          if (newPos > 100) newPos = 100
          endPos = newPos
          return { ...p, pos: newPos }
        }
        return p
      }),
    )
    // Play jump sound for each step
    playSound("jumpSound")
    moved++
    if (moved < steps && !paused) {
      setTimeout(animateStep, 250)
    } else if (!paused) {
      // After all steps, check for special cell using the latest position
      setTimeout(() => {
        let specialType = null
        let fromSquare = endPos
        let toSquare = endPos
        let pointsToAdd = 0
        let pointsToSubtract = 0
        let climbOrSlide = false
        // Check for natural resource
        const naturalResource = NATURAL_RESOURCES.find((r) => r.from === endPos)
        if (naturalResource) {
          specialType = "climb"
          fromSquare = endPos
          toSquare = naturalResource.to
          pointsToAdd = lastCorrectPoints-1
          climbOrSlide = true
        } else {
          // Check for carbon loss
          const carbonLoss = CARBON_LOSSES.find((l) => l.from === endPos)
          if (carbonLoss) {
            specialType = "slide"
            fromSquare = endPos
            toSquare = carbonLoss.to
            pointsToSubtract =lastCorrectPoints
            climbOrSlide = true
          }
        }
        if (climbOrSlide) {
          setMoveMessage(
            specialType === "climb"
              ? `Climb: Player moves from square ${fromSquare} to ${toSquare}!`
              : `Slide: Player moves from square ${fromSquare} to ${toSquare}!`
          )
          // Play climb or slide sound
          if (specialType === "climb") {
            playSound("resourceSound")
          } else {
            playSound("carbonLossSound")
          }
          setTimeout(() => {
            setPlayers((prevPlayers) =>
              prevPlayers.map((p, idx) => {
                if (idx === currentPlayerIdx) {
                  let newPos = toSquare
                  let newPoints = p.points
                  if (specialType === "climb") {
                    newPoints += pointsToAdd
                    setNewPoints(pointsToAdd)
                  } else {
                    newPoints = Math.max(0, newPoints - pointsToSubtract)
                    setNewPoints(-pointsToSubtract)
                  }
                  return { ...p, pos: newPos, points: newPoints }
                }
                return p
              })
            )
            // setShowTurnMessage(false) // Removed
            setTimeout(() => {
              setMoveMessage("")
              setNewPoints(0)
              // setShowTurnMessage(true) // Removed
              // Check for win after climb/slide
              const updatedPlayers = players.map((p, idx) =>
                idx === currentPlayerIdx
                  ? { ...p, pos: toSquare }
                  : p
              )
              if (toSquare === 100) {
                handleWin(currentPlayerIdx)
              } else {
                setCurrentPlayerIdx((prev) => (prev + 1) % numPlayers)
                setTimeout(() => {
                  if (!paused) setQuestionReady(true)
                }, 1000)
              }
            }, 1200)
          }, 1200)
        } else {
          setTimeout(() => {
            // setShowTurnMessage(true) // Removed
            // Check for win after normal move
            if (endPos === 100) {
              handleWin(currentPlayerIdx)
            } else {
              setCurrentPlayerIdx((prev) => (prev + 1) % numPlayers)
              setTimeout(() => {
                if (!paused) setQuestionReady(true)
              }, 1000)
            }
          }, 1200)
        }
      }, 400)
    }
  }
  animateStep()
}

  // Win handler
  function handleWin(playerIdx) {
    setWinner(players[playerIdx])
    setShowWinCard(true)
    playSound("winCardSound")
    // Pause background music
    const bgAudio = document.getElementById("backgroundSound")
    if (bgAudio) bgAudio.pause()
    // Optionally, auto-close win card after some time
    if (winCardTimeout.current) clearTimeout(winCardTimeout.current)
    winCardTimeout.current = setTimeout(() => {
      setShowWinCard(false);
      setGameStarted(false);
      setPaused(false);
      setQuizFlipped(false);
      setShowDice(false);
      setCurrentPlayerIdx(0);
      setQuestionReady(true);
      setQuestionIdx(0);
      setPlayers(allPlayers.map((p) => ({ ...p, pos: 1, points: 0, correct: 0, incorrect: 0 })));
      setWinner(null);
    }, 15000)
  }

  const [showCorrect, setShowCorrect] = useState(false)
  const [rolling, setRolling] = useState(false)

const handleAnswer = (opt) => {
    if (quizFlipped || !questionReady || paused) return
    setShowCorrect(false)

    if (opt === currentQuestion.answer) {
      // Correct answer
      setLastCorrectPoints(currentQuestion.points) // Track last correct answer points
      setPlayers((prevPlayers) =>
        prevPlayers.map((p, idx) => {
          if (idx === currentPlayerIdx) {
            return { ...p, points: p.points + currentQuestion.points, correct: p.correct + 1 }
          }
          return p
        }),
      )
      setNewPoints(currentQuestion.points)
      // Play correct and card flip sound
      playSound("correctSound")
      playSound("cardFlipSound")
      // setShowTurnMessage(false) // Removed
      setQuizFlipped(true)
      setTimeout(() => {
        if (paused) return
        setQuestionReady(false)
        setRolling(true)
        setShowDice(true)
        // Play dice roll sound
        playSound("diceRollSound")
        let rollCount = 0
        const rollInterval = setInterval(() => {
          if (paused) {
            clearInterval(rollInterval)
            return
          }
          setDiceNumber(Math.floor(Math.random() * 6) + 1)
          rollCount++
          if (rollCount >= 10) {
            clearInterval(rollInterval)
            setDiceNumber(currentQuestion.points)
            setRolling(false)
            setTimeout(() => {
              if (paused) return
              setShowDice(false)
              movePlayer(currentQuestion.points)
              setQuizFlipped(false)
              setQuestionIdx((idx) => (idx + 1) % questions.length)
              setTimeout(() => {
                setNewPoints(0)
                // setShowTurnMessage(true) // Removed
              }, 1200)
              setTimeout(
                () => {
                  if (!paused) setQuestionReady(true)
                },
                currentQuestion.points * 250 + 400,
              )
            }, 1000)
          }
        }, 100)
      }, 1200)
    } else {
      // Wrong answer
      setPlayers((prevPlayers) =>
        prevPlayers.map((p, idx) => {
          if (idx === currentPlayerIdx) {
            return { ...p, incorrect: p.incorrect + 1 }
          }
          return p
        }),
      )
      // Play incorrect sound
      playSound("incorrectSound")
      setShowCorrect(true)
      setTimeout(() => {
        if (paused) return
        setShowCorrect(false)
        setCurrentPlayerIdx((prev) => (prev + 1) % numPlayers)
        setQuestionIdx((idx) => (idx + 1) % questions.length)
      }, 2000)
    }
  }

  return (
    <div className={`ecovoyage-game-root ${paused ? "paused" : ""}`}>
      <ecovoyage-game-root style={{margin: '0px 233px' }}></ecovoyage-game-root>
      {/* Header */}
      <header style={{margin:'0px -76px' , display: 'flex', alignItems: 'center', position: 'relative', minHeight: 60 }}>
        <button 
          id="burgerMenu" 
          aria-label="Open rules menu" 
          onClick={() => setShowRules(true)}
          style={{
            marginRight: 18,
            marginLeft: 0,
            fontSize: '2em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#388e3c',
            padding: '0.2em 0.6em',
            borderRadius: 8,
            transition: 'background 0.2s',
            outline: 'none',
            alignSelf: 'center',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e0f7fa'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          ☰
        </button>
        <h1>Eco Voyage: Reach the Peak</h1>
        {gameStarted && (
          <>
            <button
              id="pauseBtn"
              aria-label={paused ? "Resume game" : "Pause game"}
              onClick={() => {
                setPaused((p) => !p)
                const bgAudio = document.getElementById("backgroundSound")
                if (bgAudio) {
                  if (!paused) {
                    bgAudio.pause()
                  } else {
                    bgAudio.play()
                  }
                }
              }}
              className={paused ? "paused" : ""}
            >
              {paused ? "▶️" : "⏸️"}
            </button>
            <button id="restartBtn" aria-label="Restart game" onClick={handleRestart}>
              🔄
            </button>
      </>
        )}
      </header>

      {/* Win Card Overlay */}
      {showWinCard && winner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="flip-card win-card"
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 32px #0005",
              padding: "2.5rem 2rem 2rem 2rem",
              minWidth: 320,
              minHeight: 260,
              position: "relative",
              textAlign: "center",
              animation: "pop-in 0.7s cubic-bezier(.5,1.5,.5,1)",
            }}
          >
            {/* Party poppers */}
            <span style={{fontSize: 40, position: "absolute", left: 20, top: 10, transform: "rotate(-20deg)"}}>🎉</span>
            <span style={{fontSize: 40, position: "absolute", right: 20, top: 10, transform: "rotate(20deg)"}}>🎉</span>
            <div className="flip-card-inner" style={{transform: "rotateY(180deg)"}}>
              <div className="flip-card-back" style={{background: "#fff"}}>
                <h2 style={{color: "#2e7d32", marginBottom: 10}}>Congratulations!</h2>
                <div style={{fontSize: 22, fontWeight: 600, marginBottom: 8}}>
                  {winner.name} {winner.emoji}
                </div>
                <div style={{fontSize: 18, marginBottom: 6}}>
                  You have secured <span style={{color: "#388e3c", fontWeight: 700}}>{winner.points} points</span>!
                </div>
                <div style={{fontSize: 16, marginBottom: 6}}>
                  Correct Answers: <b>{winner.correct}</b>
                </div>
                <div style={{fontSize: 16, marginBottom: 12}}>
                  Incorrect Answers: <b>{winner.incorrect}</b>
                </div>
                <div style={{fontSize: 32, margin: "10px 0 0 0"}}>🎊🎊🎊</div>
                <button
                  style={{marginTop: 18, fontSize: 18, background: "#388e3c", color: "#fff", border: "none", borderRadius: 8, padding: "8px 24px", cursor: "pointer"}}
                  onClick={() => {
                    setShowWinCard(false);
                    setGameStarted(false);
                    setPaused(false);
                    setQuizFlipped(false);
                    setShowDice(false);
                    setCurrentPlayerIdx(0);
                    setQuestionReady(true);
                    setQuestionIdx(0);
                    setPlayers(allPlayers.map((p) => ({ ...p, pos: 1, points: 0, correct: 0, incorrect: 0 })));
                    setWinner(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Sidebar */}
      {showRules && (
        <div
          id="rulesSidebar"
          style={{
            position: "fixed",
          top: 0,
          left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
          zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "90%",
              position: "relative",
            }}
          >
            <button
              id="closeRules"
              aria-label="Close rules menu"
              style={{ position: "absolute", top: 10, right: 10, fontSize: "1.5em" }}
              onClick={() => setShowRules(false)}
            >
              ✕
            </button>
            <h2>Game Rules</h2>
            <ul>
              <li>Select 1–4 players and click "Start Game."</li>
              <li>When you give a correct answer, the dice rolls to the number of points assigned to that question.</li>
              <li>
                When a player reaches a unique natural resource (e.g., Solar Energy ☀️, Forests 🌳), their score
                increases by double the points of the last correctly answered question.
              </li>
              <li>
                When a player reaches a distinct carbon emission loss (e.g., Air Pollution 🏭, Deforestation 🪓), their
                score decreases by the points of the last correctly answered question (minimum 0).
              </li>
              <li>
                Pause the game using the ⏸️ button (top-right). Resume with ▶️ to continue from the exact moment paused.
                Interactions are disabled while paused, except for the rules menu (☰).
              </li>
              <li>
                Restart the game using the 🔄 button (top-right) to return to player selection and reset all progress.
              </li>
              <li>Click energy icons at the bottom for tooltips about sustainable energy sources.</li>
              <li>If questions run out: "No more questions! Game over!" (no win card).</li>
            </ul>
          </div>
        </div>
      )}

      {/* Player Selection */}
      {!gameStarted && !showPlayerDetails && (
        <div id="playerSelection" style={{ margin: "1rem 300px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="numPlayers"> players:</label>
          <select id="numPlayers" value={numPlayers} onChange={handleNumPlayersChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            {/* <option value="3">3</option>
            <option value="4">4</option> */}
          </select>
          <button id="startGame" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      )}

      {/* Player Details Form as Flip Card Overlay */}
      {showPlayerDetails && !gameStarted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 1500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="flip-card"
            style={{
              background: "rgba(255,255,255,0.55)",
             
              boxShadow: "0 12px 48px #0003, 0 2px 12px #388e3c22",
              padding: "2.8rem 2.2rem 2.2rem 2.2rem",
              minWidth: 370,
              minHeight: 340 + (numPlayers-1)*90,
              position: "relative",
              textAlign: "center",
              animation: "pop-in 0.7s cubic-bezier(.5,1.5,.5,1)",
              maxWidth: 460,
              border: "2.5px solid transparent",
              backgroundClip: "padding-box, border-box",
              borderImage: "linear-gradient(120deg, #b2dfdb 40%, #66bb6a 100%) 1",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              overflow: "visible",
              transition: 'min-height 0.3s',
            }}
          >
            {/* Close button */}
            <button
              aria-label="Close player details"
              onClick={() => setShowPlayerDetails(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                background: "rgba(255,255,255,0.7)",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: 22,
                color: "#388e3c",
                cursor: "pointer",
                boxShadow: "0 1px 4px #388e3c22",
                zIndex: 2,
                transition: "background 0.2s, color 0.2s"
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#e0f7fa'; e.currentTarget.style.color = '#d32f2f'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#388e3c'; }}
            >
              ×
            </button>
            {/* Floating avatar icon */}
            <div style={{
              position: "absolute",
              top: -38,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #66bb6a 60%, #b2dfdb 100%)",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px #388e3c33",
              border: "3px solid #fff",
              zIndex: 1
            }}>
              <span style={{fontSize: 38, color: '#fff', textShadow: '0 2px 8px #388e3c55'}}>👤</span>
            </div>
            <div className="flip-card-inner" style={{transform: "rotateY(180deg)"}}>
              <div className="flip-card-back" style={{background: "transparent"}}>
                <form onSubmit={handlePlayerDetailsSubmit}>
                  <h2 style={{marginBottom: 18, color: '#388e3c', letterSpacing: 1, fontWeight: 700, fontSize: 26, marginTop: 18}}>Enter Player Details</h2>
                  {Array.from({ length: numPlayers }).map((_, i) => (
                    <div key={i} style={{ 
                      marginBottom: numPlayers === 4 ? 12 : 22, 
                      padding: numPlayers === 4 ? 7 : 14, 
                      border: "1.5px solid #b2dfdb", 
                      borderRadius: 10, 
                      background: "#ffffffcc", 
                      boxShadow: "0 1px 4px #388e3c11", 
                      transition: 'box-shadow 0.2s',
                    }}>
                      <div style={{ marginBottom: numPlayers === 4 ? 4 : 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label htmlFor={`playerName${i}`} style={{ marginRight: numPlayers === 4 ? 6 : 10, fontWeight: 600, color: '#388e3c', fontSize: numPlayers === 4 ? 14 : 16 }}>Player {i + 1} Name:</label>
                        <input
                          id={`playerName${i}`}
                          type="text"
                          value={playerDetails[i].name}
                          onChange={e => handlePlayerDetailChange(i, 'name', e.target.value)}
                          placeholder={`Player ${i + 1}`}
                          style={{ 
                            padding: numPlayers === 4 ? "5px 8px" : "8px 14px", 
                            borderRadius: 6, 
                            border: "1.5px solid #b2dfdb", 
                            fontSize: numPlayers === 4 ? 14 : 17, 
                            outline: 'none', 
                            background: '#f7fafc', 
                            transition: 'border 0.2s, box-shadow 0.2s', 
                            boxShadow: '0 1px 4px #388e3c11',
                            width: numPlayers === 4 ? 90 : undefined,
                          }}
                          onFocus={e => { e.target.style.border = '#388e3c 2px solid'; e.target.style.boxShadow = '0 0 0 2px #b2dfdb88'; }}
                          onBlur={e => { e.target.style.border = '1.5px solid #b2dfdb'; e.target.style.boxShadow = '0 1px 4px #388e3c11'; }}
                        />
                      </div>
                      <div style={{ marginBottom: numPlayers === 4 ? 4 : 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label htmlFor={`playerAge${i}`} style={{ marginRight: numPlayers === 4 ? 6 : 10, fontWeight: 600, color: '#388e3c', fontSize: numPlayers === 4 ? 14 : 16 }}>Age:</label>
                        <input
                          id={`playerAge${i}`}
                          type="number"
                          min="1"
                          value={playerDetails[i].age}
                          onChange={e => handlePlayerDetailChange(i, 'age', e.target.value)}
                          placeholder="Age"
                          style={{ 
                            padding: numPlayers === 4 ? "5px 8px" : "8px 14px", 
                            borderRadius: 6, 
                            border: "1.5px solid #b2dfdb", 
                            fontSize: numPlayers === 4 ? 14 : 17, 
                            outline: 'none', 
                            background: '#f7fafc', 
                            width: numPlayers === 4 ? 60 : 90, 
                            transition: 'border 0.2s, box-shadow 0.2s', 
                            boxShadow: '0 1px 4px #388e3c11',
                          }}
                          onFocus={e => { e.target.style.border = '#388e3c 2px solid'; e.target.style.boxShadow = '0 0 0 2px #b2dfdb88'; }}
                          onBlur={e => { e.target.style.border = '1.5px solid #b2dfdb'; e.target.style.boxShadow = '0 1px 4px #388e3c11'; }}
                        />
                      </div>
                      <div style={{marginTop: 2}}>
                        <label style={{fontWeight: 600, color: '#388e3c', fontSize: numPlayers === 4 ? 14 : 16}}>Mode: </label>
                        <span style={{ fontWeight: 700, color: playerDetails[i].mode === 'easy' ? '#388e3c' : playerDetails[i].mode === 'medium' ? '#ff9800' : '#d32f2f', fontSize: numPlayers === 4 ? 15 : 18, letterSpacing: 0.5 }}>
                          {playerDetails[i].mode.charAt(0).toUpperCase() + playerDetails[i].mode.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button type="submit" style={{ marginTop: 10, fontSize: 21, background: "linear-gradient(90deg, #388e3c 60%, #66bb6a 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 38px", cursor: "pointer", fontWeight: 700, boxShadow: "0 2px 12px #388e3c22", letterSpacing: 1, transition: 'background 0.2s, box-shadow 0.2s', marginBottom: 4 }}
                    onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #66bb6a 60%, #388e3c 100%)'; e.currentTarget.style.boxShadow = '0 4px 16px #388e3c33'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #388e3c 60%, #66bb6a 100%)'; e.currentTarget.style.boxShadow = '0 2px 12px #388e3c22'; }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoreboard - Show for all selected players */}
      {gameStarted && (
        <ScoreBoard
          playerCount={numPlayers}
          playersData={players.slice(0, numPlayers).map((p) => ({
            points: p.points,
            correct: p.correct,
            incorrect: p.incorrect,
          }))}
        />
      )}

      {/* Number Board (no tokens before game starts) */}
 {!gameStarted && (
  <div id="board" aria-label="Sustainable board" style={{  margin: "0px 294px" }} >
    
    {Array.from({ length: 100 }).map((_, idx) => {
            const row = 9 - Math.floor(idx / 10)
            const col = idx % 10
            const evenRow = row % 2 === 0
            const num = evenRow ? row * 10 + col + 1 : row * 10 + (9 - col) + 1
            const { type, emoji, title } = getCellType(num)
      return (
        <div
          key={num}
          className={`cell ${type}`}
          title={title}
          data-cell-num={num}
                style={{ position: "relative" }}
        >
                <span style={{ fontWeight: "bold", fontSize: "0.9em" }}>{num}</span> {emoji}
        </div>
            )
    })}
  </div>
)}

      {/* Game UI (board, tokens, etc.) */}
     {gameStarted && (
  <>
          <div id="board" aria-label="Sustainable board" style={{  margin: "0px 350px" }}>
      {/* Render board cells */}
      {Array.from({ length: 100 }).map((_, idx) => {
              const row = 9 - Math.floor(idx / 10)
              const col = idx % 10
              const evenRow = row % 2 === 0
              const num = evenRow ? row * 10 + col + 1 : row * 10 + (9 - col) + 1
              const { type, emoji, title } = getCellType(num)
        return (
          <div
            key={num}
            className={`cell ${type}`}
            title={title}
            data-cell-num={num}
                  style={{ position: "relative" }}
          >
                  <span style={{ fontWeight: "bold", fontSize: "0.9em" }}>{num}</span> {emoji}
          </div>
              )
      })}
      {/* Render tokens absolutely for smooth movement */}
      {players.slice(0, numPlayers).map((p, i) => {
              const coords = getCellCoords(p.pos)
        return (
          <span
            key={i}
            className="player"
            style={{
              background: p.color,
              border: `2px solid ${p.border}`,
                    position: "absolute",
              left: `calc(${coords.left} + ${i * 12}px)`,
              top: `calc(${coords.top} + 8px)`,
                    width: "1.8em",
                    height: "1.8em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2em",
                    borderRadius: "50%",
              zIndex: 10,
                    boxShadow: "0 1px 4px #0002",
                    transition: paused
                      ? "none"
                      : "left 0.5s cubic-bezier(.5,1.5,.5,1), top 0.5s cubic-bezier(.5,1.5,.5,1)",
            }}
            aria-label={`${p.name} ${p.emoji}'s game piece`}
          >
            {p.emoji}
          </span>
              )
      })}
    </div>
  </>
)}

          {/* Message Area */}
      {gameStarted && (
          <div id="message" role="alert" aria-live="assertive">
          {paused ? "Game Paused" : `Your turn: ${players[currentPlayerIdx].name} ${players[currentPlayerIdx].emoji}`}
          </div>
      )}

          {/* Question Area */}
      {gameStarted && questionReady && !paused && (
        <div id="questionArea" className={`flip-card${quizFlipped ? " flipped" : ""}`} style={{ display: "block" }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p id="questionText">{currentQuestion.question}</p>
                  <div id="options">
                    {currentQuestion.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </button>
                    ))}
                  </div>
                  {showCorrect && (
                <div style={{ marginTop: "1em", color: "#d32f2f", fontWeight: "bold" }}>
                      Correct Answer: {currentQuestion.answer}
                    </div>
                  )}
                </div>
                <div className="flip-card-back">
                  <p id="answerResult">+{currentQuestion.points} marks!</p>
                </div>
              </div>
            </div>
          )}

      {/* Dice Area */}
      {showDice && !paused && (
        <div id="diceArea" style={{ display: "block" }}>
            <div
              id="diceNumber"
              style={{
              fontSize: "2em",
              fontWeight: "bold",
              transition: rolling ? "transform 0.1s" : "none",
              transform: rolling ? "rotate(" + Math.random() * 360 + "deg)" : "none",
              }}
            >
              {diceNumber}
            </div>
          </div>
    )}

    {/* Energy Icons
    <div id="energyIcons" aria-label="Natural energy sources">
      <div className="tooltip">
          <img
            className="energy-icon"
            src="https://img.icons8.com/color/96/000000/solar-panel.png"
            alt="Solar Energy"
          />
        <span className="tooltiptext">Solar Energy: Harnesses sunlight to generate electricity.</span>
      </div>
      <div className="tooltip">
        <img className="energy-icon" src="https://img.icons8.com/color/96/000000/windmill.png" alt="Wind Energy" />
        <span className="tooltiptext">Wind Energy: Uses wind turbines to produce power.</span>
      </div>
      <div className="tooltip">
          <img
            className="energy-icon"
            src="https://img.icons8.com/?size=100&id=3F5ntRhugsgh&format=png&color=000000"
            alt="Hydroelectric Power"
          />
        <span className="tooltiptext">Hydropower: Generates energy from flowing water.</span>
      </div>
      <div className="tooltip">
        <img className="energy-icon" src="https://img.icons8.com/color/86/000000/leaf.png" alt="Bio Energy" />
        <span className="tooltiptext">Bio Energy: Derived from organic materials like plants.</span>
      </div>
      <div className="tooltip">
        <img className="energy-icon" src="https://img.icons8.com/color/96/000000/earth-planet--v1.png" alt="Earth" />
        <span className="tooltiptext">Earth & Nature: Promotes sustainable ecosystems.</span>
      </div>
    </div> */}

    {/* Audio Elements */}
    <div id="audio">
    <audio id="backgroundSound" src="/game/ecovoyage/background.mp3" loop />
    <audio id="jumpSound" src="/game/ecovoyage/jump.mp3" />
    <audio id="resourceSound" src="/game/ecovoyage/climb.mp3" />
    <audio id="carbonLossSound" src="/game/ecovoyage/lose.mp3" />
    <audio id="diceRollSound" src="/game/ecovoyage/dice.mp3" />
    <audio id="cardFlipSound" src="/game/ecovoyage/cardflip.m4a" />
    <audio id="correctSound" src="/game/ecovoyage/correct.m4a" />
    <audio id="incorrectSound" src="/game/ecovoyage/incorrect.mp3" />
    <audio id="winCardSound" src="/game/ecovoyage/win.m4a" />
  </div>

      {/* In the render, below the board, show newPoints and moveMessage, and hide the player's turn message when newPoints is visible */}
      {/* Removed showTurnMessage rendering */}
      {moveMessage && (
        <div id="moveMessage" style={{ marginTop: 10, color: '#2e7d32', fontWeight: 600, fontSize: 18, textAlign: 'center' }}>{moveMessage}</div>
      )}
      {newPoints !== 0 && (
        <div id="newPoints" style={{ marginTop: 5, color: newPoints > 0 ? '#388e3c' : '#c82333', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
          {newPoints > 0 ? `+${newPoints} points added!` : `${newPoints} points deducted!`}
        </div>
      )}
    </div>
  )
}

export default EcovoyageGame;