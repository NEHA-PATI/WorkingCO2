import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarClock, ChevronLeft, ChevronRight, CircleDot, Flame, Shield, Trophy, Globe } from 'lucide-react';
import '@features/arena/styles/arenaglobals.css';
import '@features/arena/styles/history.css';
import arenaApi from '@features/arena/services/arenaApi';

const PAGE_SIZE = 12;
const STREAK_BADGE_TIERS = [
    {
        days: 3,
        label: 'Eco Starter',
        icon: Flame,
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        days: 7,
        label: 'Green Warrior',
        icon: Shield,
        gradient: 'from-teal-500 to-cyan-500'
    },
    {
        days: 15,
        label: 'Sustainability Champion',
        icon: Trophy,
        gradient: 'from-lime-500 to-emerald-500'
    },
    {
        days: 30,
        label: 'Carbon Hero',
        icon: Globe,
        gradient: 'from-emerald-600 to-green-500'
    }
];

const formatTaskName = (actionKey) => {
    if (!actionKey) return 'Unknown task';
    return actionKey
        .replace(/^redeem_/, 'Redeemed: ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (iso) => {
    if (!iso) return '--';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '--';
    return {
        date: parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: parsed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
};

const deriveBadge = (item) => {
    if (item.action_type === 'consistency') {
        return `${item.milestone_weeks || ''} Week Consistency`;
    }
    if (Number(item.points) >= 100) {
        return 'High Impact';
    }
    return '--';
};

export default function ArenaHistoryPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const historyQuery = useQuery({
        queryKey: ['arenaRewardHistory', page, PAGE_SIZE],
        queryFn: () => arenaApi.getRewardHistory({ page, limit: PAGE_SIZE })
    });

    const streakQuery = useQuery({
        queryKey: ['arenaStreakHistoryBadges'],
        queryFn: () => arenaApi.getStreak()
    });

    const items = historyQuery.data?.data || [];
    const totalPages = historyQuery.data?.totalPages || 1;
    const totalItems = historyQuery.data?.total || 0;
    const currentStreak = Number(streakQuery.data?.current_streak || 0);
    const longestStreak = Number(streakQuery.data?.longest_streak || 0);
    const streakBadges = useMemo(() => (
        STREAK_BADGE_TIERS.map((badge) => ({
            ...badge,
            unlocked: currentStreak >= badge.days
        }))
    ), [currentStreak]);

    const headerLabel = useMemo(() => {
        if (!totalItems) return 'No history found';
        const start = (page - 1) * PAGE_SIZE + 1;
        const end = Math.min(page * PAGE_SIZE, totalItems);
        return `Showing ${start}-${end} of ${totalItems}`;
    }, [page, totalItems]);

    return (
        <div className="arena-history-page arena-scope">
            <div className="arena-history-container">
                <div className="arena-history-header">
                    <button
                        type="button"
                        onClick={() => navigate('/arena-standalone')}
                        className="arena-history-back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Arena
                    </button>
                    <div>
                        <h1 className="arena-history-title">Points History</h1>
                        <p className="arena-history-subtitle">Structured activity timeline for Arena points.</p>
                    </div>
                </div>

                <div className="arena-history-summary">
                    <div className="arena-history-summary-left">
                        <CalendarClock className="w-5 h-5" />
                        <span>{headerLabel}</span>
                    </div>
                </div>

                <div className="arena-history-layout">
                    <aside className="arena-history-left">
                        <h2>Streak Badges</h2>
                        <p>Consistency grows forests. Build daily check-ins to unlock sustainability milestones.</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1">
                                <Flame className="w-3.5 h-3.5" />
                                Current: {currentStreak}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1">
                                <Trophy className="w-3.5 h-3.5" />
                                Longest: {longestStreak}
                            </span>
                        </div>

                        {streakQuery.isLoading ? (
                            <div className="arena-history-badge-placeholder mt-4">Loading badges...</div>
                        ) : streakQuery.isError ? (
                            <div className="arena-history-badge-placeholder mt-4">Unable to load streak badges.</div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {streakBadges.map((badge, index) => {
                                    const Icon = badge.icon;
                                    return (
                                        <motion.div
                                            key={badge.days}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.06 }}
                                            whileHover={{ y: -2 }}
                                            className={`group relative overflow-hidden rounded-xl border p-3 text-center ${badge.unlocked ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-85'}`}
                                        >
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-[130%] group-hover:translate-x-[130%] transition-transform duration-700" />
                                            <div className={`mx-auto mb-2 w-11 h-11 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${badge.gradient}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-800 leading-tight">{badge.label}</p>
                                            <p className="text-[11px] text-slate-500 mt-1">{badge.days} days</p>
                                            {!badge.unlocked && (
                                                <p className="text-[10px] text-slate-400 mt-1">Locked</p>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </aside>

                    <section className="arena-history-right">
                        {historyQuery.isLoading ? (
                            <div className="arena-history-empty">Loading points history...</div>
                        ) : items.length === 0 ? (
                            <div className="arena-history-empty">No points activity available.</div>
                        ) : (
                            <div className="arena-history-timeline">
                                {items.map((item) => {
                                    const dateTime = formatDateTime(item.created_at);
                                    const points = Number(item.points || 0);
                                    const isPositive = points >= 0;

                                    return (
                                        <article key={item.event_id} className="arena-history-event">
                                            <div className="arena-history-event-marker">
                                                <CircleDot className="w-4 h-4" />
                                            </div>
                                            <div className="arena-history-event-card">
                                                <div className="arena-history-event-top">
                                                    <span className={`arena-history-points ${isPositive ? 'positive' : 'negative'}`}>
                                                        {isPositive ? '+' : ''}{points} pts
                                                    </span>
                                                    <span className="arena-history-task">{formatTaskName(item.action_key)}</span>
                                                </div>
                                                <div className="arena-history-event-meta">
                                                    <span>Badge: {deriveBadge(item)}</span>
                                                    <span>Date: {dateTime.date}</span>
                                                    <span>Time: {dateTime.time}</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                <div className="arena-history-pagination">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page <= 1}
                        className="arena-history-page-btn"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <span className="arena-history-page-text">Page {page} of {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages}
                        className="arena-history-page-btn"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
