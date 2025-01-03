import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

interface FootSensationTestProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
}

const RightFootSensation: React.FC<FootSensationTestProps> = ({
  answers,
  handleAnswer,
}) => {
  const regions = [
    {id: 'region1', number: 1, x: '30%', y: '5%'},
    {id: 'region2', number: 2, x: '51%', y: '14%'},
    {id: 'region3', number: 3, x: '62%', y: '24%'},
    {id: 'region4', number: 4, x: '28%', y: '32%'},
    {id: 'region5', number: 5, x: '45%', y: '33%'},
    {id: 'region6', number: 6, x: '60%', y: '38%'},
    {id: 'region7', number: 7, x: '42%', y: '55%'},
    {id: 'region8', number: 8, x: '55%', y: '57%'},
    {id: 'region9', number: 9, x: '40%', y: '80%'},
  ];

  const toggleRegion = (regionId: string) => {
    handleAnswer(`sensation_${regionId}`, !answers[`sensation_${regionId}`]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Use a microfilament (like a pin) to check sensation in the specific
        areas.
      </Text>
      <Text style={styles.subtitle}>Identify the areas the patient feels.</Text>

      <View style={styles.footContainer}>
        <Image
          source={require('../assets/foot-outline.png')}
          style={styles.footImage}
          resizeMode="contain"
        />

        {regions.map(({id, number, x, y}) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.region,
              {
                left: x,
                top: y,
                backgroundColor: answers[`sensation_${id}`]
                  ? '#007AFF'
                  : 'white',
              },
            ]}
            onPress={() => toggleRegion(id)}>
            <Text
              style={[
                styles.regionNumber,
                {color: answers[`sensation_${id}`] ? 'white' : '#007AFF'},
              ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
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
  footContainer: {
    position: 'relative',
    width: 300,
    height: 400,
    alignItems: 'center',
  },
  footImage: {
    width: '100%',
    height: '100%',
  },
  region: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RightFootSensation;
