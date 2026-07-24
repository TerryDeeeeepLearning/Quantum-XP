import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { load, save } from "./storage.js";
import { buildSeries, overallStats, todayISO } from "./compute.js";
import Dashboard from "./components/Dashboard.jsx";
import Today from "./components/Today.jsx";
import Catalog from "./components/Catalog.jsx";
import Schedule from "./components/Schedule.jsx";
import Review from "./components/Review.jsx";

const TABS = [
  ["dash", "主控台"],
  ["today", "打卡"],
  ["catalog", "任務庫"],
  ["schedule", "行程表"],
  ["review", "回顧"],
];

export default function App() {
  const [state, setState] = useState(() => load());
  const [tab, setTab] = useState("dash");
  const [today, setToday] = useState(todayISO);
  const [cursor, setCursor] = useState(today);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2000);
  }, []);

  const update = useCallback((next) => {
    setState(next);
    save(next);
  }, []);

  /* App 放在背景很久後再打開時，把「今天」校正到真正的今天 */
  useEffect(() => {
    const check = () => {
      const now = todayISO();
      if (now !== today) {
        setToday(now);
        setCursor(now);
      }
    };
    document.addEventListener("visibilitychange", check);
    const id = setInterval(check, 60000);
    return () => {
      document.removeEventListener("visibilitychange", check);
      clearInterval(id);
    };
  }, [today]);

  const taskMap = useMemo(() => Object.fromEntries(state.tasks.map((t) => [t.id, t])), [state.tasks]);
  const series = useMemo(() => buildSeries(state, taskMap, today), [state, taskMap, today]);
  const stats = useMemo(() => overallStats(series, state, today), [series, state, today]);
  const dayRow = series.find((r) => r.date === cursor);

  return (
    <div className="wrap">
      <header className="hd">
        <div>
          <div className="hd-eyebrow">Energy-Level Discipline System</div>
          <h1>
            <span className="ket" style={{ color: "var(--cyan)" }}>
              ⟨ψ|
            </span>{" "}
            量子能階系統{" "}
            <span className="ket" style={{ color: "var(--magenta)" }}>
              |ψ⟩
            </span>
          </h1>
        </div>
        <div className="hd-meta">
          <span className="chip">{state.profile === "summer" ? "SUMMER" : "SEMESTER"}</span>
          <span className="chip" style={{ color: "var(--cyan)" }}>
            E{stats.lv}
          </span>
          <span className="chip" style={{ color: "var(--violet)" }}>
            {stats.streak}d
          </span>
        </div>
      </header>

      <nav className="nav">
        {TABS.map(([k, label]) => (
          <button key={k} aria-current={tab === k} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === "dash" && <Dashboard state={state} stats={stats} series={series} today={today} />}
      {tab === "today" && (
        <Today state={state} update={update} cursor={cursor} setCursor={setCursor} today={today} dayRow={dayRow} />
      )}
      {tab === "catalog" && <Catalog state={state} update={update} />}
      {tab === "schedule" && <Schedule state={state} update={update} toast={toast} />}
      {tab === "review" && <Review state={state} update={update} series={series} today={today} stats={stats} />}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
