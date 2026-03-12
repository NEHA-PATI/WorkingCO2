import React from "react";
import { motion } from "framer-motion";
import { Droplets, Flame, Leaf, Wind, Zap } from "lucide-react";

const typeIcons = {
  nature_based: Leaf,
  renewable_energy: Zap,
  biochar: Flame,
  blue_carbon: Droplets,
  direct_air_capture: Wind,
};

const registryLabels = {
  verra: "Verra",
  gold_standard: "Gold Standard",
  american_carbon_registry: "ACR",
  climate_action_reserve: "CAR",
  puro_earth: "Puro.earth",
};

export default function FloatingCard({ project, index }) {
  const Icon = typeIcons[project.type] || Leaf;

  return (
    <motion.div
      className="group w-72 flex-shrink-0 cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{project.name}</h4>
          <p className="text-xs text-slate-400">
            {registryLabels[project.registry] || project.registry}
          </p>
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">{project.creditType}</span>
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-700">
          {project.rating}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Price Range</p>
          <p className="font-semibold text-slate-800">
            ${project.priceMin} - ${project.priceMax}
          </p>
        </div>
        <motion.div className="text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
          View {"->"}
        </motion.div>
      </div>
    </motion.div>
  );
}
