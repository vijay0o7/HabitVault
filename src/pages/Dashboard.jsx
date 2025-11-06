import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Lamp from "../components/Lamp";
import WeeklyCompletionChart from "../components/WeeklyCompletionChart";
import AddHabitModal from "../components/AddHabitModal";
import HabitItem from "../components/HabitItem";
import ActivityList from "../components/ActivityList";
import API from "../api";

export default function Dashboard() {
  const [kpis, setKpis] = useState({ streak: 0, todayPlanned: 0, todayDone: 0, completionRate: 0 });
  const [weekly, setWeekly] = useState([]);
  const [today, setToday] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [sum, wk, dy] = await Promise.all([
          API.get("/habits/summary"),
          API.get("/habits/weekly"),
          API.get("/habits/today"),
        ]);
        setKpis(sum.data);
        setWeekly(wk.data);
        setToday(dy.data);
        const h = await API.get("/habits/history?limit=20");
        setHistory(h.data);
      } catch {
        // fallback demo
        setKpis({ streak: 7, todayPlanned: 5, todayDone: 3, completionRate: 68 });
        setWeekly([
          { day: "Mon", pct: 55 }, { day: "Tue", pct: 72 }, { day: "Wed", pct: 63 },
          { day: "Thu", pct: 40 }, { day: "Fri", pct: 80 }, { day: "Sat", pct: 50 }, { day: "Sun", pct: 68 },
        ]);
        setToday([
          { id: 1, name: "Morning Walk", goal: "20 min", tag: "Health", done: true },
          { id: 2, name: "Read", goal: "10 pages", tag: "Learning", done: false },
          { id: 3, name: "Code", goal: "1 hour", tag: "Career", done: false },
        ]);
      }
    })();
  }, []);

  const onCreateHabit = async (payload) => {
    try {
      const res = await API.post("/habits", payload);
      setToday((prev) => [{ id: res.data._id, name: res.data.title, goal: res.data.goal, tag: "New", done: false }, ...prev]);
      setOpenAdd(false);
      const h = await API.get("/habits/history?limit=20");
      setHistory(h.data);
    } catch {
      setToday((prev) => [{ id: Date.now(), name: payload.title, goal: payload.goal, tag: "New", done: false }, ...prev]);
      setOpenAdd(false);
    }
  };

  const onToggle = async (item) => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      await API.post(`/habits/${item.id}/complete`, { date: todayStr });
      setToday((prev) => prev.map((h) => (h.id === item.id ? { ...h, done: !h.done } : h)));
      const h = await API.get("/habits/history?limit=20");
      setHistory(h.data);
    } catch {
      setToday((prev) => prev.map((h) => (h.id === item.id ? { ...h, done: !h.done } : h)));
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete habit "${item.name}"?`)) return;
    try {
      await API.delete(`/habits/${item.id}`);
      setToday((prev) => prev.filter((h) => h.id !== item.id));
      const [sum, wk, dy, hist] = await Promise.all([
        API.get("/habits/summary"),
        API.get("/habits/weekly"),
        API.get("/habits/today"),
        API.get("/habits/history?limit=20"),
      ]);
      setKpis(sum.data);
      setWeekly(wk.data);
      setToday(dy.data);
      setHistory(hist.data);
    } catch {
      setToday((prev) => prev.filter((h) => h.id !== item.id));
    }
  };

  return (
    <div className="dashboard">
      <div className="container px-3 sm:px-5">
        <header className="mb-4">
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">
            HabitVault helps you build consistent routines. Track your habits, keep streaks alive,
            visualize progress, and get motivated daily.
          </p>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm text-slate-400">Current Streak</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1">
              {kpis.streak}<span className="text-lg sm:text-xl ml-1">days</span>
            </div>
            <div className="text-[11px] sm:text-xs text-green-400 mt-1">+1 vs yesterday</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm text-slate-400">Planned Today</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1">{kpis.todayPlanned}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm text-slate-400">Completed Today</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1">{kpis.todayDone}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm text-slate-400">Weekly Completion</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1">{kpis.completionRate}%</div>
          </div>
        </section>

        {/* Focus + Today & Weekly chart */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-700">
              <h3 className="font-semibold">Focus & Motivation</h3>
              <button
                onClick={() => setOpenAdd(true)}
                className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold active:scale-[0.98]"
              >
                Add Habit
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid place-items-center h-[220px] sm:h-[300px] lg:h-[340px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-xl">
                <Lamp />
              </div>

              <h3 className="mt-5 mb-2 text-slate-200 font-semibold">Today</h3>
              <div className="space-y-3">
                {today.map((h) => (
                  <HabitItem key={h.id} item={h} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-700">
              <h3 className="font-semibold">Weekly Progress</h3>
              <span className="text-[11px] sm:text-xs text-blue-300 border border-blue-400/40 bg-blue-400/10 px-2 py-1 rounded-full">
                Last 7 days
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <WeeklyCompletionChart data={weekly} />
              <p className="mt-4 text-sm text-slate-400">
                Tip: small daily wins compound fast. Keep your streak alive!
              </p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-6 grid grid-cols-1">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-700">
              <h3 className="font-semibold">Recent Activity</h3>
              <span className="text-[11px] sm:text-xs text-slate-400">last 20 actions</span>
            </div>
            <div className="p-4 sm:p-5">
              <ActivityList items={history} />
            </div>
          </div>
        </section>

        <footer className="text-center text-xs sm:text-sm text-slate-500 mt-10 pb-[env(safe-area-inset-bottom)]">
          © {new Date().getFullYear()} HabitVault — Build Better Habits Every Day.
        </footer>
      </div>

      <AddHabitModal open={openAdd} onClose={() => setOpenAdd(false)} onCreate={onCreateHabit} />
    </div>
  );
}
