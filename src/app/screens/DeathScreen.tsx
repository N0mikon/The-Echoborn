import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface DeathScreenProps {
  onComplete: () => void;
}

export const DeathScreen: React.FC<DeathScreenProps> = ({ onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade to black
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      // Fade in text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(() => {
      onComplete();
    });
  }, [fadeAnim, textFadeAnim, onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.deathText}>You have died.</Text>
        <Text style={styles.continueText}>But your story continues...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  textContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  deathText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B0000', // Dark red
    marginBottom: 16,
  },
  continueText: {
    fontSize: 18,
    color: '#999',
    fontStyle: 'italic',
  },
});
