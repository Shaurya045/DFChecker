import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import LanguageDropdown from './LanguageDropdown';
import {useTranslation} from 'react-i18next';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({navigation}: ProfileProps) => {
  const [profile, setProfile] = useState<{name?: string; email?: string}>({});
  const [reports, setReports] = useState<any[]>([]);
  const {logout} = useAuth();
  const {t} = useTranslation();

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

  const getAllReports = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }
      const response = await fetch(`${url}/getallreports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const report = data.data;
        setReports(report);
        console.log('Reports:', report[0]);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    getAllReports();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
<TouchableOpacity
  onPress={() => navigation.navigate('Home')}
  style={styles.homeButton}>  {/* Added proper styling */}
  <Icon name="home" size={30} color={colors.primary} />  {/* Fixed lowercase + color */}
</TouchableOpacity>
      <View style={{width: '100%'}}>
        <Text style={styles.headingText}>{t('Profile.title')}</Text>
        <View style={styles.profileItem}>
          <Text style={styles.profileText}>{t('Welcome.text1')}:</Text>
          <LanguageDropdown />
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileText}>{t('Profile.text1')}: </Text>
          <Text style={styles.profileTextAns}>{profile.name}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileText}>{t('Profile.text2')}: </Text>
          <Text style={styles.profileTextAns}>{profile.email}</Text>
        </View>
        <TouchableOpacity style={styles.buttonStyle} onPress={handleLogout}>
          <Text style={styles.buttonText}>{t('Profile.btn1')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 30, flex: 1, width: '100%'}}>
        <Text
          style={{
            fontSize: 23,
            fontWeight: '500',
            marginBottom: 15,
            textAlign: 'center',
            color: colors.secondary,
          }}>
          {t('Profile.text3')}
        </Text>
        {reports.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {reports.map((item, index) => {
              const formattedDate = new Date(
                item?.createdAt,
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('ReportProfile', {
                      reportData: item,
                      result: {
                        left: item?.result?.left_foot?.risk_category?.replace(
                          /^(.*?)\s-\sCategory\s\d+$/,
                          '$1',
                        ),
                        right: item?.result?.right_foot?.risk_category?.replace(
                          /^(.*?)\s-\sCategory\s\d+$/,
                          '$1',
                        ),
                      },
                    })
                  }>
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      padding: 15,
                      borderRadius: 10,
                      marginBottom: 17,
                    }}>
                    <View style={{flexDirection: 'column', gap: 5}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'baseline'}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: colors.gray,
                          }}>
                          {t('Profile.text4')}:{' '}
                        </Text>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: 16,
                            maxWidth: '70%',
                          }}>
                          {t(`Profile.${item?.result?.left_foot?.risk_category?.replace(
                            /^(.*?)\s-\sCategory\s\d+$/,
                            '$1'
                          )}`)}
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'baseline'}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: colors.gray,
                          }}>
                          {t('Profile.text5')}:{' '}
                        </Text>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: 16,
                            maxWidth: '70%',
                          }}>
                          {t(`Profile.${item?.result?.right_foot?.risk_category?.replace(
                            /^(.*?)\s-\sCategory\s\d+$/,
                            '$1'
                          )}`)}
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: colors.gray,
                          }}>
                          {t('Profile.text6')}:{' '}
                        </Text>
                        <Text style={{color: colors.white, fontSize: 16}}>
                          {formattedDate}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={{textAlign: 'center', fontSize: 18}}>
            {t('Profile.text7')}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  headingText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  profileText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1D1616',
  },
  profileTextAns: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: '400',
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    padding: 15,
    width: '60%',
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
  homeButton: {  // Add this new style
    position: 'absolute',
    top: 43,
    left: -12,
    zIndex: 1,
    padding: 10,
  },
});

export default ProfileScreen;