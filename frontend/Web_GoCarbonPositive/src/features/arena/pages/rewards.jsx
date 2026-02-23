import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Gift, Sparkles, Zap, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import '@features/arena/styles/arenaglobals.css';
import '@features/arena/styles/rewards.css';
import arenaApi from '@features/arena/services/arenaApi';

const PAGE_SIZE = 8;

const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const backendMessage = error?.response?.data?.message;
    const backendReason = error?.response?.data?.data?.reason;
    if (backendMessage) return backendMessage;
    if (backendReason) return backendReason.replace(/_/g, ' ').toLowerCase();
    return error?.message || fallback;
};

export default function ArenaRewardsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const rewardsQuery = useQuery({
        queryKey: ['arenaRewardsPage', page, PAGE_SIZE],
        queryFn: () => arenaApi.getRewardCatalog({ page, limit: PAGE_SIZE })
    });

    const redeemMutation = useMutation({
        mutationFn: (rewardId) => arenaApi.redeemReward(rewardId),
        onSuccess: () => {
            toast.success('Reward redeemed successfully.');
            queryClient.invalidateQueries({ queryKey: ['arenaRewardsPage'] });
            queryClient.invalidateQueries({ queryKey: ['arenaRewardPreview'] });
            queryClient.invalidateQueries({ queryKey: ['arenaContestStatus'] });
            queryClient.invalidateQueries({ queryKey: ['arenaLeaderboard'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Unable to redeem reward right now.'));
        }
    });

    const rewards = rewardsQuery.data?.data || [];
    const totalPages = rewardsQuery.data?.totalPages || 1;
    const totalItems = rewardsQuery.data?.total || 0;

    const pageLabel = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE + 1;
        const end = Math.min(page * PAGE_SIZE, totalItems);
        if (!totalItems) return 'No rewards';
        return `Showing ${start}-${end} of ${totalItems}`;
    }, [page, totalItems]);

    return (
        <div className="arena-rewards-page arena-scope">
            <div className="arena-rewards-container">
                <div className="arena-rewards-header">
                    <button
                        type="button"
                        onClick={() => navigate('/arena-standalone')}
                        className="arena-rewards-back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Arena
                    </button>
                    <div>
                        <h1 className="arena-rewards-title">Rewards</h1>
                        <p className="arena-rewards-subtitle">Redeem points for curated rewards.</p>
                    </div>
                </div>

                <div className="arena-rewards-summary">
                    <div className="arena-rewards-summary-left">
                        <Gift className="w-5 h-5" />
                        <span>{pageLabel}</span>
                    </div>
                    <div className="arena-rewards-summary-right">
                        <Sparkles className="w-4 h-4" />
                        <span>Paginated backend feed</span>
                    </div>
                </div>

                {rewardsQuery.isLoading ? (
                    <div className="arena-rewards-empty">Loading rewards...</div>
                ) : rewards.length === 0 ? (
                    <div className="arena-rewards-empty">No rewards available right now.</div>
                ) : (
                    <div className="arena-rewards-grid">
                        {rewards.map((reward) => (
                            <article key={reward.reward_id} className="arena-reward-card">
                                <div className="arena-reward-image-wrap">
                                    {reward.image_url ? (
                                        <img
                                            src={reward.image_url}
                                            alt={reward.name}
                                            className="arena-reward-image"
                                        />
                                    ) : (
                                        <div className="arena-reward-image-fallback">No Image</div>
                                    )}
                                </div>
                                <div className="arena-reward-body">
                                    <h2 className="arena-reward-name">{reward.name}</h2>
                                    <p className="arena-reward-description">{reward.description}</p>
                                    <div className="arena-reward-pricing">
                                        <span className="arena-reward-rupees">
                                            Rs. {Number(reward.price_inr || 0).toLocaleString('en-IN')}
                                        </span>
                                        <span className="arena-reward-points">
                                            <Zap className="w-3.5 h-3.5" />
                                            {Number(reward.points || 0).toLocaleString()} pts
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={redeemMutation.isPending}
                                        onClick={() => redeemMutation.mutate(reward.reward_id)}
                                        className="arena-reward-redeem-btn"
                                    >
                                        Redeem Now
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="arena-rewards-pagination">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page <= 1}
                        className="arena-rewards-page-btn"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <span className="arena-rewards-page-text">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages}
                        className="arena-rewards-page-btn"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
