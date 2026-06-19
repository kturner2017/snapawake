import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { Card, AlarmToggle, PrimaryButton } from '../components/UI';

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function HomeScreen({ alarms, onToggle, onDelete, onAdd, onEdit }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SnapAwake</Text>
        <Text style={styles.subtitle}>No cheating.</Text>
      </View>

      {alarms.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⏰</Text>
          <Text style={styles.emptyText}>No alarms yet.</Text>
          <Text style={styles.emptyHint}>Tap the button below to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.alarmCard}>
              <TouchableOpacity onPress={() => onEdit(item)} activeOpacity={0.8}>
                <View style={styles.alarmRow}>
                  <View style={styles.alarmLeft}>
                    <Text style={[styles.timeText, !item.active && styles.dimmed]}>
                      {formatTime(item.hour, item.minute)}
                    </Text>
                    <Text style={styles.labelText}>📷 {item.targetObject || 'Tap to set object'}</Text>
                    <View style={styles.daysRow}>
                      {DAYS.map((d, i) => (
                        <Text
                          key={d}
                          style={[styles.dayChip, item.days?.includes(i) && styles.dayChipActive]}
                        >
                          {d}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <AlarmToggle
                    value={item.active}
                    onChange={v => onToggle(item.id, v)}
                  />
                </View>
              </TouchableOpacity>
            </Card>
          )}
        />
      )}

      <View style={styles.footer}>
        <PrimaryButton label="+ Add Alarm" onPress={onAdd} style={styles.addBtn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '800' },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 2 },
  list: { paddingHorizontal: theme.spacing.lg, paddingBottom: 100 },
  alarmCard: { marginBottom: theme.spacing.md },
  alarmRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  alarmLeft: { flex: 1 },
  timeText: { color: theme.colors.text, fontSize: theme.font.xxl, fontWeight: '700', letterSpacing: -1 },
  dimmed: { color: theme.colors.textMuted },
  labelText: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 4 },
  daysRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  dayChip: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dayChipActive: {
    color: theme.colors.bg,
    backgroundColor: theme.colors.primary,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyIcon: { fontSize: 64, marginBottom: theme.spacing.md },
  emptyText: { color: theme.colors.text, fontSize: theme.font.lg, fontWeight: '600' },
  emptyHint: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.spacing.lg, backgroundColor: theme.colors.bg },
  addBtn: { width: '100%' },
});
