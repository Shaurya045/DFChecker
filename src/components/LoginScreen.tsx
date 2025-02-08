import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFormValid = email.length >= 9 && password.length >= 6;
  const {login} = useAuth();

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const response = await fetch(`${url}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (data.success) {
          await login(data.token);
          Alert.alert('Success', 'Login successful!');
        } else {
          Alert.alert('Error', 'Login failed!');
        }
      } catch (error) {
        console.error('Error Logging in:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please fill all the fields');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{paddingHorizontal: 30}}>
      <Text style={styles.mainHeader}>LOGIN</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
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
          onChangeText={setPassword}
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
        onPress={handleSubmit}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    //paddingHorizontal: 30,
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
