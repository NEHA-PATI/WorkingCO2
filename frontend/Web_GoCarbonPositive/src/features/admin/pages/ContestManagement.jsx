import React, { useMemo, useState } from "react";
import {
  Download,
  Edit,
  Eye,
  ExternalLink,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  uploadQuizCSV,
  getContestStats,
  createContest,
  updateRule,
  getRewardsCatalogAdmin,
  getRedeemsAdmin,
  createRewardCatalogItem,
  updateRewardCatalogItem,
  deleteRewardCatalogItem,
} from "../services/ContestApi";
import { getContests } from "../services/ContestApi";
import { useEffect } from "react";

const seed = [
  {
    id: 1,
    title: "Sign Up Bonus",
    description: "Complete profile setup",
    points: 500,
    taskType: "signup_bonus",
    isDailyTask: false,
    buttonText: "Complete Profile",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    rules: ["Fill profile", "Upload avatar"],
    rewards: ["500 points", "Pioneer badge"],
    status: "active",
    completions: 820,
    lastUpdated: "2026-02-13",
    publishStartAt: "",
    publishEndAt: "",
  },
  {
    id: 2,
    title: "Daily Check-in",
    description: "Claim daily reward",
    points: 50,
    taskType: "daily_checkin",
    isDailyTask: true,
    buttonText: "Check In",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    rules: ["One completion per day"],
    rewards: ["50 points", "Streak bonus"],
    status: "active",
    completions: 5920,
    lastUpdated: "2026-02-14",
    publishStartAt: "",
    publishEndAt: "",
  },
  {
    id: 3,
    title: "Quiz Challenge",
    description: "Test your knowledge",
    points: 120,
    taskType: "quiz",
    isDailyTask: true,
    buttonText: "Take Quiz",
    color: "from-fuchsia-500 to-pink-600",
    bgColor: "bg-fuchsia-50",
    borderColor: "border-fuchsia-200",
    rules: ["Answer 10 questions", "2 minute limit"],
    rewards: ["Up to 150 points"],
    status: "draft",
    completions: 0,
    lastUpdated: "2026-02-12",
    publishStartAt: "",
    publishEndAt: "",
  },
];

const emptyContest = () => ({
  id: null,
  title: "",
  description: "",
  points: 0,
  taskType: "",
  isDailyTask: false,
  buttonText: "",
  color: "",
  bgColor: "",
  borderColor: "",
  rules: [""],
  rewards: [""],
  status: "draft",
  completions: 0,
  lastUpdated: new Date().toISOString().slice(0, 10),
  publishStartAt: "",
  publishEndAt: "",
});

const emptyReward = () => ({
  reward_id: "",
  name: "",
  description: "",
  points: 0,
  image_url: "",
  is_active: true,
  created_at: "",
  updated_at: "",
});

export default function ContestManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [contests, setContests] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState(null);
const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyContest());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [quizFileName, setQuizFileName] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    daily: "all",
    taskType: "all",
  });
  const [rewardsCatalog, setRewardsCatalog] = useState([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [rewardsSearch, setRewardsSearch] = useState("");
  const [isRewardFormOpen, setIsRewardFormOpen] = useState(false);
  const [rewardDraft, setRewardDraft] = useState(emptyReward());
  const [isRewardSaving, setIsRewardSaving] = useState(false);
  const [isEditingReward, setIsEditingReward] = useState(false);
  const [redeems, setRedeems] = useState([]);
  const [redeemsLoading, setRedeemsLoading] = useState(false);

const loadContests = async () => {
  try {
    setLoading(true);

    const res = await getContests();
    const raw = res.data || {};

    const statsRes = await getContestStats();
    const statsArray = statsRes.data || [];

    const statsMap = {};
    statsArray.forEach(item => {
      statsMap[item.action_key] = Number(item.completions);
    });

    const contestsArray = Object.entries(raw).map(([key, value], index) => {
  let points = 0;
  let isDailyTask = false;
  let rules = [];

  // ONE TIME
  if (value.one_time) {
    points = value.one_time.points || 0;
    rules = value.one_time.rules || [];
  }

  // DAILY
  if (value.daily) {
    points = value.daily.points_per_action || 0;
    isDailyTask = true;
    rules = value.daily.rules || [];
  }

  // CONSISTENCY (optional: take first milestone rules)
  if (value.consistency) {
    const firstKey = Object.keys(value.consistency)[0];
    if (value.consistency[firstKey]?.rules?.length) {
      rules = value.consistency[firstKey].rules;
    }
  }

  return {
    id: value.rule_id ?? null,
    uiId: value.rule_id ?? `${key}-${index}`,

    title: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    description: "",
    points,
    taskType: key,
    isDailyTask,
    buttonText: "Start",
    color: "from-slate-500 to-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",

    rules: rules.length ? rules : [""],  // 👈 IMPORTANT FIX
    rewards: [`${points} points`],

    status: value.is_active ? "active" : "draft",
    completions: statsMap[key] || 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
});


    setContests(contestsArray);

    if (contestsArray.length > 0) {
     setSelectedContestId(contestsArray[0].uiId);

    }

  } catch (err) {
    console.error("Failed to load contests:", err);
  } finally {
    setLoading(false);
  }
};

const loadRewardsCatalog = async (search = "") => {
  try {
    setRewardsLoading(true);
    const res = await getRewardsCatalogAdmin({ page: 1, limit: 500, search });
    setRewardsCatalog(res?.data || []);
  } catch (err) {
    console.error("Failed to load rewards catalog:", err);
    alert("Failed to load rewards catalog");
  } finally {
    setRewardsLoading(false);
  }
};

const loadRedeems = async () => {
  try {
    setRedeemsLoading(true);
    const res = await getRedeemsAdmin({ page: 1, limit: 500 });
    setRedeems(res?.data || []);
  } catch (err) {
    console.error("Failed to load redeems:", err);
    alert("Failed to load redeems");
  } finally {
    setRedeemsLoading(false);
  }
};

 useEffect(() => {
  loadContests();
  loadRewardsCatalog();
  loadRedeems();
}, []);



  const selectedContest = useMemo(
    () => contests.find((c) => c.uiId === selectedContestId) || null,
    [contests, selectedContestId]
  );

  const taskTypes = useMemo(
    () => Array.from(new Set(contests.map((c) => c.taskType).filter(Boolean))),
    [contests]
  );

  const filteredContests = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return contests.filter((c) => {
      const searchHit =
        !q || c.title.toLowerCase().includes(q) || c.taskType.toLowerCase().includes(q);
      const statusHit = filters.status === "all" || c.status === filters.status;
      const dailyHit =
        filters.daily === "all" ||
        (filters.daily === "daily" ? c.isDailyTask : !c.isDailyTask);
      const typeHit = filters.taskType === "all" || c.taskType === filters.taskType;
      return searchHit && statusHit && dailyHit && typeHit;
    });
  }, [contests, filters]);

  const filteredRewards = useMemo(() => {
    const q = rewardsSearch.trim().toLowerCase();
    if (!q) return rewardsCatalog;

    return rewardsCatalog.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();
      const rewardId = String(item.reward_id || "").toLowerCase();
      return name.includes(q) || description.includes(q) || rewardId.includes(q);
    });
  }, [rewardsCatalog, rewardsSearch]);

  const kpis = useMemo(() => {
    const active = contests.filter((c) => c.status === "active").length;
    const total = contests.length;
    const completions = contests.reduce((sum, c) => sum + c.completions, 0);
    const coverage = total ? Math.round((contests.filter((c) => c.completions > 0).length / total) * 100) : 0;
    return { active, total, completions, coverage };
  }, [contests]);

  const openCreate = () => {
    setDraft(emptyContest());
    setIsFormOpen(true);
    setActiveTab("edit");
  };

  const openEdit = (contest) => {
    setDraft({
      ...contest,
      rules: contest.rules?.length ? contest.rules : [""],
      rewards: contest.rewards?.length ? contest.rewards : [""],
    });
    setSelectedContestId(contest.uiId);
    setIsFormOpen(true);
    setActiveTab("edit");
  };

  const openPreview = (contest) => {
    setSelectedContestId(contest.uiId);
    setDraft(contest);
    setActiveTab("preview");
  };

//   const saveDraft = async () => {
//   try {

//   if (draft.id && Number.isInteger(Number(draft.id))) {

//     // 🟡 UPDATE EXISTING RULE (only if real DB id)
//     await updateRule(Number(draft.id), {
//       points: draft.points,
//       is_active: draft.status === "active"
//     });

//     alert("Contest updated successfully ✅");

//   } else {

//     // 🟢 CREATE NEW RULE
//    await createContest({
//   action_key: draft.taskType,
//   action_type: draft.isDailyTask ? "daily" : "one_time",
//   points: draft.points,
//   milestone_weeks: null,
//   max_points_per_day: draft.isDailyTask ? draft.points : null
// });


//     alert("Contest created successfully ✅");
//   }

//   setIsFormOpen(false);
//   setActiveTab("all");

//   // reload data
//   loadContests();

// } catch (err) {
//   alert(err.message);
// }};

const saveDraft = async () => {
  try {

    if (draft.id && Number.isInteger(Number(draft.id))) {

      // ✅ UPDATE EXISTING RULE
     await updateRule(Number(draft.id), {
  points: draft.points,
  max_points_per_day: draft.isDailyTask ? draft.points : null,
  is_active: draft.status === "active",
  rules: draft.rules.filter(Boolean)
});


      alert("Contest updated successfully ✅");

    } else {

      // ✅ CREATE NEW RULE (PROPER BACKEND FORMAT)
     await createContest({
  action_key: draft.taskType,
  action_type: draft.isDailyTask ? "daily" : "one_time",
  points: draft.points,
  milestone_weeks: null,
  max_points_per_day: draft.isDailyTask ? draft.points : null,
  rules: draft.rules.filter(Boolean)   // 👈 THIS IS IMPORTANT
});


      alert("Contest created successfully ✅");
    }

    setIsFormOpen(false);
    setActiveTab("all");

    await loadContests();

  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌");
  }
};


  const deleteContest = (id) => {
    setContests(contests.filter((c) => c.uiId !== id));
    setSelectedRows(selectedRows.filter((v) => v !== id));
    if (selectedContestId === id) setSelectedContestId(null);
  };

  const bulkDelete = () => {
    if (!selectedRows.length) return;
    const set = new Set(selectedRows);
    setContests(contests.filter((c) => !set.has(c.uiId)));
    setSelectedRows([]);
    if (selectedContestId && set.has(selectedContestId)) setSelectedContestId(null);
  };

const setStatus = async (id, status) => {
  try {
    // Only update if id is a valid number
    if (!id || isNaN(Number(id))) {
      console.warn("Invalid DB id, skipping update:", id);
      return;
    }

    await updateRule(Number(id), {
      is_active: status === "active"
    });

    setContests(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status } : c
      )
    );

  } catch (err) {
    console.error(err);
  }
};

  const openCreateReward = () => {
    setRewardDraft(emptyReward());
    setIsEditingReward(false);
    setIsRewardFormOpen(true);
  };

  const openEditReward = (reward) => {
    setRewardDraft({
      reward_id: String(reward.reward_id || ""),
      name: reward.name || "",
      description: reward.description || "",
      points: Number(reward.points || 0),
      image_url: reward.image_url || "",
      is_active: Boolean(reward.is_active),
      created_at: reward.created_at || "",
      updated_at: reward.updated_at || "",
    });
    setIsEditingReward(true);
    setIsRewardFormOpen(true);
  };

  const saveRewardDraft = async () => {
    try {
      setIsRewardSaving(true);
      const payload = {
        name: rewardDraft.name,
        description: rewardDraft.description,
        points: Number(rewardDraft.points || 0),
        image_url: rewardDraft.image_url,
        is_active: Boolean(rewardDraft.is_active),
      };

      if (isEditingReward) {
        await updateRewardCatalogItem(rewardDraft.reward_id, payload);
      } else {
        await createRewardCatalogItem({
          ...payload,
          reward_id: rewardDraft.reward_id?.trim() || undefined,
        });
      }

      setIsRewardFormOpen(false);
      setRewardDraft(emptyReward());
      await loadRewardsCatalog(rewardsSearch);
    } catch (err) {
      console.error("Failed to save reward:", err);
      alert(err.message || "Failed to save reward");
    } finally {
      setIsRewardSaving(false);
    }
  };

  const removeReward = async (rewardId) => {
    const confirmed = window.confirm("Delete this reward?");
    if (!confirmed) return;

    try {
      await deleteRewardCatalogItem(rewardId);
      await loadRewardsCatalog(rewardsSearch);
    } catch (err) {
      console.error("Failed to delete reward:", err);
      alert(err.message || "Failed to delete reward");
    }
  };

  const toggleRewardStatus = async (reward) => {
    try {
      await updateRewardCatalogItem(reward.reward_id, {
        is_active: !reward.is_active,
      });
      await loadRewardsCatalog(rewardsSearch);
    } catch (err) {
      console.error("Failed to update reward status:", err);
      alert(err.message || "Failed to update reward status");
    }
  };



  const handleExportCsv = () => {
    const generatedAt = new Date();
    const fileName = `contest-management-${generatedAt.toISOString().slice(0, 10)}.csv`;

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const headers = [
      "Id",
      "Title",
      "Description",
      "Points",
      "Task Type",
      "Is Daily Task",
      "Button Text",
      "Gradient",
      "Bg Color",
      "Border Color",
      "Rules",
      "Rewards",
      "Status",
      "Completions",
      "Last Updated",
      "Publish Start",
      "Publish End",
    ];

    const rows = contests.map((contest) => [
      contest.id,
      contest.title,
      contest.description,
      contest.points,
      contest.taskType,
      contest.isDailyTask ? "Yes" : "No",
      contest.buttonText,
      contest.color,
      contest.bgColor,
      contest.borderColor,
      (contest.rules || []).join(" | "),
      (contest.rewards || []).join(" | "),
      contest.status,
      contest.completions,
      contest.lastUpdated,
      contest.publishStartAt,
      contest.publishEndAt,
    ]);

    const csvLines = [headers, ...rows].map((row) => row.map(escapeCsv).join(","));
    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 p-8 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contest Management</h1>
          <p className="text-slate-500 mt-1">Manage and monitor user-side contests</p>
          <ContestAuditTimeline contest={selectedContest} />
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">
            <Plus className="w-4 h-4" /> New Contest
          </button>
          <button
            onClick={() => {
              if (activeTab === "reward-upload") {
                loadRewardsCatalog(rewardsSearch);
                return;
              }
              if (activeTab === "redeem") {
                loadRedeems();
                return;
              }
              loadContests();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleExportCsv} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Active Contests" value={kpis.active} />
        <Stat label="Total Contests" value={kpis.total} />
        <Stat label="Total Completions" value={kpis.completions.toLocaleString()} />
        <Stat label="Completion Coverage" value={`${kpis.coverage}%`} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 flex overflow-x-auto">
          {[
            { id: "all", label: "All Contests" },
            { id: "edit", label: "Create/Edit" },
            { id: "preview", label: "Preview" },
            { id: "analytics", label: "Analytics" },
            { id: "quiz-upload", label: "Quiz Upload" },
            { id: "reward-upload", label: "Rewards" },
            { id: "redeem", label: "Redeems" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm border-b-2 min-w-fit ${
                activeTab === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {activeTab === "all" && (
            <>
              <ContestFiltersBar filters={filters} setFilters={setFilters} taskTypes={taskTypes} />
              <BulkActionBar selectedCount={selectedRows.length} onClear={() => setSelectedRows([])} onDelete={bulkDelete} />
              <ContestTableV2
                rows={filteredContests}
                selectedRows={selectedRows}
                onSelectRows={setSelectedRows}
                onView={openPreview}
                onEdit={openEdit}
                onDelete={deleteContest}
                onStatusChange={setStatus}
              />
            </>
          )}

          {activeTab === "edit" && (
            <div className="border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
              Use <span className="font-medium">New Contest</span> or row Edit to open drawer.
            </div>
          )}

          {activeTab === "preview" && <ContestPreview contest={draft.title ? draft : selectedContest} />}
          {activeTab === "analytics" && <AnalyticsPanel contests={contests} selected={selectedContest} />}
          {activeTab === "quiz-upload" && (
            <QuizUploadPanel
              contest={draft.title ? draft : selectedContest}
              fileName={quizFileName}
              onFileNameChange={setQuizFileName}
            />
          )}
          {activeTab === "reward-upload" && (
            <RewardsCatalogPanel
              rows={filteredRewards}
              loading={rewardsLoading}
              search={rewardsSearch}
              onSearchChange={setRewardsSearch}
              onSearchSubmit={() => loadRewardsCatalog(rewardsSearch)}
              onCreate={openCreateReward}
              onEdit={openEditReward}
              onDelete={removeReward}
              onToggleStatus={toggleRewardStatus}
            />
          )}
          {activeTab === "redeem" && (
            <RedeemsPanel
              rows={redeems}
              loading={redeemsLoading}
            />
          )}
        </div>
      </div>

      <ContestFormDrawer
        isOpen={isFormOpen}
        value={draft}
        allContests={contests}
        onChange={setDraft}
        onClose={() => setIsFormOpen(false)}
        onSave={saveDraft}
      />
      <RewardFormDrawer
        isOpen={isRewardFormOpen}
        value={rewardDraft}
        isEditing={isEditingReward}
        isSaving={isRewardSaving}
        onChange={setRewardDraft}
        onClose={() => setIsRewardFormOpen(false)}
        onSave={saveRewardDraft}
      />
    </div>
  );
}

function ContestFiltersBar({ filters, setFilters, taskTypes }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <label className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            placeholder="Search title / taskType"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </label>
        <label className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.status}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <select
          value={filters.daily}
          onChange={(e) => setFilters((p) => ({ ...p, daily: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        >
          <option value="all">All frequencies</option>
          <option value="daily">Daily only</option>
          <option value="non-daily">Non daily</option>
        </select>
        <select
          value={filters.taskType}
          onChange={(e) => setFilters((p) => ({ ...p, taskType: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        >
          <option value="all">All task types</option>
          {taskTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function BulkActionBar({ selectedCount, onClear, onDelete }) {
  if (!selectedCount) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-4 py-2 flex justify-between items-center">
      <span className="text-sm">{selectedCount} contests selected</span>
      <div className="flex gap-2">
        <button onClick={onDelete} className="text-sm px-2 py-1 rounded bg-white/15 hover:bg-white/25">
          Delete Selected
        </button>
        <button onClick={onClear} className="text-sm px-2 py-1 rounded bg-white/15 hover:bg-white/25">
          Clear
        </button>
      </div>
    </div>
  );
}

function ContestStatusToggle({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1 text-sm border border-slate-200 rounded-md bg-white"
    >
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="archived">Archived</option>
    </select>
  );
}

function ContestTableV2({
  rows,
  selectedRows,
  onSelectRows,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const selectedSet = new Set(selectedRows);
  const allChecked = rows.length > 0 && rows.every((r) => selectedSet.has(r.uiId));
  const toggleAll = () => onSelectRows(allChecked ? [] : rows.map((r) => r.uiId));
  const toggleRow = (id) =>
    onSelectRows(selectedSet.has(id) ? selectedRows.filter((v) => v !== id) : [...selectedRows, id]);

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-4 py-3">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} />
            </th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Task Type</th>
            <th className="px-4 py-3">Points</th>
            <th className="px-4 py-3">Daily</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Completions</th>
            <th className="px-4 py-3">Last Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row.uiId} className="hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <input type="checkbox" checked={selectedSet.has(row.uiId)} onChange={() => toggleRow(row.uiId)} />
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{row.title}</td>
              <td className="px-4 py-3 text-slate-600">{row.taskType}</td>
              <td className="px-4 py-3 text-slate-600">{row.points}</td>
              <td className="px-4 py-3 text-slate-600">{row.isDailyTask ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <ContestStatusToggle value={row.status} onChange={(status) => onStatusChange(row.id, status)} />
              </td>
              <td className="px-4 py-3 text-slate-600">{row.completions}</td>
              <td className="px-4 py-3 text-slate-500">{row.lastUpdated}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onView(row)}
                    className="p-1.5 border border-slate-200 rounded-md text-slate-600"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(row)}
                    className="p-1.5 border border-slate-200 rounded-md text-slate-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(row.uiId)}
                    className="p-1.5 border border-red-200 rounded-md text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <div className="p-6 text-sm text-slate-500 text-center">No contests found.</div>}
    </div>
  );
}

function ContestFormDrawer({ isOpen, value, allContests, onChange, onClose, onSave }) {
  if (!isOpen) return null;

  const duplicateTaskType =
    Boolean(value.taskType) &&
    allContests.some((c) => c.taskType === value.taskType && c.id !== value.id);

  const updateList = (key, idx, val) =>
    onChange((prev) => ({ ...prev, [key]: prev[key].map((x, i) => (i === idx ? val : x)) }));
  const addList = (key) => onChange((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  const removeList = (key, idx) =>
    onChange((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{value.id ? "Edit Contest" : "Create Contest"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title" value={value.title} onChange={(v) => onChange((p) => ({ ...p, title: v }))} />
            <Input
              label="Task Type"
              value={value.taskType}
              onChange={(v) => onChange((p) => ({ ...p, taskType: v }))}
              hint={duplicateTaskType ? "Task type already exists." : "Use stable value: e.g. daily_checkin"}
              hintError={duplicateTaskType}
            />
            <Input
              label="Points"
              type="number"
              value={value.points}
              onChange={(v) => onChange((p) => ({ ...p, points: Number(v || 0) }))}
            />
            <Input
              label="Button Text"
              value={value.buttonText}
              onChange={(v) => onChange((p) => ({ ...p, buttonText: v }))}
            />
          </div>

          <Input
            label="Description"
            value={value.description}
            onChange={(v) => onChange((p) => ({ ...p, description: v }))}
            textarea
          />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Gradient" value={value.color} onChange={(v) => onChange((p) => ({ ...p, color: v }))} />
            <Input label="Bg Color" value={value.bgColor} onChange={(v) => onChange((p) => ({ ...p, bgColor: v }))} />
            <Input label="Border Color" value={value.borderColor} onChange={(v) => onChange((p) => ({ ...p, borderColor: v }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-slate-600">Status</span>
              <select
                value={value.status}
                onChange={(e) => onChange((p) => ({ ...p, status: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">Daily Task</span>
              <div className="mt-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value.isDailyTask}
                    onChange={(e) => onChange((p) => ({ ...p, isDailyTask: e.target.checked }))}
                  />
                  Enable daily lock
                </label>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Publish Start"
              type="datetime-local"
              value={value.publishStartAt || ""}
              onChange={(v) => onChange((p) => ({ ...p, publishStartAt: v }))}
            />
            <Input
              label="Publish End"
              type="datetime-local"
              value={value.publishEndAt || ""}
              onChange={(v) => onChange((p) => ({ ...p, publishEndAt: v }))}
            />
          </div>

          <ListEditor
            label="Rules"
            values={value.rules}
            onAdd={() => addList("rules")}
            onRemove={(i) => removeList("rules", i)}
            onEdit={(i, v) => updateList("rules", i, v)}
          />
          <ListEditor
            label="Rewards"
            values={value.rewards}
            onAdd={() => addList("rewards")}
            onRemove={(i) => removeList("rewards", i)}
            onEdit={(i, v) => updateList("rewards", i, v)}
          />

          <ContestHealthAlerts contest={value} />
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={duplicateTaskType}
            className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg disabled:opacity-50"
          >
            Save Contest
          </button>
        </div>
      </div>
    </div>
  );
}

function ContestHealthAlerts({ contest }) {
  const issues = [];
  if (!contest.title?.trim()) issues.push("Title is missing.");
  if (!contest.taskType?.trim()) issues.push("Task type is missing.");
  if (!(contest.rules || []).filter(Boolean).length) issues.push("No rules configured.");
  if (!(contest.rewards || []).filter(Boolean).length) issues.push("No rewards configured.");
  if (contest.status === "active" && !contest.publishStartAt) issues.push("Active contest should have publish start.");

  if (!issues.length) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-3 text-sm text-green-700">
        Contest health is good.
      </div>
    );
  }
  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
      <p className="text-sm font-semibold text-amber-800">Health Alerts</p>
      <ul className="text-sm text-amber-700 mt-2 space-y-1">
        {issues.map((issue) => (
          <li key={issue}>- {issue}</li>
        ))}
      </ul>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", textarea = false, hint, hintError = false, disabled = false }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          disabled={disabled}
          className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg ${
            hintError ? "border-red-300" : "border-slate-200"
          }`}
        />
      )}
      {hint ? (
        <p className={`text-sm mt-1 ${hintError ? "text-red-600" : "text-slate-500"}`}>{hint}</p>
      ) : null}
    </label>
  );
}

function ListEditor({ label, values, onAdd, onRemove, onEdit }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button onClick={onAdd} className="text-sm px-2 py-1 border border-slate-200 rounded-md">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={`${label}-${i}`} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => onEdit(i, e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <button
              onClick={() => onRemove(i)}
              className="px-2 border border-red-200 text-red-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function ContestAuditTimeline({ contest }) {
  if (!contest) {
    return (
      <div className="mt-2 text-sm text-slate-500">
        Select a contest to view audit timeline.
      </div>
    );
  }
  const events = [
    `Updated contest on ${contest.lastUpdated}`,
    `Status is currently ${contest.status}`,
    "Synced to user Arena page",
  ];
  return (
    <div className="mt-2">
      <p className="text-sm font-semibold text-slate-700">Audit Timeline</p>
      <div className="mt-1 space-y-1">
        {events.map((e) => (
          <p key={e} className="text-sm text-slate-500">
            {e}
          </p>
        ))}
      </div>
    </div>
  );
}

function ContestPreview({ contest }) {
  if (!contest) return <div className="text-sm text-slate-500">No contest selected.</div>;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500 mb-2">Card Preview</p>
        <div className={`${contest.bgColor || "bg-slate-50"} ${contest.borderColor || "border-slate-200"} border rounded-xl p-4`}>
          <h3 className="font-semibold text-slate-900">{contest.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{contest.description}</p>
          <button className={`mt-3 w-full py-2 text-sm text-white rounded-lg bg-gradient-to-r ${contest.color || "from-slate-500 to-slate-700"}`}>
            {contest.buttonText || "Action"}
          </button>
        </div>
      </div>
      <div className="border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500 mb-2">Modal Preview</p>
        <h3 className="font-semibold">{contest.title}</h3>
        <p className="text-sm text-slate-600 mt-1">{contest.description}</p>
        <p className="text-sm font-medium mt-3">Rules</p>
        <ul className="text-sm text-slate-600">
          {(contest.rules || []).map((r, i) => (
            <li key={`${r}-${i}`}>{i + 1}. {r}</li>
          ))}
        </ul>
        <p className="text-sm font-medium mt-3">Rewards</p>
        <ul className="text-sm text-slate-600">
          {(contest.rewards || []).map((r, i) => (
            <li key={`${r}-${i}`}>{i + 1}. {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AnalyticsPanel({ contests, selected }) {
  const max = Math.max(...contests.map((c) => c.completions), 1);
  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Completions by Contest</h3>
        <div className="space-y-3">
          {contests.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{c.title}</span>
                <span>{c.completions}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div
                  className={`h-full bg-gradient-to-r ${c.color || "from-slate-500 to-slate-700"} rounded-full`}
                  style={{ width: `${(c.completions / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContestHealthAlerts contest={selected || contests[0]} />
    </div>
  );
}

function RewardsCatalogPanel({
  rows,
  loading,
  search,
  onSearchChange,
  onSearchSubmit,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reward by id, name, description"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </label>
        <button
          type="button"
          onClick={onSearchSubmit}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white"
        >
          <Search className="w-4 h-4" /> Search
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" /> New Reward
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Reward ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  Loading rewards...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No rewards found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.reward_id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.reward_id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{row.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{row.description || "No description"}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{Number(row.points || 0)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(row)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {row.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {row.image_url ? (
                      <a
                        href={row.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800"
                        title={row.image_url}
                      >
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(row.created_at)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(row.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="p-1.5 border border-slate-200 rounded-md text-slate-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.reward_id)}
                        className="p-1.5 border border-red-200 rounded-md text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RedeemsPanel({ rows, loading }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Redeem ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Reward</th>
              <th className="px-4 py-3">Points Used</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Redeemed At</th>
              <th className="px-4 py-3">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Loading redeems...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No redeems found.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const metadataText = row.metadata
                  ? (typeof row.metadata === "string"
                      ? row.metadata
                      : JSON.stringify(row.metadata))
                  : "-";

                return (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.id}</td>
                    <td className="px-4 py-3 text-slate-700">{row.u_id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{row.reward_name || row.reward_id}</p>
                      <p className="text-xs text-slate-500">{row.reward_id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{Number(row.points_used || 0)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.status || "SUCCESS"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(row.redeemed_at)}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[320px]">
                      <div className="truncate" title={metadataText}>{metadataText}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RewardFormDrawer({
  isOpen,
  value,
  isEditing,
  isSaving,
  onChange,
  onClose,
  onSave,
}) {
  if (!isOpen) return null;

  const setField = (key, fieldValue) => onChange((prev) => ({ ...prev, [key]: fieldValue }));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{isEditing ? "Edit Reward" : "Create Reward"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Reward ID"
              value={value.reward_id}
              onChange={(v) => setField("reward_id", v)}
              disabled={isEditing}
              hint={isEditing ? "Reward ID cannot be changed." : "Optional. Leave blank for auto-generated id."}
            />
            <Input
              label="Points"
              type="number"
              value={value.points}
              onChange={(v) => setField("points", Number(v || 0))}
            />
          </div>
          <Input label="Name" value={value.name} onChange={(v) => setField("name", v)} />
          <Input
            label="Description"
            value={value.description}
            onChange={(v) => setField("description", v)}
            textarea
          />
          <Input
            label="Image URL"
            value={value.image_url}
            onChange={(v) => setField("image_url", v)}
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(value.is_active)}
              onChange={(e) => setField("is_active", e.target.checked)}
            />
            Active reward
          </label>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Reward"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function QuizUploadPanel({ fileName, onFileNameChange }) {
  const pickFile = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  onFileNameChange(file.name);

  try {
    await uploadQuizCSV(file);
    alert("CSV uploaded and saved to active.json ✅");
  } catch (err) {
    alert("Upload failed ❌");
    console.error(err);
  }
};


  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
      <p className="text-sm text-slate-600">
        Upload quiz CSV file (will be converted to JSON)
      </p>

      <label className="inline-flex mt-3 px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer">
        Browse CSV
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={pickFile}
        />
      </label>

      {fileName && (
        <p className="mt-3 text-sm text-emerald-700">
          {fileName}
        </p>
      )}
    </div>
  );
}
