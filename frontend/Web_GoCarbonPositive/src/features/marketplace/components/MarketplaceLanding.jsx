import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "./ui/basic-ui";
import AnimatedCounter from "./landing/AnimatedCounter";
import FeatureGrid from "./landing/FeatureGrid";
import FloatingCard from "./landing/FloatingCard";
import HeroGlobe from "./landing/HeroGlobe";
import HowItWorks from "./landing/HowItWorks";
import MarketPreview from "./landing/MarketPreview";
import ParticleField from "./landing/ParticleField";
import RegistryLogos from "./landing/RegistryLogos";
import useCurrency from "../hooks/useCurrency";
import { convertPrice } from "../lib/currencyUtils";

const sampleProjects = [
  {
    name: "Amazon Rainforest REDD+",
    registry: "verra",
    type: "nature_based",
    creditType: "Avoidance",
    rating: "AAA",
    priceMin: 12,
    priceMax: 18,
  },
  {
    name: "Gujarat Wind Farm",
    registry: "gold_standard",
    type: "renewable_energy",
    creditType: "Reduction",
    rating: "AA",
    priceMin: 6,
    priceMax: 11,
  },
  {
    name: "Oregon Biochar Initiative",
    registry: "puro_earth",
    type: "biochar",
    creditType: "Removal",
    rating: "AAA",
    priceMin: 28,
    priceMax: 45,
  },
  {
    name: "Iceland Direct Air Capture",
    registry: "verra",
    type: "direct_air_capture",
    creditType: "Removal",
    rating: "AAA",
    priceMin: 80,
    priceMax: 150,
  },
  {
    name: "Mangrove Blue Carbon",
    registry: "gold_standard",
    type: "blue_carbon",
    creditType: "Avoidance",
    rating: "AA",
    priceMin: 15,
    priceMax: 25,
  },
  {
    name: "Kenya Clean Cooking",
    registry: "gold_standard",
    type: "nature_based",
    creditType: "Avoidance",
    rating: "A",
    priceMin: 8,
    priceMax: 14,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Sustainability, TechCorp",
    text: "CarbonX made it easy to verify and purchase high-quality credits for our net-zero roadmap.",
  },
  {
    name: "Marcus Weber",
    role: "Carbon Asset Manager, GreenFund",
    text: "The analytics dashboard is unparalleled. We can make data-driven decisions in real time.",
  },
  {
    name: "Priya Nair",
    role: "Project Developer, ReForest India",
    text: "Listing our project took minutes. The verification process is transparent and thorough.",
  },
];

export default function MarketplaceLanding({ onAction }) {
  const { currency, fxRate } = useCurrency();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const currencyPrefix = currency === "INR" ? "₹" : "$";

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.86]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98]);

  const handleMouseMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  const landingStats = useMemo(
    () => [
      {
        label: "Market Cap",
        value: convertPrice(2.4, currency, fxRate),
        prefix: currencyPrefix,
        suffix: "B",
        decimals: 1,
      },
      { label: "Credits Traded", value: 187, suffix: "M", decimals: 0 },
      {
        label: "Avg. Credit Price",
        value: convertPrice(14.82, currency, fxRate),
        prefix: currencyPrefix,
        decimals: 2,
      },
      { label: "Active Projects", value: 3400, suffix: "+", decimals: 0 },
    ],
    [currency, currencyPrefix, fxRate],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-white"
      onMouseMove={handleMouseMove}
    >
      <motion.section
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="pointer-events-none absolute left-20 top-20 h-96 w-96 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-20 h-80 w-80 rounded-full bg-cyan-100 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-[-140px] z-[2] hidden items-center md:flex">
          <div className="h-[620px] w-[620px] opacity-95">
            <HeroGlobe mouseX={mousePos.x} mouseY={mousePos.y} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center md:hidden">
          <div className="h-[420px] w-[420px] opacity-75">
            <HeroGlobe mouseX={mousePos.x} mouseY={mousePos.y} />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-8 text-center md:pr-40">
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              The Future of Carbon Markets is Here
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold leading-none tracking-tight text-slate-900 sm:text-6xl md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The Global
            <br />
            <span className="gradient-text">Carbon Credit</span>
            <br />
            Marketplace
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Trade verified carbon credits from leading registries with transparent
            pricing, analytics, and measurable impact.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button
              className="group rounded-2xl bg-emerald-600 px-10 py-7 text-base text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700"
              onClick={() => onAction?.("overview")}
            >
              Start Trading
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-2xl border-slate-300 px-10 py-7 text-base text-slate-700 hover:bg-slate-50"
              onClick={() => onAction?.("browse")}
            >
              <Play className="h-4 w-4" /> Explore Listings
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex -space-x-2">
              {["bg-emerald-400", "bg-cyan-400", "bg-violet-400", "bg-amber-400"].map(
                (color, index) => (
                  <div
                    key={String(index)}
                    className={`h-8 w-8 rounded-full border-2 border-white ${color}`}
                  />
                ),
              )}
            </div>
            <p className="text-sm text-slate-500">
              <strong className="text-slate-800">2,400+</strong> organizations trading
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star key={String(index)} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <strong className="text-slate-800">4.9/5</strong> platform rating
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </motion.section>

      <section className="relative border-y border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {landingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix || ""}
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-emerald-600">
              Live Dashboard
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Real-Time Market Intelligence
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Institutional-grade analytics with live pricing, order books, and market
              depth across registries.
            </p>
          </motion.div>
          <MarketPreview />
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-6 py-20">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan-600">
            Featured Projects
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Verified Carbon Projects
          </h2>
          <p className="mt-3 text-slate-500">
            Handpicked projects from trusted registries worldwide.
          </p>
        </motion.div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-4 pb-4">
          {sampleProjects.map((project, index) => (
            <FloatingCard key={project.name} project={project} index={index} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => onAction?.("browse")}
          >
            View All Projects <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-slate-50 to-emerald-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-emerald-600">
              Trusted By Leaders
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              What Our Users Say
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Star key={String(score)} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-700">
                  "{testimonial.text}"
                </p>
                <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-xs text-slate-500">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-emerald-600">
              Trusted Partners
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Verified Carbon Registries
            </h2>
            <p className="mt-3 text-slate-500">
              Credits sourced from globally recognized carbon standards.
            </p>
          </motion.div>
          <RegistryLogos />
        </div>
      </section>

      <section className="relative bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan-600">
              Simple Process
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              How the Marketplace Works
            </h2>
          </motion.div>
          <HowItWorks />
        </div>
      </section>

      <section className="relative bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-emerald-600">
              Platform Capabilities
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Built for Serious Carbon Markets
            </h2>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 px-6 py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <ParticleField count={15} />
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Start Your Carbon Journey Today
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-lg text-emerald-100">
            Join organizations trading verified credits on a transparent, data-rich
            marketplace.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              className="group rounded-xl bg-white px-10 py-6 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              onClick={() => onAction?.("sell")}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/40 px-10 py-6 text-base text-white hover:bg-white/10"
              onClick={() => onAction?.("buy")}
            >
              Explore Marketplace
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
