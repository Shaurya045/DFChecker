import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface FootConditionGridProps {
  questions: Array<{
    id: string;
    text: string;
    image: any;
  }>;
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
}

const RightFootGrid: React.FC<FootConditionGridProps> = ({
  questions,
  answers,
  handleAnswer,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        Do you notice any of the following changes in your foot?
      </Text>
      <View style={styles.grid}>
        {questions.map((question, index) => (
          <TouchableOpacity
            key={question.id}
            style={styles.gridItem}
            onPress={() => handleAnswer(question.id, !answers[question.id])}>
            <View style={styles.imageContainer}>
              <Image source={question.image} style={styles.image} />
              <View
                style={[
                  styles.checkbox,
                  answers[question.id] && styles.checkboxChecked,
                ]}>
                {answers[question.id] && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </View>
            <Text style={styles.text}>{question.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  checkbox: {
    position: 'absolute',
    bottom: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
});

export default RightFootGrid;
