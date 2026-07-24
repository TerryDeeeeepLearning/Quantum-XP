import React from "react";
import { Panel, Stat, Btn } from "./ui.jsx";
import { AmplitudeBar, ScheduleList } from "./charts.jsx";
import { TIER, DAY_NAME, CORE_RATIO } from "../data.js";
import { addDays, parseISO } from "../compute.js";

export default function Today({ state, update, cursor, setCursor, today, dayRow }) {
  const entries = state.log[cursor]?.entries || [];
  const qtyOf = (id) => entries.find((e) => e.taskId === id)?.qty || 0;
  const wd = parseISO(cursor).getDay();
  const target = state.targets[state.profile][wd] ?? 90;
  const floor = dayRow?.coreFloor ?? Math.round(target * CORE_RATIO);
  const ex = state.exceptions.find((e) => e.date === cursor);
  const got = dayRow?.total || 0;
  const saXP = dayRow?.saXP || 0;

  const bump = (id, delta) => {
    const next = Math.max(0, Number((qtyOf(id) + delta).toFixed(2)));
    const rest = entries.filter((e) => e.taskId !== id);
    const arr = next > 0 ? [...rest, { taskId: id, qty: next }] : rest;
    update({ ...state, log: { ...state.log, [cursor]: { ...(state.log[cursor] || {}), entries: arr } } });
  };

  const groups = ["S", "A", "B", "C", "D"].map((t) => [t, state.tasks.filter((x) => x.tier === t)]);

  return (
    <>
      <Panel
        title="日期"
        right={
          <div className="row" style={{ gap: 6 }}>
            <Btn onClick={() => setCursor(addDays(cursor, -1))} aria-label="前一天">
              ←
            </Btn>
            <Btn tone={cursor === today ? "primary" : ""} onClick={() => setCursor(today)}>
              今天
            </Btn>
            <Btn onClick={() => setCursor(addDays(cursor, 1))} aria-label="後一天">
              →
            </Btn>
          </div>
        }
      >
        <div className="statrow" style={{ marginBottom: 12 }}>
          <Stat label="日期" value={cursor.slice(5)} sub={`星期${DAY_NAME[wd]}`} />
          <Stat
            label="已獲得"
            value={got}
            sub={`目標 ${target}`}
            color={got >= target ? "var(--cyan)" : got < 0 ? "var(--red)" : "var(--ink)"}
          />
          <Stat
            label="深度門檻"
            value={`${saXP}/${floor}`}
            sub={`S＋A · ${(dayRow?.deep || 0).toFixed(1)}h`}
            color={saXP >= floor ? "var(--cyan)" : "var(--amber)"}
          />
        </div>
        <AmplitudeBar value={got} target={target} />
        {ex && (
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--amber)", fontFamily: "var(--mono)" }}>
            ※ 特例：{ex.label}
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <ScheduleList blocks={state.schedules[state.profile][wd]} />
        </div>
      </Panel>

      {groups.map(([tier, list]) =>
        list.length ? (
          <Panel
            key={tier}
            title={`${tier} 級 · ${TIER[tier].desc}`}
            right={
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: TIER[tier].color }}>
                {tier === "D" ? "誠實登記才有意義" : `${list.length} 項`}
              </span>
            }
            tight
          >
            {list.map((t) => (
              <TaskRow key={t.id} task={t} qty={qtyOf(t.id)} bump={bump} />
            ))}
          </Panel>
        ) : null
      )}
    </>
  );
}

function TaskRow({ task, qty, bump }) {
  const step = task.unit === "小時" ? 0.5 : 1;
  const on = qty > 0;
  return (
    <div className={"task" + (on ? " on" : "")}>
      <span className="task-bar" style={{ background: TIER[task.tier].color }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="task-name">{task.name}</div>
        <div className="task-meta">
          {task.xp > 0 ? "+" : ""}
          {task.xp} XP／{task.unit} · {task.cat}
        </div>
      </div>
      <div className="task-val" style={{ color: on ? (task.xp < 0 ? "var(--red)" : "var(--cyan)") : undefined }}>
        {on ? `${qty}${task.unit}` : "—"}
        {on && <div style={{ fontSize: 11 }}>{task.xp * qty}</div>}
      </div>
      <div className="row" style={{ gap: 4, flexWrap: "nowrap" }}>
        <Btn className="btn-step" onClick={() => bump(task.id, -step)} aria-label={`減少 ${task.name}`}>
          −
        </Btn>
        <Btn className="btn-step" tone="primary" onClick={() => bump(task.id, step)} aria-label={`增加 ${task.name}`}>
          ＋
        </Btn>
      </div>
    </div>
  );
}
