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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {colors} from '../utils/colors';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from './LanguageDropdown';
import { wp, hp } from '../utils/responsive';
import { requestTrackingPermission } from '../utils/trackingPermission';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isIpad = Platform.OS === 'ios' && Math.min(screenWidth, screenHeight) >= 768;
const isLargeIpad = Platform.OS === 'ios' && Math.min(screenWidth, screenHeight) >= 1024; // 13-inch iPad detection

// ===== INFO CARD POSITION CONFIGURATION =====
// Change these values to adjust the info card position on different devices
// Available inputs: Any number (positive or negative)
// Positive values move the card DOWN, Negative values move the card UP
// Examples: 5 (down), -5 (up), 0 (no change)
const INFO_CARD_POSITION = {
  largeIpad: -2,    // Position for 13-inch iPad and larger
  ipad: -8,         // Position for 9.7-inch to 12.9-inch iPad
  mobile: -10       // Position for iPhone and smaller devices
};
// ===========================================

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
    // Request App Tracking Transparency permission
    const requestTracking = async () => {
      try {
        await requestTrackingPermission();
      } catch (error) {
        console.log('Error requesting tracking permission:', error);
      }
    };

    // Request tracking permission after a short delay to ensure app is fully loaded
    const trackingTimer = setTimeout(() => {
      requestTracking();
    }, 1000);

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

    // Cleanup timer on unmount
    return () => {
      clearTimeout(trackingTimer);
    };
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
        {/* On iPad, show language selector in its own row above the heading */}
        {isIpad ? (
          <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: hp('2%') }}>
            <View style={styles.languageWrapper}>
              <Text style={styles.languageLabel}>🌐</Text>
              <LanguageDropdown />
            </View>
          </View>
        ) : (
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
        )}

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
    width: '100%',
    maxWidth: isLargeIpad ? 1000 : isIpad ? 800 : '100%',
    alignSelf: 'center',
    paddingHorizontal: isLargeIpad ? wp('8%') : isIpad ? wp('6%') : wp('4%'),
    paddingTop: isLargeIpad ? hp('6%') : isIpad ? hp('4%') : hp('2%'),
    paddingBottom: isLargeIpad ? hp('6%') : isIpad ? hp('4%') : hp('2%'),
  },
  languageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 10,
  },
  image: {
    height: isLargeIpad ? hp('18%') : isIpad ? hp('2%') : hp('30%'),
    width: isLargeIpad ? wp('25%') : isIpad ? wp('30%') : wp('50%'),
    marginBottom: isLargeIpad ? hp('3%') : isIpad ? hp('4%') : hp('4%'),
    marginTop: isLargeIpad ? hp('2%') : isIpad ? hp('0%') : hp('0%'),
    resizeMode: 'contain',
  },
  tagline: {
    fontSize: isLargeIpad ? wp('3.8%') : isIpad ? wp('3.5%') : wp('4%'),
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: isLargeIpad ? hp('3%') : isIpad ? hp('2%') : hp('2%'),
    marginTop: isLargeIpad ? hp('1%') : isIpad ? -hp('1%') : -hp('1%'),
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: isLargeIpad ? hp('5%') : isIpad ? hp('3%') : hp('3%'),
    gap: isLargeIpad ? wp('3.5%') : isIpad ? wp('3%') : wp('2%'),
    width: isLargeIpad ? '88%' : isIpad ? '90%' : '100%',
    maxWidth: isLargeIpad ? 750 : isIpad ? 700 : undefined,
  },
  featureItem: {
    fontSize: isLargeIpad ? wp('2.6%') : isIpad ? wp('2.8%') : wp('3.2%'),
    color: colors.primary,
    marginHorizontal: isLargeIpad ? wp('1.5%') : isIpad ? wp('2%') : wp('1.5%'),
    backgroundColor: '#EAF6FB',
    borderRadius: wp('3%'),
    paddingHorizontal: isLargeIpad ? wp('2.5%') : isIpad ? wp('3%') : wp('2.5%'),
    paddingVertical: isLargeIpad ? hp('0.6%') : isIpad ? hp('0.8%') : hp('0.5%'),
    overflow: 'hidden',
  },
  buttonWrapper: {
    borderRadius: wp('7%'),
    marginTop: isLargeIpad ? hp('4%') : isIpad ? hp('1.5%') : hp('1.5%'),
    width: isLargeIpad ? wp('42%') : isIpad ? wp('40%') : wp('60%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  button: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: wp('7%'),
    paddingVertical: 0,
    minHeight: isLargeIpad ? hp('6.5%') : isIpad ? hp('6%') : hp('7%'),
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
    fontSize: isLargeIpad ? wp('4.8%') : isIpad ? wp('4.5%') : wp('5%'),
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
    fontSize: isLargeIpad ? wp('5.2%') : isIpad ? wp('5%') : wp('5.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 0,
    paddingHorizontal: 0,
  },
  headingRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isLargeIpad ? hp('6%') : isIpad ? hp('6%') : hp('10%'),
    marginTop: isLargeIpad ? hp('2%') : isIpad ? hp('-1.5%') : hp('-0.5%'),
    alignSelf: 'center',
    maxWidth: isLargeIpad ? '100%' : isIpad ? '100%' : '100%',
    width: '100%',
    paddingHorizontal: isLargeIpad ? wp('1%') : isIpad ? wp('2%') : wp('5%'),
  },
  gradientTextWrapper: {
    borderRadius: wp('14.5%'),
    paddingHorizontal: isLargeIpad ? wp('0.5%') : isIpad ? wp('1%') : 0,
    paddingVertical: isLargeIpad ? hp('2%') : isIpad ? hp('2.5%') : hp('1%'),
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
    fontSize: isLargeIpad ? wp('4.5%') : isIpad ? wp('4.2%') : wp('6.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    color: 'white',
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 8,
    marginBottom: isLargeIpad ? hp('3%') : isIpad ? hp('4%') : hp('4%'),
    marginTop: isLargeIpad ? -8 : isIpad ? -12 : -12,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: isLargeIpad ? wp('7.5%') : isIpad ? wp('7%') : wp('8%'),
    paddingHorizontal: isLargeIpad ? wp('5.5%') : isIpad ? wp('5%') : wp('5%'),
  },
  languageContainer: {
    position: 'absolute',
    top: isLargeIpad ? hp('2%') : isIpad ? hp('2.5%') : hp('6%'),
    right: isLargeIpad ? wp('6%') : isIpad ? wp('6%') : wp('4%'),
    zIndex: 10,
    maxWidth: isLargeIpad ? 300 : isIpad ? 280 : 180,
    minWidth: 120,
    alignSelf: 'flex-end',
  },
  languageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: wp('5%'),
    paddingHorizontal: isLargeIpad ? wp('2%') : isIpad ? wp('2.5%') : wp('2.5%'),
    paddingVertical: isLargeIpad ? hp('0.5%') : isIpad ? hp('0.7%') : hp('0.7%'),
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
    fontSize: isLargeIpad ? wp('3%') : isIpad ? wp('3.5%') : wp('3.5%'),
    marginRight: isLargeIpad ? wp('0.8%') : isIpad ? wp('1%') : wp('1%'),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FAFD',
    borderRadius: wp('4.5%'),
    paddingVertical: isLargeIpad ? hp('0.5%') : isIpad ? hp('2.5%') : hp('1.7%'),
    paddingHorizontal: isLargeIpad ? wp('7%') : isIpad ? wp('6%') : wp('4.5%'),
    marginBottom: isLargeIpad ? hp('4%') : isIpad ? hp('2%') : hp('2%'),
    marginTop: isLargeIpad ? hp(INFO_CARD_POSITION.largeIpad + '%') : isIpad ? hp(INFO_CARD_POSITION.ipad + '%') : hp(INFO_CARD_POSITION.mobile + '%'),
    alignSelf: 'center',
    maxWidth: isLargeIpad ? '100%' : isIpad ? '65%' : '90%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconWrapper: {
    backgroundColor: '#e3f0fb',
    borderRadius: wp('4%'),
    width: isLargeIpad ? wp('9%') : isIpad ? wp('10%') : wp('11%'),
    height: isLargeIpad ? wp('9%') : isIpad ? wp('10%') : wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isLargeIpad ? wp('4%') : isIpad ? wp('4.5%') : wp('3.5%'),
  },
  infoIcon: {
    fontSize: isLargeIpad ? wp('6%') : isIpad ? wp('6.5%') : wp('7%'),
    color: '#1976d2',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    fontSize: isLargeIpad ? wp('4%') : isIpad ? wp('3.8%') : wp('4%'),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: wp('0.5%'),
  },
  infoSubtitle: {
    fontSize: isLargeIpad ? wp('3.2%') : isIpad ? wp('3%') : wp('3.2%'),
    color: '#444',
    fontWeight: '400',
  },
});

export default WelcomeScreen;
