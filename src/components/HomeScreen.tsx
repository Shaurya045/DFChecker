import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const [profile, setProfile] = useState({});
  const getUserProfile = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }

      const response = await fetch(`${url}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data;
        setProfile(userData);
        console.log('User Profile:', userData);
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Account details</Text>
      </View> */}

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.greetingButton}>
          <View style={styles.greetingContent}>
            <Text style={styles.greetingText}>Hello {profile?.name}</Text>
            <View style={styles.userIcon}>
              <View style={styles.userIconCircle} />
              <View style={styles.userIconBody} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraSection}>
        <Text style={styles.instructionText}>Take Diabetic Foot Test</Text>
        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Qes')}
          style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Take Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  greetingContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  greetingButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    color: '#fff',
    fontSize: 18,
  },
  userIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  userIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 6,
  },
  userIconBody: {
    width: 24,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
  arrowContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  arrow: {
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    transform: [{rotate: '45deg'}],
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: 'semibold',
  },
});

export default HomeScreen;
