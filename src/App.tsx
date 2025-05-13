import type React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';

// Screens
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Questions from './components/Questions';
import Register from './components/Register';
import ProfileScreen from './components/ProfileScreen';
import ReportScreen from './components/ReportScreen';
import ReportDetail from './components/ReportDetail';

// Auth Context
import {AuthProvider, useAuth} from './AuthContext';
import {useEffect} from 'react';
import ReportProfile from './components/ReportProfile';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
  Profile: undefined;
  Qes: undefined;
  Report: undefined;
  ReportDetail: { reportData: any; result: { left: string | null; right: string | null } };
  ReportProfile: { reportData: any; result: { left: string | null; right: string | null } };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Qes" component={Questions} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetail} />
      <Stack.Screen name="ReportProfile" component={ReportProfile} />
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const {isLoggedIn} = useAuth();
  return isLoggedIn ? <AuthenticatedStack /> : <UnauthenticatedStack />;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // setTimeout(() => {
    SplashScreen.hide();
    // }, 500);
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
