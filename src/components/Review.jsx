import React, { useState } from "react";
import { Panel, Stat, Btn } from "./ui.jsx";
import { DayBars, CatBars, TierBars } from "./charts.jsx";
import { addDays, aggregate } from "../compute.js";

const PERIODS = [
  ["week", "每週", 7],
  ["month", "每月", 30],
  ["quarter", "每季", 90],
  ["half", "半年", 180],
];

export default function Review({ state, update, series, today, stats }) {
  const [period, setPeriod] = useState("week");
  const days = PERIODS.find((p) => p[0] === period)[2];
  const end = today;
  const start = addDays(end, -(days - 1));

  const inRange = (a, b) => series.filter((r) => r.date >= a && r.date <= b);
  const cur = inRange(start, end);
  const prev = inRange(addDays(start, -days), addDays(start, -1));

  const a = aggregate(cur);
  const p = aggregate(prev);
  const weeklyTarget = [0, 1, 2, 3, 4, 5, 6].reduce((s, d) => s + (state.targets[state.profile][d] || 0), 0);
  const noteKey = `${period}:${end}`;

  return (
    <>
      <Panel
        title="回顧區間"
        right={
          <div className="row" style={{ gap: 6 }}>
            {PERIODS.map(([k, l]) => (
              <Btn key={k} tone={period === k ? "primary" : ""} onClick={() => setPeriod(k)}>
                {l}
              </Btn>
            ))}
          </div>
        }
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--dim)", marginBottom: 14 }}>
          {start} → {end}　共 {days} 天　已登記 {a.logged} 天
        </div>
        <div className="statrow">
          <Stat label="區間 XP" value={Math.round(a.pos)} sub={cmp(delta(a.pos, p.pos))} color="var(--cyan)" />
          <Stat label="日均 XP" value={Math.round(a.avg)} sub={cmp(delta(a.avg, p.avg))} />
          <Stat
            label="達標率"
            value={`${Math.round(a.rate)}%`}
            sub={`${a.hits}/${days} 天`}
            color={a.rate >= 70 ? "var(--cyan)" : "var(--amber)"}
          />
          <Stat label="深度時數" value={`${a.deep.toFixed(1)}h`} sub={cmp(delta(a.deep, p.deep))} color="var(--magenta)" />
          <Stat
            label="有效產出率"
            value={`${Math.round(a.quality)}%`}
            sub="S＋A 佔正向 XP"
            color={a.quality >= 55 ? "var(--cyan)" : "var(--amber)"}
          />
          <Stat
            label="耗損率"
            value={`${Math.round(a.leak)}%`}
            sub="負向／正向"
            color={a.leak > 15 ? "var(--red)" : "var(--dim)"}
          />
        </div>
      </Panel>

      <Panel title="每日振幅">
        <DayBars rows={cur.slice(-30)} />
      </Panel>

      <div className="grid2">
        <Panel title="投入分佈 · 依分類">
          <CatBars byCat={a.byCat} />
        </Panel>
        <Panel title="等級分佈 · S／A／B／C／D">
          <TierBars byTier={a.byTier} />
        </Panel>
      </div>

      <Panel title="自動診斷">
        <Diagnosis a={a} days={days} streak={stats.streak} weeklyTarget={weeklyTarget} />
      </Panel>

      <Panel title="回顧筆記">
        <textarea
          placeholder={"三個問題：\n1. 這段期間最有價值的一次投入是什麼？為什麼？\n2. XP 掉最多的那幾天，觸發點是什麼？\n3. 下一期我要改掉的一個具體行為是？"}
          value={state.notes[noteKey] || ""}
          onChange={(e) => update({ ...state, notes: { ...state.notes, [noteKey]: e.target.value } })}
          style={{ width: "100%", height: 140 }}
        />
      </Panel>
    </>
  );
}

const delta = (x, y) => (y > 0 ? ((x - y) / y) * 100 : null);
function cmp(d) {
  if (d === null || !isFinite(d)) return "無前期資料";
  return `${d >= 0 ? "▲" : "▼"} ${Math.abs(Math.round(d))}% vs 前期`;
}

function Diagnosis({ a, days, streak, weeklyTarget }) {
  const msgs = [];
  const perWeek = (a.deep / days) * 7;
  const deepStd = (weeklyTarget * 0.5) / 40; // 深度門檻 XP ÷ 每小時約 40 XP

  if (a.logged < days * 0.7)
    msgs.push(["var(--amber)", "登記天數不足七成。沒登記的日子在系統裡等於零，資料不完整，回顧就沒有意義。"]);

  if (a.quality < 50)
    msgs.push([
      "var(--amber)",
      `有效產出率 ${Math.round(a.quality)}%，低於 50%。你正在靠 B／C 級任務刷分——睡覺和健身很重要，但它們不會讓你看懂論文。`,
    ]);
  else if (a.quality >= 65)
    msgs.push(["var(--cyan)", `有效產出率 ${Math.round(a.quality)}%，結構健康。核心投入確實在核心項目上。`]);

  if (a.leak > 15)
    msgs.push([
      "var(--red)",
      `耗損率 ${Math.round(a.leak)}%。每賺 100 XP 就漏掉 ${Math.round(a.leak)}。先處理漏水，比多讀一小時有效。`,
    ]);

  if (perWeek < deepStd * 0.8)
    msgs.push([
      "var(--amber)",
      `深度時數換算每週約 ${perWeek.toFixed(1)} 小時，低於目前強度所需的 ${deepStd.toFixed(1)} 小時。上午那格是不是又沒守住？`,
    ]);
  else if (perWeek >= deepStd)
    msgs.push(["var(--cyan)", `每週深度時數約 ${perWeek.toFixed(1)} 小時，符合目前強度。連續兩週如此就該考慮升檔。`]);

  if (a.missCore > 0)
    msgs.push([
      "var(--amber)",
      `有 ${a.missCore} 天總量過線但深度門檻沒過——那幾天是靠睡眠、三餐、重訓把分數撐起來的。分數好看，實力沒動。`,
    ]);

  if (a.rate < 60 && a.logged > 3)
    msgs.push([
      "var(--amber)",
      `達標率 ${Math.round(a.rate)}%。若連續兩期低於 60%，問題是目標訂太高，不是你不夠努力——回「行程表」降一檔，可持續比漂亮重要。`,
    ]);

  const research = a.byCat["研究"] || 0;
  const skill = a.byCat["技能"] || 0;
  if (research > 0 && skill > 0) {
    const ratio = research / (research + skill);
    if (ratio > 0.8)
      msgs.push(["var(--violet)", "研究類遠高於技能類。純理論在台灣業界換不到百萬年薪，把程式實作的比重拉回來。"]);
    if (ratio < 0.4)
      msgs.push([
        "var(--violet)",
        "技能類遠高於研究類。寫程式比較舒服、回饋比較快，但論文閱讀量才是研究所前期真正的門檻。",
      ]);
  }

  if (streak >= 7)
    msgs.push(["var(--cyan)", `相干天數 ${streak} 天，加成已啟動。這是複利開始的地方，別為了單日的懶惰把它歸零。`]);

  if (!msgs.length) msgs.push(["var(--dim)", "資料量還不足以診斷。先累積一週再回來看。"]);

  return (
    <div>
      {msgs.map(([color, text], i) => (
        <div className="diag" key={i}>
          <span className="diag-mark" style={{ color }}>
            ▍
          </span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
