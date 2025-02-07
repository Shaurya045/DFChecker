import {enableScreens} from 'react-native-screens';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';

// Background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  // console.log('Background event:', type, detail);

  switch (type) {
    case EventType.ACTION_PRESS:
      // console.log('User tapped an action', detail.pressAction);
      break;
    case EventType.DISMISSED:
      // console.log('User dismissed notification');
      break;
    default:
      break;
  }
});

enableScreens(); // Enable react-native-screens for performance
AppRegistry.registerComponent(appName, () => App);
