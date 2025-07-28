import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../utils/constants';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';

interface PatientItem {
  name: string;
  lastTestDate: string;
  screeningFrequency: string;
  riskLevel?: string;
  gender?: string;
}

const getNextScreeningDate = (lastTestDate: string) => {
  // For demo: add 30 days to last test date
  const date = new Date(lastTestDate);
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString();
};

const getRiskLevel = (leftRisk: string, rightRisk: string) => {
  if (leftRisk.includes('Urgent Risk') || rightRisk.includes('Urgent Risk')) {
    return 'Urgent';
  } else if (leftRisk.includes('High Risk') || rightRisk.includes('High Risk')) {
    return 'High';
  }
  return 'Medium';
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Urgent':
      return '#d32f2f';
    case 'High':
      return '#f57c00';
    default:
      return '#1976d2';
  }
};

const HighRiskPatients = () => {
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${url}/getallreports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        if (data.success) {
          const reports = data.data;
          // Group by patient name, get latest high risk report
          const highRiskMap: { [name: string]: any } = {};
          reports.forEach((item: any) => {
            const name = item?.formId?.data?.patientName || 'Unknown Patient';
            const leftRisk = item?.result?.left_foot?.risk_category || '';
            const rightRisk = item?.result?.right_foot?.risk_category || '';
            const isHighRisk = leftRisk.includes('High Risk') || rightRisk.includes('High Risk') || leftRisk.includes('Urgent Risk') || rightRisk.includes('Urgent Risk');
            
            if (isHighRisk) {
              if (!highRiskMap[name] || new Date(item.createdAt) > new Date(highRiskMap[name].createdAt)) {
                highRiskMap[name] = item;
              }
            }
          });
          
          const highRiskPatients: PatientItem[] = Object.keys(highRiskMap).map(name => {
            const report = highRiskMap[name];
            const leftRisk = report?.result?.left_foot?.risk_category || '';
            const rightRisk = report?.result?.right_foot?.risk_category || '';
            const riskLevel = getRiskLevel(leftRisk, rightRisk);
            const gender = report?.formId?.data?.patientGender || undefined;
            
            // Calculate next screening date based on actual screening frequency
            const getScreeningFrequencyFromReport = (report: any) => {
              const freqLeft = report?.result?.left_foot?.screening_frequency;
              const freqRight = report?.result?.right_foot?.screening_frequency;
              
              // Debug logging
              console.log('Patient:', report?.formId?.data?.patientName);
              console.log('Left foot frequency:', freqLeft);
              console.log('Right foot frequency:', freqRight);
              
              // Extract number of days from screening frequency string
              const extractDays = (freq: string | null | undefined): number | null => {
                if (!freq) return null;
                console.log('Processing frequency:', freq);
                const match = freq.match(/\d+/);
                const num = match ? parseInt(match[0], 10) : null;
                console.log('Extracted number:', num);
                if (!num) return null;
                if (freq.toLowerCase().includes('month')) return num * 30;
                if (freq.toLowerCase().includes('week')) return num * 7;
                if (freq.toLowerCase().includes('day')) return num;
                // If no specific unit found, assume days
                return num;
              };
              
              const daysLeft = extractDays(freqLeft);
              const daysRight = extractDays(freqRight);
              console.log('Days left:', daysLeft, 'Days right:', daysRight);
              
              // Use the minimum frequency if both exist, otherwise use whichever exists
              let screeningDays;
              if (daysLeft && daysRight) {
                screeningDays = Math.min(daysLeft, daysRight);
              } else if (daysLeft) {
                screeningDays = daysLeft;
              } else if (daysRight) {
                screeningDays = daysRight;
              } else {
                screeningDays = 30; // fallback
              }
              
              console.log('Final screening days:', screeningDays);
              
              // Format frequency for display using i18n
              if (screeningDays < 7) {
                return t('Home.EveryXDays', { count: screeningDays });
              } else if (screeningDays < 30) {
                const weeks = Math.round(screeningDays / 7);
                return t('Home.EveryXWeeks', { count: weeks });
              } else {
                const months = Math.round(screeningDays / 30);
                return t('Home.EveryXMonths', { count: months });
              }
            };
            
            return {
              name,
              lastTestDate: new Date(report.createdAt).toLocaleDateString(),
              screeningFrequency: getScreeningFrequencyFromReport(report),
              riskLevel,
              gender,
            };
          });
          
          // Sort so that 'Urgent' riskLevel patients are at the top
          highRiskPatients.sort((a, b) => {
            if (a.riskLevel === 'Urgent' && b.riskLevel !== 'Urgent') return -1;
            if (a.riskLevel !== 'Urgent' && b.riskLevel === 'Urgent') return 1;
            return 0;
          });
          setPatients(highRiskPatients);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const renderPatientCard = ({ item }: { item: PatientItem }) => {
    let genderIcon = 'user';
    let genderColor = colors.primary;
    if (item.gender === 'male') {
      genderIcon = 'man';
      genderColor = '#3498db';
    } else if (item.gender === 'female') {
      genderIcon = 'woman';
      genderColor = '#e67eeb';
    }
    return (
      <View style={styles.patientCard}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.nameContainer}>
              <Icon name={genderIcon} size={22} color={genderColor} style={styles.patientIcon} />
              <Text style={styles.patientName}>{item.name}</Text>
            </View>
            {item.riskLevel && (
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.riskLevel) + '15' }]}>
                <Text style={[styles.riskText, { color: getRiskColor(item.riskLevel) }]}>
                  {item.riskLevel === 'Urgent' ? t('Home.UrgentRisk', 'URGENT RISK') : item.riskLevel === 'High' ? t('Home.HighRisk', 'HIGH RISK') : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={16} color="#666" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{t('Home.LastTest')}</Text>
                <Text style={styles.infoValue}>{item.lastTestDate}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="clockcircle" size={16} color="#666" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{t('Home.ScreeningFrequency')}</Text>
                <Text style={styles.infoValue}>{item.screeningFrequency}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrowleft" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Home.HighRiskPatients', 'High Risk Patients')}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>{t('Home.TotalPatients') || 'Total Patients'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {patients.filter(p => p.riskLevel === 'Urgent').length}
            </Text>
            <Text style={styles.statLabel}>{t('Home.UrgentCases') || 'Urgent Cases'}</Text>
          </View>
        </View>
      </View>
      
      {/* Patients List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>{t('Home.PatientList') || 'Patient List'}</Text>
        <FlatList
          data={patients}
          keyExtractor={(item) => item.name}
          renderItem={renderPatientCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={64} color={colors.gray} />
              <Text style={styles.emptyTitle}>{t('Home.NoHighRisk') || 'No High Risk Patients'}</Text>
              <Text style={styles.emptySubtitle}>
                {t('Home.NoHighRiskDesc') || 'All patients are currently at low risk levels.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  statsCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  listContent: {
    paddingBottom: 20,
  },
  patientCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientIcon: {
    marginRight: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'column',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
    width: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default HighRiskPatients; 