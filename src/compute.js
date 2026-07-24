import { CORE_RATIO, PHOTON_STEP } from "./data.js";

/* ---------- 日期 ---------- */
export const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => iso(new Date());
export const parseISO = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s, n) => {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};

/* ---------- 能階 ---------- */
export const cumThreshold = (n) => 600 * n + 100 * n * (n - 1);
export const levelFromXP = (xp) => {
  let n = 0;
  while (cumThreshold(n + 1) <= xp) n++;
  return n;
};

/* ---------- 每日序列 ----------
 * 依日期由早到晚推算，因為相干加成取決於前一天的連續紀錄。
 * 達標需同時滿足兩個條件：總量過線，且 S／A 級 XP 達到深度門檻。 */
export function buildSeries(state, taskMap, today) {
  const dates = Object.keys(state.log).sort();
  if (!dates.length) return [];
  const first = dates[0];
  const lastLogged = dates[dates.length - 1];
  const last = today > lastLogged ? today : lastLogged;

  const out = [];
  let streak = 0;
  for (let d = first; d <= last; d = addDays(d, 1)) {
    const entries = state.log[d]?.entries || [];
    let base = 0;
    let neg = 0;
    let saXP = 0;
    let deep = 0;
    const byCat = {};
    const byTier = {};

    for (const e of entries) {
      const t = taskMap[e.taskId];
      if (!t) continue;
      const v = t.xp * e.qty;
      base += v;
      if (v < 0) neg += v;
      if (t.tier === "S" || t.tier === "A") {
        saXP += v;
        deep += (t.hr || 0) * e.qty;
      }
      byCat[t.cat] = (byCat[t.cat] || 0) + v;
      byTier[t.tier] = (byTier[t.tier] || 0) + v;
    }

    const wd = parseISO(d).getDay();
    const target = state.targets[state.profile][wd] ?? 90;
    const coreFloor = Math.round(target * CORE_RATIO);
    const mult = Math.min(0.2, Math.floor(streak / 7) * 0.05);
    const hit = base >= target && saXP >= coreFloor;
    const bonus = hit ? Math.round(base * mult) : 0;
    const total = base + bonus;

    streak = hit ? streak + 1 : 0;
    out.push({
      date: d,
      base,
      bonus,
      total,
      target,
      coreFloor,
      saXP,
      hit,
      neg,
      deep,
      byCat,
      byTier,
      streak,
      logged: entries.length > 0,
    });
  }
  return out;
}

export function overallStats(series, state, today) {
  const totalXP = series.reduce((s, r) => s + Math.max(0, r.total), 0);
  const lv = levelFromXP(totalXP);
  const cur = cumThreshold(lv);
  const next = cumThreshold(lv + 1);
  const earned = series.reduce(
    (s, r) => s + Math.max(0, Math.floor((r.total - r.target) / PHOTON_STEP)),
    0
  );

  let streak = 0;
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i].date === today && !series[i].logged) continue;
    if (series[i].hit) streak++;
    else break;
  }

  return {
    totalXP,
    lv,
    cur,
    next,
    pct: next > cur ? ((totalXP - cur) / (next - cur)) * 100 : 0,
    photons: earned - (state.photonsSpent || 0),
    streak,
  };
}

export function aggregate(rows) {
  const pos = rows.reduce((s, r) => s + Math.max(0, r.total), 0);
  const neg = rows.reduce((s, r) => s + r.neg, 0);
  const hits = rows.filter((r) => r.hit).length;
  const missCore = rows.filter((r) => r.base >= r.target && r.saXP < r.coreFloor).length;
  const logged = rows.filter((r) => r.logged).length;
  const deep = rows.reduce((s, r) => s + r.deep, 0);

  const byCat = {};
  const byTier = {};
  for (const r of rows) {
    for (const [k, v] of Object.entries(r.byCat)) byCat[k] = (byCat[k] || 0) + v;
    for (const [k, v] of Object.entries(r.byTier)) byTier[k] = (byTier[k] || 0) + v;
  }

  const sa = (byTier.S || 0) + (byTier.A || 0);
  const posRaw = ["S", "A", "B", "C"].reduce((s, k) => s + Math.max(0, byTier[k] || 0), 0);

  return {
    pos,
    neg,
    hits,
    missCore,
    logged,
    deep,
    byCat,
    byTier,
    quality: posRaw ? (sa / posRaw) * 100 : 0,
    leak: posRaw ? (Math.abs(neg) / posRaw) * 100 : 0,
    avg: rows.length ? pos / rows.length : 0,
    rate: rows.length ? (hits / rows.length) * 100 : 0,
  };
}
