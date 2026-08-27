import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import LoginScreen from './src/screens/LoginScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';

const Tab = createBottomTabNavigator();
const CartStack = createNativeStackNavigator();

function CartStackScreen() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <CartStack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ title: 'Confirmation', headerBackVisible: false }}
      />
    </CartStack.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  // ───────────────────────────────────────────────────────────────────
  // BUG-015: the whole tab bar (Login | Products | Cart) is rendered
  // from launch, so "Products" and "Cart" are reachable BEFORE the user
  // has authenticated. The requirement is that the tab bar appears only
  // after login. The fix: gate on isAuthenticated and render the login
  // screen alone (no tab bar) until the user signs in.
  //
  // BUG-014: the Products tab's navigation title is "Untitled" instead
  // of "Products".
  // ───────────────────────────────────────────────────────────────────
  return (
    <Tab.Navigator initialRouteName={isAuthenticated ? 'Products' : 'Login'}>
      <Tab.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
      <Tab.Screen name="Products" component={CatalogScreen} options={{ title: 'Untitled' }} />
      <Tab.Screen name="Cart" component={CartStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
