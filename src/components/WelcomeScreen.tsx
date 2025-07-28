import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Linking,
  I18nManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {colors} from '../utils/colors';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from './LanguageDropdown';
import { wp, hp } from '../utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({navigation}: WelcomeProps) => {
  const submit = () => {
    navigation.navigate('Login');
  };
  const {t} = useTranslation();

  // Animation refs
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const langAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence entrance animations
    Animated.stagger(250, [
      Animated.timing(langAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // Floating logo animation (infinite loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [langAnim, logoAnim, buttonAnim, floatAnim]);

  // Button press animation
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    submit();
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#EAF6FB', '#B3D8F7']}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Language Selector - Top Right */}
        <Animated.View
          style={[
            styles.languageContainer,
            {
              opacity: langAnim,
              transform: [
                {
                  translateY: langAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.languageWrapper}>
            <Text style={styles.languageLabel}>🌐</Text>
            <LanguageDropdown />
          </View>
        </Animated.View>

        <View style={styles.headingRow}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientTextWrapper}
          >
            <Text style={styles.welcomeHeading}>
              {t('Welcome.heading').replace('DF Checker', t('Welcome.brand'))}
            </Text>
          </LinearGradient>
        </View>

        {/* Info Card between heading and logo */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrapper}>
            <Text style={styles.infoIcon}>🩺</Text>
          </View>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>{t('Welcome.infoTitle')}</Text>
            <Text style={styles.infoSubtitle}>
              {t('Welcome.infoSubtitle')}
            </Text>
          </View>
        </View>

        <Animated.Image
          source={require('../assets/dfcheckerImage.png')}
          style={[
            styles.image,
            {
              opacity: logoAnim,
              transform: [
                { translateY: floatAnim },
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]}
        />
        {/* Tagline */}
        <Text style={styles.tagline}>{t('Welcome.tagline')}</Text>
        {/* Feature List */}
        <View style={styles.featuresRow}>
          <Text style={styles.featureItem}>📄 {t('Welcome.feature2')}</Text>
          <Text style={styles.featureItem}>🦶 {t('Welcome.feature1')}</Text>
          <Text style={styles.featureItem}>🌐 {t('Welcome.feature3')}</Text>
        </View>
        {/* Login Button with gradient and icon */}
        <Animated.View
          style={{
            width: '100%',
            alignItems: 'center',
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.loginText}>{t('Welcome.login')}</Text>
                <Text style={styles.loginIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  languageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 10,
  },
  image: {
    height: hp('30%'),
    width: wp('50%'),
    marginBottom: hp('4%'),
  },
  tagline: {
    fontSize: wp('4%'),
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: hp('2%'),
    marginTop: -hp('1%'),
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: hp('3%'),
    gap: wp('2%'),
  },
  featureItem: {
    fontSize: wp('3.2%'),
    color: colors.primary,
    marginHorizontal: wp('1.5%'),
    backgroundColor: '#EAF6FB',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    overflow: 'hidden',
  },
  buttonWrapper: {
    borderRadius: wp('7%'),
    marginTop: hp('1.5%'),
    width: wp('60%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  button: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    borderRadius: wp('7%'),
    paddingVertical: 0,
    minHeight: hp('7%'),
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  loginText: {
    color: colors.white,
    fontSize: wp('5%'),
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: I18nManager.isRTL ? 0 : 0,
    marginLeft: I18nManager.isRTL ? 0 : 0,
    textAlign: 'center',
    flex: 0,
    paddingHorizontal: 0,
  },
  loginIcon: {
    color: colors.white,
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 0,
    paddingHorizontal: 0,
  },
  headingRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('10%'),
    marginTop: hp('1.5%'),
    alignSelf: 'center',
    maxWidth: '100%',
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  gradientTextWrapper: {
    borderRadius: wp('4.5%'),
    paddingHorizontal: 0,
    paddingVertical: hp('1%'),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: '100%',
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeHeading: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    color: 'white',
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 8,
    marginBottom: hp('2%'),
    marginTop: 0,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: wp('8%'),
    paddingHorizontal: wp('5%'),
  },
  languageContainer: {
    position: 'absolute',
    top: hp('7%'),
    right: wp('4%'),
    zIndex: 10,
    maxWidth: '40%',
  },
  languageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.7%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexShrink: 1,
  },
  languageLabel: {
    fontSize: wp('3.5%'),
    marginRight: wp('1%'),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FAFD',
    borderRadius: wp('4.5%'),
    paddingVertical: hp('1.7%'),
    paddingHorizontal: wp('4.5%'),
    marginBottom: hp('2%'),
    marginTop: -hp('10%'),
    alignSelf: 'center',
    maxWidth: '90%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconWrapper: {
    backgroundColor: '#e3f0fb',
    borderRadius: wp('4%'),
    width: wp('11%'),
    height: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3.5%'),
  },
  infoIcon: {
    fontSize: wp('7%'),
    color: '#1976d2',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: wp('0.5%'),
  },
  infoSubtitle: {
    fontSize: wp('3.2%'),
    color: '#444',
    fontWeight: '400',
  },
});

export default WelcomeScreen;
