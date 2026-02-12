import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';

const rewards = [
  { name: "Premium T-Shirt", points: 5000 },
  { name: "Steel Bottle", points: 3500 },
  { name: "Designer Keychain", points: 2000 },
  { name: "Summer Internship", points: 15000 }
];

export default function RewardsShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16 mb-8"
    >
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-8 sm:p-12 shadow-xl overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Header */}
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

          {/* Big Trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            className="relative mx-auto w-48 h-48 mb-8"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-2xl"
            />

            {/* Trophy Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-24 h-24 text-white drop-shadow-lg" />
              
              {/* Sparkle Animations */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    x: [0, Math.cos((i * 60 * Math.PI) / 180) * 80, 0],
                    y: [0, Math.sin((i * 60 * Math.PI) / 180) * 80, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    repeatDelay: 1
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rewards List */}
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
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-200 shadow-md flex items-center justify-between"
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

          {/* Call to Action */}
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 text-slate-600 font-medium"
          >
            Complete challenges to earn points and unlock rewards! 🎁
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
