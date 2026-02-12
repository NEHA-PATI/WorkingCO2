import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Trophy, Gift, Zap, Star } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: "Welcome to the Arena",
    subtitle: "Compete, Earn & Win Amazing Rewards",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    icon: Trophy,
    accent: "bg-yellow-400"
  },
  {
    id: 2,
    title: "Weekly Challenge Live",
    subtitle: "Top 10 winners get exclusive prizes",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    icon: Zap,
    accent: "bg-emerald-300"
  },
  {
    id: 3,
    title: "Streak Bonus Active",
    subtitle: "Maintain your streak for 5x multiplier",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    icon: Sparkles,
    accent: "bg-orange-300"
  },
  {
    id: 4,
    title: "Referral Rewards",
    subtitle: "Invite friends & earn 1000 points each",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    icon: Gift,
    accent: "bg-pink-300"
  },
  {
    id: 5,
    title: "New Milestone Unlocked",
    subtitle: "Complete all tasks to become a Legend",
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    icon: Star,
    accent: "bg-blue-300"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-r ${banners[current].gradient}`}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="flex items-center gap-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`hidden sm:flex w-24 h-24 ${banners[current].accent} rounded-2xl items-center justify-center shadow-2xl`}
              >
                {React.createElement(banners[current].icon, { 
                  className: "w-12 h-12 text-slate-800" 
                })}
              </motion.div>

              {/* Text */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
                >
                  {banners[current].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-white/80 mt-3"
                >
                  {banners[current].subtitle}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
