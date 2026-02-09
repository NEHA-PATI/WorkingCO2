import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  UserPlus, ClipboardList, Linkedin, Instagram, Users, 
  CalendarCheck, Gamepad2, Brain, Zap, ChevronRight 
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

export default function ContestCard({ contest, index, onClick, isCompleted }) {
  const Icon = iconMap[contest.icon] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: isCompleted ? 0 : -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative ${contest.bgColor} ${contest.borderColor} border rounded-2xl p-5 cursor-pointer overflow-hidden transition-all ${
        isCompleted ? 'opacity-50 hover:shadow-sm' : 'hover:shadow-lg'
      }`}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${contest.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      {/* Points Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
        className={`absolute top-4 right-4 bg-gradient-to-r ${contest.color} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5`}
      >
        <Zap className="w-4 h-4" />
        <span>{contest.points} pts</span>
      </motion.div>

      {/* Completed Badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
        >
          <ChevronRight className="w-3 h-3" />
          <span>Completed</span>
        </motion.div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 bg-gradient-to-br ${contest.color} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {contest.title}
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        {contest.description}
      </p>

      {/* Button */}
      <Button
        className={`w-full bg-gradient-to-r ${contest.color} hover:opacity-90 text-white border-0 shadow-md group-hover:shadow-lg transition-all`}
      >
        <span>{contest.buttonText}</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}