import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../store/gameStore';

// Mapping from internal names to display abbreviations
const STAT_DISPLAY: Record<string, string> = {
  strength: 'STR',
  intelligence: 'INT',
  agility: 'AGI',
  stamina: 'STA',
  charisma: 'CHA',
  luck: 'LCK',
  morality: 'MOR',
};

interface StatsDisplayProps {
  visible?: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ visible = false }) => {
  const stats = useGameStore((state) => state.stats);
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const statEntries = Object.entries(stats).map(([name, value]) => ({
    abbrev: STAT_DISPLAY[name] || name.toUpperCase().slice(0, 3),
    value,
  }));

  // Split stats into left and right groups to avoid notch
  const leftStats = statEntries.slice(0, 4); // STR, INT, AGI, STA
  const rightStats = statEntries.slice(4);   // CHA, LCK, MOR

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      <View style={[styles.statGroup, { paddingLeft: insets.left + 8 }]}>
        {leftStats.map((stat) => (
          <View key={stat.abbrev} style={styles.statItem}>
            <Text style={styles.statName}>{stat.abbrev}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.statGroup, styles.statGroupRight, { paddingRight: insets.right + 8 }]}>
        {rightStats.map((stat) => (
          <View key={stat.abbrev} style={styles.statItem}>
            <Text style={styles.statName}>{stat.abbrev}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    backgroundColor: '#2a2a4e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statGroupRight: {
    justifyContent: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    marginHorizontal: 6,
    marginBottom: 2,
  },
  statName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#AAA',
    marginRight: 4,
  },
  statValue: {
    fontSize: 12,
    color: '#FFD700',
  },
});
