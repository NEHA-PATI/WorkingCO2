import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "@features/arena/styles/arenaglobals.css";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import {
    Trophy, Crown, Flame, Sparkles, TrendingUp, Star,
    ChevronLeft, ChevronRight, Check, Zap, X, CheckCircle2, Gift, ScrollText,
    UserPlus, ClipboardList, Linkedin, Instagram, Users, CalendarCheck, Gamepad2, Brain, Clock
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import arenaApi, { getArenaUserId } from '@features/arena/services/arenaApi';
import { useCountdown } from '@features/arena/hooks/useCountdown';
import a4 from "@features/arena/components/photos/a4.jpg";
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

.points-pill,
.completed-pill {
  position: absolute;
  top: 1rem;
  right: 1rem;
  min-width: 92px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  gap: 0.35rem;
  z-index: 10;
}

.points-pill {
  color: white;
  box-shadow: 0 10px 18px -10px rgba(0, 0, 0, 0.45);
}

.completed-pill {
  background: linear-gradient(90deg, rgb(34, 197, 94), rgb(22, 163, 74));
  color: white;
  box-shadow: 0 10px 18px -10px rgba(21, 128, 61, 0.45);
}

.cooldown-pill {
  position: absolute;
  top: 1rem;
  right: 1rem;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(71, 85, 105);
  z-index: 10;
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

const QUIZ_TASK_KEY = 'daily_quiz';

const DEFAULT_THEME = {
    gradient: "from-slate-500 to-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
    iconBg: "bg-slate-600",
    iconText: "text-white",
    button: "from-slate-600 to-slate-700"
};

const CONTEST_UI_CONFIG = {
    sign_up: {
        title: "Sign Up Bonus",
        description: "One-time signup reward",
        icon: "UserPlus",
        buttonText: "Claim Bonus",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-violet-500 to-purple-600",
            bg: "bg-violet-50",
            border: "border-violet-200",
            iconBg: "bg-violet-600",
            iconText: "text-white",
            button: "from-violet-500 to-purple-600"
        }
    },
    complete_profile: {
        title: "Complete Profile",
        description: "Finish your profile to unlock bonus points",
        icon: "UserPlus",
        buttonText: "Mark Complete",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-indigo-500 to-violet-600",
            bg: "bg-indigo-50",
            border: "border-indigo-200",
            iconBg: "bg-indigo-600",
            iconText: "text-white",
            button: "from-indigo-500 to-violet-600"
        }
    },
    take_survey: {
        title: "Take a Survey",
        description: "Share your feedback and claim points",
        icon: "ClipboardList",
        buttonText: "Start Survey",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            iconBg: "bg-emerald-600",
            iconText: "text-white",
            button: "from-emerald-500 to-teal-600"
        }
    },
    connect_linkedin: {
        title: "Connect on LinkedIn",
        description: "Follow us on LinkedIn",
        icon: "Linkedin",
        buttonText: "Connect Now",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            iconBg: "bg-blue-600",
            iconText: "text-white",
            button: "from-blue-500 to-indigo-600"
        }
    },
    connect_instagram: {
        title: "Follow on Instagram",
        description: "Join our Instagram community",
        icon: "Instagram",
        buttonText: "Follow Us",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-pink-500 to-rose-600",
            bg: "bg-pink-50",
            border: "border-pink-200",
            iconBg: "bg-pink-600",
            iconText: "text-white",
            button: "from-pink-500 to-rose-600"
        }
    },
    join_community: {
        title: "Join Community",
        description: "Be part of our community",
        icon: "Users",
        buttonText: "Join Community",
        rules: ["Configured from backend reward rules", "One-time task"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-cyan-500 to-blue-600",
            bg: "bg-cyan-50",
            border: "border-cyan-200",
            iconBg: "bg-cyan-600",
            iconText: "text-white",
            button: "from-cyan-500 to-blue-600"
        }
    },
    daily_checkin: {
        title: "Daily Check-in",
        description: "Claim your daily check-in points",
        icon: "CalendarCheck",
        buttonText: "Check In",
        rules: ["Available once every 24 hours", "Cooldown controlled by backend"],
        rewards: ["Daily points + streak progression"],
        theme: {
            gradient: "from-sky-600 to-indigo-600",
            bg: "bg-sky-50",
            border: "border-sky-200",
            iconBg: "bg-sky-600",
            iconText: "text-white",
            button: "from-sky-600 to-indigo-600"
        }
    },
    daily_quiz: {
        title: "Daily Quiz",
        description: "Submit your correct answers to earn points",
        icon: "Brain",
        buttonText: "Submit Score",
        rules: ["Enter number of correct answers", "Daily cap is from backend"],
        rewards: ["Points from reward_rules table"],
        theme: {
            gradient: "from-fuchsia-500 to-pink-600",
            bg: "bg-fuchsia-50",
            border: "border-fuchsia-200",
            iconBg: "bg-fuchsia-600",
            iconText: "text-white",
            button: "from-fuchsia-500 to-pink-600"
        }
    }
};

const humanizeTaskType = (taskType) => taskType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const backendMessage = error?.response?.data?.message;
    const backendReason = error?.response?.data?.data?.reason;

    if (backendMessage) return backendMessage;
    if (backendReason) return backendReason.replace(/_/g, ' ').toLowerCase();
    return error?.message || fallback;
};

const rankEmoji = (rank) => {
    if (rank === 1) return '\u{1F3C6}';
    if (rank === 2) return '\u{1F525}';
    if (rank === 3) return '\u26A1';
    if (rank <= 10) return '\u{1F31F}';
    return '\u2728';
};

const isScoreTask = (contest) => {
    if (!contest) return false;
    if (contest.taskType === 'daily_checkin') return false;
    if (contest.taskType === QUIZ_TASK_KEY) return true;

    const requiredScore = Number(contest.requiredScore ?? contest?.backend?.required_score);
    return Number.isFinite(requiredScore) && requiredScore > 0;
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
    }, [banners.length]);

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

const STREAK_WINDOW_DAYS = 30;
const STREAK_BONUS_TIERS = [
    { days: 7, points: 75 },
    { days: 14, points: 150 },
    { days: 30, points: 250 }
];

const StreakProgressPanel = ({
    currentStreak,
    longestStreak,
    lastCheckinDate,
    isLoading,
    isError,
    errorMessage
}) => {
    const [days, setDays] = useState([]);
    const safeCurrentStreak = Math.max(Number(currentStreak) || 0, 0);
    const safeLongestStreak = Math.max(Number(longestStreak) || 0, 0);
    const nextBonusTier = STREAK_BONUS_TIERS.find((tier) => safeCurrentStreak < tier.days) || null;
    const progressTarget = nextBonusTier ? nextBonusTier.days : STREAK_BONUS_TIERS[STREAK_BONUS_TIERS.length - 1].days;
    const progressValue = Math.min(safeCurrentStreak, progressTarget);
    const progressPercent = Math.max(0, Math.min((progressValue / progressTarget) * 100, 100));
    const earnedBonus = STREAK_BONUS_TIERS.reduce((sum, tier) => {
        if (safeCurrentStreak >= tier.days) return tier.points;
        return sum;
    }, 0);

    useEffect(() => {
        const now = new Date();
        const normalizedStreak = Math.max(0, Math.min(safeCurrentStreak, STREAK_WINDOW_DAYS));

        const generated = Array.from({ length: STREAK_WINDOW_DAYS }, (_, index) => {
            const dayOffset = STREAK_WINDOW_DAYS - 1 - index;
            const date = new Date(now);
            date.setHours(0, 0, 0, 0);
            date.setDate(now.getDate() - dayOffset);

            const isActive = index >= STREAK_WINDOW_DAYS - normalizedStreak;
            const distanceFromToday = STREAK_WINDOW_DAYS - 1 - index;

            let intensity = 'inactive';
            if (isActive && distanceFromToday <= 1) intensity = 'bright';
            else if (isActive && distanceFromToday <= 4) intensity = 'medium';
            else if (isActive) intensity = 'soft';

            return {
                index,
                date,
                isActive,
                isToday: index === STREAK_WINDOW_DAYS - 1,
                intensity
            };
        });

        setDays(generated);
    }, [safeCurrentStreak]);

    if (isLoading) {
        return (
            <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <p className="text-sm text-slate-500">Loading streak progress...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <p className="text-sm text-rose-600">Unable to load streak right now.</p>
                <p className="text-xs text-slate-500 mt-1">{errorMessage || 'Please try again in a moment.'}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Streak Progress</h3>
                    <p className="text-xs text-slate-500 mt-1">Daily action reduces carbon. Keep your run alive.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        {safeCurrentStreak} days
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-2.5 py-1 text-xs font-semibold">
                        <Crown className="w-3.5 h-3.5" />
                        Best {safeLongestStreak}
                    </span>
                </div>
            </div>

            {lastCheckinDate && (
                <p className="text-[11px] text-slate-400 mb-3">Last check-in: {lastCheckinDate}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {STREAK_BONUS_TIERS.map((tier) => {
                    const unlocked = safeCurrentStreak >= tier.days;
                    return (
                        <div
                            key={tier.days}
                            className={`rounded-xl border px-3 py-2 text-center transition-all ${unlocked
                                ? 'border-emerald-300 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                                : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                        >
                            <p className="text-xs font-semibold">Streak Bonus</p>
                            <p className="text-sm font-bold mt-0.5">{tier.days} days - +{tier.points} pts</p>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-600">
                        {nextBonusTier
                            ? `${safeCurrentStreak}/${nextBonusTier.days} days to +${nextBonusTier.points} points`
                            : 'All streak rewards unlocked'}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700">Active bonus: +{earnedBonus} pts</p>
                </div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
                    />
                </div>
            </div>

            <div className="mt-4 overflow-x-auto pb-1">
                <div className="flex items-end gap-1.5 min-w-max">
                    {days.map((day, index) => {
                        const barBase = 'bg-slate-200 border border-slate-300';
                        const barColor = day.intensity === 'bright'
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 border-emerald-500'
                            : day.intensity === 'medium'
                                ? 'bg-gradient-to-t from-emerald-500 to-teal-300 border-emerald-400'
                                : day.intensity === 'soft'
                                    ? 'bg-gradient-to-t from-emerald-400 to-emerald-300 border-emerald-300'
                                    : barBase;

                        const dateLabel = day.date.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        });

                        return (
                            <div key={dateLabel} className="group relative" title={dateLabel}>
                                <motion.div
                                    initial={{ opacity: 0, scaleY: 0.4 }}
                                    animate={{
                                        opacity: 1,
                                        scaleY: day.isActive ? 1 : 0.65
                                    }}
                                    transition={{
                                        delay: index * 0.015,
                                        duration: 0.35
                                    }}
                                    className={`w-3 sm:w-3.5 h-10 sm:h-12 rounded-md origin-bottom ${barColor} ${day.isToday ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
                                >
                                    {day.isToday && (
                                        <motion.div
                                            className="w-full h-full rounded-md"
                                            animate={{ opacity: [0.45, 0.95, 0.45] }}
                                            transition={{ duration: 1.6, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md bg-slate-900 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {dateLabel}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
// Leaderboard Component
const Leaderboard = ({ leaderboardData, isLoading, myRank, onSeeMore }) => {
    const maxVisible = 7;
    const visibleList = leaderboardData.slice(0, maxVisible);

    return (
        <div className="w-full">
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
                    {isLoading && (
                        <div className="py-8 text-center text-sm text-slate-500">Loading leaderboard...</div>
                    )}
                    {!isLoading && visibleList.length === 0 && (
                        <div className="py-8 text-center text-sm text-slate-500">No leaderboard data available.</div>
                    )}

                    {!isLoading && visibleList.map((user, index) => {
                        const isTop = user.rank <= 3;

                        return (
                            <motion.div
                                key={`${user.rank}-${user.u_id}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all cursor-pointer border ${isTop ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300' : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isTop ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {user.rank}
                                </div>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow ${isTop ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-violet-400 to-purple-500'}`}>
                                    {user.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base">{user.emoji}</span>
                                        <span className="font-medium text-slate-800 text-sm truncate">{user.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Sparkles className={`w-3 h-3 ${isTop ? 'text-amber-500' : 'text-violet-400'}`} />
                                        <span className="text-xs text-slate-500">{user.points.toLocaleString()} pts</span>
                                    </div>
                                </div>
                                <div className="text-emerald-500">
                                    <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                        <TrendingUp className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onSeeMore}
                        className="mb-3 w-full arena-standalone-btn bg-violet-600 border border-violet-600 text-white hover:bg-violet-700 h-10"
                    >
                        See More
                    </button>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow">
                                <Flame className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Your Rank</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-violet-600 text-lg">{myRank !== null && myRank !== undefined ? `#${myRank}` : '--'}</span>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ContestCard Component
const ContestCard = ({ contest, index, onClick, state, onCooldownExpired }) => {
    const Icon = iconMap[contest.icon] || Zap;
    const cooldownTarget = state === 'COOLDOWN' ? contest.backend?.next_available_at : null;
    const { formatted: cooldownText, isExpired } = useCountdown(cooldownTarget);

    useEffect(() => {
        if (state === 'COOLDOWN' && isExpired) {
            onCooldownExpired?.();
        }
    }, [state, isExpired, onCooldownExpired]);

    const effectiveState = state === 'COOLDOWN' && isExpired ? 'AVAILABLE' : state;
    const isCompleted = effectiveState === 'COMPLETED';
    const isCooldown = effectiveState === 'COOLDOWN';
    const isUnavailable = isCompleted || isCooldown;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: isUnavailable ? 0 : -4, transition: { duration: 0.2 } }}
            onClick={() => onClick(contest.taskType)}
            className={`group relative ${contest.theme.bg} ${contest.theme.border} border rounded-2xl p-5 cursor-pointer overflow-hidden transition-all ${isCompleted ? 'opacity-70 hover:shadow-sm' : 'hover:shadow-lg'}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${contest.theme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            {isCooldown ? (
                <div className="cooldown-pill">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cooldownText}</span>
                </div>
            ) : isCompleted ? (
                <div className="completed-pill">
                    <Check className="w-3.5 h-3.5" />
                    <span>Completed</span>
                </div>
            ) : (
                <div className={`points-pill bg-gradient-to-r ${contest.theme.gradient}`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{Number(contest.points || 0).toLocaleString()} pts</span>
                </div>
            )}
            <div className={`w-12 h-12 ${contest.theme.iconBg} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                <Icon className={`w-8 h-8 ${contest.theme.iconText}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{contest.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{contest.description}</p>
            <button
                className={`arena-standalone-btn w-full border-0 shadow-md transition-all ${isCooldown ? 'bg-slate-100 text-slate-500' : isCompleted ? 'bg-emerald-100 text-emerald-700' : `bg-gradient-to-r ${contest.theme.button} hover:opacity-90 text-white group-hover:shadow-lg`}`}
                disabled={isUnavailable}
            >
                <span>
                    {isCompleted
                        ? 'Completed'
                        : isCooldown
                            ? 'On Cooldown'
                            : contest.buttonText}
                </span>
                {!isUnavailable && (
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                )}
            </button>
        </motion.div>
    );
};

// ContestModal Component
const ContestModal = ({
    contest,
    isOpen,
    onClose,
    onComplete,
    isSubmitting,
    state,
    onCooldownExpired
}) => {
    const [scoreInput, setScoreInput] = useState('');

    const cooldownTarget = state === 'COOLDOWN' ? contest?.backend?.next_available_at : null;
    const { formatted: cooldownText, isExpired } = useCountdown(cooldownTarget);

    useEffect(() => {
        if (state === 'COOLDOWN' && isExpired) {
            onCooldownExpired?.();
        }
    }, [state, isExpired, onCooldownExpired]);

    useEffect(() => {
        if (!isOpen || !contest) return;
        setScoreInput('');
    }, [isOpen, contest, contest?.taskType]);

    if (!contest) return null;

    const Icon = iconMap[contest.icon] || Zap;
    const rewardIconColor = contest.theme.iconBg.startsWith('bg-')
        ? contest.theme.iconBg.replace(/^bg-/, 'text-')
        : 'text-violet-500';
    const contestUsesScoreInput = isScoreTask(contest);
    const effectiveState = state === 'COOLDOWN' && isExpired ? 'AVAILABLE' : state;
    const hasValidScore = scoreInput.trim() !== '' && Number.isFinite(Number(scoreInput));

    const canComplete = () => {
        if (isSubmitting) return false;
        if (effectiveState === 'COMPLETED' || effectiveState === 'COOLDOWN') return false;
        if (contestUsesScoreInput) return hasValidScore;
        return true;
    };

    const handleAction = () => {
        if (contestUsesScoreInput && !hasValidScore) {
            toast.error('Enter a valid score.');
            return;
        }
        const payload = contestUsesScoreInput ? { score: Number(scoreInput) } : {};
        onComplete(contest, payload);
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
                                {effectiveState === 'COOLDOWN' ? (
                                    <div className="absolute bottom-4 right-4 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{cooldownText}</span>
                                    </div>
                                ) : effectiveState === 'COMPLETED' ? (
                                    <div className="absolute bottom-4 right-4 text-sm font-semibold bg-green-500 px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <Check className="w-4 h-4" />
                                        <span>Completed</span>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="absolute bottom-4 right-4 bg-white text-slate-800 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                                    >
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        <span className="text-base">{Number(contest.points || 0).toLocaleString()} pts</span>
                                    </motion.div>
                                )}
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
                                {contestUsesScoreInput && (
                                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                                        <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-slate-800">Score Submission</h4>
                                            <p className="text-xs text-slate-500 mt-1">Submit your latest score to claim points.</p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={scoreInput}
                                                onChange={(e) => setScoreInput(e.target.value)}
                                                className="flex-1 h-11 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                                                placeholder="Enter your latest score"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 pt-0">
                                <button
                                    onClick={handleAction}
                                    disabled={!canComplete()}
                                    className={`arena-standalone-btn w-full bg-gradient-to-r ${contest.theme.button} hover:opacity-90 text-white border-0 shadow-lg h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {effectiveState === 'COMPLETED'
                                        ? 'Completed'
                                        : effectiveState === 'COOLDOWN'
                                            ? `Available in ${cooldownText}`
                                            : contestUsesScoreInput
                                                ? 'Complete & Claim Points'
                                                : contest.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const pointsHistoryButtonStyles = `
  .pts-btn-wrap * { box-sizing: border-box; }

  .pts-btn {
    font-family: "Outfit", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 14px;
    border: 1.5px solid #6ee7b7;
    background: linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
    color: #065f46;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, border-color 0.2s ease;
    box-shadow: 0 1px 3px rgba(16,185,129,0.12), 0 4px 16px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
    letter-spacing: -0.01em;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    white-space: nowrap;
  }

  .pts-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, rgba(255,255,255,0.6) 0%, transparent 60%);
    pointer-events: none;
    border-radius: inherit;
  }

  .pts-btn:hover {
    transform: translateY(-2px) scale(1.01);
    border-color: #34d399;
    box-shadow: 0 2px 8px rgba(16,185,129,0.15), 0 12px 32px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.9);
  }

  .pts-btn:active {
    transform: translateY(-1px) scale(0.99);
    transition-duration: 0.08s;
  }

  .pts-btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
    transform: skewX(-15deg);
    pointer-events: none;
  }

  .pts-btn:hover .pts-btn-shine {
    animation: shineSweep 0.5s ease forwards;
  }

  @keyframes shineSweep {
    to { left: 160%; }
  }

  .pts-leaf {
    display: inline-flex;
    animation: leafSway 3.5s ease-in-out infinite;
    transform-origin: bottom center;
    filter: drop-shadow(0 1px 2px rgba(16,185,129,0.3));
  }

  @keyframes leafSway {
    0%,100% { transform: rotate(-6deg); }
    50% { transform: rotate(7deg); }
  }

  .pts-coin-icon {
    position: relative;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .pts-coin-icon .c {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid #34d399;
  }

  .pts-coin-icon .c1 {
    width: 17px;
    height: 17px;
    top: 4px;
    left: 2px;
    background: radial-gradient(circle at 35% 30%, #a7f3d0, #34d399 60%, #059669);
    box-shadow: 0 2px 4px rgba(5,150,105,0.4);
    animation: coinBob 2s ease-in-out infinite;
  }

  .pts-coin-icon .c2 {
    width: 15px;
    height: 15px;
    top: 1px;
    left: 4px;
    background: radial-gradient(circle at 35% 30%, #d1fae5, #6ee7b7 60%, #10b981);
    box-shadow: 0 1px 3px rgba(5,150,105,0.3);
    animation: coinBob 2s ease-in-out infinite 0.15s;
  }

  .pts-coin-icon .c-sym {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 800;
    color: #065f46;
    font-family: Georgia, serif;
    z-index: 2;
    animation: coinBob 2s ease-in-out infinite;
  }

  @keyframes coinBob {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }

  .pts-arrow {
    display: inline-flex;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
    opacity: 0.7;
  }

  .pts-btn:hover .pts-arrow {
    transform: translateX(4px);
    opacity: 1;
  }

  .pts-particle {
    position: fixed;
    pointer-events: none;
    border-radius: 50%;
    z-index: 9999;
    will-change: transform, opacity;
  }

  @keyframes particleUp {
    0% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0.3) rotate(var(--dr)); opacity: 0; }
  }

  .pts-ripple {
    position: fixed;
    border-radius: 50%;
    border: 2px solid #34d399;
    pointer-events: none;
    z-index: 9998;
    animation: rippleOut 0.7s ease-out forwards;
  }

  @keyframes rippleOut {
    from { transform: scale(0.3); opacity: 0.9; }
    to { transform: scale(3.5); opacity: 0; }
  }
`;

const spawnPointsParticles = (x, y) => {
    const coins = 12;
    const sparks = 8;
    const particles = [];

    for (let i = 0; i < coins; i++) {
        const angle = (i / coins) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = 55 + Math.random() * 55;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 25;
        const size = 11 + Math.random() * 9;
        const colors = [
            'radial-gradient(circle at 35% 30%, #a7f3d0, #34d399 60%, #059669)',
            'radial-gradient(circle at 35% 30%, #d1fae5, #6ee7b7 55%, #10b981)',
            'radial-gradient(circle at 35% 30%, #fef9c3, #fde68a 55%, #d97706)'
        ];

        particles.push({
            id: `${Date.now()}-c${i}`,
            type: 'coin',
            x,
            y,
            dx,
            dy,
            dr: `${(Math.random() - 0.5) * 600}deg`,
            size,
            bg: colors[i % 3],
            delay: i * 28,
            dur: 680 + Math.random() * 300,
            sym: ['*', 'o', '+'][i % 3]
        });
    }

    for (let i = 0; i < sparks; i++) {
        const angle = (i / sparks) * Math.PI * 2;
        const dist = 28 + Math.random() * 28;
        particles.push({
            id: `${Date.now()}-s${i}`,
            type: 'spark',
            x,
            y,
            dx: Math.cos(angle) * dist,
            dy: Math.sin(angle) * dist - 8,
            dr: '0deg',
            size: 3 + Math.random() * 3,
            bg: '#34d399',
            delay: i * 18,
            dur: 400 + Math.random() * 180,
            sym: ''
        });
    }

    return particles;
};

const PointsParticle = ({ particle, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDone(particle.id), particle.delay + particle.dur + 60);
        return () => clearTimeout(timer);
    }, [particle.id, particle.delay, particle.dur, onDone]);

    return (
        <div
            className="pts-particle"
            style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                background: particle.bg,
                border: particle.type === 'coin' ? '1px solid rgba(52,211,153,0.5)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: particle.size * 0.42,
                color: '#065f46',
                fontWeight: 800,
                boxShadow: particle.type === 'coin' ? '0 1px 5px rgba(5,150,105,0.45)' : 'none',
                '--dx': `${particle.dx}px`,
                '--dy': `${particle.dy}px`,
                '--dr': particle.dr,
                animation: `particleUp ${particle.dur}ms cubic-bezier(.25,.46,.45,.94) ${particle.delay}ms both`
            }}
        >
            {particle.sym}
        </div>
    );
};

const PointsRipple = ({ x, y, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(onDone, 700);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <div
            className="pts-ripple"
            style={{ left: x - 20, top: y - 20, width: 40, height: 40 }}
        />
    );
};

const PointsHistoryButton = ({ onOpen }) => {
    const [particles, setParticles] = useState([]);
    const [ripples, setRipples] = useState([]);
    const btnRef = useRef(null);
    const navigateTimerRef = useRef(null);

    useEffect(() => () => {
        if (navigateTimerRef.current) {
            clearTimeout(navigateTimerRef.current);
        }
    }, []);

    const handleClick = () => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) {
            onOpen?.();
            return;
        }

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        setParticles((prev) => [...prev, ...spawnPointsParticles(cx, cy)]);
        setRipples((prev) => [...prev, { id: `${Date.now()}`, x: cx, y: cy }]);

        navigateTimerRef.current = setTimeout(() => {
            onOpen?.();
        }, 220);
    };

    return (
        <>
            <style>{pointsHistoryButtonStyles}</style>
            {particles.map((particle) => (
                <PointsParticle
                    key={particle.id}
                    particle={particle}
                    onDone={(id) => setParticles((prev) => prev.filter((item) => item.id !== id))}
                />
            ))}
            {ripples.map((ripple) => (
                <PointsRipple
                    key={ripple.id}
                    x={ripple.x}
                    y={ripple.y}
                    onDone={() => setRipples((prev) => prev.filter((item) => item.id !== ripple.id))}
                />
            ))}
            <div className="pts-btn-wrap">
                <button
                    ref={btnRef}
                    type="button"
                    className="pts-btn"
                    onClick={handleClick}
                >
                    <div className="pts-btn-shine" />
                    <div className="pts-coin-icon">
                        <div className="c c2" />
                        <div className="c c1" />
                        <div className="c-sym">*</div>
                    </div>
                    <span>View Points History</span>
                    <span className="pts-leaf">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C6.5 2 2 8 2 13.5C2 17.09 4.24 20.14 7.4 21.5C7 19.5 7 17 8.5 15C10 13 12 13 12 13C12 13 14 13 15.5 15C17 17 17 19.5 16.6 21.5C19.76 20.14 22 17.09 22 13.5C22 8 17.5 2 12 2Z"
                                fill="#34d399"
                                stroke="#059669"
                                strokeWidth="0.5"
                            />
                            <path d="M12 13 L12 22" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </span>
                    <span className="pts-arrow">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </div>
        </>
    );
};

// RewardsShowcase Component
// RewardsShowcase Component
const RewardsShowcase = ({ rewards, isLoading, onSeeMore }) => {
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
                        {/* <p className="text-slate-600 mb-4 text-sm">Redeem your Arena points for real-world rewards. See full catalog for details.</p> */}
                        {isLoading ? (
                            <div className="py-10 text-center text-sm text-slate-500">Loading rewards...</div>
                        ) : rewards.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-500">Rewards catalog is currently unavailable.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {rewards.map((reward, index) => (
                                    <motion.div
                                        key={reward.reward_id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.08 }}
                                        className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-100 border border-amber-200 flex-shrink-0">
                                                {reward.image_url ? (
                                                    <img src={reward.image_url} alt={reward.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-amber-700 text-xs font-semibold">IMG</div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{reward.name}</p>
                                                <p className="text-xs text-slate-500">Rs. {Number(reward.price_inr || 0).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                                            <Zap className="w-3 h-3" />
                                            {Number(reward.points || 0).toLocaleString()} pts
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                    <motion.p
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-6 text-slate-600 font-medium"
                    >
                        Redeem your Arena points for real-world rewards. See full catalog for details.
                    </motion.p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={onSeeMore}
                            className="arena-standalone-btn bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                        >
                            See More
                        </button>

                    </div>

                </div>
            </div>
        </motion.div>
    );
};
// Main Arena Component// Main Arena Component
export default function ArenaStandalone() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedContestTask, setSelectedContestTask] = useState(null);
    const userId = useMemo(() => getArenaUserId(), []);
    const hasAuthUser = Boolean(userId);

    const contestMetadataQuery = useQuery({
        queryKey: ['arenaContestMetadata'],
        queryFn: () => arenaApi.getContestMetadata(),
        staleTime: 60 * 1000
    });

    const contestStatusQuery = useQuery({
        queryKey: ['arenaContestStatus'],
        queryFn: () => arenaApi.getContestStatus(),
        enabled: hasAuthUser,
        refetchInterval: 30 * 1000
    });

    const streakQuery = useQuery({
        queryKey: ['arenaStreak'],
        queryFn: () => arenaApi.getStreak(),
        enabled: hasAuthUser,
        refetchInterval: 30 * 1000
    });

    const leaderboardQuery = useQuery({
        queryKey: ['arenaLeaderboard', 'monthly', 1, 10],
        queryFn: () => arenaApi.getLeaderboard({ type: 'monthly', page: 1, limit: 10 })
    });

    const myRankQuery = useQuery({
        queryKey: ['arenaMyRank'],
        queryFn: () => arenaApi.getMyRank(),
        enabled: hasAuthUser
    });

    const rewardsPreviewQuery = useQuery({
        queryKey: ['arenaRewardPreview', 1, 4],
        queryFn: () => arenaApi.getRewardCatalog({ page: 1, limit: 4 })
    });

    const invalidateArenaData = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['arenaContestStatus'] });
        queryClient.invalidateQueries({ queryKey: ['arenaStreak'] });
        queryClient.invalidateQueries({ queryKey: ['arenaLeaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['arenaMyRank'] });
        queryClient.invalidateQueries({ queryKey: ['arenaRewardPreview'] });
    }, [queryClient]);

    const completeTaskMutation = useMutation({
        mutationFn: async ({ contest, score }) => {
            if (contest.taskType === 'daily_checkin') return arenaApi.completeDailyCheckin();
            if (contest.taskType === QUIZ_TASK_KEY) return arenaApi.completeDailyQuiz(score);
            if (isScoreTask(contest)) return arenaApi.completeScoreTask(contest.taskType, score);
            return arenaApi.completeOneTimeTask(contest.taskType);
        },
        onSuccess: (result) => {
            if (result?.awarded === false) {
                toast.info(getErrorMessage({ response: { data: { data: { reason: result?.reason } } } }, 'Task not completed.'));
                return;
            }
            toast.success('Task completed! Points added.');
            setSelectedContestTask(null);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Unable to complete task right now.'));
        },
        onSettled: () => {
            invalidateArenaData();
        }
    });

    const statusByTask = useMemo(() => {
        const statusList = contestStatusQuery.data || [];
        return statusList.reduce((acc, item) => {
            acc[item.task_type] = item;
            return acc;
        }, {});
    }, [contestStatusQuery.data]);

    const mergedContests = useMemo(() => {
        const metadataList = contestMetadataQuery.data || [];

        return metadataList.map((metadata, index) => {
            const backend = statusByTask[metadata.task_type] || {};
            const configuredActionType = metadata.action_type || backend.action_type || (metadata.repeatable ? 'daily' : 'one_time');
            const configuredUi = CONTEST_UI_CONFIG[metadata.task_type] || {};

            return {
                id: index + 1,
                taskType: metadata.task_type,
                title: configuredUi.title || humanizeTaskType(metadata.task_type),
                description: configuredUi.description || 'Task configured from backend reward rules',
                icon: configuredUi.icon || (configuredActionType === 'daily' ? 'CalendarCheck' : 'Zap'),
                theme: configuredUi.theme || DEFAULT_THEME,
                buttonText: configuredUi.buttonText || (configuredActionType === 'daily' ? 'Claim Points' : 'Complete Task'),
                rules: configuredUi.rules || ['Configured from backend reward rules'],
                rewards: configuredUi.rewards || ['Points from reward_rules table'],
                requiredScore: metadata.required_score ?? null,
                points: Number(metadata.points ?? backend.points ?? 0),
                backend: {
                    ...backend,
                    action_type: backend.action_type || configuredActionType,
                    repeatable: backend.repeatable ?? metadata.repeatable ?? (configuredActionType === 'daily'),
                    required_score: backend.required_score ?? metadata.required_score ?? null,
                    points: Number(backend.points ?? metadata.points ?? 0)
                }
            };
        });
    }, [contestMetadataQuery.data, statusByTask]);

    const getContestState = useCallback((contest) => {
        const backend = contest?.backend || {};
        const nextAvailableAt = backend.next_available_at ? new Date(backend.next_available_at).getTime() : null;
        const cooldownActive = Boolean(nextAvailableAt && nextAvailableAt > Date.now());
        if (cooldownActive) return 'COOLDOWN';
        if (backend.completed) return 'COMPLETED';
        return 'AVAILABLE';
    }, []);

    const sortedContests = useMemo(() => {
        const priority = { AVAILABLE: 0, COMPLETED: 1, COOLDOWN: 2 };
        return [...mergedContests].sort((a, b) => priority[getContestState(a)] - priority[getContestState(b)]);
    }, [mergedContests, getContestState]);

    const selectedContest = useMemo(
        () => mergedContests.find((contest) => contest.taskType === selectedContestTask) || null,
        [mergedContests, selectedContestTask]
    );

    const selectedContestState = useMemo(
        () => (selectedContest ? getContestState(selectedContest) : 'AVAILABLE'),
        [selectedContest, getContestState]
    );

    const handleTaskComplete = (contest, payload = {}) => {
        completeTaskMutation.mutate({ contest, score: payload.score });
    };

    const handleCooldownExpired = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['arenaContestStatus'] });
    }, [queryClient]);

    const currentStreak = Number(streakQuery.data?.current_streak || 0);
    const longestStreak = Number(streakQuery.data?.longest_streak || 0);
    const lastCheckinDate = streakQuery.data?.last_checkin_date || null;
    const leaderboardData = useMemo(() => {
        const items = leaderboardQuery.data?.data || [];
        return items.map((item) => {
            const username = item.username ? String(item.username).trim() : '';
            const userIdLabel = item.u_id || `User-${item.rank}`;
            const displayName = username || `User ${String(userIdLabel).slice(-6)}`;
            return {
                ...item,
                name: displayName,
                avatar: displayName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'AR',
                emoji: rankEmoji(item.rank)
            };
        });
    }, [leaderboardQuery.data]);
    const rewardsPreview = rewardsPreviewQuery.data?.data || [];

    // ===== Infinite Carousel Logic =====
    const carouselRef = useRef(null);
    const x = useMotionValue(0);
    const isPausedRef = useRef(false);

    // duplicate contests for circular behavior
    const carouselItems = [...sortedContests, ...sortedContests];

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
                    <StreakProgressPanel
                        currentStreak={currentStreak}
                        longestStreak={longestStreak}
                        lastCheckinDate={lastCheckinDate}
                        isLoading={streakQuery.isLoading}
                        isError={streakQuery.isError}
                        errorMessage={streakQuery.error?.message}
                    />
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Earn Points</h2>
                                <p className="text-slate-500 mt-1">Complete challenges to climb the leaderboard</p>
                            </div>
                            <PointsHistoryButton onOpen={() => navigate('/arena/history')} />


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
                                {carouselItems.map((contest, index) => (
                                    <div
                                        key={`${contest.id}-${index}`}
                                        className="min-w-[280px] sm:min-w-[320px]"
                                    >
                                        <ContestCard
                                            contest={contest}
                                            index={index}
                                            state={getContestState(contest)}
                                            onClick={setSelectedContestTask}
                                            onCooldownExpired={handleCooldownExpired}
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
                            <RewardsShowcase
                                rewards={rewardsPreview}
                                isLoading={rewardsPreviewQuery.isLoading}
                                onSeeMore={() => navigate('/arena/rewards')}
                            />
                        </div>
                        <div className="h-full flex">
                            <Leaderboard
                                leaderboardData={leaderboardData}
                                isLoading={leaderboardQuery.isLoading}
                                myRank={myRankQuery.data}
                                onSeeMore={() => navigate('/arena/leaderboard')}
                            />
                        </div>
                    </div>
                </div>
                <ContestModal
                    contest={selectedContest}
                    isOpen={!!selectedContest}
                    onClose={() => setSelectedContestTask(null)}
                    onComplete={handleTaskComplete}
                    isSubmitting={completeTaskMutation.isPending}
                    state={selectedContestState}
                    onCooldownExpired={handleCooldownExpired}
                />
            </div>
        </>
    );
}

