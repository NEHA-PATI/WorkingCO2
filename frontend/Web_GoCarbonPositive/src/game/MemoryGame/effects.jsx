import React from 'react';

export const showCelebration = (container, text, left, top, color, fontSize = '40px') => {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = text;
    celebration.style.left = `${left}px`;
    celebration.style.top = `${top}px`;
    celebration.style.color = color;
    celebration.style.fontSize = fontSize;
    
    container.appendChild(celebration);
    
    setTimeout(() => {
      celebration.remove();
    }, 1500);
  };