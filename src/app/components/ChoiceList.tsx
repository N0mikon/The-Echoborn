import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InkChoice } from '../../engine';

interface ChoiceListProps {
  choices: InkChoice[];
  onSelect: (index: number) => void;
}

export const ChoiceList: React.FC<ChoiceListProps> = ({ choices, onSelect }) => {
  if (choices.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {choices.map((choice) => (
        <TouchableOpacity
          key={choice.index}
          style={styles.choiceButton}
          onPress={() => onSelect(choice.index)}
        >
          <Text style={styles.choiceText}>{choice.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  choiceButton: {
    backgroundColor: '#4a90d9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
