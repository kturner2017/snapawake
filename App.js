import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { RingingScreen } from './src/screens/RingingScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { VerifyingScreen } from './src/screens/VerifyingScreen';
import { DismissedScreen } from './src/screens/DismissedScreen';
import { StreaksScreen } from './src/screens/StreaksScreen';
import { TabBar } from './src/components/TabBar';
import { theme } from './src/theme';
import { loadAlarms, saveAlarms, recordDismissal, makeId } from './src/utils/storage';
import { verifyPhoto } from './src/utils/verify';

// Which screens show the tab bar
const TABBED = ['Home', 'Streaks'];

export default function App() {
  const [alarms, setAlarms] = useState([]);
  const [screen, setScreen] = useState('Home');
  const [tab, setTab] = useState('Home');
  const [editingAlarm, setEditingAlarm] = useState(null); // null = new
  const [firingAlarm, setFiringAlarm] = useState(null);
  const [streak, setStreak] = useState(0);
  const [verifyError, setVerifyError] = useState(null);

  // Load alarms on mount
  useEffect(() => {
    loadAlarms().then(setAlarms);
  }, []);

  // Check every 30s if an alarm should fire
  useEffect(() => {
    function checkAlarms() {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const h = now.getHours();
      const m = now.getMinutes();

      for (const alarm of alarms) {
        if (!alarm.active) continue;
        if (!alarm.days.includes(dayOfWeek)) continue;
        if (alarm.hour === h && alarm.minute === m && !alarm._firedToday) {
          setFiringAlarm(alarm);
          setScreen('Ringing');
          // Mark fired so it doesn't re-trigger within the same minute
          setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, _firedToday: true } : a));
          break;
        }
      }
    }

    checkAlarms();
    const timer = setInterval(checkAlarms, 30000);
    return () => clearInterval(timer);
  }, [alarms]);

  // Reset _firedToday at midnight
  useEffect(() => {
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timer = setTimeout(() => {
      setAlarms(prev => prev.map(a => ({ ...a, _firedToday: false })));
    }, msToMidnight);
    return () => clearTimeout(timer);
  }, []);

  // Navigation
  function navigate(s) {
    setScreen(s);
    if (TABBED.includes(s)) setTab(s);
  }

  // Alarm CRUD
  function handleSaveAlarm(data) {
    let updated;
    if (editingAlarm) {
      updated = alarms.map(a => a.id === editingAlarm.id ? { ...a, ...data } : a);
    } else {
      updated = [...alarms, { id: makeId(), ...data }];
    }
    setAlarms(updated);
    saveAlarms(updated);
    navigate('Home');
    setEditingAlarm(null);
  }

  function handleDeleteAlarm() {
    const updated = alarms.filter(a => a.id !== editingAlarm.id);
    setAlarms(updated);
    saveAlarms(updated);
    navigate('Home');
    setEditingAlarm(null);
  }

  function handleToggle(id, value) {
    const updated = alarms.map(a => a.id === id ? { ...a, active: value } : a);
    setAlarms(updated);
    saveAlarms(updated);
  }

  // Dismissal flow
  async function handlePhotoTaken(base64) {
    navigate('Verifying');
    setVerifyError(null);
    try {
      const verified = await verifyPhoto(base64, firingAlarm.targetObject);
      if (verified) {
        const data = await recordDismissal(firingAlarm.targetObject);
        setStreak(data.currentStreak);
        navigate('Dismissed');
      } else {
        // Photo didn't match — send back to camera
        navigate('Camera');
      }
    } catch (e) {
      console.error('Verify error', e);
      setVerifyError(e.message);
      navigate('Camera');
    }
  }

  // Render
  const showTabs = TABBED.includes(screen);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {screen === 'Home' && (
        <HomeScreen
          alarms={alarms}
          onToggle={handleToggle}
          onAdd={() => { setEditingAlarm(null); navigate('Setup'); }}
          onEdit={alarm => { setEditingAlarm(alarm); navigate('Setup'); }}
          onDelete={handleDeleteAlarm}
        />
      )}

      {screen === 'Streaks' && <StreaksScreen />}

      {screen === 'Setup' && (
        <SetupScreen
          alarm={editingAlarm}
          onSave={handleSaveAlarm}
          onDelete={handleDeleteAlarm}
          onCancel={() => navigate('Home')}
        />
      )}

      {screen === 'Ringing' && firingAlarm && (
        <RingingScreen
          alarm={firingAlarm}
          onDismiss={() => navigate('Camera')}
        />
      )}

      {screen === 'Camera' && firingAlarm && (
        <CameraScreen
          alarm={firingAlarm}
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => navigate('Ringing')}
        />
      )}

      {screen === 'Verifying' && (
        <VerifyingScreen onCancel={() => navigate('Camera')} />
      )}

      {screen === 'Dismissed' && (
        <DismissedScreen
          streak={streak}
          onDone={() => navigate('Home')}
        />
      )}

      {showTabs && <TabBar active={tab} onNavigate={navigate} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});
