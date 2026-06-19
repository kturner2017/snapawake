import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { PrimaryButton } from '../components/UI';

function pad(n) { return String(n).padStart(2, '0'); }
function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${pad(m)} ${period}`;
}

export function RingingScreen({ alarm, onDismiss }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Animated.Text style={[styles.bellIcon, { transform: [{ scale: pulse }] }]}>
          🔔
        </Animated.Text>

        <Text style={styles.timeText}>{formatTime(alarm.hour, alarm.minute)}</Text>
        <Text style={styles.label}>{alarm.label || 'Wake up!'}</Text>

        <View style={styles.divider} />

        <Text style={styles.instruction}>To dismiss, photograph your</Text>
        <Text style={styles.objectName}>{alarm.targetObject}</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="📷  Take Photo to Dismiss"
          onPress={onDismiss}
          style={styles.dismissBtn}
        />
        <Text style={styles.noCheat}>No cheating — AI will verify the photo.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  bellIcon: { fontSize: 80, marginBottom: theme.spacing.xl },
  timeText: { color: theme.colors.text, fontSize: theme.font.xxxl, fontWeight: '800', letterSpacing: -4 },
  label: { color: theme.colors.textMuted, fontSize: theme.font.lg, marginTop: theme.spacing.sm },
  divider: { width: 60, height: 2, backgroundColor: theme.colors.border, marginVertical: theme.spacing.xl, borderRadius: 1 },
  instruction: { color: theme.colors.textMuted, fontSize: theme.font.md },
  objectName: { color: theme.colors.primary, fontSize: theme.font.xl, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  footer: { padding: theme.spacing.lg, gap: theme.spacing.md },
  dismissBtn: { width: '100%' },
  noCheat: { color: theme.colors.textMuted, fontSize: theme.font.xs, textAlign: 'center' },
});
