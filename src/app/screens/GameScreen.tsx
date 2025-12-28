import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoryText, ChoiceList, StatsDisplay } from '../components';
import { useGameStore, useSoulStatsStore } from '../store';
import { storyRunner, loadSavedGame, clearAllData } from '../../engine';

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
    restoreFromSave,
    resetGame,
  } = useGameStore();

  const { currentScreen, applyPendingStats, resetAll: resetSoulStats } = useSoulStatsStore();

  // Debug: Reset all data and restart
  const handleDebugReset = useCallback(async () => {
    await clearAllData();
    resetSoulStats();
    resetGame();
  }, [resetGame, resetSoulStats]);

  // Memoize the story load and rebirth handling
  const initializeStory = useCallback(async () => {
    // Check for saved game first
    const savedGame = await loadSavedGame();

    if (savedGame && savedGame.storyId === 'fantasy-test') {
      // Restore from save
      await restoreFromSave(testStory, savedGame.inkState);
    } else {
      // Fresh start
      await loadStory(testStory);

      // Apply pending stats from rebirth if any
      if (applyPendingStats()) {
        const stats = storyRunner.getStats();
        syncStats(stats);
      }
    }
  }, [loadStory, restoreFromSave, applyPendingStats, syncStats]);

  useEffect(() => {
    // Load story when screen becomes active
    if (!isPlaying && !isLoading) {
      initializeStory();
    }
  }, [currentScreen, isPlaying, isLoading, initializeStory]);

  const containerStyle = [styles.container, { paddingBottom: insets.bottom }];

  // Debug reset button (top right corner)
  const DebugResetButton = (
    <TouchableOpacity
      style={[styles.debugButton, { top: insets.top + 8 }]}
      onPress={handleDebugReset}
    >
      <Text style={styles.debugButtonText}>Reset</Text>
    </TouchableOpacity>
  );

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
        {DebugResetButton}
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
      {DebugResetButton}
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
  debugButton: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
    backgroundColor: '#d9534f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
