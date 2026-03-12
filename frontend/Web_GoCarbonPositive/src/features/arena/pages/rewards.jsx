import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Gift,
    Sparkles,
    Zap,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Leaf,
    ShieldCheck,
    Clock3,
    IndianRupee,
    User,
    Mail,
    Phone,
    MapPin,
    X,
    PartyPopper
} from 'lucide-react';
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

const createInitialRedeemForm = () => {
    if (typeof window === 'undefined') {
        return { name: '', email: '', phone: '', address: '' };
    }

    try {
        const raw = window.localStorage.getItem('authUser');
        const parsed = raw ? JSON.parse(raw) : {};
        const name =
            [parsed?.first_name, parsed?.last_name].filter(Boolean).join(' ').trim() ||
            parsed?.name ||
            '';

        return {
            name: name || '',
            email: parsed?.email || '',
            phone: parsed?.phone || parsed?.phone_number || '',
            address: ''
        };
    } catch {
        return { name: '', email: '', phone: '', address: '' };
    }
};

const resolveMyPoints = (payload) => {
    const candidates = [
        payload?.totalPoints,
        payload?.monthlyPoints,
        payload?.points,
        payload?.total_points,
        payload?.balance,
        payload?.data?.totalPoints,
        payload?.data?.monthlyPoints,
        payload?.data?.points,
        payload?.data?.total_points,
        payload?.data?.balance,
        payload?.data?.available_points
    ];

    const firstFinite = candidates
        .map((value) => Number(value))
        .find((value) => Number.isFinite(value));

    return firstFinite ?? 0;
};

const CONFETTI_COLORS = ['#16a34a', '#0ea5e9', '#f97316', '#eab308', '#ec4899', '#8b5cf6'];
const CONFETTI_PARTICLES = Array.from({ length: 48 }, (_, index) => ({
    id: index,
    left: (index * 17) % 100,
    delay: (index % 8) * 0.1,
    duration: 2.1 + (index % 5) * 0.28,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    rotate: (index * 33) % 360
}));

export default function ArenaRewardsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [activeReward, setActiveReward] = useState(null);
    const [redeemForm, setRedeemForm] = useState(createInitialRedeemForm);
    const [isLocating, setIsLocating] = useState(false);
    const [successReward, setSuccessReward] = useState(null);

    const rewardsQuery = useQuery({
        queryKey: ['arenaRewardsPage', page, PAGE_SIZE],
        queryFn: () => arenaApi.getRewardCatalog({ page, limit: PAGE_SIZE })
    });

    const myPointsQuery = useQuery({
        queryKey: ['arenaMyPoints'],
        queryFn: () => arenaApi.getMyPoints(),
        retry: false
    });

    const myPoints = useMemo(() => resolveMyPoints(myPointsQuery.data), [myPointsQuery.data]);

    const redeemMutation = useMutation({
        mutationFn: ({ rewardId }) => arenaApi.redeemReward(rewardId),
        onSuccess: (_, variables) => {
            toast.success('Reward redeemed successfully.');
            setActiveReward(null);
            setRedeemForm(createInitialRedeemForm());
            setSuccessReward({
                name: variables.rewardName,
                points: variables.rewardPoints,
                price: variables.rewardPrice
            });
            queryClient.invalidateQueries({ queryKey: ['arenaRewardsPage'] });
            queryClient.invalidateQueries({ queryKey: ['arenaRewardPreview'] });
            queryClient.invalidateQueries({ queryKey: ['arenaContestStatus'] });
            queryClient.invalidateQueries({ queryKey: ['arenaLeaderboard'] });
            queryClient.invalidateQueries({ queryKey: ['arenaMyPoints'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Unable to redeem reward right now.'));
        }
    });

    const rewards = rewardsQuery.data?.data || [];
    const totalPages = rewardsQuery.data?.totalPages || 1;
    const totalItems = rewardsQuery.data?.total || 0;
    const pointsLabel = myPointsQuery.isLoading
        ? 'Loading points...'
        : myPointsQuery.isError
          ? 'Points unavailable'
          : `${myPoints.toLocaleString()} available points`;

    const pageLabel = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE + 1;
        const end = Math.min(page * PAGE_SIZE, totalItems);
        if (!totalItems) return 'No rewards';
        return `Showing ${start}-${end} of ${totalItems}`;
    }, [page, totalItems]);

    useEffect(() => {
        if (!successReward) return undefined;
        const timer = window.setTimeout(() => {
            setSuccessReward(null);
        }, 4500);
        return () => window.clearTimeout(timer);
    }, [successReward]);

    const openRedeemModal = (reward) => {
        setActiveReward(reward);
        setRedeemForm(createInitialRedeemForm());
    };

    const closeRedeemModal = () => {
        if (redeemMutation.isPending) return;
        setActiveReward(null);
    };

    const handleFormChange = (field) => (event) => {
        const value = event.target.value;
        setRedeemForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Location is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const locationLabel = `Lat ${coords.latitude.toFixed(5)}, Lng ${coords.longitude.toFixed(5)}`;
                setRedeemForm((prev) => ({
                    ...prev,
                    address: prev.address ? `${prev.address}\n${locationLabel}` : locationLabel
                }));
                setIsLocating(false);
                toast.success('Current location captured.');
            },
            () => {
                setIsLocating(false);
                toast.error('Unable to fetch current location.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleProceedRedeem = (event) => {
        event.preventDefault();
        if (!activeReward) return;

        const requiredFields = ['name', 'email', 'phone', 'address'];
        const missingField = requiredFields.find((field) => !String(redeemForm[field] || '').trim());
        if (missingField) {
            toast.error('Please complete all details before proceeding.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(redeemForm.email.trim())) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const cleanedPhone = redeemForm.phone.replace(/\D/g, '');
        if (cleanedPhone.length < 10) {
            toast.error('Please enter a valid phone number.');
            return;
        }

        const rewardPoints = Number(activeReward.points || 0);
        if (!myPointsQuery.isError && myPoints < rewardPoints) {
            toast.error('You do not have enough points for this reward.');
            return;
        }

        redeemMutation.mutate({
            rewardId: activeReward.reward_id,
            rewardName: activeReward.name,
            rewardPoints: rewardPoints,
            rewardPrice: Number(activeReward.price_inr || 0)
        });
    };

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
                        <Zap className="w-4 h-4" />
                        <span>{pointsLabel}</span>
                    </div>
                </div>

                {rewardsQuery.isLoading ? (
                    <div className="arena-rewards-empty">Loading rewards...</div>
                ) : rewards.length === 0 ? (
                    <div className="arena-rewards-empty">No rewards available right now.</div>
                ) : (
                    <div className="arena-rewards-grid">
                        {rewards.map((reward) => {
                            const rewardPoints = Number(reward.points || 0);
                            const canRedeem = myPointsQuery.isError || (!myPointsQuery.isLoading && rewardPoints <= myPoints);

                            return (
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
                                        <div className="arena-reward-brand-chip">
                                            <Leaf className="w-3.5 h-3.5" />
                                            Carbon-Positive Pick
                                        </div>
                                        <div className="arena-reward-worth-chip">
                                            <IndianRupee className="w-3.5 h-3.5" />
                                            Worth Rs. {Number(reward.price_inr || 0).toLocaleString('en-IN')}
                                        </div>
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
                                                {rewardPoints.toLocaleString()} pts
                                            </span>
                                        </div>
                                       
                                        <button
                                            type="button"
                                            disabled={!canRedeem}
                                            onClick={() => openRedeemModal(reward)}
                                            className="arena-reward-redeem-btn"
                                        >
                                            {canRedeem ? 'Redeem Gift' : 'Not Enough Points'}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
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

            {activeReward ? (
                <div className="arena-redeem-modal-backdrop" onClick={closeRedeemModal}>
                    <div className="arena-redeem-modal" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="arena-redeem-close-btn" onClick={closeRedeemModal}>
                            <X className="w-4 h-4" />
                        </button>

                        <div className="arena-redeem-header">
                            <h2>Redeem Reward</h2>
                            <p>Complete details to claim your gift.</p>
                        </div>

                        <div className="arena-redeem-item">
                            {activeReward.image_url ? (
                                <img
                                    src={activeReward.image_url}
                                    alt={activeReward.name}
                                    className="arena-redeem-item-image"
                                />
                            ) : (
                                <div className="arena-redeem-item-image arena-redeem-item-image-fallback">No Image</div>
                            )}
                            <div>
                                <h3>{activeReward.name}</h3>
                                <p>
                                    Worth Rs. {Number(activeReward.price_inr || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        <form className="arena-redeem-form" onSubmit={handleProceedRedeem}>
                            <div className="arena-redeem-grid">
                                <label>
                                    <span>Your Points</span>
                                    <input
                                        value={myPoints.toLocaleString()}
                                        readOnly
                                        className="arena-redeem-readonly"
                                    />
                                </label>
                                <label>
                                    <span>Reward Points</span>
                                    <input
                                        value={Number(activeReward.points || 0).toLocaleString()}
                                        readOnly
                                        className="arena-redeem-readonly"
                                    />
                                </label>
                                <label>
                                    <span>Name</span>
                                    <div className="arena-redeem-input-wrap">
                                        <User className="w-4 h-4" />
                                        <input
                                            type="text"
                                            value={redeemForm.name}
                                            onChange={handleFormChange('name')}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </label>
                                <label>
                                    <span>Email</span>
                                    <div className="arena-redeem-input-wrap">
                                        <Mail className="w-4 h-4" />
                                        <input
                                            type="email"
                                            value={redeemForm.email}
                                            onChange={handleFormChange('email')}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </label>
                                <label>
                                    <span>Phone Number</span>
                                    <div className="arena-redeem-input-wrap">
                                        <Phone className="w-4 h-4" />
                                        <input
                                            type="tel"
                                            value={redeemForm.phone}
                                            onChange={handleFormChange('phone')}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </label>
                                <label className="arena-redeem-address-label">
                                    <span>Address</span>
                                    <textarea
                                        value={redeemForm.address}
                                        onChange={handleFormChange('address')}
                                        placeholder="Enter complete delivery address"
                                        rows={3}
                                    />
                                </label>
                            </div>

                            <button
                                type="button"
                                className="arena-redeem-location-btn"
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                            >
                                <MapPin className="w-4 h-4" />
                                {isLocating ? 'Fetching current location...' : 'Use Current Location'}
                            </button>

                            <button type="submit" className="arena-redeem-proceed-btn" disabled={redeemMutation.isPending}>
                                {redeemMutation.isPending ? 'Processing...' : 'Proceed'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}

            {successReward ? (
                <div className="arena-redeem-success-overlay">
                    <div className="arena-redeem-confetti-layer">
                        {CONFETTI_PARTICLES.map((piece) => (
                            <span
                                key={piece.id}
                                className="arena-redeem-confetti-piece"
                                style={{
                                    left: `${piece.left}%`,
                                    animationDelay: `${piece.delay}s`,
                                    animationDuration: `${piece.duration}s`,
                                    backgroundColor: piece.color,
                                    transform: `rotate(${piece.rotate}deg)`
                                }}
                            />
                        ))}
                    </div>

                    <div className="arena-redeem-success-popup">
                        <div className="arena-redeem-success-icon">
                            <PartyPopper className="w-7 h-7" />
                        </div>
                        <h3>Congratulations!</h3>
                        <p>
                            You have redeemed <strong>{successReward.name}</strong>. Your prize worth Rs.{' '}
                            {Number(successReward.price || 0).toLocaleString('en-IN')} will be processed soon.
                        </p>
                        <button type="button" onClick={() => setSuccessReward(null)}>
                            Awesome
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
