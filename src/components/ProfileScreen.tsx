import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({navigation}: ProfileProps) => {
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
  const handleLogout = async () => {
    try {
      // Clear the token from storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('isLoggedIn');

      // Optionally, call the backend logout endpoint
      const response = await fetch(`${url}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('User logged out successfully.');
        navigation.replace('Welcome');
      } else {
        console.error('Error logging out:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Profile</Text>
      <View style={styles.innerContainer}>
        <View style={styles.profileItem}>
          <Text style={styles.profileText}>UserName: </Text>
          <Text style={styles.profileText}>{profile.name}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileText}>Email: </Text>
          <Text style={styles.profileText}>{profile.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => handleLogout()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  headingText: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  profileItem: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 500,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    padding: 15,
    width: '100%',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
