import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Sparkles, TrendingUp, Award, Star } from 'lucide-react';

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

const TopThreeCard = ({ user, index }) => {
  const colors = [
    { gradient: 'from-yellow-400 via-yellow-500 to-amber-600', bg: 'bg-yellow-50', border: 'border-yellow-300', icon: Crown, iconColor: 'text-yellow-600' },
    { gradient: 'from-slate-300 via-slate-400 to-slate-500', bg: 'bg-slate-50', border: 'border-slate-300', icon: Award, iconColor: 'text-slate-600' },
    { gradient: 'from-amber-600 via-orange-500 to-amber-700', bg: 'bg-orange-50', border: 'border-orange-300', icon: Medal, iconColor: 'text-orange-600' },
  ];
  
  const config = colors[index];
  const Icon = config.icon;
  const scale = index === 0 ? 1.05 : 0.95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      {/* Rank Badge - Floating */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        className="absolute -top-2 -right-2 z-20"
      >
        <div className={`w-9 h-9 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-xl border-2 border-white`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className={`${config.bg} ${config.border} border-2 rounded-xl p-2.5 relative overflow-hidden shadow-lg`}
      >
        {/* Shimmer Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-5`} />
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12"
        />

        {/* Content */}
        <div className="flex items-center gap-2 relative z-10">
          {/* Avatar */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-md border-2 border-white flex-shrink-0`}
          >
            <span className="text-white font-bold text-xs">{user.avatar}</span>
          </motion.div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm">{user.emoji}</span>
              <h4 className="font-bold text-slate-800 text-xs truncate">{user.name}</h4>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className={`w-2.5 h-2.5 ${config.iconColor}`} />
              <span className="font-bold text-slate-700 text-xs">{user.points.toLocaleString()}</span>
            </div>
          </div>

          {/* Trend */}
          {user.trend === 'up' && (
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-emerald-500 flex-shrink-0"
            >
              <TrendingUp className="w-3 h-3" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Leaderboard() {
  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-4"
    >
      {/* Header */}
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

      {/* Top 3 Winners */}
      <div className="p-3">
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-3 mb-3 border border-amber-200">
          <div className="space-y-2">
            {topThree.map((user, index) => (
              <TopThreeCard key={user.rank} user={user} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="p-3 max-h-[300px] overflow-y-auto">
        {restOfList.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl mb-2 transition-all cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200"
          >
            {/* Rank */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600">
              {user.rank}
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{user.emoji}</span>
                <span className="font-medium text-slate-800 text-sm truncate">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span className="text-xs text-slate-500">
                  {user.points.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Trend */}
            <div className={`${
              user.trend === 'up' ? 'text-emerald-500' : 
              user.trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {user.trend === 'up' && (
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <TrendingUp className="w-4 h-4" />
                </motion.div>
              )}
              {user.trend === 'down' && (
                <TrendingUp className="w-4 h-4 rotate-180" />
              )}
              {user.trend === 'same' && (
                <div className="w-4 h-0.5 bg-slate-300 rounded-full" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 rounded-b-2xl">
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
  );
}
