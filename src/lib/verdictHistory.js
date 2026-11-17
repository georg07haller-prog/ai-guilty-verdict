const HISTORY_KEY = 'guilty:verdict_history';
const UNLOCK_PREFIX = 'guilty:unlock:';
const MAX_ENTRIES = 15;

export function getVerdictHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVerdictToHistory(entry) {
  if (!entry?.id) return;
  const rest = getVerdictHistory().filter((item) => item.id !== entry.id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...rest].slice(0, MAX_ENTRIES)));
}

/** Remembers which paid Stripe session unlocked a given verdict in this browser. */
export function saveUnlockToken(verdictId, sessionId) {
  if (!verdictId || !sessionId) return;
  localStorage.setItem(UNLOCK_PREFIX + verdictId, sessionId);
}

export function getUnlockToken(verdictId) {
  if (!verdictId) return null;
  return localStorage.getItem(UNLOCK_PREFIX + verdictId);
}