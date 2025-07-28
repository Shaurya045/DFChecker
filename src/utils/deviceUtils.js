import { Dimensions, Platform } from 'react-native';
import { wp, hp } from './responsive';

// Device detection
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

// iPad detection (typically aspect ratios between 1.3 and 1.5)
export const isTablet = () => {
  return (
    (Platform.OS === 'ios' && Platform.isPad) || 
    (aspectRatio < 1.6 && Math.max(width, height) >= 768)
  );
};

// Scale factors for different device types
export const scale = (size) => {
  if (isTablet()) {
    // More moderate scaling for iPad to avoid overly large elements
    return size * 1.15;
  }
  return size;
};

// Font scaling helper
export const scaleFontSize = (size) => {
  return isTablet() ? Math.round(size * 1.2) : size;
};

// Spacing helpers
export const padding = {
  sm: isTablet() ? 12 : 8,
  md: isTablet() ? 20 : 16,
  lg: isTablet() ? 32 : 24,
};

// Responsive dimensions that work well with both phone and tablet
export const getResponsiveWidth = (percentage) => {
  // On tablets, we use a smaller percentage to avoid overly wide elements
  const adjustedPercentage = isTablet() ? percentage * 0.7 : percentage;
  return wp(adjustedPercentage);
};

// Responsive height helper
export const getResponsiveHeight = (percentage) => {
  return hp(percentage);
};

// For grid layouts on tablets
export const getGridItemWidth = (itemsPerRow) => {
  // Tablets can show more items per row
  const adjustedItemsPerRow = isTablet() ? itemsPerRow + 1 : itemsPerRow;
  // Calculate width with margins
  return wp(90 / adjustedItemsPerRow);
};

// Content container width - narrower on tablets for better readability
export const getContentMaxWidth = () => {
  return isTablet() ? wp(75) : wp(92);
};
