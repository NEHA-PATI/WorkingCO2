import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  X, CheckCircle2, Gift, ScrollText, Sparkles,
  UserPlus, ClipboardList, Linkedin, Instagram, Users, 
  CalendarCheck, Gamepad2, Brain, Zap
} from 'lucide-react';

const iconMap = {
  UserPlus,
  ClipboardList,
  Linkedin,
  Instagram,
  Users,
  CalendarCheck,
  Gamepad2,
  Brain
};

export default function ContestModal({ contest, isOpen, onClose, onComplete, isCompleted }) {
  if (!contest) return null;

  const Icon = iconMap[contest.icon] || Zap;

  const handleAction = () => {
    if (contest.isDailyTask) {
      onComplete(contest);
    } else {
      // Open external links or handle other actions
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className={`relative bg-gradient-to-r ${contest.color} p-6 text-white`}>
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-50"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{contest.title}</h2>
                  <p className="text-white/80 mt-1">{contest.description}</p>
                </div>
              </div>

              {/* Points Badge */}
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Rules Section */}
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

              {/* Rewards Section */}
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
                      className={`flex items-center gap-3 p-3 ${contest.bgColor} ${contest.borderColor} border rounded-xl`}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${
                        contest.color.includes('violet') ? 'text-violet-500' :
                        contest.color.includes('emerald') ? 'text-emerald-500' :
                        contest.color.includes('blue') ? 'text-blue-500' :
                        contest.color.includes('pink') ? 'text-pink-500' :
                        contest.color.includes('indigo') ? 'text-indigo-500' :
                        contest.color.includes('amber') ? 'text-amber-500' :
                        contest.color.includes('cyan') ? 'text-cyan-500' :
                        'text-fuchsia-500'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{reward}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <Button
                onClick={handleAction}
                disabled={isCompleted}
                className={`w-full bg-gradient-to-r ${contest.color} hover:opacity-90 text-white border-0 shadow-lg h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCompleted ? 'Completed for Today' : contest.buttonText}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}