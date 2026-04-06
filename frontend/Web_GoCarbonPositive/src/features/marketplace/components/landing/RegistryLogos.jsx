import React from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle, Globe, Leaf, Shield } from "lucide-react";

const registries = [
  {
    name: "Verra",
    icon: Shield,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    name: "Gold Standard",
    icon: Award,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    name: "American Carbon Registry",
    icon: CheckCircle,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    name: "Climate Action Reserve",
    icon: Globe,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    name: "Puro.earth",
    icon: Leaf,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
];

export default function RegistryLogos() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {registries.map((registry, index) => {
        const Icon = registry.icon;
        return (
          <motion.div
            key={registry.name}
            className="group flex cursor-pointer flex-col items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300"
              style={{
                background: registry.bg,
                border: `1px solid ${registry.border}`,
              }}
              whileHover={{ boxShadow: `0 8px 24px ${registry.color}20` }}
            >
              <Icon className="h-7 w-7" style={{ color: registry.color }} />
            </motion.div>
            <span className="max-w-[100px] text-center text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-800">
              {registry.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
