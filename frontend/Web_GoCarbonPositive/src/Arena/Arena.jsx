import React, { useState, useEffect } from 'react';
import HeroSlider from '@/components/arena/HeroSlider';
import MilestoneTracker from '@/components/arena/MilestoneTracker';
import RewardsShowcase from '@/components/arena/RewardsShowcase';
import ContestCard from '@/components/arena/ContestCard';
import Leaderboard from '@/components/arena/Leaderboard';
import ContestModal from '@/components/arena/ContestModal';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Arena() {
  const [selectedContest, setSelectedContest] = useState(null);
  const queryClient = useQueryClient();

  const { data: completions = [] } = useQuery({
    queryKey: ['dailyCompletions'],
    queryFn: () => base44.entities.DailyCompletion.list()
  });

  const createCompletionMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyCompletion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyCompletions'] });
      toast.success('Task completed! Points added.');
    }
  });

  const isTaskCompletedToday = (taskType) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(c => c.task_type === taskType && c.completed_date === today);
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

    createCompletionMutation.mutate({
      task_type: contest.taskType,
      completed_date: new Date().toISOString().split('T')[0],
      points_earned: contest.points
    });

    setSelectedContest(null);
  };

  const contests = [
    {
      id: 1,
      title: "Sign Up Bonus",
      description: "Complete your profile setup",
      points: 500,
      icon: "UserPlus",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      buttonText: "Complete Profile",
      rules: [
        "Fill in all required profile fields",
        "Upload a profile picture",
        "Verify your email address",
        "Add your bio (minimum 50 characters)"
      ],
      rewards: ["500 Arena Points", "Exclusive 'Pioneer' Badge", "Early access to new features"]
    },
    {
      id: 2,
      title: "Take a Survey",
      description: "Share your valuable feedback",
      points: 150,
      icon: "ClipboardList",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      buttonText: "Start Survey",
      rules: [
        "Answer all questions honestly",
        "Complete survey within 10 minutes",
        "One survey per day limit",
        "Thoughtful responses earn bonus points"
      ],
      rewards: ["150 Arena Points", "Chance for bonus 50 points", "Entry into weekly raffle"]
    },
    {
      id: 3,
      title: "Connect on LinkedIn",
      description: "Follow us on LinkedIn",
      points: 100,
      icon: "Linkedin",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonText: "Connect Now",
      rules: [
        "Follow our official LinkedIn page",
        "Like our latest post",
        "Share with your network for bonus",
        "Comment on any post for extra points"
      ],
      rewards: ["100 Arena Points", "Professional network badge", "LinkedIn exclusive updates"]
    },
    {
      id: 4,
      title: "Follow on Instagram",
      description: "Join our Instagram community",
      points: 100,
      icon: "Instagram",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      buttonText: "Follow Us",
      rules: [
        "Follow our Instagram account",
        "Like our latest 3 posts",
        "Tag us in your story for bonus",
        "Use our hashtag in your posts"
      ],
      rewards: ["100 Arena Points", "Social butterfly badge", "Featured in our stories"]
    },
    {
      id: 5,
      title: "Join Community",
      description: "Be part of our Discord family",
      points: 200,
      icon: "Users",
      color: "from-indigo-500 to-violet-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      buttonText: "Join Discord",
      rules: [
        "Join our official Discord server",
        "Introduce yourself in #introductions",
        "Read and accept community guidelines",
        "Stay active for weekly bonuses"
      ],
      rewards: ["200 Arena Points", "Community member role", "Access to exclusive channels"]
    },
    {
      id: 6,
      title: "Daily Check-in",
      description: "Claim your daily reward",
      points: 50,
      icon: "CalendarCheck",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      buttonText: "Check In",
      isDailyTask: true,
      taskType: "daily_checkin",
      rules: [
        "Check in once every 24 hours",
        "Maintain streak for multipliers",
        "7-day streak = 2x points",
        "30-day streak = 5x points"
      ],
      rewards: ["50 Base Points", "Streak multiplier bonus", "Monthly streak badge"]
    },
    {
      id: 7,
      title: "Play Games",
      description: "Win points through mini-games",
      points: 75,
      icon: "Gamepad2",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      buttonText: "Play Now",
      isDailyTask: true,
      taskType: "play_games",
      rules: [
        "Complete any available game",
        "Higher scores = more points",
        "3 attempts per game daily",
        "Weekly tournaments available"
      ],
      rewards: ["Up to 75 Points per game", "Gamer badge", "Tournament eligibility"]
    },
    {
      id: 8,
      title: "Quiz Challenge",
      description: "Test your knowledge",
      points: 120,
      icon: "Brain",
      color: "from-fuchsia-500 to-pink-600",
      bgColor: "bg-fuchsia-50",
      borderColor: "border-fuchsia-200",
      buttonText: "Take Quiz",
      isDailyTask: true,
      taskType: "quiz",
      rules: [
        "Answer 10 questions correctly",
        "Time limit: 2 minutes",
        "Each correct answer = 12 points",
        "Perfect score = bonus 30 points"
      ],
      rewards: ["Up to 150 Points", "Genius badge", "Leaderboard ranking boost"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <HeroSlider />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Milestone Tracker */}
        <MilestoneTracker currentStreak={currentStreak} />

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contest Cards - 70% */}
          <div className="lg:w-[70%]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-slate-800">Earn Points</h2>
              <p className="text-slate-500 mt-1">Complete challenges to climb the leaderboard</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contests
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
                  <ContestCard 
                    key={contest.id}
                    contest={contest}
                    index={index}
                    isCompleted={contest.isDailyTask && isTaskCompletedToday(contest.taskType)}
                    onClick={() => setSelectedContest(contest)}
                  />
                ))}
            </div>
          </div>

          {/* Leaderboard - 30% */}
          <div className="lg:w-[30%]">
            <Leaderboard />
          </div>
        </div>

        {/* Rewards Showcase */}
        <RewardsShowcase />
      </div>

      {/* Contest Modal */}
      <ContestModal 
        contest={selectedContest}
        isOpen={!!selectedContest}
        onClose={() => setSelectedContest(null)}
        onComplete={handleTaskComplete}
        isCompleted={selectedContest?.isDailyTask && isTaskCompletedToday(selectedContest.taskType)}
      />
    </div>
  );
}