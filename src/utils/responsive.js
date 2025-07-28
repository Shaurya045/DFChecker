import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions, Platform, PixelRatio, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Scale based on screen width - the base width is 375 (iPhone X)
const scale = SCREEN_WIDTH / 375;

// Device detection utilities
const isIphoneX = () => {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (SCREEN_HEIGHT === 780 ||
      SCREEN_HEIGHT === 812 ||
      SCREEN_HEIGHT === 844 ||
      SCREEN_HEIGHT === 852 ||
      SCREEN_HEIGHT === 896 ||
      SCREEN_HEIGHT === 926 ||
      SCREEN_HEIGHT === 932)
  );
};

const isIpad = () => {
  return Platform.OS === 'ios' && (Platform.isPad || Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) >= 768);
};

// Normalize sizes based on screen dimensions
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Get current device orientation
const isPortrait = () => {
  const dim = Dimensions.get('window');
  return dim.height >= dim.width;
};

const isLandscape = () => {
  const dim = Dimensions.get('window');
  return dim.width >= dim.height;
};

// Get safe area insets for different devices
const getStatusBarHeight = () => {
  return Platform.select({
    ios: isIphoneX() ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0,
  });
};

// Get device-specific bottom spacing (for iPhoneX home indicator etc)
const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

// Responsive font size utility
const fs = (size) => {
  if (isIpad()) {
    // Slightly larger fonts on iPad
    return normalize(size * 1.1);
  }
  return normalize(size);
};

// Get device-specific size adjustments
const getDeviceSizeAdjustment = () => {
  if (isIpad()) {
    return isPortrait() ? 0.8 : 0.65; // iPad needs less padding in landscape
  } 
  // For phones
  return isPortrait() ? 1 : 0.85; // Phones need less padding in landscape
};

// Add orientation listener
const listenOrientationChange = (callback) => {
  Dimensions.addEventListener('change', callback);
  return () => {
    Dimensions.removeEventListener('change', callback);
  };
};

export {
  wp,
  hp,
  normalize,
  isIphoneX,
  isIpad,
  isPortrait,
  isLandscape,
  getStatusBarHeight,
  getBottomSpace,
  fs,
  getDeviceSizeAdjustment,
  listenOrientationChange,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
};