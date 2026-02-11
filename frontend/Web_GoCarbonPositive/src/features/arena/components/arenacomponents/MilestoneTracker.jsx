import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronLeft, ChevronRight, Crown, Check } from 'lucide-react';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MilestoneTracker({ currentStreak }) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'short' }).toUpperCase();
  
  // Get calendar data for current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Calculate which days have check-ins (mock data based on streak)
  const checkedInDays = [];
  for (let i = 0; i < currentStreak; i++) {
    checkedInDays.push(currentDay - i);
  }

  const getDayStatus = (day) => {
    if (day === null) return 'empty';
    if (day === currentDay) return 'current';
    if (checkedInDays.includes(day) && day < currentDay) return 'checked';
    if (day < currentDay) return 'missed';
    return 'future';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Streak Info - 70% */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:w-[70%] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
      >
        {/* Header with Day Counter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {/* Hexagon Badge */}
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                  fill="url(#hexGradient)"
                  className="drop-shadow-lg"
                />
                <polygon
                  points="50,12 83,30 83,70 50,88 17,70 17,30"
                  fill="#134e4a"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">{currentDay}</div>
                <div className="text-xs text-teal-200 uppercase tracking-wider">{currentMonth}</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-800">Day {currentDay}</h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-6 h-6 text-orange-500" />
              </motion.div>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak today'}
            </p>
          </div>
        </div>

        {/* Streak Bonus System */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-slate-800">Streak Bonus</span>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-emerald-700">
                +{currentStreak >= 30 ? 250 : currentStreak >= 14 ? 150 : currentStreak >= 7 ? 75 : 0} pts
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-lg p-3 text-center transition-all ${
              currentStreak >= 7
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
                : 'bg-white border border-emerald-200'
            }`}>
              <div className="text-xl font-bold mb-1">7</div>
              <div className="text-xs opacity-80">+75 pts</div>
            </div>
            <div className={`rounded-lg p-3 text-center transition-all ${
              currentStreak >= 14
                ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md'
                : 'bg-white border border-emerald-200'
            }`}>
              <div className="text-xl font-bold mb-1">14</div>
              <div className="text-xs opacity-80">+150 pts</div>
            </div>
            <div className={`rounded-lg p-3 text-center transition-all ${
              currentStreak >= 30
                ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-md'
                : 'bg-white border border-emerald-200'
            }`}>
              <div className="text-xl font-bold mb-1">30</div>
              <div className="text-xs opacity-80">+250 pts</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendar - 30% */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-[30%] bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-800 text-sm">Daily Streak</h4>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-3 h-3 text-slate-600" />
            </button>
            <button className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const status = getDayStatus(day);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`aspect-square flex items-center justify-center rounded-md transition-all relative ${
                  status === 'empty' ? 'invisible' :
                  status === 'current' ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold shadow-md' :
                  status === 'checked' ? 'bg-teal-50 text-teal-600 font-semibold' :
                  status === 'missed' ? 'text-slate-300' :
                  'text-slate-500'
                }`}
              >
                <span className="text-xs">{day}</span>
                {status === 'checked' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-3 h-3 text-teal-600" strokeWidth={3} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
