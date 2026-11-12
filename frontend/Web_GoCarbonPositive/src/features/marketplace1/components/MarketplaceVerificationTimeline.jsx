import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ClipboardCheck,
  FileText,
  ScanSearch,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  Wifi,
} from "lucide-react";

const TIMELINE_STAGES = [
  {
    title: "Seller declaration",
    description:
      "Project details, credit quantity, and pricing submitted by the seller.",
    badge: "Seller",
    date: "10 April 2026",
    color: "#3B6D11",
    bg: "#EAF3DE",
    Icon: UserCircle,
  },
  {
    title: "Document upload",
    description:
      "Issuance certificate, registry screenshot, and balance proof uploaded securely.",
    badge: "Seller",
    date: "12 April 2026",
    color: "#3B6D11",
    bg: "#EAF3DE",
    Icon: FileText,
  },
  {
    title: "Automated pre-screening",
    description:
      "Format validation, duplicate scan, serial logic, volume and price anomaly detection.",
    badge: "Automated",
    date: "12 April 2026",
    color: "#185FA5",
    bg: "#E6F1FB",
    Icon: ScanSearch,
  },
  {
    title: "Manual document review",
    description:
      "Reviewer cross-checks every document against public registry records manually.",
    badge: "Manual",
    date: "14 April 2026",
    color: "#534AB7",
    bg: "#EEEDFE",
    Icon: ClipboardCheck,
  },
  {
    title: "Risk scoring",
    description:
      "Composite trust score computed from seller history, doc confidence, and fraud signals.",
    badge: "Async",
    date: "15 April 2026",
    color: "#854F0B",
    bg: "#FAEEDA",
    Icon: ShieldAlert,
  },
  {
    title: "Admin decision",
    description:
      "Admin stamps listing Active, Under Review, or Rejected - seller notified by email.",
    badge: "Gate",
    date: "17 April 2026",
    color: "#993C1D",
    bg: "#FAECE7",
    Icon: ShieldCheck,
  },
  {
    title: "Legal sign-off",
    description:
      "Seller confirms ownership, non-double-sale, accuracy, and accepts penalty terms.",
    badge: "Seller",
    date: "17 April 2026",
    color: "#3B6D11",
    bg: "#EAF3DE",
    Icon: ScrollText,
  },
  {
    title: "Live monitoring",
    description:
      "Continuous duplicate detection and anomaly watch once listing is publicly active.",
    badge: "Automated",
    date: "18 April 2026",
    color: "#185FA5",
    bg: "#E6F1FB",
    Icon: Wifi,
  },
];

function splitDate(date) {
  const parts = date.split(" ");
  return {
    dayMonth: `${parts[0]} ${parts[1]}`,
    year: parts[2],
  };
}

function TimelineCard({ stage, showDate }) {
  const date = splitDate(stage.date);
  const style = {
    "--stage-color": stage.color,
    "--stage-bg": stage.bg,
  };

  return (
    <div className="marketplace1-vtimeline-card-wrap" style={style}>
      {showDate && (
        <div className="marketplace1-vtimeline-date marketplace1-vtimeline-date--inside">
          <span>{date.dayMonth}</span>
          <span>{date.year}</span>
        </div>
      )}
      <div className="marketplace1-vtimeline-card-head">{stage.title}</div>
      <div className="marketplace1-vtimeline-card-body">{stage.description}</div>
      <span className="marketplace1-vtimeline-badge">
        <span className="marketplace1-vtimeline-badge-dot" />
        {stage.badge}
      </span>
    </div>
  );
}

function TimelineDate({ stage, align = "left" }) {
  const date = splitDate(stage.date);
  return (
    <div
      className={`marketplace1-vtimeline-date ${
        align === "right"
          ? "marketplace1-vtimeline-date--right"
          : "marketplace1-vtimeline-date--left"
      }`}
    >
      <span>{date.dayMonth}</span>
      <span>{date.year}</span>
    </div>
  );
}

function TimelineRowDesktop({ stage, index, total }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { amount: 0.1, once: true });
  const isOdd = index % 2 === 0;
  const delayBase = index * 0.15;
  const hasNext = index < total - 1;
  const cardX = isOdd ? -50 : 50;
  const dateX = isOdd ? -40 : 40;
  const style = {
    "--stage-color": stage.color,
    "--stage-bg": stage.bg,
  };

  return (
    <div ref={rowRef} className="marketplace1-vtimeline-row marketplace1-vtimeline-row--desktop" style={style}>
      <div className="marketplace1-vtimeline-col1">
        {isOdd ? (
          <motion.div
            initial={{ x: cardX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: cardX, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: delayBase }}
          >
            <TimelineCard stage={stage} />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-col2">
        {isOdd ? (
          <motion.div
            initial={{ x: dateX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: dateX, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: delayBase }}
          >
            <TimelineDate stage={stage} align="right" />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-col3">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.4, ease: "backOut", delay: delayBase }}
          className="marketplace1-vtimeline-node"
        >
          <stage.Icon className="h-6 w-6" />
        </motion.div>
        {hasNext ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={
              inView
                ? { opacity: 1, y: [0, 6, 0] }
                : { opacity: 0, y: -8 }
            }
            transition={{
              delay: delayBase + 0.3,
              duration: 0.9,
              ease: "easeOut",
              repeat: inView ? Infinity : 0,
            }}
            className="marketplace1-vtimeline-connector"
          >
            <span className="marketplace1-vtimeline-connector-line" />
            <span className="marketplace1-vtimeline-connector-arrow" />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-col4">
        {!isOdd ? (
          <motion.div
            initial={{ x: dateX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: dateX, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: delayBase }}
          >
            <TimelineDate stage={stage} align="left" />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-col5">
        {!isOdd ? (
          <motion.div
            initial={{ x: cardX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: cardX, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: delayBase }}
          >
            <TimelineCard stage={stage} />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function TimelineRowTablet({ stage, index, total }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { amount: 0.1, once: true });
  const isOdd = index % 2 === 0;
  const delayBase = index * 0.15;
  const hasNext = index < total - 1;
  const cardX = isOdd ? -50 : 50;
  const style = {
    "--stage-color": stage.color,
    "--stage-bg": stage.bg,
  };

  return (
    <div ref={rowRef} className="marketplace1-vtimeline-row marketplace1-vtimeline-row--tablet" style={style}>
      <div className="marketplace1-vtimeline-tablet-col-left">
        {isOdd ? (
          <motion.div
            initial={{ x: cardX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: cardX, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: delayBase }}
          >
            <TimelineCard stage={stage} showDate />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-tablet-col-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.4, ease: "backOut", delay: delayBase }}
          className="marketplace1-vtimeline-node"
        >
          <stage.Icon className="h-6 w-6" />
        </motion.div>
        {hasNext ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={
              inView
                ? { opacity: 1, y: [0, 6, 0] }
                : { opacity: 0, y: -8 }
            }
            transition={{
              delay: delayBase + 0.3,
              duration: 0.9,
              ease: "easeOut",
              repeat: inView ? Infinity : 0,
            }}
            className="marketplace1-vtimeline-connector"
          >
            <span className="marketplace1-vtimeline-connector-line" />
            <span className="marketplace1-vtimeline-connector-arrow" />
          </motion.div>
        ) : null}
      </div>

      <div className="marketplace1-vtimeline-tablet-col-right">
        {!isOdd ? (
          <motion.div
            initial={{ x: cardX, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: cardX, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: delayBase }}
          >
            <TimelineCard stage={stage} showDate />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function TimelineRowMobile({ stage, index, total }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { amount: 0.1, once: true });
  const delayBase = index * 0.15;
  const hasNext = index < total - 1;
  const style = {
    "--stage-color": stage.color,
    "--stage-bg": stage.bg,
  };

  return (
    <div ref={rowRef} className="marketplace1-vtimeline-row marketplace1-vtimeline-row--mobile" style={style}>
      <div className="marketplace1-vtimeline-mobile-spine-slot">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.4, ease: "backOut", delay: delayBase }}
          className="marketplace1-vtimeline-node"
        >
          <stage.Icon className="h-6 w-6" />
        </motion.div>
        {hasNext ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={
              inView
                ? { opacity: 1, y: [0, 6, 0] }
                : { opacity: 0, y: -8 }
            }
            transition={{
              delay: delayBase + 0.3,
              duration: 0.9,
              ease: "easeOut",
              repeat: inView ? Infinity : 0,
            }}
            className="marketplace1-vtimeline-connector"
          >
            <span className="marketplace1-vtimeline-connector-line" />
            <span className="marketplace1-vtimeline-connector-arrow" />
          </motion.div>
        ) : null}
      </div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: delayBase }}
        className="marketplace1-vtimeline-mobile-card"
      >
        <TimelineCard stage={stage} showDate />
      </motion.div>
    </div>
  );
}

export default function MarketplaceVerificationTimeline() {
  const stages = useMemo(() => TIMELINE_STAGES, []);

  return (
    <section className="marketplace1-vtimeline-section">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Carbon Positive
        </p>
        <h3 className="marketplace1-headline mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
          Verification Methodology Timeline
        </h3>
      </div>

      <div className="marketplace1-vtimeline-container">
        <div className="marketplace1-vtimeline-desktop hidden lg:block">
          <div className="marketplace1-vtimeline-spine" />
          {stages.map((stage, index) => (
            <TimelineRowDesktop
              key={stage.title}
              stage={stage}
              index={index}
              total={stages.length}
            />
          ))}
        </div>

        <div className="marketplace1-vtimeline-tablet hidden md:block lg:hidden">
          <div className="marketplace1-vtimeline-spine" />
          {stages.map((stage, index) => (
            <TimelineRowTablet
              key={stage.title}
              stage={stage}
              index={index}
              total={stages.length}
            />
          ))}
        </div>

        <div className="marketplace1-vtimeline-mobile block md:hidden">
          <div className="marketplace1-vtimeline-spine" />
          {stages.map((stage, index) => (
            <TimelineRowMobile
              key={stage.title}
              stage={stage}
              index={index}
              total={stages.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
