import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsDisplayProps {
  visible?: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ visible = false }) => {
  if (!visible) return null;

  // Placeholder stats - will be connected to Soul Stats in Phase 3
  const stats = [
    { name: 'STR', value: 1 },
    { name: 'INT', value: 1 },
    { name: 'AGI', value: 1 },
    { name: 'STA', value: 1 },
    { name: 'CHA', value: 1 },
    { name: 'LCK', value: 1 },
    { name: 'MOR', value: 1 },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.name} style={styles.statItem}>
          <Text style={styles.statName}>{stat.name}</Text>
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
