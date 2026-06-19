import React from 'react';
import { TouchableOpacity, Text, View, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export function PrimaryButton({ label, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.btnDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={theme.colors.bg} />
        : <Text style={styles.primaryBtnText}>{label}</Text>}
    </TouchableOpacity>
  );
}

export function DangerButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.dangerBtn, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.dangerBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.ghostBtn, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function AlarmToggle({ value, onChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: theme.colors.border, true: theme.colors.primaryDark }}
      thumbColor={value ? theme.colors.primary : theme.colors.textMuted}
    />
  );
}

export function SectionLabel({ text }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

export function Badge({ text, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color || theme.colors.primaryDark }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  primaryBtnText: { color: theme.colors.bg, fontWeight: '700', fontSize: theme.font.md },
  dangerBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  dangerBtnText: { color: theme.colors.danger, fontWeight: '600', fontSize: theme.font.md },
  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ghostBtnText: { color: theme.colors.textMuted, fontSize: theme.font.sm },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.font.xs,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  badge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { color: theme.colors.text, fontSize: theme.font.xs, fontWeight: '600' },
});
