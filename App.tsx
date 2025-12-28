import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameScreen, DeathScreen, SoulStatsScreen } from './src/app/screens';
import { useSoulStatsStore } from './src/app/store';

function AppContent() {
  const { currentScreen, setScreen, initialize, isInitialized } = useSoulStatsStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <View style={styles.loading} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'death':
        return <DeathScreen onComplete={() => setScreen('soulStats')} />;
      case 'soulStats':
        return <SoulStatsScreen />;
      case 'game':
      default:
        return <GameScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loading: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
