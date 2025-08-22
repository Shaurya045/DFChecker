import { Platform } from 'react-native';

// Define the type for tracking status
type TrackingStatus = 'authorized' | 'denied' | 'not-determined' | 'restricted';

// Configuration: Set to false since this app doesn't track users across apps/websites
const APP_TRACKS_USERS = false;

// Get current tracking status without requesting permission
let getTrackingStatus: () => Promise<TrackingStatus>;
let requestTrackingPermission: () => Promise<boolean>;

if (Platform.OS === 'ios') {
  try {
    // Dynamic import to avoid errors on Android
    const ATT = require('react-native-tracking-transparency');
    
    getTrackingStatus = async (): Promise<TrackingStatus> => {
      try {
        console.log('Getting current tracking status...');
        const status = await ATT.getTrackingStatus();
        console.log('Current tracking status:', status);
        return status;
      } catch (error) {
        console.log('ATT module not available or error getting status:', error);
        return 'not-determined';
      }
    };

    requestTrackingPermission = async (): Promise<boolean> => {
      // Request tracking permission for App Store compliance
      // Even if we don't track users, we need to request permission
      try {
        console.log('Requesting App Tracking Transparency permission...');
        const trackingStatus: TrackingStatus = await ATT.requestTrackingPermission();
        console.log('Tracking permission result:', trackingStatus);
        
        // Log the result for App Store review purposes
        if (trackingStatus === 'authorized') {
          console.log('✅ User authorized tracking permission');
        } else if (trackingStatus === 'denied') {
          console.log('❌ User denied tracking permission');
        } else if (trackingStatus === 'restricted') {
          console.log('🚫 Tracking permission is restricted');
        } else {
          console.log('❓ Tracking permission status is not determined');
        }
        
        return trackingStatus === 'authorized';
      } catch (error) {
        console.error('Error requesting tracking permission:', error);
        return false;
      }
    };
  } catch (error) {
    // Fallback if module isn't available
    console.log('ATT module not available, using fallback');
    getTrackingStatus = async (): Promise<TrackingStatus> => 'not-determined';
    requestTrackingPermission = async (): Promise<boolean> => false;
  }
} else {
  // On Android, no ATT framework needed
  console.log('Android platform detected - no ATT framework needed');
  getTrackingStatus = async (): Promise<TrackingStatus> => 'not-determined';
  requestTrackingPermission = async (): Promise<boolean> => true;
}

export { requestTrackingPermission, getTrackingStatus, APP_TRACKS_USERS };
