import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Search, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Credits",
    description:
      "Browse verified projects from trusted global registries. Filter by type, region, and quality.",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    icon: BarChart3,
    title: "Analyze Quality",
    description:
      "Review integrity scores, verification details, and live market analytics before investing.",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  {
    icon: ShoppingCart,
    title: "Purchase & Retire",
    description:
      "Execute trades at market or limit price, then retire credits against your carbon footprint.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.title}
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <motion.div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: step.bg, border: `1px solid ${step.border}` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="h-7 w-7" style={{ color: step.color }} />
              </motion.div>
              <div className="mb-3 font-mono text-xs font-semibold" style={{ color: step.color }}>
                STEP {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
