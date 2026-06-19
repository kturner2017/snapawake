import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const TABS = [
  { key: 'Home', label: 'Alarms', icon: '⏰' },
  { key: 'Streaks', label: 'Streaks', icon: '🔥' },
];

export function TabBar({ active, onNavigate }) {
  return (
    <View style={styles.bar}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onNavigate(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>
            {tab.label}
          </Text>
          {active === tab.key && <View style={styles.dot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  icon: { fontSize: 22 },
  label: { color: theme.colors.textMuted, fontSize: theme.font.xs, fontWeight: '500' },
  labelActive: { color: theme.colors.primary },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 3,
  },
});
