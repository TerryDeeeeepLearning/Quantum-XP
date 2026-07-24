import React from "react";
import { CAT_COLOR, TIER } from "../data.js";
import { Empty } from "./ui.jsx";

/* 招牌元素：能階圖。粒子停在目前能階，向上的虛線代表朝下一階累積的進度。 */
export function EnergyLadder({ lv, pct }) {
  const rows = 6;
  const base = Math.max(0, lv - 2);
  const H = 168;
  const top = 14;
  const gap = (H - top * 2) / (rows - 1);
  const yCur = top + (rows - 1 - (lv - base)) * gap;
  const yNext = yCur - gap;
  const py = yCur + (yNext - yCur) * (Math.min(100, pct) / 100);

  return (
    <svg viewBox="0 0 260 168" style={{ width: "100%", height: 168 }} role="img" aria-label={`目前能階 E${lv}`}>
      {Array.from({ length: rows }).map((_, i) => {
        const n = base + (rows - 1 - i);
        const y = top + i * gap;
        const isCur = n === lv;
        return (
          <g key={n}>
            <line
              x1="52"
              y1={y}
              x2="238"
              y2={y}
              stroke={isCur ? "var(--magenta)" : "var(--line)"}
              strokeWidth={isCur ? 1.6 : 1}
              strokeDasharray={isCur ? "" : "3 4"}
            />
            <text
              x="42"
              y={y + 4}
              textAnchor="end"
              fontFamily="var(--mono)"
              fontSize="10"
              fill={isCur ? "var(--magenta)" : "var(--dim2)"}
            >
              E{n}
            </text>
          </g>
        );
      })}
      <line x1="145" y1={yCur} x2="145" y2={py} stroke="var(--cyan)" strokeWidth="1" strokeDasharray="2 3" />
      <circle className="particle" cx="145" cy={py} r="9" fill="var(--cyan)" opacity="0.18" />
      <circle cx="145" cy={py} r="4" fill="var(--cyan)" />
    </svg>
  );
}

export function AmplitudeBar({ value, target }) {
  const p = Math.max(0, Math.min(100, (value / target) * 100));
  const over = value > target ? Math.min(100, ((value - target) / target) * 100) : 0;
  return (
    <div className="amp">
      <div className="amp-fill" style={{ width: `${p}%` }} />
      {over > 0 && <div className="amp-over" style={{ width: `${over}%` }} />}
    </div>
  );
}

export function DayBars({ rows }) {
  if (!rows.length) return <Empty text="此區間沒有資料。" />;
  const maxV = Math.max(...rows.map((r) => Math.max(r.total, r.target)), 100);
  const H = 120;
  const showLabel = rows.length <= 16;
  return (
    <div className="bars" style={{ height: H + 22 }}>
      {rows.map((r) => {
        const h = Math.max(2, (Math.abs(r.total) / maxV) * H);
        const th = (r.target / maxV) * H;
        const color = r.total < 0 ? "var(--red)" : r.hit ? "var(--cyan)" : "var(--line2)";
        return (
          <div className="bar-col" key={r.date}>
            <div className="bar-slot" style={{ height: H }}>
              <div
                className="bar"
                title={`${r.date} · ${r.total} XP／目標 ${r.target}`}
                style={{ height: h, background: color, opacity: r.logged ? 1 : 0.25 }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: th,
                  borderTop: "1px dashed var(--dim2)",
                  opacity: 0.55,
                }}
              />
            </div>
            {showLabel && <div className="bar-lbl">{r.date.slice(5).replace("-", "/")}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function CatBars({ byCat }) {
  const items = Object.entries(byCat)
    .filter(([, v]) => v !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  if (!items.length) return <Empty text="沒有資料。" />;
  const max = Math.max(...items.map(([, v]) => Math.abs(v)));
  return (
    <div>
      {items.map(([k, v]) => (
        <div className="hbar-row" key={k}>
          <span className="hbar-k">{k}</span>
          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{ width: `${(Math.abs(v) / max) * 100}%`, background: CAT_COLOR[k] || "var(--dim2)" }}
            />
          </div>
          <span className="hbar-v" style={{ color: v < 0 ? "var(--red)" : "var(--ink)" }}>
            {Math.round(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TierBars({ byTier }) {
  const order = ["S", "A", "B", "C", "D"];
  const vals = order.map((t) => byTier[t] || 0);
  const max = Math.max(...vals.map(Math.abs), 1);
  return (
    <div>
      {order.map((t, i) => (
        <div className="hbar-row" key={t}>
          <span className="hbar-k" style={{ color: TIER[t].color }}>
            {t} 級
          </span>
          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{ width: `${(Math.abs(vals[i]) / max) * 100}%`, background: TIER[t].color, opacity: 0.85 }}
            />
          </div>
          <span className="hbar-v" style={{ color: vals[i] < 0 ? "var(--red)" : "var(--ink)" }}>
            {Math.round(vals[i])}
          </span>
        </div>
      ))}
    </div>
  );
}

const KIND_COLOR = {
  deep: "var(--magenta)",
  fixed: "var(--violet)",
  body: "var(--cyan)",
  free: "var(--dim2)",
};

export function ScheduleList({ blocks }) {
  if (!blocks || !blocks.length) return <Empty text="這天沒有排定行程。到「行程表」新增。" />;
  return (
    <div>
      {blocks.map((b, i) => (
        <div className="blk" key={i}>
          <span className="blk-bar" style={{ background: KIND_COLOR[b.kind] || "var(--dim2)" }} />
          <span className="blk-t">{b.t}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
