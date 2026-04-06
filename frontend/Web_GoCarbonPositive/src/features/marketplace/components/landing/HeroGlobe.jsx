import React from "react";
import { motion } from "framer-motion";

const dots = [
  { x: 55, y: 28, size: 3 },
  { x: 34, y: 44, size: 2.4 },
  { x: 67, y: 54, size: 2.8 },
  { x: 48, y: 66, size: 2.2 },
  { x: 74, y: 38, size: 2.1 },
  { x: 24, y: 60, size: 2.5 },
];

export default function HeroGlobe({ mouseX = 0, mouseY = 0 }) {
  const rotateX = mouseY * -8;
  const rotateY = mouseX * 10;

  return (
    <motion.div
      className="pointer-events-none relative h-full w-full"
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 40, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-full bg-emerald-300/35 blur-3xl" />
      <div className="absolute inset-[14%] rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-200/20 via-cyan-100/10 to-transparent shadow-[0_0_90px_rgba(16,185,129,0.22)]" />
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full drop-shadow-[0_10px_40px_rgba(16,185,129,0.25)]"
        role="img"
        aria-label="Animated globe"
      >
        <defs>
          <radialGradient id="globeCore" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#34d399" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="50"
          cy="50"
          r="32"
          fill="url(#globeCore)"
          stroke="#10b981"
          strokeOpacity="0.7"
          strokeWidth="0.8"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />

        <motion.ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="11"
          fill="none"
          stroke="#10b981"
          strokeOpacity="0.55"
          strokeWidth="0.6"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="11"
          fill="none"
          stroke="#06b6d4"
          strokeOpacity="0.48"
          strokeWidth="0.6"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="14"
          ry="30"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.38"
          strokeWidth="0.55"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />

        <motion.path
          d="M25 45 Q 50 23 75 45"
          fill="none"
          stroke="#10b981"
          strokeOpacity="0.7"
          strokeWidth="0.7"
          strokeLinecap="round"
          animate={{ pathLength: [0.15, 1, 0.15] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M27 62 Q 50 79 73 62"
          fill="none"
          stroke="#06b6d4"
          strokeOpacity="0.72"
          strokeWidth="0.7"
          strokeLinecap="round"
          animate={{ pathLength: [0.2, 1, 0.2] }}
          transition={{
            duration: 6.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />

        {dots.map((dot, index) => (
          <motion.circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill={index % 2 === 0 ? "#10b981" : "#22d3ee"}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.25, 0.9] }}
            transition={{
              duration: 2.8 + index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="#34d399"
          strokeOpacity="0.3"
          strokeWidth="0.6"
          animate={{ rotate: -360, opacity: [0.2, 0.45, 0.2] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />
      </svg>
    </motion.div>
  );
}
