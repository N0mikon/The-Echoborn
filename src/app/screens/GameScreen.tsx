import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoryText, ChoiceList, StatsDisplay } from '../components';
import { useGameStore, useSoulStatsStore } from '../store';
import { storyRunner } from '../../engine';

// Import compiled test story
import testStory from '../../stories/compiled/test.json';

export const GameScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    isPlaying,
    currentText,
    choices,
    isEnded,
    loadStory,
    selectChoice,
    syncStats,
  } = useGameStore();

  const { currentScreen, applyPendingStats } = useSoulStatsStore();

  // Memoize the story load and rebirth handling
  const initializeStory = useCallback(async () => {
    await loadStory(testStory);

    // Apply pending stats from rebirth if any
    if (applyPendingStats()) {
      // Sync the new stats to game store
      const stats = storyRunner.getStats();
      syncStats(stats);
    }
  }, [loadStory, applyPendingStats, syncStats]);

  useEffect(() => {
    // Load story when screen becomes active
    if (!isPlaying && !isLoading) {
      initializeStory();
    }
  }, [currentScreen, isPlaying, isLoading, initializeStory]);

  const containerStyle = [styles.container, { paddingBottom: insets.bottom }];

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color="#4a90d9" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (!isPlaying) {
    return (
      <View style={[styles.centered, { paddingBottom: insets.bottom }]}>
        <Text style={styles.errorText}>Failed to load story</Text>
      </View>
    );
  }

  if (isEnded) {
    return (
      <View style={containerStyle}>
        <StatsDisplay visible />
        <StoryText text={currentText} />
        <View style={styles.endContainer}>
          <Text style={styles.endText}>The End</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <StatsDisplay visible />
      <StoryText text={currentText} />
      <ChoiceList choices={choices} onSelect={selectChoice} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
  },
  endContainer: {
    padding: 24,
    alignItems: 'center',
  },
  endText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
