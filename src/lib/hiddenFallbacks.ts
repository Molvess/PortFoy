// Ortak localStorage yardımcıları — admin'den gizlenen örnek verileri takip eder
const HIDDEN_KEY = 'molvess_hidden_fallbacks';

export const getHiddenIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addHiddenId = (id: string) => {
  const ids = getHiddenIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
  }
};

export const removeHiddenId = (id: string) => {
  const ids = getHiddenIds().filter((x) => x !== id);
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
};

export const resetHiddenIds = () => localStorage.removeItem(HIDDEN_KEY);

// Admin fallback ID'leri ile public fallback ID'leri eşleştirme
// Admin: fb-v1..fb-v4, fb-c1..fb-c3, fb-p1..fb-p6
// Public Showreel: 1..4   → admin fb-v1..fb-v4
// Public Content:  c1..c3 → admin fb-c1..fb-c3
// Public Projects: 1..6   → admin fb-p1..fb-p6
export const isVideoHidden = (publicId: string): boolean => {
  const hidden = getHiddenIds();
  return hidden.includes(`fb-v${publicId}`);
};

export const isContentHidden = (publicId: string): boolean => {
  const hidden = getHiddenIds();
  return hidden.includes(`fb-${publicId}`);
};

export const isProjectHidden = (publicId: string): boolean => {
  const hidden = getHiddenIds();
  return hidden.includes(`fb-p${publicId}`);
};
