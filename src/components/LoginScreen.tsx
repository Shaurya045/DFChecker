import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFormValid = email.length >= 9 && password.length >= 6;

  const handleSubmit = async () => {
    const userData = {
      email,
      password,
    };
    if (isFormValid) {
      try {
        const response = await fetch(`${url}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Login successfull!!!');
          navigation.replace('Home');
        } else {
          Alert.alert('Login failed!!!');
        }
      } catch (error) {
        console.error('Error Logging in:', error);
      }
    } else {
      Alert.alert('Please fill all the fields');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>LOGIN</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Password</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          {backgroundColor: isFormValid ? colors.primary : 'grey'},
          {
            marginTop: 50,
          },
        ]}
        disabled={!isFormValid}
        onPress={() => handleSubmit()}
        accessible
        accessibilityLabel="Login button">
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <Text style={[styles.description, {marginTop: 20}]}>
        Don't have an account?
      </Text>
      <TouchableOpacity
        style={[styles.buttonStyle, {backgroundColor: colors.primary}]}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  mainHeader: {
    fontSize: 30,
    color: '#344055',
    fontWeight: '500',
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: 'bold',
  },
  description: {
    fontSize: 20,
    color: '#7d7d7d',
    paddingBottom: 20,
    lineHeight: 25,
    fontFamily: 'regular',
  },
  inputContainer: {
    marginTop: 20,
  },
  labels: {
    fontSize: 18,
    color: '#7d7d7d',
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
    fontFamily: 'regular',
  },
  inputStyle: {
    borderWidth: 1,
    color: 'black',
    borderColor: 'rgba(0,0,0,0.3',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    fontFamily: 'regular',
    fontSize: 18,
  },
  buttonStyle: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default LoginScreen;
