import {enableScreens} from 'react-native-screens';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

enableScreens(); // Enable react-native-screens for performance
AppRegistry.registerComponent(appName, () => App);
