import React from "react";
import { Panel, Stat, Empty } from "./ui.jsx";
import { EnergyLadder, AmplitudeBar, DayBars, ScheduleList } from "./charts.jsx";
import { LEVEL_TITLES, PHOTON_STEP, CORE_RATIO } from "../data.js";

export default function Dashboard({ state, stats, series, today }) {
  const row = series.find((r) => r.date === today);
  const wd = new Date().getDay();
  const target = state.targets[state.profile][wd] ?? 90;
  const got = row?.total || 0;
  const saXP = row?.saXP || 0;
  const floor = row?.coreFloor ?? Math.round(target * CORE_RATIO);
  const ex = state.exceptions.find((e) => e.date === today);
  const last14 = series.slice(-14);

  return (
    <>
      <div className="grid2" style={{ marginBottom: 12 }}>
        <Panel title="能階 · Energy Level">
          <EnergyLadder lv={stats.lv} pct={stats.pct} />
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--magenta)" }}>
              E{stats.lv} · {LEVEL_TITLES[Math.min(stats.lv, LEVEL_TITLES.length - 1)]}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--dim)", marginTop: 3 }}>
              {stats.totalXP} / {stats.next} XP　→ 躍遷還差 {Math.max(0, stats.next - stats.totalXP)}
            </div>
          </div>
        </Panel>

        <Panel title="今日狀態">
          <div className="statrow" style={{ marginBottom: 14 }}>
            <Stat
              label="今日 XP"
              value={got}
              sub={`目標 ${target}`}
              color={got >= target ? "var(--cyan)" : got < 0 ? "var(--red)" : "var(--ink)"}
            />
            <Stat
              label="相干天數"
              value={`${stats.streak}d`}
              sub={`加成 +${Math.min(20, Math.floor(stats.streak / 7) * 5)}%`}
              color="var(--violet)"
            />
            <Stat label="光子點數" value={stats.photons} sub="1 顆 = 30 分娛樂" color="var(--amber)" />
          </div>

          <AmplitudeBar value={got} target={target} />

          <div className="note" style={{ marginTop: 10 }}>
            {got >= target
              ? `總量已過線，超量 ${got - target} XP → 再 ${PHOTON_STEP - ((got - target) % PHOTON_STEP)} XP 可得下一顆光子。`
              : `距離總量過線還差 ${target - got} XP。`}
            <br />
            深度門檻：
            <span style={{ fontFamily: "var(--mono)", color: saXP >= floor ? "var(--cyan)" : "var(--amber)" }}>
              {saXP} / {floor} XP
            </span>
            {" 來自 S／A 級。"}
            <span style={{ color: row?.hit ? "var(--cyan)" : "var(--amber)" }}>
              {row?.hit ? "兩項皆達成，相干延續。" : "兩項都過才算達標，否則相干歸零。"}
            </span>
          </div>

          {ex && (
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--amber)", fontFamily: "var(--mono)" }}>
              ※ 今日特例：{ex.label}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="近 14 日振幅"
        right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--dim2)" }}>虛線 ＝ 每日目標</span>}
      >
        {last14.length ? <DayBars rows={last14} /> : <Empty text="還沒有紀錄。切到「打卡」登記第一筆。" />}
      </Panel>

      <Panel title="今日行程">
        <ScheduleList blocks={state.schedules[state.profile][wd]} />
      </Panel>
    </>
  );
}
