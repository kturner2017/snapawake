import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = 'snapawake_alarms';
const STREAKS_KEY = 'snapawake_streaks';

export async function loadAlarms() {
  try {
    const raw = await AsyncStorage.getItem(ALARMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveAlarms(alarms) {
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}

export async function loadStreaks() {
  try {
    const raw = await AsyncStorage.getItem(STREAKS_KEY);
    return raw ? JSON.parse(raw) : { entries: [], currentStreak: 0, bestStreak: 0 };
  } catch {
    return { entries: [], currentStreak: 0, bestStreak: 0 };
  }
}

export async function recordDismissal(alarmLabel) {
  const data = await loadStreaks();
  const today = new Date().toISOString().split('T')[0];

  const alreadyToday = data.entries.some(e => e.date === today && e.success);
  if (!alreadyToday) {
    data.entries.unshift({ date: today, label: alarmLabel, success: true });

    // Recalculate current streak
    let streak = 0;
    const sortedEntries = [...data.entries].sort((a, b) => b.date.localeCompare(a.date));
    let expected = new Date();
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const diff = Math.round((expected - entryDate) / 86400000);
      if (diff <= 1 && entry.success) {
        streak++;
        expected = entryDate;
      } else {
        break;
      }
    }
    data.currentStreak = streak;
    data.bestStreak = Math.max(data.bestStreak, streak);
    await AsyncStorage.setItem(STREAKS_KEY, JSON.stringify(data));
  }
  return data;
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
