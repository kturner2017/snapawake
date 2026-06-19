import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/UI';
import { loadStreaks } from '../utils/storage';

export function StreaksScreen() {
  const [data, setData] = useState({ entries: [], currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    loadStreaks().then(setData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Streaks</Text>
        <Text style={styles.subtitle}>Don't break the chain.</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{data.currentStreak}</Text>
          <Text style={styles.statLabel}>Current 🔥</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{data.bestStreak}</Text>
          <Text style={styles.statLabel}>Best 🏆</Text>
        </Card>
      </View>

      {data.entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No history yet.</Text>
          <Text style={styles.emptyHint}>Dismiss your first alarm to start your streak.</Text>
        </View>
      ) : (
        <FlatList
          data={data.entries}
          keyExtractor={(item, i) => `${item.date}-${i}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.entryRow}>
              <Text style={styles.entryCheck}>{item.success ? '✅' : '❌'}</Text>
              <View style={styles.entryInfo}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text style={styles.entryLabel}>{item.label}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '800' },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: theme.spacing.lg },
  statNumber: { color: theme.colors.primary, fontSize: theme.font.xxl, fontWeight: '800' },
  statLabel: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 4 },
  list: { paddingHorizontal: theme.spacing.lg },
  entryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: theme.spacing.md },
  entryCheck: { fontSize: 22 },
  entryInfo: { flex: 1 },
  entryDate: { color: theme.colors.text, fontSize: theme.font.sm, fontWeight: '600' },
  entryLabel: { color: theme.colors.textMuted, fontSize: theme.font.xs },
  sep: { height: 1, backgroundColor: theme.colors.border },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyText: { color: theme.colors.text, fontSize: theme.font.lg, fontWeight: '600' },
  emptyHint: { color: theme.colors.textMuted, fontSize: theme.font.sm, marginTop: 8, textAlign: 'center', paddingHorizontal: theme.spacing.xl },
});
