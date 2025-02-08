import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {colors} from '../utils/colors';

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({navigation}: WelcomeProps) => {
  const submit = () => {
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.mainText}>DFChecker</Text> */}
      <Image
        source={require('../assets/dfcheckerImage.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={submit}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 250,
    width: 200,
  },
  mainText: {
    fontSize: 40,
    fontFamily: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 98,
  },
  loginText: {
    padding: 6,
    color: colors.white,
    fontSize: 20,
    fontFamily: 'semibold',
  },
});

export default WelcomeScreen;
