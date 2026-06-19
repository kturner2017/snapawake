import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../theme';
import { PrimaryButton } from '../components/UI';

export function DismissedScreen({ streak, onDone }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.checkmark, { transform: [{ scale }] }]}>✅</Animated.Text>
      <Text style={styles.title}>You're up!</Text>
      <Text style={styles.sub}>Alarm dismissed. Good morning.</Text>

      {streak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      )}

      <PrimaryButton label="Done" onPress={onDone} style={styles.doneBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.lg },
  checkmark: { fontSize: 80 },
  title: { color: theme.colors.text, fontSize: theme.font.xxl, fontWeight: '800' },
  sub: { color: theme.colors.textMuted, fontSize: theme.font.md },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: theme.radius.full, paddingHorizontal: 24, paddingVertical: 12, gap: 8, borderWidth: 1, borderColor: theme.colors.border },
  streakFire: { fontSize: 28 },
  streakCount: { color: theme.colors.primary, fontSize: theme.font.xxl, fontWeight: '800' },
  streakLabel: { color: theme.colors.textMuted, fontSize: theme.font.sm },
  doneBtn: { width: '100%', marginTop: theme.spacing.md },
});
