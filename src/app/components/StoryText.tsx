import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

interface StoryTextProps {
  text: string[];
}

export const StoryText: React.FC<StoryTextProps> = ({ text }) => {
  return (
    <ScrollView style={styles.container}>
      {text.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#e0e0e0',
    marginBottom: 12,
  },
});
