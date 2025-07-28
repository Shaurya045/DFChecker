import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  SafeAreaView,
  Modal,
  Image,
  I18nManager,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import LanguageDropdown from './LanguageDropdown';
import Icon from 'react-native-vector-icons/AntDesign';
import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native';
import { wp, hp } from '../utils/responsive';
import type { requestTrackingPermission as requestTrackingPermissionType } from '../utils/trackingPermission';

// Properly import the tracking permission function
const { requestTrackingPermission } = require('../utils/trackingPermission');

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useTranslation} from 'react-i18next';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface UserProfile {
  name?: string;
  isDoctor?: boolean;
  [key: string]: any; // For any other properties that might exist
};

// Utility to schedule doctor notifications for a patient
async function scheduleDoctorNotifications(patientName: string, screeningDate: Date) {
  const now = new Date();
  const target = new Date(screeningDate);
  const msLeft = target.getTime() - now.getTime();
  if (msLeft <= 0) return; // Screening date is in the past

  const scheduleTimes = [14 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 25 * 60 * 60 * 1000]; // 14d, 7d, 25h
  for (let ms of scheduleTimes) {
    if (msLeft > ms) {
      const fireTime = target.getTime() - ms;
      const daysLeft = Math.round((target.getTime() - fireTime) / (1000 * 60 * 60 * 24));
      await notifee.createChannel({
        id: 'doctor-screening',
        name: 'Doctor Screening Alerts',
        importance: AndroidImportance.HIGH,
      });
      await notifee.createTriggerNotification(
        {
          title: 'Screening Reminder',
          body: `${patientName} to be tested in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
          android: {
            channelId: 'doctor-screening',
            pressAction: {
              id: 'doctor-screening',
              launchActivity: 'default',
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: fireTime,
        },
      );
    }
  }
}

const HomeScreen = ({navigation}: HomeProps) => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedPatientName, setSelectedPatientName] = useState<string>('All Patients');
  const [patientsList, setPatientsList] = useState<{id: string; name: string}[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {t} = useTranslation();
  const {isDoctor} = useAuth();

  // Flag to prevent duplicate notification scheduling
  const [notificationsScheduled, setNotificationsScheduled] = useState(false);
  // Flag to track if tracking permission was requested
  const [trackingPermissionRequested, setTrackingPermissionRequested] = useState(false);

  const requestAppTrackingPermission = async () => {
    // Only request on iOS and only once per session
    if (Platform.OS === 'ios' && !trackingPermissionRequested) {
      setTrackingPermissionRequested(true);
      try {
        const trackingStatus = await requestTrackingPermission();
        console.log('Tracking permission status:', trackingStatus);
      } catch (error) {
        console.error('Error requesting tracking permission:', error);
      }
    }
  };

  const getUserProfile = async () => {
    try {
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
        setProfile(data.data);
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getAllReports = async () => {
    try {
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
        
        // For doctors, create patient list for filtering
        if (isDoctor) {
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
        }
        
        console.log('Reports:', report[0]);
      } else {
        setReports([]);
        setAllReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Filter reports based on selected patient (for doctors)
  const filterReportsByPatient = (patientId: string, patientName: string) => {
    setSelectedPatient(patientId);
    setSelectedPatientName(patientName);
    setModalVisible(false);
    // Persist selection
    AsyncStorage.setItem('selectedPatient', patientId);
    AsyncStorage.setItem('selectedPatientName', patientName);
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
    if (!patientsList) return [];
    if (!searchQuery) return patientsList;
    return patientsList.filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  const handleTestButtonPress = () => {
    if (isDoctor) {
      // If user is a doctor, navigate directly to questions
      navigation.navigate('Qes');
    } else {
      // Otherwise show the confirmation modal
      setShowConfirmation(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
      // Restore selected patient filter before fetching reports
      const restoreFilter = async () => {
        const storedPatient = await AsyncStorage.getItem('selectedPatient');
        const storedPatientName = await AsyncStorage.getItem('selectedPatientName');
        if (storedPatient && storedPatientName) {
          setSelectedPatient(storedPatient);
          setSelectedPatientName(storedPatientName);
        } else {
          setSelectedPatient('all');
          setSelectedPatientName('All Patients');
        }
      };
      restoreFilter().then(() => {
        getAllReports();
      });
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, []),
  );

  // When allReports or selectedPatient changes, update reports accordingly
  useEffect(() => {
    if (isDoctor) {
      if (selectedPatient === 'all') {
        setReports(allReports);
      } else {
        const selectedName = selectedPatientName;
        const filteredReports = allReports.filter(
          (item: any) => (item?.formId?.data?.patientName === selectedName)
        );
        setReports(filteredReports);
      }
    }
  }, [allReports, selectedPatient, selectedPatientName, isDoctor]);

  // Helper to extract days from screening frequency string
  const extractDays = (freq: string | null | undefined): number | null => {
    if (!freq) return null;
    const match = freq.match(/\d+/);
    const num = match ? parseInt(match[0], 10) : null;
    if (!num) return null;
    if (freq.toLowerCase().includes('month')) return num * 30;
    if (freq.toLowerCase().includes('week')) return num * 7;
    if (freq.toLowerCase().includes('day')) return num;
    // If no specific unit found, assume days
    return num;
  };

  // Helper to get next screening date for a specific patient
  const getNextScreeningDate = () => {
    if (!isDoctor || selectedPatient === 'all' || !reports || reports.length === 0) return null;
    // Get the latest report for the selected patient
    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastReport = sortedReports[0];
    if (!lastReport) return null;
    const lastTestDate = new Date(lastReport.createdAt);
    // Get screening frequency from both feet
    const freqLeft = lastReport?.result?.left_foot?.screening_frequency;
    const freqRight = lastReport?.result?.right_foot?.screening_frequency;
    const daysLeft = extractDays(freqLeft);
    const daysRight = extractDays(freqRight);
    let screeningDays: number | null = null;
    if (daysLeft && daysRight) {
      screeningDays = Math.min(daysLeft, daysRight);
    } else if (daysLeft) {
      screeningDays = daysLeft;
    } else if (daysRight) {
      screeningDays = daysRight;
    }
    if (!screeningDays) return null;
    const nextScreeningDate = new Date(lastTestDate.getTime() + screeningDays * 24 * 60 * 60 * 1000);
    return nextScreeningDate;
  };

  // Calculate metrics based on role and filter
  const getMetrics = () => {
    // Calculate unique patients for doctors
    const uniquePatientNames = Array.from(
      new Set(
        (allReports || [])
          .map((item: any) => item?.formId?.data?.patientName)
          .filter(Boolean)
      )
    );

    if (!isDoctor) {
      // Regular user metrics
      const testCount = reports?.length || 0;
      let daysSinceLast: string = '-';
      if (reports && reports.length > 0) {
        const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const lastDate = new Date(sortedReports[0].createdAt);
        const now = new Date();
        daysSinceLast = String(Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
      }
      return { testCount, daysSinceLast };
    } else {
      // Doctor metrics
      if (selectedPatient === 'all') {
        // All patients view
        const totalPatients = uniquePatientNames.length;
        let lastTest = '-';
        if (allReports && allReports.length > 0) {
          const sortedReports = [...allReports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const lastDate = new Date(sortedReports[0].createdAt);
          const now = new Date();
          lastTest = String(Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
        }
        return { totalPatients, lastTest };
      } else {
        // Specific patient view
        const testCount = reports?.length || 0;
        // Remove lastTestTaken, add nextScreeningDate
        const nextScreeningDate = getNextScreeningDate();
        return { testCount, nextScreeningDate };
      }
    }
  };

  const metrics = getMetrics();

  // Get last test result for display
  const getLastTestResult = () => {
    if (!reports || reports.length === 0) return null;
    
    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastReport = sortedReports[0];
    
    if (!isDoctor) {
      // Regular user - show their own results
      return {
        leftRisk: lastReport?.result?.left_foot?.risk_category || '',
        rightRisk: lastReport?.result?.right_foot?.risk_category || '',
        patientName: null
      };
    } else {
      // Doctor - show patient-specific or last patient result
      if (selectedPatient === 'all') {
        // Show last patient result
        return {
          leftRisk: lastReport?.result?.left_foot?.risk_category || '',
          rightRisk: lastReport?.result?.right_foot?.risk_category || '',
          patientName: lastReport?.formId?.data?.patientName || 'Unknown Patient'
        };
      } else {
        // Show specific patient's latest result
        return {
          leftRisk: lastReport?.result?.left_foot?.risk_category || '',
          rightRisk: lastReport?.result?.right_foot?.risk_category || '',
          patientName: null
        };
      }
    }
  };

  const lastTestResult = getLastTestResult();

  // Helper to get badge color based on backend risk value (match ReportScreen)
  const getRiskColors = (risk: string) => {
    if (!risk) return { bg: '#f0f0f0', text: '#333' };
    if (risk.includes('Urgent Risk')) return { bg: '#ffd6d6', text: '#b71c1c' };
    if (risk.includes('High Risk')) return { bg: '#ffeaea', text: '#d32f2f' };
    if (risk.includes('Moderate Risk')) return { bg: '#fff4e6', text: '#ff9800' };
    if (risk.includes('Low Risk')) return { bg: '#fffbe6', text: '#e6a700' };
    if (risk.includes('Very Low Risk')) return { bg: '#eafbe7', text: '#228B22' };
    if (risk.includes('Healthy Foot - Need Self Care')) return { bg: '#e6f0fa', text: '#228B22' };
    return { bg: '#f0f0f0', text: '#333' };
  };

  // Helper to get badge color based on risk
  const getRiskBadgeStyle = (riskKey: string) => {
    const colors = getRiskColors(riskKey);
    return { backgroundColor: colors.bg };
  };

  // Get status title based on role and filter
  const getStatusTitle = () => {
    if (!isDoctor) {
      return t('Home.LastTestResult');
    } else {
      if (selectedPatient === 'all') {
        return t('Home.LastPatientResult') || 'Last Patient Result';
      } else {
        return t('Home.LastTestResult');
      }
    }
  };

  const getHighRiskPatientsCount = () => {
    const highRiskMap = new Set();
    allReports.forEach((item: any) => {
      const name = item?.formId?.data?.patientName || 'Unknown Patient';
      const leftRisk = item?.result?.left_foot?.risk_category || '';
      const rightRisk = item?.result?.right_foot?.risk_category || '';
      const isHighRisk = leftRisk.includes('High Risk') || rightRisk.includes('High Risk') || leftRisk.includes('Urgent Risk') || rightRisk.includes('Urgent Risk');
      if (isHighRisk) {
        highRiskMap.add(name);
      }
    });
    return highRiskMap.size;
  };

  // After getAllReports, schedule notifications for doctors
  useEffect(() => {
    if (isDoctor && allReports.length > 0 && !notificationsScheduled) {
      setNotificationsScheduled(true);
      // Group by patient, get latest report for each
      const patientMap: { [name: string]: any } = {};
      allReports.forEach((item: any) => {
        const name: string = item?.formId?.data?.patientName || 'Unknown Patient';
        if (!patientMap[name] || new Date(item.createdAt) > new Date(patientMap[name].createdAt)) {
          patientMap[name] = item;
        }
      });
      Object.values(patientMap).forEach((report: any) => {
        // Calculate next screening date
        const lastTestDate = new Date(report.createdAt);
        // Try to get screening frequency in days from left/right foot
        let freqLeft = report?.result?.left_foot?.screening_frequency;
        let freqRight = report?.result?.right_foot?.screening_frequency;
        // Extract number of days from string (e.g., 'Screen every 3 months')
        const extractDays = (freq: string): number | null => {
          if (!freq) return null;
          const matches = freq.match(/\d+/);
          const num = matches ? parseInt(matches[0], 10) : null;
          if (!num) return null;
          if (freq.includes('month')) return num * 30;
          if (freq.includes('week')) return num * 7;
          if (freq.includes('day')) return num;
          return null;
        };
        const daysLeft = extractDays(freqLeft);
        const daysRight = extractDays(freqRight);
        const screeningDays = daysLeft && daysRight ? Math.min(daysLeft, daysRight) : (daysLeft || daysRight);
        if (screeningDays) {
          const nextScreeningDate = new Date(lastTestDate.getTime() + screeningDays * 24 * 60 * 60 * 1000);
          scheduleDoctorNotifications(report?.formId?.data?.patientName || 'Unknown Patient', nextScreeningDate);
        }
      });
    }
  }, [isDoctor, allReports, notificationsScheduled]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar: Logo + Language Switcher */}
      <View style={styles.topBar}>
        <Image source={require('../assets/dfcheckerImage.png')} style={styles.logo} resizeMode="contain" />
        <LanguageDropdown />
      </View>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.greetingButton}>
          <View style={styles.greetingContent}>
            <Text style={styles.greetingText}>
              {t('Home.hello')} {profile?.name}
            </Text>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Patient Filter for Doctors */}
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
            <View style={styles.modalBackdrop}>
              <View style={styles.instructionModalContainer}>
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
                  data={[{id: 'all', name: t('Profile.allPatients') || 'All Patients'}, ...(getFilteredPatients() || [])]}
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

      {/* Quick Overview Section */}
      <Text style={styles.sectionTitle}>{t('Home.QuickOverview')}</Text>
      <View style={styles.overviewRow}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>
            {isDoctor 
              ? (selectedPatient === 'all' ? metrics.totalPatients : metrics.testCount)
              : metrics.testCount
            }
          </Text>
          <Text style={styles.overviewLabel}>
            {isDoctor 
              ? (selectedPatient === 'all' ? t('Home.TotalPatients', 'Total Patients') : t('Home.TestsCompleted', 'Tests Completed'))
              : t('Home.TestsCompleted', 'Tests Completed')
            }
          </Text>
        </View>
        <TouchableOpacity
          style={styles.overviewCard}
          disabled={!(isDoctor && selectedPatient === 'all')}
          onPress={() => {
            if (isDoctor && selectedPatient === 'all') navigation.navigate('HighRiskPatients');
          }}
        >
          <Text style={styles.overviewNumber}>
            {isDoctor && selectedPatient === 'all' ? getHighRiskPatientsCount() : (
              isDoctor && selectedPatient !== 'all' && metrics.nextScreeningDate
                ? (() => {
                    const d = new Date(metrics.nextScreeningDate);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = String(d.getFullYear()).slice(-2);
                    return `${day}/${month}/${year}`;
                  })()
                : (isDoctor ? (selectedPatient === 'all' ? metrics.lastTest : '-') : metrics.daysSinceLast)
            )}
          </Text>
          <Text style={styles.overviewLabel}>
            {isDoctor && selectedPatient === 'all' ? t('Home.HighRiskPatients', 'High Risk Patients') : (
              isDoctor && selectedPatient !== 'all' ? t('Home.NextScreening', 'Next Screening') : (isDoctor ? (selectedPatient === 'all' ? t('Home.LastTest', 'Last Test') : 'Next Screening') : t('Home.DaysSinceLast', 'Days Since Last'))
            )}
          </Text>
        </TouchableOpacity>
      </View>
      

      
      {/* Welcome Card for new doctors - show when they have no patients AND viewing all patients */}
      {isDoctor && (!metrics?.totalPatients || metrics.totalPatients === 0) && selectedPatient === 'all' && (
        <View style={{marginBottom: 0}}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIconContainer}>
              <Text style={styles.welcomeIcon}>👨‍⚕️</Text>
            </View>
            <Text style={styles.welcomeTitle}>{t('Home.WelcomeDoctorTitle')}</Text>
            <Text style={styles.welcomeText}>{t('Home.AddFirstPatient')}</Text>
            <View style={styles.welcomeTipContainer}>
              <Text style={styles.welcomeTipIcon}>💡</Text>
              <Text style={styles.welcomeTipText}>{t('Home.DoctorDashboardTip')}</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Welcome Card for new patients - show when there are no reports */}
      {!isDoctor && reports && reports.length === 0 && (
        <View style={{marginBottom: 12}}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIconContainer}>
              <Text style={styles.welcomeIcon}>👋</Text>
            </View>
            <Text style={styles.welcomeTitle}>{t('Home.WelcomePatientTitle')}</Text>
            <Text style={styles.welcomeText}>{t('Home.TakeFirstTest')}</Text>
            <View style={styles.welcomeTipContainer}>
              <Text style={styles.welcomeTipIcon}>💡</Text>
              <Text style={styles.welcomeTipText}>{t('Home.PatientTestTip')}</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Health Status Card - only show if at least one report exists */}
      {reports && reports.length > 0 && lastTestResult && (
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.statusIconCircle}>
              <Text style={styles.statusIconText}>✓</Text>
            </View>
            {isDoctor && selectedPatient === 'all' && lastTestResult.patientName ? (
              <Text style={styles.statusTitle}>
                {t('Home.LastPatientResult')}: <Text style={styles.patientNameHighlight}>{lastTestResult.patientName}</Text>
              </Text>
            ) : (
              <Text style={styles.statusTitle}>{getStatusTitle()}</Text>
            )}
          </View>
          
          <View style={styles.footResultsRow}>
            <View style={styles.footResultItem}>
              {I18nManager.isRTL ? (
                <>
                  <View style={styles.badgeContainer}>
                    <Text style={[
                      styles.riskBadge,
                      getRiskBadgeStyle(lastTestResult.leftRisk),
                      { color: getRiskColors(lastTestResult.leftRisk).text }
                    ]}>
                      {lastTestResult.leftRisk ? (t('Profile.' + lastTestResult.leftRisk) !== ('Profile.' + lastTestResult.leftRisk) ? t('Profile.' + lastTestResult.leftRisk) : lastTestResult.leftRisk) : t('Home.NoData')}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.footLabel}>{t('Home.LeftFoot')}:</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.labelContainer}>
                    <Text style={styles.footLabel}>{t('Home.LeftFoot')}:</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <Text style={[
                      styles.riskBadge,
                      getRiskBadgeStyle(lastTestResult.leftRisk),
                      { color: getRiskColors(lastTestResult.leftRisk).text }
                    ]}>
                      {lastTestResult.leftRisk ? (t('Profile.' + lastTestResult.leftRisk) !== ('Profile.' + lastTestResult.leftRisk) ? t('Profile.' + lastTestResult.leftRisk) : lastTestResult.leftRisk) : t('Home.NoData')}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.footResultItem}>
              {I18nManager.isRTL ? (
                <>
                  <View style={styles.badgeContainer}>
                    <Text style={[
                      styles.riskBadge,
                      getRiskBadgeStyle(lastTestResult.rightRisk),
                      { color: getRiskColors(lastTestResult.rightRisk).text }
                    ]}>
                      {lastTestResult.rightRisk ? (t('Profile.' + lastTestResult.rightRisk) !== ('Profile.' + lastTestResult.rightRisk) ? t('Profile.' + lastTestResult.rightRisk) : lastTestResult.rightRisk) : t('Home.NoData')}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.footLabel}>{t('Home.RightFoot')}:</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.labelContainer}>
                    <Text style={styles.footLabel}>{t('Home.RightFoot')}:</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <Text style={[
                      styles.riskBadge,
                      getRiskBadgeStyle(lastTestResult.rightRisk),
                      { color: getRiskColors(lastTestResult.rightRisk).text }
                    ]}>
                      {lastTestResult.rightRisk ? (t('Profile.' + lastTestResult.rightRisk) !== ('Profile.' + lastTestResult.rightRisk) ? t('Profile.' + lastTestResult.rightRisk) : lastTestResult.rightRisk) : t('Home.NoData')}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Diagnostic Test Section */}
      <View style={styles.centeredContent}>
        <View style={[
          styles.diagnosticCard,
          isDoctor && (!metrics?.totalPatients || metrics.totalPatients === 0) ? styles.smallDiagnosticCard : null
        ]}>
          <Text style={styles.cardIcon}>🦶</Text>
          <Text style={styles.diagnosticTitle}>{t('Home.text1')}</Text>
          <Text style={styles.diagnosticSubtitle}>{t('Home.QuickScreening')}</Text>
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureLabel}>{t('Home.Easy')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureLabel}>{t('Home.Accurate')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡️</Text>
              <Text style={styles.featureLabel}>{t('Home.Fast')}</Text>
            </View>
        </View>
        <TouchableOpacity
          onPress={handleTestButtonPress}
            style={styles.diagnosticButton}>
            <Text style={styles.diagnosticButtonText}>
              {isDoctor ? t('Home.NewTest') : t('Home.btn1')} <Text style={styles.buttonIcon}>→</Text>
            </Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}>
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <View style={styles.confirmationHeader}>
              <View style={styles.confirmationIcon}>
                <Text style={styles.confirmationIconText}>🩺</Text>
              </View>
              <Text style={styles.confirmationTitle}>{t('Home.title1')}</Text>
              <Text style={styles.confirmationSubtitle}>{t('Home.text2')}</Text>
            </View>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.helpButton]}
                onPress={() => {
                  setShowConfirmation(false);
                  setShowPulseModal(true);
                }}>
                <Text style={styles.helpButtonText}>{t('Home.btn2')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={() => {
                  setShowConfirmation(false);
                  navigation.navigate('Qes');
                }}>
                <Text style={styles.confirmButtonText}>{t('Home.btn3')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pulse Check Instructions Modal */}
      <Modal
        visible={showPulseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPulseModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.instructionModalContainer}>
            {/* Header with icon */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.pulseIconContainer}>
                  <Text style={styles.pulseIcon}>💗</Text>
                </View>
                <Text style={styles.modalTitle}>{t('Home.title2')}</Text>
              </View>
            </View>

            {/* Content with step-by-step instructions */}
            <View style={styles.instructionContent}>
              {/* Step 1 */}
              <View style={styles.instructionStep}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t('Home.title3')}</Text>
                  <Text style={styles.stepDescription}>{t('Home.text3')}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.stepDivider} />

              {/* Step 2 */}
              <View style={styles.instructionStep}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t('Home.title4')}</Text>
                  <Text style={styles.stepDescription}>{t('Home.text4')}</Text>
                </View>
              </View>

              {/* Important Note */}
              <View style={styles.noteContainer}>
                <Text style={styles.noteTitle}>{t('Home.title5')}</Text>
                <Text style={styles.noteText}>{t('Home.text5')}</Text>
              </View>
            </View>

            {/* Footer with button */}
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => setShowPulseModal(false)}>
              <Text style={styles.gotItButtonText}>{t('Home.btn4')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1.5%'),
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('13%'),
    height: wp('13%'),
  },
  dropdownContainer: {
    paddingHorizontal: 18,
    marginBottom: hp('2%'),
  },
  greetingContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  greetingButton: {
    backgroundColor: colors.primary,
    borderRadius: wp('4.5%'),
    padding: wp('4.5%'),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  avatarInitials: {
    color: colors.white,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  greetingText: {
    color: colors.white,
    fontSize: wp('5%'),
    fontWeight: '600',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: wp('6%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4.5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
    minWidth: '85%',
    marginTop: 0,
  },
  cardIcon: {
    fontSize: wp('8%'),
    marginBottom: hp('0.2%'),
  },
  instructionText: {
    fontSize: wp('6%'),
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: hp('0.5%'),
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: wp('3.8%'),
    color: colors.gray,
    textAlign: 'center',
    marginBottom: hp('1.2%'),
    fontWeight: '500',
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('8%'),
    marginTop: hp('1%'),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: wp('5%'),
    fontWeight: '700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: wp('5.5%'),
    marginLeft: wp('1%'),
  },

  // Confirmation Modal Styles
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  confirmationModalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmationHeader: {
    padding: 24,
    alignItems: 'center',
  },
  confirmationIcon: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmationIconText: {
    fontSize: 28,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  confirmationButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  helpButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  helpButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  // Pulse Instruction Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionModalContainer: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseIconContainer: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pulseIcon: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 12,
    marginBottom: 10,
  },
  instructionContent: {
    padding: 20,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepIndicator: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
    marginLeft: 42,
  },
  noteContainer: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E6A100',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  gotItButton: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gotItButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    paddingHorizontal: 18,
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  overviewRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: hp('2%'),
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 6,
    alignItems: I18nManager.isRTL ? 'flex-end' : 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  overviewNumber: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'center',
  },
  overviewLabel: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
    textAlign: I18nManager.isRTL ? 'right' : 'center',
  },
  statusCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#f3fcf6',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: hp('2%'),
    marginTop: 0,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d2e9db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    overflow: 'hidden',
  },
  welcomeCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 0,
    marginBottom: hp('2%'),
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4e6f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  welcomeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e6f0fa',
  },
  welcomeIcon: {
    fontSize: 20,
  },
  welcomeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  welcomeTipContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#fffcf0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 2,
    borderLeftWidth: 2,
    borderLeftColor: '#ffd700',
    width: '100%',
    alignItems: 'center',
  },
  welcomeTipIcon: {
    fontSize: 14,
    marginRight: I18nManager.isRTL ? 0 : 6,
    marginLeft: I18nManager.isRTL ? 6 : 0,
  },
  welcomeTipText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
    lineHeight: 14,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  statusIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    marginLeft: 2,
    marginTop: 2,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1,
  },
  statusIconText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
  statusTitle: {
    color: '#228B22',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  footResultsRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  footResultItem: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  footLabel: {
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
    marginRight: 4,
  },
  riskBadge: {
    backgroundColor: '#ffeaea',
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    textAlign: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
    marginLeft: 0,
    marginRight: 0,
    alignSelf: 'flex-start',
  },
  diagnosticCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    width: '92%',
    marginTop: hp('1%'),
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  smallDiagnosticCard: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
    marginTop: 5,
  },
  diagnosticTitle: {
    fontSize: 20,
    color: '#222',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 2,
  },
  diagnosticSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 18,
    marginTop: 2,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  featureLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  diagnosticButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosticButtonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  labelContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  // Dropdown container styles already defined above
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: colors.secondary,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  patientsList: {
    maxHeight: '100%',
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  selectedPatientItem: {
    backgroundColor: '#e6f0fa',
  },
  patientItemText: {
    fontSize: 16,
    color: colors.secondary,
  },
  selectedPatientItemText: {
    color: colors.primary,
    fontWeight: '600',
  },
  patientNameHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;
