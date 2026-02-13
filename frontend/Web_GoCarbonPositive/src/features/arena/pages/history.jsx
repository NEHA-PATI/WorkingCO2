import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarClock, ChevronLeft, ChevronRight, CircleDot } from 'lucide-react';
import '@features/arena/styles/arenaglobals.css';
import '@features/arena/styles/history.css';
import arenaApi from '@features/arena/services/arenaApi';

const PAGE_SIZE = 12;

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

    const items = historyQuery.data?.data || [];
    const totalPages = historyQuery.data?.totalPages || 1;
    const totalItems = historyQuery.data?.total || 0;

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
                        <h2>Future Badges</h2>
                        <p>This 40% panel is reserved for badge timeline and achievement integrations.</p>
                        <div className="arena-history-badge-placeholder">Badge modules coming soon</div>
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
