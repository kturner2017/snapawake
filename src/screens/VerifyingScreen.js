import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../theme';
import { GhostButton } from '../components/UI';

export function VerifyingScreen({ onCancel }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.spinner, { transform: [{ rotate }] }]}>📷</Animated.Text>
      <Text style={styles.title}>Verifying...</Text>
      <Text style={styles.sub}>Claude is checking your photo.</Text>
      <Text style={styles.sub2}>This takes a couple of seconds.</Text>
      <GhostButton label="Retake Photo" onPress={onCancel} style={styles.retake} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
  spinner: { fontSize: 64 },
  title: { color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '700' },
  sub: { color: theme.colors.textMuted, fontSize: theme.font.md },
  sub2: { color: theme.colors.textMuted, fontSize: theme.font.sm },
  retake: { marginTop: theme.spacing.xl },
});
