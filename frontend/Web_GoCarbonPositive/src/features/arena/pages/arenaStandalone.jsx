import React, { useState, useEffect, useRef } from 'react';
import "@features/arena/styles/arenaglobals.css";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import {
    Trophy, Medal, Crown, Flame, Sparkles, TrendingUp, Award, Star,
    ChevronLeft, ChevronRight, Check, Zap, X, CheckCircle2, Gift, ScrollText,
    UserPlus, ClipboardList, Linkedin, Instagram, Users, CalendarCheck, Gamepad2, Brain, Clock
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import a4 from "@features/arena/components/photos/a4.jpeg";
import a5 from "@features/arena/components/photos/a5.jpg";
import a6 from "@features/arena/components/photos/a6.jpg";
import a7 from "@features/arena/components/photos/a7.jpg";

// Inline Styles
const styles = `
.arena-standalone-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(255, 255, 255) 50%, rgb(248, 250, 252) 100%);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  color: hsl(var(--foreground));
  line-height: 1.5;
}

.arena-standalone-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  height: 2.5rem;
}

.arena-standalone-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.arena-standalone-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 50;
}

.arena-standalone-modal {
  position: relative;
  max-width: 32rem;
  width: calc(100% - 2rem);
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 51;
  max-height: 80vh;
  overflow-y: auto;
}

.arena-standalone-modal-wrap {
  position: fixed;
  inset: 0;
  z-index: 51;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: 1rem;
}

.arena-standalone-modal-wrap > .arena-standalone-modal {
  pointer-events: auto;
}
`;

const iconMap = {
    UserPlus, ClipboardList, Linkedin, Instagram, Users, CalendarCheck, Gamepad2, Brain
};

// HeroSlider Component
const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const banners = [
        { id: 1, title: "Welcome to the Arena", subtitle: "Compete, Earn & Win Amazing Rewards", gradient: "from-violet-600 via-purple-600 to-indigo-700", icon: Trophy, accent: "bg-yellow-400", image: a4 },
        { id: 2, title: "Weekly Challenge Live", subtitle: "Top 10 winners get exclusive prizes", gradient: "from-emerald-500 via-teal-500 to-cyan-600", icon: Zap, accent: "bg-emerald-300", image: a5 },
        { id: 3, title: "Streak Bonus Active", subtitle: "Maintain your streak for 5x multiplier", gradient: "from-orange-500 via-amber-500 to-yellow-500", icon: Sparkles, accent: "bg-orange-300", image: a6 },
        { id: 4, title: "Referral Rewards", subtitle: "Invite friends & earn 1000 points each", gradient: "from-pink-500 via-rose-500 to-red-500", icon: Gift, accent: "bg-pink-300", image: a7 },
        { id: 5, title: "New Milestone Unlocked", subtitle: "Complete all tasks to become a Legend", gradient: "from-blue-600 via-indigo-600 to-violet-700", icon: Star, accent: "bg-blue-300", image: a4 }
    ];

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

                >
                    <img
                        src={banners[current].image}
                        alt={banners[current].title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                    </div>
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                        <div className="flex items-center gap-8">
                            {/* <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className={`hidden sm:flex w-24 h-24 ${banners[current].accent} rounded-2xl items-center justify-center shadow-2xl`}
                            >
                                {React.createElement(banners[current].icon, { className: "w-12 h-12 text-slate-800" })}
                            </motion.div> */}
                            <div>
                                {/* <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
                                >
                                    {banners[current].title}
                                </motion.h1> */}
                                {/* <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg sm:text-xl text-white/80 mt-3"
                                >
                                    {banners[current].subtitle}
                                </motion.p> */}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

// MilestoneTracker Component
const MilestoneTracker = ({ currentStreak }) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.toLocaleString('default', { month: 'short' }).toUpperCase();
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:w-[70%] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="relative w-20 h-20">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                <defs>
                                    <linearGradient id="arenaHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#14b8a6" />
                                        <stop offset="100%" stopColor="#0891b2" />
                                    </linearGradient>
                                </defs>
                                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="url(#arenaHexGradient)" className="drop-shadow-lg" />
                                <polygon points="50,12 83,30 83,70 50,88 17,70 17,30" fill="#134e4a" />
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
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Flame className="w-6 h-6 text-orange-500" />
                            </motion.div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak today'}
                        </p>
                    </div>
                </div>

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
                        <div className={`rounded-lg p-3 text-center transition-all ${currentStreak >= 7 ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md' : 'bg-white border border-emerald-200'
                            }`}>
                            <div className="text-xl font-bold mb-1">7</div>
                            <div className="text-xs opacity-80">+75 pts</div>
                        </div>
                        <div className={`rounded-lg p-3 text-center transition-all ${currentStreak >= 14 ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md' : 'bg-white border border-emerald-200'
                            }`}>
                            <div className="text-xl font-bold mb-1">14</div>
                            <div className="text-xs opacity-80">+150 pts</div>
                        </div>
                        <div className={`rounded-lg p-3 text-center transition-all ${currentStreak >= 30 ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-md' : 'bg-white border border-emerald-200'
                            }`}>
                            <div className="text-xl font-bold mb-1">30</div>
                            <div className="text-xs opacity-80">+250 pts</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-[30%] bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
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
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-slate-400">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        const status = getDayStatus(day);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.01 }}
                                className={`aspect-square flex items-center justify-center rounded-md transition-all relative ${status === 'empty' ? 'invisible' :
                                    status === 'current' ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold shadow-md' :
                                        status === 'checked' ? 'bg-teal-50 text-teal-600 font-semibold' :
                                            status === 'missed' ? 'text-slate-300' : 'text-slate-500'
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
};

// Leaderboard Component
const Leaderboard = () => {
    const leaderboardData = [
        { rank: 1, name: "Alex Chen", points: 12450, emoji: "🏆", trend: "up", avatar: "AC" },
        { rank: 2, name: "Sarah Kim", points: 11200, emoji: "🔥", trend: "up", avatar: "SK" },
        { rank: 3, name: "Mike Ross", points: 10850, emoji: "⚡", trend: "same", avatar: "MR" },
        { rank: 4, name: "Emma Wilson", points: 9600, emoji: "🌟", trend: "up", avatar: "EW" },
        { rank: 5, name: "James Lee", points: 8750, emoji: "💎", trend: "down", avatar: "JL" },
        { rank: 6, name: "Lisa Wang", points: 7900, emoji: "🎯", trend: "up", avatar: "LW" },
        { rank: 7, name: "David Park", points: 7200, emoji: "🚀", trend: "same", avatar: "DP" },
        { rank: 8, name: "Amy Zhang", points: 6800, emoji: "✨", trend: "up", avatar: "AZ" },
        { rank: 9, name: "Tom Brown", points: 6100, emoji: "💫", trend: "down", avatar: "TB" },
        { rank: 10, name: "Nina Patel", points: 5500, emoji: "🌈", trend: "up", avatar: "NP" },
    ];

    const maxVisible = 7;
    const visibleList = leaderboardData.slice(0, maxVisible);
    const hasMore = leaderboardData.length > maxVisible;

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full"
            >
                <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                        >
                            <Trophy className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Leaderboard</h3>
                            <p className="text-xs text-slate-500">Top performers this week</p>
                        </div>
                    </div>
                </div>

                <div className="p-3">
                    {visibleList.map((user, index) => {
                        const isTop = user.rank <= 3;

                        return (
                            <motion.div
                                key={user.rank}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                className={`
                                flex items-center gap-3 p-3 rounded-xl mb-2
                                transition-all cursor-pointer
                                border
                                ${isTop
                                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                                        : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200'
                                    }
                            `}
                            >
                                <div
                                    className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center
                                    font-bold text-sm
                                    ${isTop ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-600'}
                                `}
                                >
                                    {user.rank}
                                </div>
                                <div
                                    className={`
                                    w-9 h-9 rounded-full flex items-center justify-center
                                    text-white text-sm font-semibold shadow
                                    ${isTop
                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                            : 'bg-gradient-to-br from-violet-400 to-purple-500'
                                        }
                                `}
                                >
                                    {user.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base">{user.emoji}</span>
                                        <span className="font-medium text-slate-800 text-sm truncate">
                                            {user.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Sparkles className={`w-3 h-3 ${isTop ? 'text-amber-500' : 'text-violet-400'}`} />
                                        <span className="text-xs text-slate-500">
                                            {user.points.toLocaleString()} pts
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={
                                        user.trend === 'up'
                                            ? 'text-emerald-500'
                                            : user.trend === 'down'
                                                ? 'text-red-400'
                                                : 'text-slate-400'
                                    }
                                >
                                    {user.trend === 'up' && (
                                        <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                            <TrendingUp className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                    {user.trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
                                    {user.trend === 'same' && <div className="w-4 h-0.5 bg-slate-300 rounded-full" />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 rounded-b-2xl">
                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "/leaderboard";
                            }}
                            className="mb-3 w-full arena-standalone-btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-10"
                        >
                            See More
                        </button>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow">
                                <Flame className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Your Rank</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-violet-600 text-lg">#42</span>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ContestCard Component
const ContestCard = ({ contest, index, onClick, isCompleted, timeLeft }) => {
    const Icon = iconMap[contest.icon] || Zap;



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: isCompleted ? 0 : -4, transition: { duration: 0.2 } }}
            onClick={onClick}
            className={`group relative ${contest.theme.bg} ${contest.theme.border} border rounded-2xl p-5 cursor-pointer overflow-hidden transition-all ${isCompleted ? 'opacity-50 hover:shadow-sm' : 'hover:shadow-lg'
                }`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${contest.theme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className={`absolute top-4 right-4 bg-gradient-to-r ${contest.theme.gradient} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5`}
            >
                <Zap className="w-4 h-4" />
                <span>{contest.points} pts</span>
            </motion.div>
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                >
                    <ChevronRight className="w-3 h-3" />
                    <span>Completed</span>
                </motion.div>
            )}
            <div className={`w-12 h-12 ${contest.theme.iconBg} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                <Icon className={`w-8 h-8 ${contest.theme.iconText}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{contest.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{contest.description}</p>
            <button className={`arena-standalone-btn w-full bg-gradient-to-r ${contest.theme.button} hover:opacity-90 text-white border-0 shadow-md group-hover:shadow-lg transition-all`}>
                <span>{contest.buttonText}</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
            {contest.taskType === "daily_checkin" && isCompleted && timeLeft && (
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Next in {timeLeft}</span>
                </div>
            )}
        </motion.div>
    );
};

// ContestModal Component
const ContestModal = ({ contest, isOpen, onClose, onComplete, isCompleted }) => {
    if (!contest) return null;
    const Icon = iconMap[contest.icon] || Zap;
    const rewardIconColor = contest.theme.iconBg.startsWith('bg-')
        ? contest.theme.iconBg.replace(/^bg-/, 'text-')
        : 'text-violet-500';

    const handleAction = () => {
        onComplete(contest);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="arena-standalone-modal-backdrop"
                    />
                    <div className="arena-standalone-modal-wrap">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="arena-standalone-modal"
                        >
                            <div className={`relative bg-gradient-to-r ${contest.theme.gradient} p-6 text-white`}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                                <div className="relative flex items-center gap-4">
                                    <div className={`w-16 h-16 ${contest.theme.iconBg} rounded-2xl flex items-center justify-center`}>
                                        <Icon className={`w-8 h-8 ${contest.theme.iconText}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{contest.title}</h2>
                                        <p className="text-white/80 mt-1">{contest.description}</p>
                                    </div>
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="absolute bottom-4 right-4 bg-white text-slate-800 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <span className="text-base">{contest.points} pts</span>
                                </motion.div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ScrollText className="w-5 h-5 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">Rules & Guidelines</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {contest.rules.map((rule, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + index * 0.1 }}
                                                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                                            >
                                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-semibold text-slate-600">{index + 1}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{rule}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Gift className="w-5 h-5 text-violet-600" />
                                        <h3 className="font-semibold text-slate-800">Rewards</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {contest.rewards.map((reward, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className={`flex items-center gap-3 p-3 ${contest.theme.bg} ${contest.theme.border} border rounded-xl`}
                                            >
                                                <CheckCircle2 className={`w-5 h-5 ${rewardIconColor}`} />
                                                <span className="text-sm font-medium text-slate-700">{reward}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0">
                                <button
                                    onClick={handleAction}
                                    disabled={isCompleted}
                                    className={`arena-standalone-btn w-full bg-gradient-to-r ${contest.theme.button} hover:opacity-90 text-white border-0 shadow-lg h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isCompleted ? 'Completed for Today' : contest.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const RedeemModal = ({ reward, isOpen, onClose }) => {
    const [addressType, setAddressType] = useState("home");
    const [address, setAddress] = useState("");

    if (!reward) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="arena-standalone-modal-backdrop"
                    />
                    <div className="arena-standalone-modal-wrap">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="arena-standalone-modal"
                        >
                            <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                                <div className="relative">
                                    <h3 className="text-2xl font-bold">Redeem Your Tokens</h3>
                                    <p className="text-white/80 mt-1 text-sm">Confirm reward delivery details</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <div>
                                        <div className="text-sm text-slate-500">Reward</div>
                                        <div className="text-lg font-semibold text-slate-800">{reward.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-500">Points</div>
                                        <div className="text-lg font-bold text-amber-600">{reward.points.toLocaleString()} pts</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Select Address Type</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                                        value={addressType}
                                        onChange={(e) => setAddressType(e.target.value)}
                                    >
                                        <option value="home">Home</option>
                                        <option value="office">Office</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                                        placeholder="Enter full delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Your Points</span>
                                        <span className="font-semibold">12,450 pts</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600 mt-1">
                                        <span>After Redeem</span>
                                        <span className="font-semibold">7,450 pts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="arena-standalone-btn w-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onClose}
                                    className="arena-standalone-btn w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                                >
                                    Confirm Redeem
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

// RewardsShowcase Component
const RewardsShowcase = ({ onRedeem }) => {
    const rewards = [
        { name: "Premium T-Shirt", points: 5000 },
        { name: "Steel Bottle", points: 3500 },
        { name: "Designer Keychain", points: 2000 },
        { name: "Summer Internship", points: 15000 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
        >
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-8 sm:p-12 shadow-xl overflow-hidden relative w-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 text-center">
                    <motion.div
                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="inline-block mb-6"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3 justify-center">
                            <Sparkles className="w-8 h-8 text-amber-500" />
                            Exclusive Rewards
                            <Sparkles className="w-8 h-8 text-amber-500" />
                        </h2>
                    </motion.div>

                    <DotLottieReact
                        src="https://lottie.host/773bdabd-bd62-4e05-b664-c1cf62a11094/Kue8cbS72H.lottie"
                        loop
                        autoplay
                    />

                    <div className="max-w-2xl mx-auto">
                        <p className="text-slate-600 mb-4 text-sm">Redeem your points for amazing prizes:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {rewards.map((reward, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    onClick={() => onRedeem?.(reward)}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-200 shadow-md flex items-center justify-between cursor-pointer hover:border-amber-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                        <span className="font-semibold text-slate-700">{reward.name}</span>
                                    </div>
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {reward.points.toLocaleString()} pts
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <motion.p
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-6 text-slate-600 font-medium"
                    >
                        Complete challenges to earn points and unlock rewards!
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};

// Main Arena Component// Main Arena Component
export default function ArenaStandalone() {
    const [selectedContest, setSelectedContest] = useState(null);
    const [selectedReward, setSelectedReward] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const queryClient = useQueryClient();

    const { data: completions = [] } = useQuery({
        queryKey: ['arenaStandaloneCompletions'],
        queryFn: () => base44.entities.DailyCompletion.list()
    });

    const createCompletionMutation = useMutation({
        mutationFn: (data) => base44.entities.DailyCompletion.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arenaStandaloneCompletions'] });
            toast.success('Task completed! Points added.');
        }
    });

    const getLatestTaskCompletion = (taskType) => {
        const taskCompletions = completions.filter(c => c.task_type === taskType);
        if (taskCompletions.length === 0) return null;
        return taskCompletions
            .slice()
            .sort((a, b) => {
                const aTime = new Date(a.completed_at || a.completed_date || 0).getTime();
                const bTime = new Date(b.completed_at || b.completed_date || 0).getTime();
                return bTime - aTime;
            })[0];
    };

    const isTaskCompletedToday = (taskType) => {
        if (taskType === "daily_checkin") {
            const latestCheckin = getLatestTaskCompletion("daily_checkin");
            if (!latestCheckin) return false;
            const completedTime = new Date(latestCheckin.completed_at || latestCheckin.completed_date);
            const nextTime = new Date(completedTime.getTime() + 24 * 60 * 60 * 1000);
            return nextTime > new Date();
        }
        const today = new Date().toISOString().split('T')[0];
        return completions.some(c => c.task_type === taskType && c.completed_date === today);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const latestCheckin = getLatestTaskCompletion("daily_checkin");
            if (!latestCheckin) {
                setTimeLeft(null);
                return;
            }

            const completedTime = new Date(latestCheckin.completed_at || latestCheckin.completed_date);
            const nextTime = new Date(completedTime.getTime() + 24 * 60 * 60 * 1000);
            const now = new Date();
            const diff = nextTime - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [completions]);

    const getLocalCompleted = () => {
        try {
            const raw = localStorage.getItem("arenaStandaloneCompleted");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    };

    const setLocalCompleted = (taskType) => {
        const current = getLocalCompleted();
        current[taskType] = new Date().toISOString();
        localStorage.setItem("arenaStandaloneCompleted", JSON.stringify(current));
    };

    const isTaskCompleted = (contest) => {
        if (!contest?.taskType) return false;
        if (contest.isDailyTask) return isTaskCompletedToday(contest.taskType);
        const local = getLocalCompleted();
        return Boolean(local[contest.taskType]);
    };

    const calculateStreak = () => {
        const checkins = completions.filter(c => c.task_type === 'daily_checkin');
        if (checkins.length === 0) return 0;

        const dates = checkins.map(c => new Date(c.completed_date)).sort((a, b) => b - a);
        let streak = 1;

        for (let i = 0; i < dates.length - 1; i++) {
            const diff = Math.floor((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
                streak++;
            } else if (diff > 1) {
                break;
            }
        }

        return streak;
    };

    const currentStreak = calculateStreak();

    const handleTaskComplete = (contest) => {
        if (contest.isDailyTask && isTaskCompletedToday(contest.taskType)) {
            toast.info('Already completed today! Come back tomorrow.');
            return;
        }

        if (contest.isDailyTask) {
            const nowIso = new Date().toISOString();
            createCompletionMutation.mutate({
                task_type: contest.taskType,
                completed_at: nowIso,
                completed_date: nowIso.split('T')[0],
                points_earned: contest.points
            });
        } else {
            setLocalCompleted(contest.taskType);
            toast.success('Task completed! Points added.');
        }

        setSelectedContest(null);
    };

    const contests = [
        {
            id: 1,
            title: "Sign Up Bonus",
            description: "Complete your profile setup",
            points: 500,
            icon: "UserPlus",
            theme: {
                gradient: "from-violet-500 to-purple-600",
                bg: "bg-violet-50",
                border: "border-violet-200",
                iconBg: "bg-violet-600",
                iconText: "text-white",
                button: "from-violet-500 to-purple-600"
            },
            buttonText: "Sign Up Now",
            taskType: "signup_bonus",
            rules: ["Sign Up for an account", "Verify your email address", "Complete your profile information", "One-time task, cannot be repeated"],

        },
        {
            id: 2,
            title: "Take a Survey",
            description: "Share your valuable feedback",
            points: 150,
            icon: "ClipboardList",
            theme: {
                gradient: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                iconBg: "bg-emerald-600",
                iconText: "text-white",
                button: "from-emerald-500 to-teal-600"
            },
            buttonText: "Start Survey",
            taskType: "survey",
            rules: ["Answer all questions honestly", "Complete survey within 10 minutes", "One survey per day limit", "Thoughtful responses earn bonus points"],
            rewards: ["150 Arena Points", "Chance for bonus 50 points", "Entry into weekly raffle"]
        },
        {
            id: 3,
            title: "Connect on LinkedIn",
            description: "Follow us on LinkedIn",
            points: 100,
            icon: "Linkedin",
            theme: {
                gradient: "from-blue-500 to-indigo-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                iconBg: "bg-blue-600",
                iconText: "text-white",
                button: "from-blue-500 to-indigo-600"
            },
            buttonText: "Connect Now",
            taskType: "linkedin_follow",
            rules: ["Follow our official LinkedIn page", "Like our latest post", "Share with your network for bonus", "Comment on any post for extra points"],
            rewards: ["100 Arena Points", "Professional network badge", "LinkedIn exclusive updates"]
        },
        {
            id: 4,
            title: "Follow on Instagram",
            description: "Join our Instagram community",
            points: 100,
            icon: "Instagram",
            theme: {
                gradient: "from-pink-500 to-rose-600",
                bg: "bg-pink-50",
                border: "border-pink-200",
                iconBg: "bg-pink-600",
                iconText: "text-white",
                button: "from-pink-500 to-rose-600"
            },
            buttonText: "Follow Us",
            taskType: "instagram_follow",
            rules: ["Follow our Instagram account", "Like our latest 3 posts", "Tag us in your story for bonus", "Use our hashtag in your posts"],
            rewards: ["100 Arena Points", "Social butterfly badge", "Featured in our stories"]
        },
        {
            id: 5,
            title: "Join Community",
            description: "Be part of our Discord family",
            points: 200,
            icon: "Users",
            theme: {
                gradient: "from-indigo-500 to-violet-600",
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                iconBg: "bg-indigo-600",
                iconText: "text-white",
                button: "from-indigo-500 to-violet-600"
            },
            buttonText: "Join Discord",
            taskType: "community_join",
            rules: ["Join our official Discord server", "Introduce yourself in #introductions", "Read and accept community guidelines", "Stay active for weekly bonuses"],
            rewards: ["200 Arena Points", "Community member role", "Access to exclusive channels"]
        },
        {
            id: 6,
            title: "Daily Check-in",
            description: "Claim your daily reward",
            points: 50,
            icon: "CalendarCheck",
            theme: {
                gradient: "from-sky-600 to-indigo-600",
                bg: "bg-sky-50",
                border: "border-sky-200",
                iconBg: "bg-sky-600",
                iconText: "text-white",
                button: "from-sky-600 to-indigo-600"
            },
            buttonText: "Check In",
            isDailyTask: true,
            taskType: "daily_checkin",
            rules: ["Check in once every 24 hours", "Maintain streak for multipliers", "7-day streak = 2x points", "30-day streak = 5x points"],
            rewards: ["50 Base Points", "Streak multiplier bonus", "Monthly streak badge"]
        },
        {
            id: 7,
            title: "Play Games",
            description: "Win points through mini-games",
            points: 75,
            icon: "Gamepad2",
            theme: {
                gradient: "from-cyan-500 to-blue-600",
                bg: "bg-cyan-50",
                border: "border-cyan-200",
                iconBg: "bg-cyan-600",
                iconText: "text-white",
                button: "from-cyan-500 to-blue-600"
            },
            buttonText: "Play Now",
            isDailyTask: true,
            taskType: "play_games",
            rules: ["Complete any available game", "Higher scores = more points", "3 attempts per game daily", "Weekly tournaments available"],
            rewards: ["Up to 75 Points per game", "Gamer badge", "Tournament eligibility"]
        },
        {
            id: 8,
            title: "Quiz Challenge",
            description: "Test your knowledge",
            points: 120,
            icon: "Brain",
            theme: {
                gradient: "from-fuchsia-500 to-pink-600",
                bg: "bg-fuchsia-50",
                border: "border-fuchsia-200",
                iconBg: "bg-fuchsia-600",
                iconText: "text-white",
                button: "from-fuchsia-500 to-pink-600"
            },
            buttonText: "Take Quiz",
            isDailyTask: true,
            taskType: "quiz",
            rules: ["Answer 10 questions correctly", "Time limit: 2 minutes", "Each correct answer = 12 points", "Perfect score = bonus 30 points"],
            rewards: ["Up to 150 Points", "Genius badge", "Leaderboard ranking boost"]
        }
    ];

    // ===== Infinite Carousel Logic =====
    const carouselRef = useRef(null);
    const x = useMotionValue(0);
    const isPausedRef = useRef(false);

    // duplicate contests for circular behavior
    const carouselItems = [...contests, ...contests];

    // auto scroll speed (px/sec)
    const AUTO_SCROLL_SPEED = 150;


    useAnimationFrame((t, delta) => {
        if (!carouselRef.current || isPausedRef.current) return;

        const moveBy = (delta / 1000) * AUTO_SCROLL_SPEED;
        x.set(x.get() - moveBy);

        const halfWidth = carouselRef.current.scrollWidth / 2;

        // circular wrap (ring buffer behavior)
        if (x.get() <= -halfWidth) {
            x.set(0);
        }
    });

    return (
        <>
            <style>{styles}</style>
            <div className="arena-standalone-page arena-scope">
                <HeroSlider />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <MilestoneTracker currentStreak={currentStreak} />
                    <div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Earn Points</h2>
                            <p className="text-slate-500 mt-1">Complete challenges to climb the leaderboard</p>
                        </motion.div>
                        <div className="relative overflow-hidden w-full mt-6">
                            <motion.div
                                ref={carouselRef}
                                onMouseEnter={() => (isPausedRef.current = true)}
                                onMouseLeave={() => (isPausedRef.current = false)}
                                className="flex gap-4 cursor-grab active:cursor-grabbing"
                                style={{ x }}
                                drag="x"
                                dragConstraints={{ left: -Infinity, right: Infinity }}
                                dragMomentum={true}
                                dragElastic={0.08}
                            >
                                {carouselItems
                                    .sort((a, b) => {
                                        if (a.isDailyTask && b.isDailyTask) {
                                            const aCompleted = isTaskCompletedToday(a.taskType);
                                            const bCompleted = isTaskCompletedToday(b.taskType);
                                            if (aCompleted && !bCompleted) return 1;
                                            if (!aCompleted && bCompleted) return -1;
                                        }
                                        return 0;
                                    })
                                    .map((contest, index) => (
                                        <div
                                            key={`${contest.id}-${index}`}
                                            className="min-w-[280px] sm:min-w-[320px]"
                                        >
                                            <ContestCard
                                                contest={contest}
                                                index={index}
                                                isCompleted={isTaskCompleted(contest)}
                                                timeLeft={timeLeft}
                                                onClick={() => setSelectedContest(contest)}
                                            />
                                        </div>
                                    ))}
                            </motion.div>
                        </div>
                    </div>
                    {/* ================= ROW 2: REWARDS + LEADERBOARD ================= */}
                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            lg:grid-cols-[7fr_3fr]
                            gap-8
                            items-stretch
                        "
                    >
                        <div className="h-full">
                            <RewardsShowcase onRedeem={setSelectedReward} />
                        </div>
                        <div className="h-full flex">
                            <Leaderboard />
                        </div>
                    </div>

                </div>
                <ContestModal
                    contest={selectedContest}
                    isOpen={!!selectedContest}
                    onClose={() => setSelectedContest(null)}
                    onComplete={handleTaskComplete}
                    isCompleted={isTaskCompleted(selectedContest)}
                />
                <RedeemModal
                    reward={selectedReward}
                    isOpen={!!selectedReward}
                    onClose={() => setSelectedReward(null)}
                />
            </div>
        </>
    );
}

