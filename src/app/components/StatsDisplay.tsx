import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  if (!visible) return null;

  const statEntries = Object.entries(stats).map(([name, value]) => ({
    abbrev: STAT_DISPLAY[name] || name.toUpperCase().slice(0, 3),
    value,
  }));

  return (
    <View style={styles.container}>
      {statEntries.map((stat) => (
        <View key={stat.abbrev} style={styles.statItem}>
          <Text style={styles.statName}>{stat.abbrev}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  statName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 4,
  },
  statValue: {
    fontSize: 12,
    color: '#333',
  },
});
