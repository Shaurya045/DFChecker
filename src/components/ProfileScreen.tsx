import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({navigation}: ProfileProps) => {
  const [profile, setProfile] = useState<{name?: string; email?: string}>({});
  const {logout} = useAuth();

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
      const response = await fetch(`${url}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication header here
        },
      });

      const data = await response.json();

      if (data.success) {
        await logout();
        console.log('User logged out successfully.');
      } else {
        console.error('Error logging out:', data.message);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []); //This was the line that needed to be updated.  The empty array [] was causing the issue.

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Profile</Text>
      <View style={styles.profileItem}>
        <Text style={styles.profileText}>Username: {profile.name}</Text>
      </View>
      <View style={styles.profileItem}>
        <Text style={styles.profileText}>Email: {profile.email}</Text>
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
