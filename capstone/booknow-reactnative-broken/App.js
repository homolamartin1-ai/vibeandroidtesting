import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BookingProvider } from './src/context/BookingContext';
import LoginScreen from './src/screens/LoginScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import BookingScreen from './src/screens/BookingScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Rooms" component={RoomsScreen} />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ headerShown: true, title: 'Complete Booking' }}
          />
          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </BookingProvider>
    </AuthProvider>
  );
}
