import React, { useState } from 'react';
import './ThemeDescription.css';

const themeDescriptions = {
  renewableEnergy: {
    title: "Renewable Energy Sources",
    description: "These are clean energy sources that never run out and don't pollute our planet!",
    cards: [
      { emoji: '☀️', name: "Solar Energy", desc: "Converts sunlight into electricity using solar panels" },
      { emoji: '🌬️', name: "Wind Power", desc: "Uses wind turbines to generate electricity" },
      { emoji: '💧', name: "Hydropower", desc: "Generates power from flowing water" },
      { emoji: '🌋', name: "Geothermal", desc: "Uses heat from Earth's core to generate energy" },
      { emoji: '🌊', name: "Tidal Power", desc: "Harnesses energy from ocean tides" },
      { emoji: '⚡', name: "Bioenergy", desc: "Energy from organic materials" },
      { emoji: '🔋', name: "Storage", desc: "Storing renewable energy for later use" },
      { emoji: '♻️', name: "Recycled Energy", desc: "Reusing energy from waste" }
    ]
  },
  carbonReduction: {
    title: "Carbon Reduction Methods",
    description: "Ways to reduce carbon emissions and combat climate change",
    cards: [
      { emoji: '🌳', name: "Tree Planting", desc: "Trees absorb CO2 from the atmosphere" },
      { emoji: '🚲', name: "Cycling", desc: "Zero-emission transportation alternative" },
      { emoji: '🚆', name: "Trains", desc: "Efficient mass transit reduces emissions" },
      { emoji: '🏡', name: "Home Insulation", desc: "Reduces energy needed for heating/cooling" },
      { emoji: '💡', name: "LED Lighting", desc: "Uses 75% less energy than incandescent bulbs" },
      { emoji: '📉', name: "Emissions Reduction", desc: "Lowering greenhouse gas output" },
      { emoji: '🌍', name: "Awareness", desc: "Promoting climate education" },
      { emoji: '🔄', name: "Recycling", desc: "Reusing materials to save energy" }
    ]
  },
  sustainabilityGoals: {
    title: "UN Sustainability Goals",
    description: "Global goals to achieve a better and more sustainable future",
    cards: [
      { emoji: '1️⃣', name: "No Poverty", desc: "End poverty in all its forms everywhere" },
      { emoji: '2️⃣', name: "Zero Hunger", desc: "End hunger and ensure food security" },
      { emoji: '3️⃣', name: "Good Health", desc: "Ensure healthy lives for all ages" },
      { emoji: '4️⃣', name: "Quality Education", desc: "Inclusive and equitable education" },
      { emoji: '5️⃣', name: "Gender Equality", desc: "Achieve gender equality and empower all women and girls" },
      { emoji: '6️⃣', name: "Clean Water", desc: "Ensure availability and sustainable management of water" },
      { emoji: '7️⃣', name: "Clean Energy", desc: "Ensure access to affordable, reliable, sustainable energy" },
      { emoji: '8️⃣', name: "Good Jobs", desc: "Promote sustained, inclusive and sustainable economic growth" },
      { emoji: '9️⃣', name: "Innovation", desc: "Build resilient infrastructure, promote sustainable industrialization" },
      { emoji: '🔟', name: "Reduced Inequality", desc: "Reduce inequality within and among countries" }
    ]
  },
  ecoFriendly: {
    title: "Eco-Friendly Practices",
    description: "Daily habits that help protect our environment",
    cards: [
      { emoji: '🛒', name: "Reusable Bags", desc: "Reduce plastic waste from shopping" },
      { emoji: '🚯', name: "Zero Waste", desc: "Minimize trash through recycling and composting" },
      { emoji: '🚰', name: "Water Conservation", desc: "Reduce water usage in daily activities" },
      { emoji: '🌾', name: "Organic Farming", desc: "Agriculture without harmful pesticides" },
      { emoji: '🐝', name: "Pollinators", desc: "Support bees and other pollinators" },
      { emoji: '🦋', name: "Biodiversity", desc: "Protect a variety of living species" },
      { emoji: '🍀', name: "Green Spaces", desc: "Create and maintain parks and gardens" },
      { emoji: '🏭', name: "Clean Industry", desc: "Promote environmentally friendly manufacturing" }
    ]
  }
};

// Difficulty settings to match the game
const difficulties = {
  easy: { pairs: 4 },
  medium: { pairs: 6 },
  hard: { pairs: 8 },
  expert: { pairs: 10 }
};

const ThemeDescription = ({ theme, onClose, difficulty = 'medium' }) => {
  const description = themeDescriptions[theme] || themeDescriptions.renewableEnergy;
  const { pairs } = difficulties[difficulty] || difficulties.medium;
  const cards = description.cards.slice(0, pairs);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  return (
    <div className="theme-description-overlay">
      <div className="theme-description-card vertical-layout">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{description.title}</h2>
        <p className="theme-description">{description.description}</p>
        <div className="carousel-container horizontal-carousel">
          <button className="carousel-nav left" onClick={goPrev} aria-label="Previous card">&#8592;</button>
          <div className="theme-card carousel-card vertical-card">
            <div className="card-emoji">{cards[currentIndex].emoji}</div>
            <div className="card-content">
              <h3>{cards[currentIndex].name}</h3>
              <p>{cards[currentIndex].desc}</p>
            </div>
          </div>
          <button className="carousel-nav right" onClick={goNext} aria-label="Next card">&#8594;</button>
        </div>
        <div className="carousel-indicator">
          {cards.map((_, idx) => (
            <span key={idx} className={idx === currentIndex ? 'active-dot' : 'dot'}>•</span>
          ))}
        </div>
        <button className="got-it-button" onClick={onClose}>Got It!</button>
      </div>
    </div>
  );
};

export default ThemeDescription;