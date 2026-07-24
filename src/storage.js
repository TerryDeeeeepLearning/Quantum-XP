import { DEFAULT_STATE } from "./data.js";

const KEY = "qxp:state:v1";

/* 資料存在瀏覽器的 localStorage，不會離開你的手機或電腦，也沒有伺服器。
 * 代價是：清除瀏覽器資料 = 紀錄消失。所以匯出備份不是選配，是必要習慣。 */
export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return migrate({ ...DEFAULT_STATE, ...parsed });
  } catch {
    return DEFAULT_STATE;
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function migrate(s) {
  // 保留未來改版空間：欄位缺失時補上預設值，避免舊備份載入後壞掉
  if (!s.notes) s.notes = {};
  if (!s.log) s.log = {};
  if (!s.exceptions) s.exceptions = [];
  if (typeof s.photonsSpent !== "number") s.photonsSpent = 0;
  return s;
}

export function exportFile(state) {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quantum-xp-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return stamp;
}

export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || !parsed.tasks) {
          reject(new Error("這不是有效的備份檔"));
          return;
        }
        resolve(migrate({ ...DEFAULT_STATE, ...parsed }));
      } catch {
        reject(new Error("檔案格式讀不出來"));
      }
    };
    reader.onerror = () => reject(new Error("檔案讀取失敗"));
    reader.readAsText(file);
  });
}
