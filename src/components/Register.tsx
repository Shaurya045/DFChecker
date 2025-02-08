import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = ({navigation}: RegisterProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFormValid =
    name.length >= 3 && email.length >= 9 && password.length >= 6;

  const handleSubmit = async () => {
    const userData = {
      name,
      email,
      password,
    };
    if (isFormValid) {
      try {
        const response = await fetch(`${url}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
          Alert.alert('Registration successfull!!!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Registration failed!!!');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    } else {
      Alert.alert('Please fill all the fields');
    }
  };

  // useEffect(() => {
  //   if (username.length >= 3 && password.length >= 6) {
  //     setAgree(true);
  //   }
  // }, [username, password]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Register</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Name</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>
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
          {
            backgroundColor: isFormValid ? colors.primary : 'grey',
            marginTop: 50,
          },
        ]}
        disabled={!isFormValid}
        onPress={() => handleSubmit()}
        accessible
        accessibilityLabel="Login button">
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
      <Text style={[styles.description, {marginTop: 20}]}>
        Already have an account?
      </Text>
      <TouchableOpacity
        style={[styles.buttonStyle, {backgroundColor: colors.primary}]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </SafeAreaView>
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

export default Register;
