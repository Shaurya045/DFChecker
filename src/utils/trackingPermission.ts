import { Platform } from 'react-native';

// Define the type for tracking status
type TrackingStatus = 'authorized' | 'denied' | 'not-determined' | 'restricted';

// On iOS, we need to import the App Tracking Transparency module
let requestTrackingPermission: () => Promise<boolean>;

if (Platform.OS === 'ios') {
  try {
    // Dynamic import to avoid errors on Android
    const ATT = require('react-native-tracking-transparency');
    requestTrackingPermission = async (): Promise<boolean> => {
      try {
        const trackingStatus: TrackingStatus = await ATT.requestTrackingPermission();
        return trackingStatus === 'authorized';
      } catch (error) {
        console.error('Error requesting tracking permission:', error);
        return false;
      }
    };
  } catch (error) {
    // Fallback if module isn't available
    requestTrackingPermission = async (): Promise<boolean> => false;
  }
} else {
  // On Android, no ATT framework needed
  requestTrackingPermission = async (): Promise<boolean> => true;
}

export { requestTrackingPermission };
