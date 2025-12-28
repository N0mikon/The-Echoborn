import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSoulStatsStore } from '../store';
import { STAT_NAMES, StatName } from '../../types/stats';

const STAT_DISPLAY: Record<StatName, string> = {
  strength: 'STR',
  intelligence: 'INT',
  agility: 'AGI',
  stamina: 'STA',
  charisma: 'CHA',
  luck: 'LCK',
  morality: 'MOR',
};

interface AnimatedStatProps {
  name: StatName;
  oldValue: number;
  newValue: number;
  delay: number;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({
  name,
  oldValue,
  newValue,
  delay,
}) => {
  const [displayValue, setDisplayValue] = useState(oldValue);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const hasIncrease = newValue > oldValue;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasIncrease) {
        // Animate the count-up
        const duration = 1000;
        const steps = newValue - oldValue;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const interval = setInterval(() => {
          currentStep++;
          setDisplayValue(oldValue + currentStep);

          if (currentStep >= steps) {
            clearInterval(interval);
            // Pulse animation on completion
            // Note: Both animations must use same useNativeDriver setting
            // when applied to the same component. Color interpolation requires JS driver.
            Animated.sequence([
              Animated.parallel([
                Animated.timing(scaleAnim, {
                  toValue: 1.3,
                  duration: 150,
                  useNativeDriver: false,
                }),
                Animated.timing(colorAnim, {
                  toValue: 1,
                  duration: 150,
                  useNativeDriver: false,
                }),
              ]),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
              }),
            ]).start();
          }
        }, stepDuration);

        return () => clearInterval(interval);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [oldValue, newValue, delay, hasIncrease, scaleAnim, colorAnim]);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFF', '#FFD700'], // White to Gold
  });

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{STAT_DISPLAY[name]}</Text>
      <View style={styles.statValueColumn}>
        <Animated.Text
          style={[
            styles.statValue,
            {
              transform: [{ scale: scaleAnim }],
              color: hasIncrease ? textColor : '#FFF',
            },
          ]}
        >
          {displayValue}
        </Animated.Text>
      </View>
      <View style={styles.increaseColumn}>
        {hasIncrease && (
          <Text style={styles.increaseIndicator}>
            +{newValue - oldValue}
          </Text>
        )}
      </View>
    </View>
  );
};

export const SoulStatsScreen: React.FC = () => {
  const { deathData, loopCount, handleRebirth } = useSoulStatsStore();
  const insets = useSafeAreaInsets();

  if (!deathData) return null;

  const { previousSoulStats, newSoulStats, newStartingStats } = deathData;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Soul Stats</Text>
        <Text style={styles.loopCount}>Life #{loopCount}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Highest Achieved</Text>
          {STAT_NAMES.map((name, index) => (
            <AnimatedStat
              key={name}
              name={name}
              oldValue={previousSoulStats[name]}
              newValue={newSoulStats[name]}
              delay={index * 200} // Stagger animations
            />
          ))}
        </View>

        <View style={styles.startingStatsContainer}>
          <Text style={styles.sectionTitle}>Starting Stats (10%)</Text>
          {STAT_NAMES.map((name) => (
            <View key={name} style={styles.statRow}>
              <Text style={styles.statLabel}>{STAT_DISPLAY[name]}</Text>
              <View style={styles.statValueColumn}>
                <Text style={styles.startingValue}>{newStartingStats[name]}</Text>
              </View>
              <View style={styles.increaseColumn} />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleRebirth}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 4,
  },
  loopCount: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  startingStatsContainer: {
    backgroundColor: '#1e3a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#AAA',
    width: 40,
  },
  statValueColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  startingValue: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  increaseColumn: {
    width: 50,
    alignItems: 'flex-end',
  },
  increaseIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4a4a6a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
