import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LanguageDropdown from './LanguageDropdown';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({navigation}: ProfileProps) => {
  const [profile, setProfile] = useState<{name?: string; email?: string}>({});
  const [reports, setReports] = useState<any[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedPatientName, setSelectedPatientName] = useState<string>('All Patients');
  const [patientsList, setPatientsList] = useState<{id: string; name: string}[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {logout, isDoctor} = useAuth();
  const {t} = useTranslation();
  const [changePassModal, setChangePassModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingChangePass, setLoadingChangePass] = useState(false);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
        setAllReports(report);
        setReports(report);
        
        // Deduplicate patient names for dropdown
        const nameSet = new Set();
        const uniquePatients: {id: string; name: string}[] = [];
        report.forEach((item: any) => {
          const name = item?.formId?.data?.patientName || 'Unknown Patient';
          if (!nameSet.has(name)) {
            nameSet.add(name);
            uniquePatients.push({
              id: name, // Use name as id for filtering
              name,
            });
          }
        });
        setPatientsList(uniquePatients);
        
        console.log('Reports:', report[0]);
      } else {
        setReports([]);
        setAllReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };
  
  // Filter reports based on selected patient
  const filterReportsByPatient = (patientId: string, patientName: string) => {
    setSelectedPatient(patientId);
    setSelectedPatientName(patientName);
    setModalVisible(false);
    if (patientId === 'all') {
      setReports(allReports);
    } else {
      // Filter by patient name
      const filteredReports = allReports.filter(
        (item: any) => (item?.formId?.data?.patientName === patientName)
      );
      setReports(filteredReports);
    }
  };
  
  // Filter patients list based on search query
  const getFilteredPatients = () => {
    if (!searchQuery) return patientsList;
    return patientsList.filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleLogout = async () => {
    setIsLoadingLogout(true);
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
    } finally {
      setIsLoadingLogout(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert(t('ChangePassword.error'), t('ChangePassword.fillAllFields'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert(t('ChangePassword.error'), t('ChangePassword.passwordsDontMatch'));
      return;
    }
    setLoadingChangePass(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${url}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(t('ChangePassword.success'), t('ChangePassword.passwordChanged'));
        setChangePassModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        Alert.alert(t('ChangePassword.error'), data.message || t('ChangePassword.tryAgain'));
      }
    } catch (error) {
      Alert.alert(t('ChangePassword.error'), t('ChangePassword.tryAgain'));
    } finally {
      setLoadingChangePass(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    getUserProfile();
    getAllReports();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButtonTopLeft}
        >
          <Icon name="arrowleft" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{width: '100%'}}>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setSettingsMenuVisible(true)}
            style={styles.settingsCogTopRight}
            accessibilityLabel={t('ChangePassword.settings') || 'Settings'}
          >
            <Icon name="setting" size={26} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.cardHeading}>{t('Profile.accountSection') || 'Account'}</Text>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              {profile.name ? (
                <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
              ) : (
                <Icon name="user" size={32} color={colors.primary} />
              )}
            </View>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileText}>{t('Profile.text1')}: </Text>
            <Text style={styles.profileName}>{profile.name}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileText}>{t('Profile.text2')}: </Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <View style={[styles.profileRow, {marginTop: 10}]}> 
            <Text style={styles.profileText}>{t('Welcome.text1')}:</Text>
            <LanguageDropdown />
          </View>
        </View>
      </View>
      {/* Settings Dropdown/Modal (dropdown style near cog) */}
      <Modal
        visible={settingsMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSettingsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setSettingsMenuVisible(false)}
        >
          <View style={styles.menuDropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setSettingsMenuVisible(false);
              setChangePassModal(true);
            }}>
              <Icon name="lock1" size={18} color={colors.primary} style={{marginRight: 8}} />
              <Text style={styles.menuItemText}>{t('ChangePassword.changePassword')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setSettingsMenuVisible(false);
              handleLogout();
            }}>
              <Icon name="logout" size={18} color={colors.primary} style={{marginRight: 8}} />
              <Text style={styles.menuItemText}>{t('Profile.btn1')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Results/Reports Card */}
      <View style={[styles.card, {flex: 1, marginTop: 0}]}> 
        <Text style={styles.cardHeading}>
          {isDoctor
            ? t('Profile.patientsResults') || 'Patients Results'
            : t('Profile.reportsSection') !== 'Profile.reportsSection'
              ? t('Profile.reportsSection')
              : 'Reports'}
        </Text>
        {isDoctor && (
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>{t('Profile.selectPatient') || 'Select Patient'}:</Text>
            <TouchableOpacity 
              style={styles.dropdownButton} 
              onPress={() => setModalVisible(true)}>
              <Text style={styles.dropdownButtonText}>
                {selectedPatientName === 'All Patients' 
                  ? t('Profile.allPatients') || 'All Patients'
                  : selectedPatientName}
              </Text>
              <Icon name="down" size={16} color={colors.primary} />
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t('Profile.selectPatient') || 'Select Patient'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Icon name="close" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchContainer}>
                    <Icon name="search1" size={20} color={colors.gray} style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder={t('Profile.searchPatient') || 'Search patient...'}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close" size={16} color={colors.gray} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <FlatList
                    data={[{id: 'all', name: t('Profile.allPatients') || 'All Patients'}, ...getFilteredPatients()]}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={({item}) => (
                      <TouchableOpacity 
                        style={[styles.patientItem, selectedPatient === item.id && styles.selectedPatientItem]}
                        onPress={() => filterReportsByPatient(item.id, item.name)}>
                        <Text style={[styles.patientItemText, selectedPatient === item.id && styles.selectedPatientItemText]}>
                          {item.name}
                        </Text>
                        {selectedPatient === item.id && (
                          <Icon name="check" size={16} color={colors.white} />
                        )}
                      </TouchableOpacity>
                    )}
                    style={styles.patientsList}
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}
        <View style={styles.reportsDivider} />
        {reports.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {reports.map((item: any, index: number) => {
              const formattedDate = new Date(
                item?.createdAt,
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              // Risk color dot logic
              const leftRisk = item?.result?.left_foot?.risk_category?.replace(/^(.*?)\s-\sCategory\s\d+$/, '$1');
              const rightRisk = item?.result?.right_foot?.risk_category?.replace(/^(.*?)\s-\sCategory\s\d+$/, '$1');
              const riskColor = leftRisk === 'High' || rightRisk === 'High' ? '#e74c3c' : (leftRisk === 'Moderate' || rightRisk === 'Moderate' ? '#f1c40f' : colors.primary);
              // Gender icon logic
              let genderIcon = 'person-circle-outline';
              let genderIconColor = colors.primary;
              const gender = item?.formId?.data?.patientGender;
              if (gender === 'male') {
                genderIcon = 'man-outline';
                genderIconColor = '#3498db';
              } else if (gender === 'female') {
                genderIcon = 'woman-outline';
                genderIconColor = '#e67eeb';
              }
              return (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ReportProfile', {
                        reportData: item,
                        result: {
                          left: leftRisk,
                          right: rightRisk,
                        },
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.reportCardRow}>
                      <Ionicons name={genderIcon} size={24} color={genderIconColor} style={{marginRight: 12, marginLeft: 2}} />
                      <View style={{flex: 1}}>
                        {isDoctor ? (
                          <Text style={styles.reportPatientName}>{item?.formId?.data?.patientName || 'Unknown Patient'}</Text>
                        ) : (
                          <Text style={styles.reportCategory}>{t(`Profile.${leftRisk}`)}</Text>
                        )}
                        <Text style={styles.reportDate}>{formattedDate}</Text>
                      </View>
                      <MaterialIcon name="chevron-right" size={28} color={colors.secondary} />
                    </View>
                  </TouchableOpacity>
                  {index < reports.length - 1 && <View style={styles.reportDivider} />}
                </React.Fragment>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noReportsContainer}>
            <Icon name="frowno" size={48} color={colors.gray} style={{marginBottom: 8}} />
            <Text style={{textAlign: 'center', fontSize: 18, color: colors.gray}}>
              {t('Profile.text7')}
            </Text>
          </View>
        )}
      </View>
      {/* Change Password Modal */}
      <Modal
        visible={changePassModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setChangePassModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {paddingHorizontal: 20, maxWidth: 400}]}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ChangePassword.changePassword')}</Text>
              <TouchableOpacity onPress={() => setChangePassModal(false)}>
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={styles.labels}>{t('ChangePassword.currentPassword')}</Text>
              <View style={{position: 'relative', justifyContent: 'center'}}>
                <TextInput
                  style={styles.inputStyle}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(v => !v)}
                  style={{position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', padding: 5, zIndex: 2}}
                  accessibilityLabel={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={styles.labels}>{t('ChangePassword.newPassword')}</Text>
              <View style={{position: 'relative', justifyContent: 'center'}}>
                <TextInput
                  style={styles.inputStyle}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(v => !v)}
                  style={{position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', padding: 5, zIndex: 2}}
                  accessibilityLabel={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.labels}>{t('ChangePassword.confirmNewPassword')}</Text>
              <View style={{position: 'relative', justifyContent: 'center'}}>
                <TextInput
                  style={styles.inputStyle}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry={!showConfirmNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmNewPassword(v => !v)}
                  style={{position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', padding: 5, zIndex: 2}}
                  accessibilityLabel={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons name={showConfirmNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.buttonStyle, {marginTop: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}
              onPress={handleChangePassword}
              disabled={loadingChangePass}
            >
              {loadingChangePass && <ActivityIndicator color={colors.white} style={{marginRight: 10}} />}
              <Text style={styles.buttonText}>{t('ChangePassword.submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {(isLoadingLogout || loadingChangePass) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsHeading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
  reportCard: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  reportValue: {
    color: colors.white,
    fontSize: 16,
    maxWidth: '70%',
  },
  profileText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1D1616',
  },
  profileTextAns: {
    color: colors.secondary,
    fontSize: 18,
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
  dropdownContainer: {
    marginBottom: 15,
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: colors.secondary,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.primary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  patientsList: {
    maxHeight: '100%',
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedPatientItem: {
    backgroundColor: colors.primary,
  },
  patientItemText: {
    fontSize: 16,
    color: colors.secondary,
  },
  selectedPatientItemText: {
    color: colors.white,
    fontWeight: '500',
  },
  labels: {
    fontSize: 18,
    color: '#7d7d7d',
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
    fontFamily: 'regular',
    textAlign: 'left',
    writingDirection: 'auto',
  },
  inputStyle: {
    borderWidth: 1,
    color: 'black',
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    fontFamily: 'regular',
    fontSize: 18,
    textAlign: 'left',
    writingDirection: 'auto',
  },
  settingsIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuDropdown: {
    marginTop: 60,
    marginRight: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 220,
    position: 'relative',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 6,
    marginLeft: 2,
    marginTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarInitials: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: 'bold',
  },
  languageLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  profileName: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#888',
    fontSize: 16,
    fontWeight: '400',
  },
  reportCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  riskDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
    marginLeft: 2,
  },
  reportPatientName: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  reportCategory: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  reportDate: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  reportDivider: {
    height: 1,
    backgroundColor: colors.gray,
    opacity: 0.25,
    marginHorizontal: 2,
  },
  cardHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 16,
  },
  settingsCogTopRight: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
    padding: 4,
    backgroundColor: 'transparent',
  },
  noReportsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  reportsDivider: {
    height: 1,
    backgroundColor: colors.gray,
    opacity: 0.18,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  backButtonTopLeft: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 2,
    padding: 4,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});

export default ProfileScreen;