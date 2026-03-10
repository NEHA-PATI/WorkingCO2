import React from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  FileCheck,
  Globe,
  Leaf,
  Lock,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Registry Verified",
    desc: "All credits verified by Verra, Gold Standard, and other top registries.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Pricing",
    desc: "Dynamic pricing engine reflecting live market supply and demand.",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    icon: Globe,
    title: "Global Projects",
    desc: "Access projects from 90+ countries across all carbon categories.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: Leaf,
    title: "Impact Tracking",
    desc: "Track your environmental impact with detailed retirement certificates.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: Lock,
    title: "Institutional Grade",
    desc: "Enterprise security and compliance for institutional carbon buyers.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    icon: BarChart2,
    title: "Market Analytics",
    desc: "Deep analytics across registries, vintages, and project types.",
    color: "#db2777",
    bg: "#fdf2f8",
  },
  {
    icon: FileCheck,
    title: "Transparent Audit",
    desc: "Complete audit trail for every credit from issuance to retirement.",
    color: "#0d9488",
    bg: "#f0fdfa",
  },
  {
    icon: Wallet,
    title: "Portfolio Management",
    desc: "Manage your carbon portfolio with performance tracking tools.",
    color: "#4f46e5",
    bg: "#eef2ff",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <motion.div
            key={feature.title}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <motion.div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: feature.bg }}
              whileHover={{ rotate: 8 }}
            >
              <Icon className="h-5 w-5" style={{ color: feature.color }} />
            </motion.div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">
              {feature.title}
            </h4>
            <p className="text-xs leading-relaxed text-slate-500">{feature.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
