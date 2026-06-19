import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { PrimaryButton, DangerButton, GhostButton, SectionLabel } from '../components/UI';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function pad(n) { return String(n).padStart(2, '0'); }

export function SetupScreen({ alarm, onSave, onDelete, onCancel }) {
  const [hour, setHour] = useState(alarm?.hour ?? 7);
  const [minute, setMinute] = useState(alarm?.minute ?? 0);
  const [targetObject, setTargetObject] = useState(alarm?.targetObject ?? '');
  const [days, setDays] = useState(alarm?.days ?? [1, 2, 3, 4, 5]);

  function toggleDay(d) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  function handleSave() {
    if (!targetObject.trim()) return;
    onSave({ hour, minute, targetObject: targetObject.trim(), days, active: alarm?.active ?? true });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <GhostButton label="Cancel" onPress={onCancel} />
        <Text style={styles.navTitle}>{alarm ? 'Edit Alarm' : 'New Alarm'}</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <SectionLabel text="Wake Time" />
        <View style={styles.timePicker}>
          <ScrollView
            style={styles.timeScroll}
            showsVerticalScrollIndicator={false}
            snapToInterval={48}
            decelerationRate="fast"
            contentOffset={{ y: hour * 48 }}
            onMomentumScrollEnd={e => setHour(Math.round(e.nativeEvent.contentOffset.y / 48))}
          >
            {HOURS.map(h => (
              <View key={h} style={styles.timeItem}>
                <Text style={[styles.timeItemText, hour === h && styles.timeItemActive]}>{pad(h)}</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.colon}>:</Text>
          <ScrollView
            style={styles.timeScroll}
            showsVerticalScrollIndicator={false}
            snapToInterval={48}
            decelerationRate="fast"
            contentOffset={{ y: minute * 48 }}
            onMomentumScrollEnd={e => setMinute(Math.round(e.nativeEvent.contentOffset.y / 48))}
          >
            {MINUTES.map(m => (
              <View key={m} style={styles.timeItem}>
                <Text style={[styles.timeItemText, minute === m && styles.timeItemActive]}>{pad(m)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <SectionLabel text="Repeat" />
        <View style={styles.daysRow}>
          {DAYS.map((d, i) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayBtn, days.includes(i) && styles.dayBtnActive]}
              onPress={() => toggleDay(i)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayBtnText, days.includes(i) && styles.dayBtnTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text="Photo Object" />
        <TextInput
          style={styles.input}
          placeholder="e.g. coffee mug, front door, kettle"
          placeholderTextColor={theme.colors.textMuted}
          value={targetObject}
          onChangeText={setTargetObject}
          autoCapitalize="none"
          returnKeyType="done"
        />
        <Text style={styles.hint}>You must photograph THIS object to dismiss the alarm. Make it something near where you need to be.</Text>

        <PrimaryButton
          label={alarm ? 'Save Changes' : 'Create Alarm'}
          onPress={handleSave}
          disabled={!targetObject.trim()}
          style={styles.saveBtn}
        />
        {alarm && (
          <DangerButton label="Delete Alarm" onPress={onDelete} style={styles.deleteBtn} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  navTitle: { color: theme.colors.text, fontSize: theme.font.md, fontWeight: '600' },
  scroll: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 144, overflow: 'hidden', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, marginBottom: theme.spacing.sm },
  timeScroll: { width: 80, height: 144 },
  timeItem: { height: 48, alignItems: 'center', justifyContent: 'center' },
  timeItemText: { color: theme.colors.textMuted, fontSize: theme.font.xl, fontWeight: '300' },
  timeItemActive: { color: theme.colors.primary, fontWeight: '700', fontSize: theme.font.xl },
  colon: { color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '700', paddingHorizontal: 8 },
  daysRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dayBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: theme.radius.full, borderWidth: 1.5, borderColor: theme.colors.border },
  dayBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  dayBtnText: { color: theme.colors.textMuted, fontSize: theme.font.sm, fontWeight: '600' },
  dayBtnTextActive: { color: theme.colors.bg },
  input: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.md, color: theme.colors.text, fontSize: theme.font.md, borderWidth: 1, borderColor: theme.colors.border },
  hint: { color: theme.colors.textMuted, fontSize: theme.font.xs, marginTop: 8, lineHeight: 18 },
  saveBtn: { marginTop: theme.spacing.xl },
  deleteBtn: { marginTop: theme.spacing.md },
});
