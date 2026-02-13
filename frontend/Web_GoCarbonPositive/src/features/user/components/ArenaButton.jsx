import { motion, AnimatePresence } from "framer-motion";
import { Swords, Sparkles, Crown, Zap } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ArenaButton = () => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showRunner, setShowRunner] = useState(true);
  const [runnerPhase, setRunnerPhase] = useState("running");

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRunner(true);
      setRunnerPhase("running");
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 150,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 800);
  }, []);

  const handleClick = () => {
    setIsPressed(true);
    createParticles();
    setTimeout(() => setIsPressed(false), 300);
    setTimeout(() => navigate("/arena-standalone"), 120);
  };

  useEffect(() => {
    if (runnerPhase === "running") {
      const timer = setTimeout(() => setRunnerPhase("jumping"), 1500);
      return () => clearTimeout(timer);
    }
    if (runnerPhase === "jumping") {
      const timer = setTimeout(() => {
        setRunnerPhase("entered");
        createParticles();
      }, 600);
      return () => clearTimeout(timer);
    }
    if (runnerPhase === "entered") {
      const timer = setTimeout(() => setShowRunner(false), 300);
      return () => clearTimeout(timer);
    }
  }, [runnerPhase, createParticles]);

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {showRunner && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            initial={{ x: -120, y: 60, scale: 0.8, opacity: 0 }}
            animate={
              runnerPhase === "running"
                ? { x: -40, y: 20, scale: 1, opacity: 1 }
                : runnerPhase === "jumping"
                ? { x: 0, y: -20, scale: 0.6, opacity: 1, rotate: 360 }
                : { x: 0, y: 0, scale: 0, opacity: 0 }
            }
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: runnerPhase === "running" ? 1.5 : 0.6,
              ease: runnerPhase === "jumping" ? "easeIn" : "easeOut",
            }}
          >
            <motion.div
              className="relative"
              animate={runnerPhase === "running" ? { y: [0, -8, 0] } : {}}
              transition={{
                duration: 0.3,
                repeat: runnerPhase === "running" ? Infinity : 0,
              }}
            >
              <div className="relative">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 border-2 border-amber-500 relative"
                  animate={
                    runnerPhase === "running" ? { rotate: [-5, 5, -5] } : {}
                  }
                  transition={{
                    duration: 0.3,
                    repeat: runnerPhase === "running" ? Infinity : 0,
                  }}
                >
                  <div className="absolute top-2 left-1.5 w-1.5 h-2 bg-foreground rounded-full" />
                  <div className="absolute top-2 right-1.5 w-1.5 h-2 bg-foreground rounded-full" />
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-foreground rounded-full" />
                  <div className="absolute top-0 left-0 right-0 h-2 bg-primary rounded-t-full" />
                  <motion.div
                    className="absolute -right-3 top-1 w-4 h-6 bg-gradient-to-r from-secondary to-amber-400 rounded-r-full origin-left"
                    animate={
                      runnerPhase === "running"
                        ? {
                            scaleX: [1, 1.3, 1],
                            rotate: [-10, 10, -10],
                          }
                        : { scaleX: 0.5 }
                    }
                    transition={{
                      duration: 0.2,
                      repeat: runnerPhase === "running" ? Infinity : 0,
                    }}
                  />
                </motion.div>

                <div className="w-6 h-5 bg-gradient-to-b from-primary to-emerald-600 rounded-lg mx-auto -mt-1 border border-emerald-700" />

                <motion.div
                  className="absolute top-8 -left-1 w-2 h-4 bg-amber-400 rounded-full origin-top"
                  animate={
                    runnerPhase === "running"
                      ? { rotate: [-45, 45, -45] }
                      : { rotate: -30 }
                  }
                  transition={{
                    duration: 0.3,
                    repeat: runnerPhase === "running" ? Infinity : 0,
                  }}
                />
                <motion.div
                  className="absolute top-8 -right-1 w-2 h-4 bg-amber-400 rounded-full origin-top"
                  animate={
                    runnerPhase === "running"
                      ? { rotate: [45, -45, 45] }
                      : { rotate: 30 }
                  }
                  transition={{
                    duration: 0.3,
                    repeat: runnerPhase === "running" ? Infinity : 0,
                  }}
                />

                <motion.div
                  className="absolute top-12 left-1 w-2 h-5 bg-foreground rounded-full origin-top"
                  animate={
                    runnerPhase === "running"
                      ? { rotate: [-30, 30, -30] }
                      : { rotate: -20 }
                  }
                  transition={{
                    duration: 0.3,
                    repeat: runnerPhase === "running" ? Infinity : 0,
                  }}
                />
                <motion.div
                  className="absolute top-12 right-1 w-2 h-5 bg-foreground rounded-full origin-top"
                  animate={
                    runnerPhase === "running"
                      ? { rotate: [30, -30, 30] }
                      : { rotate: 20 }
                  }
                  transition={{
                    duration: 0.3,
                    repeat: runnerPhase === "running" ? Infinity : 0,
                  }}
                />
              </div>

              {runnerPhase === "running" && (
                <>
                  <motion.div
                    className="absolute top-2 -left-6 w-4 h-0.5 bg-arena-gold/60 rounded-full"
                    animate={{ opacity: [0, 1, 0], x: [-5, -15] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-5 -left-8 w-6 h-0.5 bg-arena-emerald/60 rounded-full"
                    animate={{ opacity: [0, 1, 0], x: [-5, -15] }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      delay: 0.1,
                    }}
                  />
                  <motion.div
                    className="absolute top-8 -left-5 w-3 h-0.5 bg-arena-gold/60 rounded-full"
                    animate={{ opacity: [0, 1, 0], x: [-5, -15] }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 pointer-events-none z-30"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Sparkles className="w-full h-full text-arena-gold" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--arena-glow) / 0.2) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-40 h-40 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-arena-gold"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 60}deg) translateY(-75px)`,
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 1.8,
              delay: i * 0.15,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>

      <motion.button
        onClick={handleClick}
        className="relative group cursor-pointer z-10"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl blur-lg"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--arena-emerald)), hsl(var(--arena-gold)))",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="relative px-8 py-4 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              hsl(60 30% 98%) 0%, 
              hsl(60 20% 95%) 50%, 
              hsl(60 30% 98%) 100%)`,
            boxShadow: `
              0 4px 20px hsl(var(--arena-glow) / 0.3),
              0 8px 40px hsl(var(--arena-gold) / 0.2),
              inset 0 1px 0 hsl(60 30% 100%),
              inset 0 -1px 0 hsl(var(--arena-emerald) / 0.2)
            `,
            border: "2px solid hsl(var(--arena-emerald) / 0.3)",
          }}
          animate={
            isPressed
              ? {
                  boxShadow: `
              0 0 40px hsl(var(--arena-glow)),
              0 0 80px hsl(var(--arena-gold) / 0.4)
            `,
                }
              : {}
          }
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, hsl(var(--arena-gold) / 0.4) 50%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
          />

          <div className="relative flex items-center gap-3">
            <motion.div
              className="relative"
              animate={{ rotate: [0, -8, 0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Swords className="w-7 h-7 text-arena-gold drop-shadow-lg" />
              <Crown className="absolute -top-2 -right-1 w-4 h-4 text-arena-gold" />
            </motion.div>

            <div className="flex flex-col items-start">
              <motion.span
                className="text-4xl font-black tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--arena-dark)), hsl(var(--arena-emerald)), hsl(var(--arena-gold)))",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ARENA
              </motion.span>
              <motion.span
                className="text-xs tracking-[0.25em] text-arena-emerald font-bold uppercase"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Champions Rise
              </motion.span>
            </div>

            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity },
              }}
            >
              <Zap className="w-6 h-6 text-arena-emerald" />
            </motion.div>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ArenaButton;
