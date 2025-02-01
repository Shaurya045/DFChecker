import React, {useEffect, useState} from 'react';
// import type {PropsWithChildren} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Questions from './components/Questions';
import Register from './components/Register';
import ProfileScreen from './components/ProfileScreen';
import ReportScreen from './components/ReportScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
  Profile: undefined;
  Qes: undefined;
  Report: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const getData = async () => {
    const data = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(data === 'true'); // Convert string to boolean
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              title: 'Welcome Screen',
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login Screen',
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: 'Register Screen',
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home Screen',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile Screen',
            }}
          />
          <Stack.Screen
            name="Qes"
            component={Questions}
            options={{
              title: 'Question Screen',
            }}
          />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{
              title: 'Report Screen',
            }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
