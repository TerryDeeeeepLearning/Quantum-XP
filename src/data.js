export const TIER = {
  S: { color: "var(--tier-S)", desc: "核心競爭力" },
  A: { color: "var(--tier-A)", desc: "支撐技能" },
  B: { color: "var(--tier-B)", desc: "續航與現金流" },
  C: { color: "var(--tier-C)", desc: "恢復與關係" },
  D: { color: "var(--tier-D)", desc: "耗損（負向）" },
};

export const CAT_COLOR = {
  研究: "var(--magenta)",
  技能: "var(--violet)",
  體能: "var(--cyan)",
  生活: "#4fb3d9",
  收入: "#6e8fb8",
  社交: "#5a7ca8",
  恢復: "#48627f",
  耗損: "var(--red)",
};

export const DAY_NAME = ["日", "一", "二", "三", "四", "五", "六"];

/* ---------- 任務庫 ---------- */
export const DEFAULT_TASKS = [
  { id: "s1", name: "論文精讀 ＋ 手寫摘要", tier: "S", xp: 60, unit: "篇", hr: 1.5, cat: "研究" },
  { id: "s3", name: "量子演算法手刻實作", tier: "S", xp: 50, unit: "小時", hr: 1, cat: "研究" },
  { id: "s6", name: "作品集專案（可公開 GitHub）", tier: "S", xp: 50, unit: "小時", hr: 1, cat: "研究" },
  { id: "s4", name: "數學硬底子（線代／機率／最佳化）", tier: "S", xp: 40, unit: "小時", hr: 1, cat: "研究" },
  { id: "s5", name: "量子資訊理論（N&C／量子力學）", tier: "S", xp: 40, unit: "小時", hr: 1, cat: "研究" },
  { id: "s2", name: "論文速掃（摘要／圖／結論）", tier: "S", xp: 25, unit: "篇", hr: 0.5, cat: "研究" },
  { id: "a1", name: "課本章節習題實作", tier: "A", xp: 35, unit: "小時", hr: 1, cat: "技能" },
  { id: "a2", name: "程式基礎（Python／C++／Git）", tier: "A", xp: 30, unit: "小時", hr: 1, cat: "技能" },
  { id: "a3", name: "機器學習／數值計算", tier: "A", xp: 30, unit: "小時", hr: 1, cat: "技能" },
  { id: "a4", name: "技術筆記公開輸出", tier: "A", xp: 30, unit: "篇", hr: 1, cat: "技能" },
  { id: "a5", name: "英文學術輸入輸出（30 分）", tier: "A", xp: 25, unit: "次", hr: 0.5, cat: "技能" },
  { id: "b1", name: "重訓", tier: "B", xp: 25, unit: "次", hr: 1.25, cat: "體能" },
  { id: "b2", name: "排球／有氧", tier: "B", xp: 20, unit: "次", hr: 2, cat: "體能" },
  { id: "b3", name: "23:30 前上床", tier: "B", xp: 15, unit: "次", hr: 0, cat: "生活" },
  { id: "b4", name: "09:00 前起床", tier: "B", xp: 15, unit: "次", hr: 0, cat: "生活" },
  { id: "b6", name: "打工出勤", tier: "B", xp: 15, unit: "次", hr: 2.5, cat: "收入" },
  { id: "b5", name: "三餐正常 ＋ 蛋白質達標", tier: "B", xp: 10, unit: "次", hr: 0, cat: "生活" },
  { id: "c1", name: "與女友／朋友高品質相處", tier: "C", xp: 15, unit: "次", hr: 2, cat: "社交" },
  { id: "c2", name: "主動恢復（散步／冥想／非技術閱讀）", tier: "C", xp: 10, unit: "次", hr: 0.5, cat: "恢復" },
  { id: "c3", name: "環境整理／家務", tier: "C", xp: 5, unit: "次", hr: 0.5, cat: "生活" },
  { id: "d5", name: "整天零深度學習", tier: "D", xp: -40, unit: "次", hr: 0, cat: "耗損" },
  { id: "d3", name: "01:30 後就寢", tier: "D", xp: -20, unit: "次", hr: 0, cat: "耗損" },
  { id: "d2", name: "遊戲超過 2 小時（每超出 1 小時）", tier: "D", xp: -20, unit: "小時", hr: 0, cat: "耗損" },
  { id: "d4", name: "12:00 後起床", tier: "D", xp: -15, unit: "次", hr: 0, cat: "耗損" },
  { id: "d1", name: "無目的滑手機（每 1 小時）", tier: "D", xp: -15, unit: "小時", hr: 0, cat: "耗損" },
];

/* ---------- 行程 ---------- */
const B = (t, label, kind) => ({ t, label, kind });
export const SUMMER_SCHEDULE = {
  1: [B("09:30–12:00", "深度學習｜論文／數學", "deep"), B("14:00–16:30", "實作｜程式／專案", "deep"), B("19:00–20:30", "重訓", "body")],
  2: [B("09:30–12:00", "深度學習｜論文／數學", "deep"), B("14:30–20:30", "打工（含通勤）", "fixed"), B("20:45–22:00", "重訓（彈性第 5 練）", "body")],
  3: [B("09:30–12:00", "深度學習｜論文／數學", "deep"), B("14:00–16:30", "實作｜程式／專案", "deep"), B("17:30–23:30", "排球（含通勤）", "fixed")],
  4: [B("09:30–12:00", "深度學習｜論文／數學", "deep"), B("14:00–16:30", "實作｜程式／專案", "deep"), B("18:00–20:30", "打工", "fixed"), B("20:45–22:00", "重訓", "body")],
  5: [B("09:30–12:00", "深度學習｜論文／數學", "deep"), B("14:00–16:30", "實作｜程式／專案", "deep"), B("18:00–20:30", "打工", "fixed"), B("20:45–22:00", "重訓", "body")],
  6: [B("10:00–12:00", "深度學習｜補洞", "deep"), B("14:00–16:30", "專案衝刺", "deep"), B("17:00–18:30", "重訓", "body")],
  0: [B("10:00–12:00", "週回顧 ＋ 補讀", "deep"), B("14:00–", "自由／社交（不設限）", "free")],
};
export const SEMESTER_SCHEDULE = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

/* 100% 強度基準（暑假週合計 705 XP）。強度調節器以此縮放。 */
export const BASELINE_TARGET = {
  summer: { 0: 90, 1: 120, 2: 85, 3: 80, 4: 105, 5: 105, 6: 120 },
  semester: { 0: 80, 1: 90, 2: 90, 3: 90, 4: 90, 5: 90, 6: 80 },
};
export const scaleTargets = (profile, f) => {
  const out = {};
  for (let d = 0; d <= 6; d++) out[d] = Math.round((BASELINE_TARGET[profile][d] * f) / 5) * 5;
  return out;
};

/* 深度門檻比例：當日至少這個比例的目標 XP 必須來自 S／A 級 */
export const CORE_RATIO = 0.5;
/* 每多少超量 XP 換一顆光子 */
export const PHOTON_STEP = 20;

export const LEVEL_TITLES = [
  "基態 · 觀望者",
  "受激 · 初階操作者",
  "相干 · 電路學徒",
  "疊加 · 演算法實習生",
  "糾纏 · 論文讀者",
  "高保真 · 研究生戰力",
  "容錯 · 專案作者",
  "邏輯位元 · 準研究員",
  "量子優勢 · 業界可用",
  "拓樸保護 · 稀缺人才",
  "通用量子機 · 百萬射程",
];

export const DEFAULT_STATE = {
  version: 1,
  profile: "summer",
  schedules: { summer: SUMMER_SCHEDULE, semester: SEMESTER_SCHEDULE },
  targets: { summer: scaleTargets("summer", 0.7), semester: scaleTargets("semester", 0.7) },
  tasks: DEFAULT_TASKS,
  log: {},
  exceptions: [
    { date: "2026-07-27", label: "上午領畢業證書｜晚間排球（不排重訓）" },
    { date: "2026-08-12", label: "和朋友出門（排球取消）" },
  ],
  notes: {},
  photonsSpent: 0,
  lastBackup: null,
};
