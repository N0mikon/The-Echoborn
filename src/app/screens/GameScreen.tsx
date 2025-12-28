import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StoryText, ChoiceList, StatsDisplay } from '../components';
import { useGameStore } from '../store';

// Import compiled test story
import testStory from '../../stories/compiled/test.json';

export const GameScreen: React.FC = () => {
  const {
    isLoading,
    isPlaying,
    currentText,
    choices,
    isEnded,
    loadStory,
    selectChoice,
  } = useGameStore();

  useEffect(() => {
    loadStory(testStory);
  }, [loadStory]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90d9" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (!isPlaying) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load story</Text>
      </View>
    );
  }

  if (isEnded) {
    return (
      <View style={styles.container}>
        <StatsDisplay visible />
        <StoryText text={currentText} />
        <View style={styles.endContainer}>
          <Text style={styles.endText}>The End</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatsDisplay visible />
      <StoryText text={currentText} />
      <ChoiceList choices={choices} onSelect={selectChoice} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
    color: '#333',
  },
});
