// @ts-nocheck

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Types ---
const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;
const DEFAULT_CATEGORIES = [
  "CAREER",
  "CREATIVE",
  "FINANCIAL",
  "PERSONAL DEVELOPMENT",
  "RELATIONSHIPS",
  "SPIRITUAL",
];

type Frequency = typeof FREQUENCIES[number];

type Habit = {
  id: string;
  title: string;
  frequency: Frequency;
  category: string;
  xpOnComplete: number;
  streak: number;
  bestStreak: number;
  lastCompletedAt: string | null;
  completions: Record<string, string>;
  isRecurring: boolean;
  specificDate?: string | null;
};

type Reward = { id: string; name: string; cost: number };

type Stored = {
  habits: Habit[];
  points: number;
  totalXP: number;
  goals: Record<string, { monthlyTargetXP: number }>;
  inventory: any[];
  shop: Reward[];
  categories?: string[]; // NEW
};

function classNames(...arr: (string | false | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

function getPeriodKey(freq: Frequency, d = new Date()) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  if (freq === "daily") return `${y}-${m}-${day}`;
  if (freq === "monthly") return `${y}-${m}`;
  if (freq === "yearly") return `${y}`;
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function todayISO() {
  return new Date().toISOString();
}

function inferDateFromKey(pk: string, freq: Frequency): Date | null {
  try {
    if (freq === "daily") {
      const [y, m, d] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    if (freq === "monthly") {
      const [y, m] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, 1);
    }
    if (freq === "yearly") {
      return new Date(Number(pk), 0, 1);
    }
    if (freq === "weekly") {
      const [y, wStr] = pk.split("-W");
      const w = Number(wStr);
      const simple = new Date(Date.UTC(Number(y), 0, 1 + (w - 1) * 7));
      const dayOfWeek = simple.getUTCDay();
      const ISOweekStart = new Date(simple);
      ISOweekStart.setUTCDate(simple.getUTCDate() - ((dayOfWeek + 6) % 7));
      return ISOweekStart;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// --- Storage helpers ---
const LS_KEY = "ghgt:data:v3";

function loadData(): Stored | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveData(data: Stored) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// --- Default seed data ---
const defaultHabits: Habit[] = [
  {
    id: crypto.randomUUID(),
    title: "25-min workout",
    frequency: "daily",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Deep work block",
    frequency: "daily",
    category: "CAREER",
    xpOnComplete: 15,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Budget review",
    frequency: "weekly",
    category: "FINANCIAL",
    xpOnComplete: 25,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Call a friend",
    frequency: "weekly",
    category: "RELATIONSHIPS",
    xpOnComplete: 15,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Read 10 pages",
    frequency: "daily",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Sketch for 20 mins",
    frequency: "weekly",
    category: "CREATIVE",
    xpOnComplete: 20,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Quiet reflection/Prayer",
    frequency: "daily",
    category: "SPIRITUAL",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Portfolio update",
    frequency: "monthly",
    category: "CAREER",
    xpOnComplete: 50,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Annual vision review",
    frequency: "yearly",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 200,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
];

const defaultGoalsByCategory: Record<string, { monthlyTargetXP: number }> = {
  CAREER: { monthlyTargetXP: 400 },
  CREATIVE: { monthlyTargetXP: 200 },
  FINANCIAL: { monthlyTargetXP: 250 },
  "PERSONAL DEVELOPMENT": { monthlyTargetXP: 350 },
  RELATIONSHIPS: { monthlyTargetXP: 200 },
  SPIRITUAL: { monthlyTargetXP: 250 },
};

const defaultRewards: Reward[] = [
  { id: "r1", name: "1-hour guilt-free anime", cost: 150 },
  { id: "r2", name: "Fancy coffee", cost: 120 },
  { id: "r3", name: "New brush set / pen", cost: 300 },
  { id: "r4", name: "Mini shopping spree", cost: 600 },
  { id: "r5", name: "Weekend adventure", cost: 1200 },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// --- Main Component ---
export default function HabitGoalTrackerV3() {
  const saved = typeof window !== 'undefined' ? loadData() : null;
  const [habits, setHabits] = useState<Habit[]>(saved?.habits ?? defaultHabits);
  const [points, setPoints] = useState<number>(saved?.points ?? 0);
  const [totalXP, setTotalXP] = useState<number>(saved?.totalXP ?? 0);
  const [activeFreq, setActiveFreq] = useState<Frequency>("daily");
  const [goals, setGoals] = useState<Record<string, { monthlyTargetXP: number }>>(
    saved?.goals ?? defaultGoalsByCategory
  );
  const [shop, setShop] = useState<Reward[]>(saved?.shop ?? defaultRewards);
  const [inventory, setInventory] = useState<any[]>(saved?.inventory ?? []);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Dynamic categories
  const [categories, setCategories] = useState<string[]>(
    saved?.categories ??
    (saved?.goals ? Object.keys(saved.goals) : DEFAULT_CATEGORIES)
  );
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    saveData({ habits, points, totalXP, goals, inventory, shop, categories });
  }, [habits, points, totalXP, goals, inventory, shop, categories]);

  const level = useMemo(() => Math.floor(Math.sqrt(totalXP) / 2) + 1, [totalXP]);
  const levelProgress = useMemo(() => {
    const currentLevelXP = Math.pow((level - 1) * 2, 2);
    const nextLevelXP = Math.pow(level * 2, 2);
    const span = nextLevelXP - currentLevelXP;
    return Math.min(100, Math.round(((totalXP - currentLevelXP) / span) * 100));
  }, [totalXP, level]);

  const periodKey = useMemo(() => getPeriodKey(activeFreq, selectedDate), [activeFreq, selectedDate]);

  function habitVisibleOnDate(h: Habit, d: Date) {
    if (h.isRecurring) return true;
    if (!h.specificDate) return true;
    const sd = new Date(h.specificDate);
    if (h.frequency === "daily") return sameDay(sd, d);
    if (h.frequency === "weekly") {
      return getPeriodKey("weekly", sd) === getPeriodKey("weekly", d);
    }
    if (h.frequency === "monthly") return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
    if (h.frequency === "yearly") return sd.getFullYear() === d.getFullYear();
    return true;
  }

  function toggleComplete(habitId: string) {
    setHabits((prev) => {
      const now = todayISO();
      return prev.map((h) => {
        if (h.id !== habitId) return h;
        const pk = getPeriodKey(h.frequency, selectedDate);
        const already = !!h.completions[pk];
        const newCompletions: Record<string, string> = { ...h.completions };
        let deltaXP = 0;
        let deltaPts = 0;
        let newStreak = h.streak || 0;

        if (already) {
          delete newCompletions[pk];
          deltaXP -= h.xpOnComplete;
          deltaPts -= Math.round(h.xpOnComplete * 2);
        } else {
          newCompletions[pk] = now;
          deltaXP += h.xpOnComplete;
          deltaPts += Math.round(h.xpOnComplete * 2);
          const lastKey = h.lastCompletedAt ? getPeriodKey(h.frequency, new Date(h.lastCompletedAt)) : null;
          if (lastKey && lastKey !== pk) {
            newStreak = (h.streak || 0) + 1;
          }
        }

        if (deltaXP) setTotalXP((x) => Math.max(0, x + deltaXP));
        if (deltaPts) setPoints((p) => Math.max(0, p + deltaPts));

        return {
          ...h,
          completions: newCompletions,
          lastCompletedAt: !already ? now : h.lastCompletedAt,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak || 0, newStreak || 0),
        };
      });
    });
  }

  function addHabit(h: Partial<Habit>) {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: h.title || "New Habit",
        frequency: (h.frequency as Frequency) || "daily",
        category: h.category || categories[0] || "PERSONAL DEVELOPMENT",
        xpOnComplete: Number(h.xpOnComplete) || 10,
        streak: 0,
        bestStreak: 0,
        lastCompletedAt: null,
        completions: {},
        isRecurring: h.isRecurring ?? true,
        specificDate: h.specificDate || null,
      },
    ]);
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  // Category XP (current month)
  const categoryXP: Record<string, number> = useMemo(() => {
    const now = selectedDate;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const out: Record<string, number> = {} as any;
    categories.forEach((c) => (out[c] = 0));
    habits.forEach((h) => {
      Object.entries(h.completions || {}).forEach(([pk, tsOrBool]) => {
        let d: Date | null = null;
        if (typeof tsOrBool === "string") {
          const dt = new Date(tsOrBool);
          d = isNaN(dt.getTime()) ? null : dt;
        } else if (typeof tsOrBool === "boolean" && tsOrBool) {
          d = inferDateFromKey(pk, h.frequency);
        }
        if (!d) return;
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          out[h.category] = (out[h.category] || 0) + h.xpOnComplete;
        }
      });
    });
    return out;
  }, [habits, selectedDate, categories]);

  function redeemReward(r: Reward) {
    if (points < r.cost) return alert("Not enough points yet!");
    setPoints((p) => p - r.cost);
    setInventory((inv) => [{ ...r, redeemedAt: new Date().toISOString() }, ...inv]);
  }

  function addReward(name: string, cost: number) {
    setShop((s) => [{ id: crypto.randomUUID(), name, cost }, ...s]);
  }

  function deleteReward(id: string) {
    setShop((s) => s.filter((r) => r.id !== id));
  }

  function addCategory(name: string, target: number) {
    const clean = name.trim();
    if (!clean) return;
    const norm = clean.toUpperCase();
    setCategories((prev) => (prev.includes(norm) ? prev : [...prev, norm]));
    setGoals((g) => ({ ...g, [norm]: { monthlyTargetXP: Math.max(0, Number(target || 0)) } }));
  }

  const visibleHabits = habits.filter((h) => h.frequency === activeFreq && habitVisibleOnDate(h, selectedDate));

  // Calendar model for current selected month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const leadingBlanks = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const completedDaysSet = useMemo(() => {
    const set = new Set<string>();
    habits.forEach((h) => {
      Object.entries(h.completions).forEach(([pk, ts]) => {
        const dt = new Date(ts);
        if (dt.getMonth() === selectedDate.getMonth() && dt.getFullYear() === selectedDate.getFullYear()) {
          set.add(`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`);
        }
      });
    });
    return set;
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-4 md:p-8 flex justify-center z-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">HabitQuest v3.2.0</h1>
            <p className="text-slate-300">Track smarter with our Sun–Sat calendar, custom categories, and a cleaner inventory.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-3">
            <StatCard label="Level" value={level} sub={`${levelProgress}% to next`}>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div layout className="h-full bg-emerald-400" animate={{ width: `${levelProgress}%` }} />
              </div>
            </StatCard>
            <StatCard label="Total XP" value={totalXP} />
            <StatCard label="Points" value={points} />
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-6 border border-slate-800 bg-slate-900/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {selectedDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700"
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              >
                ‹ Prev
              </button>
              <button
                className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </button>
              <button
                className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700"
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              >
                Next ›
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 text-xs text-slate-400">
            {WEEKDAYS.map((w) => (
              <div key={w} className="p-2 text-center">{w}</div>
            ))}
          </div>
          <motion.div layout className="grid grid-cols-7 gap-2">
            {cells.map((date, idx) => {
              const isToday = date && sameDay(date, new Date());
              const isSelected = date && sameDay(date, selectedDate);
              const key = date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : `b-${idx}`;
              const hasDone = date ? completedDaysSet.has(key) : false;
              return (
                <motion.button
                  key={key}
                  layout
                  className={classNames(
                    "h-20 rounded-xl border flex flex-col items-center justify-center",
                    date ? "border-slate-800 bg-slate-900/60 hover:bg-slate-900" : "border-transparent",
                    isSelected && "ring-2 ring-cyan-400",
                    isToday && "outline outline-1 outline-emerald-400"
                  )}
                  disabled={!date}
                  onClick={() => date && setSelectedDate(date)}
                  whileHover={date ? { scale: 1.02 } : undefined}
                  whileTap={date ? { scale: 0.98 } : undefined}
                >
                  {date ? (
                    <>
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      <div className="text-[10px] text-slate-400">{WEEKDAYS[date.getDay()]}</div>
                      {hasDone && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    </>
                  ) : (
                    <span />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
          <div className="mt-3 text-xs text-slate-400">
            Viewing period key: <span className="text-slate-200">{periodKey}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFreq(f)}
              className={classNames(
                "px-4 py-2 rounded-full border text-sm capitalize",
                activeFreq === f
                  ? "bg-emerald-500 text-black border-emerald-400"
                  : "bg-slate-800/60 border-slate-700 hover:bg-slate-800"
              )}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setShowAddHabit(true)}
            className="ml-auto px-4 py-2 rounded-full border bg-indigo-500 text-black border-indigo-400 hover:opacity-90"
          >
            + Add Habit
          </button>
        </div>

        {/* Habit List */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <AnimatePresence>
            {visibleHabits.length === 0 && (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-slate-400">
                No habits for this date/frequency. Add one! ✨
              </motion.div>
            )}
            {visibleHabits.map((h) => {
              const pk = getPeriodKey(h.frequency, selectedDate);
              const done = !!h.completions?.[pk];
              return (
                <motion.div key={h.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between border border-slate-800 bg-slate-900/60 rounded-2xl p-4">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {h.title}
                        <span className={classNames("text-[10px] px-2 py-0.5 rounded-full border",
                          h.isRecurring ? "border-emerald-400 text-emerald-300" : "border-cyan-400 text-cyan-300"
                        )}>{h.isRecurring ? "Recurring" : "Specific"}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {h.category} • {h.frequency} • {h.xpOnComplete} XP
                        {h.specificDate && !h.isRecurring && (
                          <span className="ml-2 text-slate-300">on {new Date(h.specificDate).toLocaleDateString()}</span>
                        )}
                        {h.bestStreak ? (
                          <span className="ml-2 text-amber-300">Best streak: {h.bestStreak}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => toggleComplete(h.id)}
                        className={classNames(
                          "px-3 py-2 rounded-xl text-sm border",
                          done
                            ? "bg-emerald-400 text-black border-emerald-300"
                            : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                        )}
                        title={done ? "Undo completion" : "Mark complete"}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {done ? "Completed" : "Complete"}
                      </motion.button>
                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="px-3 py-2 rounded-xl text-sm border bg-red-500/20 border-red-500/40 hover:bg-red-500/30"
                        title="Delete habit"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Goals / Category Progress */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Goal Tracker by Category ({selectedDate.toLocaleString(undefined, { month: 'long' })})
            </h2>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-3 py-1.5 rounded-full border bg-cyan-400 text-black border-cyan-300 hover:opacity-90 text-sm"
            >
              + Add Category
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {categories.map((c) => {
              const earned = categoryXP[c] || 0;
              const target = goals[c]?.monthlyTargetXP || 200;
              const pct = Math.min(100, Math.round((earned / Math.max(1, target)) * 100));
              return (
                <motion.div key={c} layout className="border border-slate-800 bg-slate-900/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{c}</div>
                    <div className="text-sm text-slate-300">{earned}/{target} XP</div>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div layout className="h-full bg-cyan-400" animate={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-xs text-slate-400">Monthly target</label>
                    <input
                      type="number"
                      className="w-28 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
                      value={goals[c]?.monthlyTargetXP}
                      onChange={(e) =>
                        setGoals((g) => ({ ...g, [c]: { monthlyTargetXP: Number(e.target.value || 0) } }))
                      }
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Rewards Shop (Customizable) */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Rewards Shop</h2>
            <button
              onClick={() => setShowAddReward(true)}
              className="px-4 py-2 rounded-full border bg-amber-400 text-black border-amber-300 hover:opacity-90"
            >
              + Add Reward
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1">Spend your points on real-life perks. You earn ~2 pts per XP.</p>

          <motion.div layout className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shop.map((r) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border border-slate-800 bg-slate-900/60 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-slate-300 text-sm">Cost: {r.cost} pts</div>
                  </div>
                  <button
                    onClick={() => deleteReward(r.id)}
                    className="px-2 py-1 rounded-md text-xs border bg-red-500/20 border-red-500/40 hover:bg-red-500/30"
                    title="Delete reward"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => redeemReward(r)}
                  className="mt-2 px-3 py-2 rounded-xl text-sm border bg-emerald-400 text-black border-emerald-300 hover:opacity-90 disabled:opacity-50"
                  disabled={points < r.cost}
                >
                  {points < r.cost ? "Not enough points" : "Redeem"}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {inventory.length > 0 && (
            <details className="mt-6 group">
              <summary className="flex items-center justify-between cursor-pointer select-none border border-slate-800 bg-slate-900/60 rounded-xl px-4 py-3">
                <span className="font-semibold">Your Inventory</span>
                <span className="text-slate-400 text-sm">{inventory.length} item{inventory.length > 1 ? 's' : ''}</span>
              </summary>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {inventory.map((it, idx) => (
                  <li key={idx} className="border border-slate-800 bg-slate-900/60 rounded-xl p-3 text-sm">
                    {it.name}{" "}
                    <span className="text-slate-400">
                      (redeemed {new Date(it.redeemedAt).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 border border-slate-800 bg-slate-900/50 rounded-2xl p-5 text-sm text-slate-300">
          <b>What’s new in v3.2.0:</b>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>📅 Calendar revamp — Sun–Sat headers for quick scanning, click any date to view & complete habits for that day, and period keys now follow your selected date so daily/monthly resets are crystal-clear.</li>
            <li>🆕 Custom Categories — Add your own categories with personalized XP targets, instantly available in both the goal tracker and Add Habit modal.</li>
            <li>📦 Inventory dropdown — Your redeemed rewards are now tucked neatly into a collapsible list for a cleaner dashboard.</li>
            <li>🔁 Recurring vs Specific habits — Recurring habits repeat every period, while Specific habits only show on their set date/month/year.</li>
            <li>✨ UI polish — Motion-based progress bars, smoother calendar hover/tap micro-interactions, animated layout shifts, and subtle spacing refinements for a more balanced look.</li>
          </ul>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddHabit && (
          <AddHabitModal
            onClose={() => setShowAddHabit(false)}
            onSave={(h) => {
              addHabit(h);
              setShowAddHabit(false);
            }}
            categories={categories}
          />
        )}
      </AnimatePresence>

      {/* Add Reward Modal */}
      <AnimatePresence>
        {showAddReward && (
          <AddRewardModal
            onClose={() => setShowAddReward(false)}
            onSave={(payload) => {
              addReward(payload.name, payload.cost);
              setShowAddReward(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategory && (
          <AddCategoryModal
            onClose={() => setShowAddCategory(false)}
            onSave={({ name, target }) => {
              addCategory(name, target);
              setShowAddCategory(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, sub, children }: any) {
  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-2xl p-4 w-full">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

function AddHabitModal({
  onClose,
  onSave,
  categories,
}: {
  onClose: () => void;
  onSave: (h: Partial<Habit>) => void;
  categories: string[];
}) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [category, setCategory] = useState<string>(categories[0] || "");
  const [xpOnComplete, setXpOnComplete] = useState(10);
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, frequency, category, xpOnComplete, isRecurring, specificDate: isRecurring ? null : (specificDate || null) });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md border border-slate-800 bg-slate-900 rounded-2xl p-5 shadow-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Habit</h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-300">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              placeholder="e.g., 25-min workout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300">Frequency</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f} className="capitalize">{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300">XP on completion</label>
              <input
                type="number"
                className="mt-1 w-28 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                value={xpOnComplete}
                onChange={(e) => setXpOnComplete(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Type</label>
              <div className="flex items-center gap-2 mt-1">
                <button type="button" className={classNames("px-2 py-1 rounded-md border text-xs",
                  isRecurring ? "bg-emerald-400 text-black border-emerald-300" : "bg-slate-800 border-slate-700")}
                  onClick={() => setIsRecurring(true)}
                >Recurring</button>
                <button type="button" className={classNames("px-2 py-1 rounded-md border text-xs",
                  !isRecurring ? "bg-cyan-400 text-black border-cyan-300" : "bg-slate-800 border-slate-700")}
                  onClick={() => setIsRecurring(false)}
                >Specific</button>
              </div>
            </div>
          </div>
          {!isRecurring && (
            <div>
              <label className="text-sm text-slate-300">Specific date</label>
              <input
                type="date"
                className="mt-1 w-56 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
              />
              <div className="text-[11px] text-slate-400 mt-1">For weekly/monthly/yearly habits, this date anchors the week/month/year they belong to.</div>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-700">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-400 text-black font-medium">Save</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function AddRewardModal({ onClose, onSave }: { onClose: () => void; onSave: (p: { name: string; cost: number }) => void }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState<number>(100);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, cost: Math.max(1, Number(cost || 1)) });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md border border-slate-800 bg-slate-900 rounded-2xl p-5 shadow-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Reward</h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              placeholder="e.g., Friday movie night"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Cost (points)</label>
            <input
              type="number"
              className="mt-1 w-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value || 0))}
            />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-700">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-400 text-black font-medium">Save</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function AddCategoryModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: { name: string; target: number }) => void;
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number>(200);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, target });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md border border-slate-800 bg-slate-900 rounded-2xl p-5 shadow-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Category</h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-300">Category name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm uppercase"
              placeholder="e.g., HEALTH"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="text-[11px] text-slate-400 mt-1">
              Tip: names are stored uppercase so they’re consistent across the app.
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-300">Monthly target (XP)</label>
            <input
              type="number"
              className="mt-1 w-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value || 0))}
            />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-700">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-medium">Save</button>
        </div>
      </motion.form>
    </motion.div>
  );
}