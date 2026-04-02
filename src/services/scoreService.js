const BASE = '/api/scores';

export async function submitScore(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getChampion() {
  try {
    const res = await fetch(`${BASE}?action=champion`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getLeaderboard() {
  try {
    const res = await fetch(BASE);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
