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

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [agree, setAgree] = useState(false);
  const isFormValid = username.length >= 3 && password.length >= 6;

  // console.warn(username, password, agree);

  const submit = () => {
    if (username === 'shaurya' && password === '123456') {
      // Alert.alert(`Thank you ${username}`);
      navigation.navigate('Home');
    } else {
      Alert.alert('Invalid Credentials');
    }
  };

  // useEffect(() => {
  //   if (username.length >= 3 && password.length >= 6) {
  //     setAgree(true);
  //   }
  // }, [username, password]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>LOGIN</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Name</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={text => setUsername(text)}
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
        ]}
        disabled={!isFormValid}
        onPress={submit}
        accessible
        accessibilityLabel="Login button">
        <Text style={styles.buttonText}>LOGIN</Text>
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
    marginTop: 50,
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
