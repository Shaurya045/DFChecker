import type React from 'react';
import { StatusBar, useColorScheme, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Questions from './components/Questions';
import Register from './components/Register';
import ProfileScreen from './components/ProfileScreen';
import ReportScreen from './components/ReportScreen';
import ReportDetail from './components/ReportDetail';
import ReportProfile from './components/ReportProfile';
import ForgotPasswordModal from './components/ForgotPassword';
import ResetPasswordModal from './components/ResetPassword';
import HighRiskPatients from './components/HighRiskPatients';

// Auth Context
import { AuthProvider, useAuth } from './AuthContext';

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
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  HighRiskPatients: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Add wrapper for ReportProfile to match navigation props
function ReportProfileScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ReportProfile'>) {
  return <ReportProfile navigation={navigation} route={route} />;
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Qes" component={Questions} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetail} />
      <Stack.Screen name="ReportProfile" component={ReportProfileScreen} />
      <Stack.Screen name="HighRiskPatients" component={HighRiskPatients} />
    </Stack.Navigator>
  );
}

// Add wrapper screen components for navigation
function ForgotPasswordScreen({ navigation }: { navigation: any }) {
  return (
    <ForgotPasswordModal
      visible={true}
      onClose={() => navigation.goBack()}
      onSuccess={email => navigation.replace('ResetPassword', { email })}
    />
  );
}

function ResetPasswordScreen({ navigation, route }: { navigation: any; route: any }) {
  return (
    <ResetPasswordModal navigation={navigation} route={route} />
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AuthenticatedStack /> : <UnauthenticatedStack />;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          {/* StatusBar config for both Android and iOS */}
          <StatusBar
            barStyle="dark-content" // Black icons on white background
            translucent={true}
            backgroundColor="transparent" // ignored on iOS
          />
          {/* Android notch fix: render white background under translucent StatusBar */}
          {Platform.OS === 'android' && (
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF' }} />
          )}
          <RootNavigator />
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
