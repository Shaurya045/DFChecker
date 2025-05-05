import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

interface PulseCheckProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: string) => void;
}

const RightPulseCheck: React.FC<PulseCheckProps> = ({
  answers,
  handleAnswer,
}) => {
  const positions = [
    {
      id: 'upperPulse',
      image: require('../assets/upper-pulse.png'),
    },
    {
      id: 'innerPulse',
      image: require('../assets/inner-pulse.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Checking the pulse: Place the index and middle fingers on the artery
        above and on the inner side of the foot
      </Text>
      <Text style={styles.subtitle}>as shown in the picture below.</Text>

      {positions.map(position => (
        <View key={position.id} style={styles.positionContainer}>
          <Image
            source={position.image}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                answers[position.id] === 'good' && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(position.id, 'good')}>
              {answers[position.id] === 'good' && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              <Text
                style={[
                  styles.optionText,
                  answers[position.id] === 'good' && styles.selectedOptionText,
                ]}>
                good
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                answers[position.id] === 'weak' && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(position.id, 'weak')}>
              {answers[position.id] === 'weak' && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              <Text
                style={[
                  styles.optionText,
                  answers[position.id] === 'weak' && styles.selectedOptionText,
                ]}>
                weak
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  positionContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingRight: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  selectedOptionText: {
    color: 'white',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
});

export default RightPulseCheck;
