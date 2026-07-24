import React, { useState } from "react";
import { Panel, Btn } from "./ui.jsx";
import { TIER, CAT_COLOR } from "../data.js";

const TIERS = ["S", "A", "B", "C", "D"];
const UNITS = ["小時", "次", "篇"];

export default function Catalog({ state, update }) {
  const [draft, setDraft] = useState({ name: "", tier: "A", xp: 30, unit: "小時", hr: 1, cat: "技能" });
  const sorted = [...state.tasks].sort((a, b) => b.xp - a.xp);

  const edit = (id, field, val) =>
    update({ ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, [field]: val } : t)) });
  const remove = (id) => update({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
  const add = () => {
    if (!draft.name.trim()) return;
    update({ ...state, tasks: [...state.tasks, { ...draft, id: `u${Date.now()}` }] });
    setDraft({ ...draft, name: "" });
  };

  return (
    <>
      <Panel title="XP 排序表 · 由高到低" tight>
        <div className="note" style={{ padding: "14px 14px 4px" }}>
          排序原則：<span style={{ color: "var(--magenta)" }}>能寫進履歷或轉成作品的最高</span> → 支撐技能 →
          讓你撐得久的（體能、睡眠、現金流） → 恢復與關係 → 純消耗為負。XP 可依實際情況調整，但不要把 D 級調成
          0，那等於自欺。
        </div>

        <div className="tbl-wrap" style={{ padding: "10px 14px 14px", overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 44 }}>級</th>
                <th>任務</th>
                <th style={{ width: 84 }}>XP</th>
                <th style={{ width: 60 }}>單位</th>
                <th style={{ width: 74 }}>時數</th>
                <th style={{ width: 70 }}>分類</th>
                <th style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="tier-tag" style={{ color: TIER[t.tier].color }}>
                      {t.tier}
                    </span>
                  </td>
                  <td>
                    <input className="txt" value={t.name} onChange={(e) => edit(t.id, "name", e.target.value)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={t.xp}
                      onChange={(e) => edit(t.id, "xp", Number(e.target.value))}
                      style={{ color: t.xp < 0 ? "var(--red)" : "var(--cyan)" }}
                    />
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--dim)" }}>{t.unit}</td>
                  <td>
                    <input
                      type="number"
                      step="0.25"
                      value={t.hr}
                      onChange={(e) => edit(t.id, "hr", Number(e.target.value))}
                    />
                  </td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: CAT_COLOR[t.cat] }}>{t.cat}</td>
                  <td>
                    <Btn tone="danger" onClick={() => remove(t.id)} aria-label="刪除">
                      ✕
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 手機版：卡片式編輯 */}
        <div className="card-list">
          {sorted.map((t) => (
            <div className="card" key={t.id}>
              <div className="card-top">
                <span className="tier-tag" style={{ color: TIER[t.tier].color }}>
                  {t.tier}
                </span>
                <input className="txt" value={t.name} onChange={(e) => edit(t.id, "name", e.target.value)} />
                <Btn tone="danger" onClick={() => remove(t.id)} aria-label="刪除">
                  ✕
                </Btn>
              </div>
              <div className="card-fields">
                <label>
                  <span className="field-l">XP／{t.unit}</span>
                  <input
                    type="number"
                    value={t.xp}
                    onChange={(e) => edit(t.id, "xp", Number(e.target.value))}
                    style={{ width: "100%", color: t.xp < 0 ? "var(--red)" : "var(--cyan)" }}
                  />
                </label>
                <label>
                  <span className="field-l">時數</span>
                  <input
                    type="number"
                    step="0.25"
                    value={t.hr}
                    onChange={(e) => edit(t.id, "hr", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </label>
                <label>
                  <span className="field-l">分類</span>
                  <select
                    value={t.cat}
                    onChange={(e) => edit(t.id, "cat", e.target.value)}
                    style={{ width: "100%" }}
                  >
                    {Object.keys(CAT_COLOR).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="新增任務">
        <div className="row">
          <input
            className="txt"
            placeholder="任務名稱"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            style={{ flex: "2 1 200px" }}
          />
          <select value={draft.tier} onChange={(e) => setDraft({ ...draft, tier: e.target.value })} style={{ width: 72 }}>
            {TIERS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            value={draft.xp}
            onChange={(e) => setDraft({ ...draft, xp: Number(e.target.value) })}
            style={{ width: 84 }}
            aria-label="XP"
          />
          <select value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} style={{ width: 82 }}>
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.25"
            value={draft.hr}
            onChange={(e) => setDraft({ ...draft, hr: Number(e.target.value) })}
            style={{ width: 78 }}
            aria-label="時數"
          />
          <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })} style={{ width: 92 }}>
            {Object.keys(CAT_COLOR).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Btn tone="primary" onClick={add}>
            加入任務庫
          </Btn>
        </div>
      </Panel>
    </>
  );
}
