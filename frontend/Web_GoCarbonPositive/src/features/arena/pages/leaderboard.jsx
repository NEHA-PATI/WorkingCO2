import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Trophy, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import '@features/arena/styles/arenaglobals.css';
import arenaApi, { getArenaUserId } from '@features/arena/services/arenaApi';

const PAGE_SIZE = 20;

const toUserLabel = (username, uId, rank) => {
    if (username && String(username).trim()) return String(username).trim();
    if (!uId) return `User #${rank}`;
    return `User ${String(uId).slice(-8)}`;
};

export default function ArenaLeaderboardPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [type, setType] = useState('monthly');
    const hasAuthUser = Boolean(getArenaUserId());

    const leaderboardQuery = useQuery({
        queryKey: ['arenaLeaderboardPage', type, page, PAGE_SIZE],
        queryFn: () => arenaApi.getLeaderboard({ type, page, limit: PAGE_SIZE })
    });

    const myRankQuery = useQuery({
        queryKey: ['arenaMyRank', type],
        queryFn: () => arenaApi.getMyRank({ type }),
        enabled: hasAuthUser
    });

    const entries = leaderboardQuery.data?.data || [];
    const totalPages = leaderboardQuery.data?.totalPages || 1;

    return (
        <div className="arena-scope min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/arena-standalone')}
                        className="w-fit inline-flex items-center gap-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-semibold px-3 py-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Arena
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
                        <p className="text-sm text-slate-500 mt-1">Detailed ranking powered by reward-service backend.</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-slate-700 text-sm font-semibold">
                        <Trophy className="w-4 h-4 text-violet-600" />
                        Your Rank: {myRankQuery.data !== null && myRankQuery.data !== undefined ? `#${myRankQuery.data}` : '--'}
                    </div>
                    <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => {
                                setType('monthly');
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm font-semibold ${type === 'monthly' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setType('lifetime');
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm font-semibold ${type === 'lifetime' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                        >
                            Lifetime
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[100px_1fr_140px] gap-3 px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <span>Rank</span>
                        <span>User</span>
                        <span className="text-right">Points</span>
                    </div>

                    {leaderboardQuery.isLoading ? (
                        <div className="py-10 text-center text-sm text-slate-500">Loading leaderboard...</div>
                    ) : entries.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-500">No leaderboard entries found.</div>
                    ) : (
                        entries.map((entry) => (
                            <div
                                key={`${entry.rank}-${entry.u_id}`}
                                className="grid grid-cols-[100px_1fr_140px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center"
                            >
                                <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <span>#{entry.rank}</span>
                                    {entry.rank <= 3 && <Flame className="w-4 h-4 text-amber-500" />}
                                </div>
                                <div className="text-sm font-semibold text-slate-800">{toUserLabel(entry.username, entry.u_id, entry.rank)}</div>
                                <div className="text-right text-sm font-bold text-violet-700">
                                    {Number(entry.points || 0).toLocaleString()} pts
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page <= 1}
                        className="inline-flex items-center gap-1.5 h-9 px-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <span className="text-sm font-semibold text-slate-600">Page {page} of {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages}
                        className="inline-flex items-center gap-1.5 h-9 px-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
