import React, { useRef, useState } from "react";
import { Panel, Btn, Empty } from "./ui.jsx";
import { DAY_NAME, BASELINE_TARGET, scaleTargets, DEFAULT_STATE } from "../data.js";
import { exportFile, importFile } from "../storage.js";

const LEVELS = [
  [0.55, "55%", "撞牆期"],
  [0.7, "70%", "起步"],
  [0.85, "85%", "進檔"],
  [1.0, "100%", "標準"],
  [1.15, "115%", "衝刺"],
];

export default function Schedule({ state, update, toast }) {
  const sch = state.schedules[state.profile];
  const tgt = state.targets[state.profile];
  const [ex, setEx] = useState({ date: "", label: "" });

  const weekTotal = [0, 1, 2, 3, 4, 5, 6].reduce((s, d) => s + (tgt[d] || 0), 0);
  const baseWeek = [0, 1, 2, 3, 4, 5, 6].reduce((s, d) => s + BASELINE_TARGET[state.profile][d], 0);

  const setSch = (next) => update({ ...state, schedules: { ...state.schedules, [state.profile]: next } });
  const setBlock = (wd, i, f, v) => setSch({ ...sch, [wd]: sch[wd].map((b, j) => (j === i ? { ...b, [f]: v } : b)) });
  const addBlock = (wd) => setSch({ ...sch, [wd]: [...(sch[wd] || []), { t: "00:00–00:00", label: "新行程", kind: "deep" }] });
  const delBlock = (wd, i) => setSch({ ...sch, [wd]: sch[wd].filter((_, j) => j !== i) });
  const setTarget = (wd, v) =>
    update({ ...state, targets: { ...state.targets, [state.profile]: { ...tgt, [wd]: Number(v) } } });

  return (
    <>
      <Panel
        title="模式"
        right={
          <div className="row" style={{ gap: 6 }}>
            {[
              ["summer", "暑假"],
              ["semester", "開學後"],
            ].map(([k, l]) => (
              <Btn key={k} tone={state.profile === k ? "primary" : ""} onClick={() => update({ ...state, profile: k })}>
                {l}
              </Btn>
            ))}
          </div>
        }
      >
        <div className="note">
          兩套行程獨立儲存。開學後把課表填進「開學後」模式再切換即可，歷史紀錄與能階不受影響。
          <br />
          本模式每週目標合計{" "}
          <span style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>{weekTotal} XP</span>，相當於基準強度的{" "}
          <span style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>
            {Math.round((weekTotal / baseWeek) * 100)}%
          </span>
          。
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--dim2)", marginBottom: 8 }}>
            強度調節器 · 一鍵重算七天目標
          </div>
          <div className="row">
            {LEVELS.map(([f, label, tag]) => (
              <Btn
                key={label}
                onClick={() =>
                  update({ ...state, targets: { ...state.targets, [state.profile]: scaleTargets(state.profile, f) } })
                }
              >
                {label} <span style={{ color: "var(--dim2)" }}>{tag}</span>
              </Btn>
            ))}
          </div>
          <div className="note" style={{ marginTop: 10 }}>
            升檔規則：<span style={{ color: "var(--cyan)" }}>連續兩週達標率 ≥ 80% 才往上加一檔</span>；連續兩週低於
            60% 就往下降一檔。不要憑心情調，那會讓數字失去意義。
          </div>
        </div>
      </Panel>

      {[1, 2, 3, 4, 5, 6, 0].map((wd) => (
        <Panel
          key={wd}
          title={`星期${DAY_NAME[wd]}`}
          right={
            <div className="row" style={{ gap: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--dim2)" }}>每日目標</span>
              <input
                type="number"
                value={tgt[wd] ?? 90}
                onChange={(e) => setTarget(wd, e.target.value)}
                style={{ width: 72 }}
                aria-label={`星期${DAY_NAME[wd]}每日目標`}
              />
              <Btn onClick={() => addBlock(wd)}>＋行程</Btn>
            </div>
          }
        >
          {!(sch[wd] || []).length && <Empty text="空白日。" />}
          {(sch[wd] || []).map((b, i) => (
            <div className="row" key={i} style={{ marginBottom: 6, flexWrap: "nowrap", overflowX: "auto" }}>
              <input value={b.t} onChange={(e) => setBlock(wd, i, "t", e.target.value)} style={{ width: 128, flexShrink: 0 }} />
              <input
                className="txt"
                value={b.label}
                onChange={(e) => setBlock(wd, i, "label", e.target.value)}
                style={{ flex: 1, minWidth: 130 }}
              />
              <select value={b.kind} onChange={(e) => setBlock(wd, i, "kind", e.target.value)} style={{ width: 96, flexShrink: 0 }}>
                <option value="deep">深度學習</option>
                <option value="fixed">固定行程</option>
                <option value="body">身體</option>
                <option value="free">自由</option>
              </select>
              <Btn tone="danger" onClick={() => delBlock(wd, i)} aria-label="刪除行程">
                ✕
              </Btn>
            </div>
          ))}
        </Panel>
      ))}

      <Panel title="特例日">
        {state.exceptions.map((e, i) => (
          <div className="row" key={i} style={{ padding: "4px 0", fontSize: 13, flexWrap: "nowrap" }}>
            <span style={{ fontFamily: "var(--mono)", color: "var(--amber)" }}>{e.date}</span>
            <span style={{ flex: 1 }}>{e.label}</span>
            <Btn
              tone="danger"
              onClick={() => update({ ...state, exceptions: state.exceptions.filter((_, j) => j !== i) })}
              aria-label="刪除特例日"
            >
              ✕
            </Btn>
          </div>
        ))}
        <div className="row" style={{ marginTop: 8 }}>
          <input type="date" value={ex.date} onChange={(e) => setEx({ ...ex, date: e.target.value })} style={{ width: 160 }} />
          <input
            className="txt"
            placeholder="說明"
            value={ex.label}
            onChange={(e) => setEx({ ...ex, label: e.target.value })}
            style={{ flex: 1, minWidth: 150 }}
          />
          <Btn
            tone="primary"
            onClick={() => {
              if (!ex.date) return;
              update({
                ...state,
                exceptions: [...state.exceptions, ex].sort((a, b) => a.date.localeCompare(b.date)),
              });
              setEx({ date: "", label: "" });
            }}
          >
            新增
          </Btn>
        </div>
      </Panel>

      <DataPanel state={state} update={update} toast={toast} />
    </>
  );
}

function DataPanel({ state, update, toast }) {
  const fileRef = useRef(null);
  const [armed, setArmed] = useState(false);

  const doExport = () => {
    const stamp = exportFile(state);
    update({ ...state, lastBackup: stamp });
    toast("備份已下載");
  };

  const doImport = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const next = await importFile(f);
      update(next);
      toast("備份已還原");
    } catch (err) {
      toast(err.message);
    }
    e.target.value = "";
  };

  return (
    <Panel title="資料">
      <div className="note" style={{ marginBottom: 12 }}>
        紀錄只存在這台裝置的瀏覽器裡，沒有伺服器，也沒有人看得到。
        <span style={{ color: "var(--amber)" }}> 代價是清除瀏覽器資料就會全部消失</span>
        ，所以每週回顧時順手匯出一次備份。
        {state.lastBackup && (
          <>
            <br />
            上次備份：<span style={{ fontFamily: "var(--mono)" }}>{state.lastBackup}</span>
          </>
        )}
      </div>

      <div className="row">
        <Btn tone="primary" onClick={doExport}>
          匯出備份 JSON
        </Btn>
        <Btn onClick={() => fileRef.current?.click()}>從備份還原</Btn>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={doImport} style={{ display: "none" }} />
        <Btn onClick={() => update({ ...state, photonsSpent: (state.photonsSpent || 0) + 1 })}>
          兌換 1 光子
        </Btn>
        <Btn
          tone="danger"
          onClick={() => {
            if (armed) {
              update(DEFAULT_STATE);
              setArmed(false);
              toast("已重設");
            } else setArmed(true);
          }}
        >
          {armed ? "再按一次確認清除" : "全部重設"}
        </Btn>
        {armed && <Btn onClick={() => setArmed(false)}>取消</Btn>}
      </div>
    </Panel>
  );
}
