// Tiny helper around localStorage so all pages share the same compare semantics (max 3).
const KEY = 'compareIds';
export const MAX_COMPARE = 3;

import colleges from '@/data/colleges.json';

export function getCompareIds() {
  if (typeof window === 'undefined') return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(v)) return [];
    
    const validIds = v.filter(id => colleges.some(c => c.id === id));
    if (validIds.length !== v.length) {
      localStorage.setItem(KEY, JSON.stringify(validIds));
    }
    
    return validIds;
  } catch { return []; }
}

export function setCompareIds(ids) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('compare:update'));
}

export function addCompareId(id) {
  const ids = getCompareIds();
  if (ids.includes(id)) return { ok: false, reason: 'exists', ids };
  if (ids.length >= MAX_COMPARE) return { ok: false, reason: 'max', ids };
  const next = [...ids, id];
  setCompareIds(next);
  return { ok: true, ids: next };
}

export function removeCompareId(id) {
  const next = getCompareIds().filter((x) => x !== id);
  setCompareIds(next);
  return next;
}
