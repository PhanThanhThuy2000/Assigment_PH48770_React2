import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import 'expo-router/entry';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationScreen from './screens/NotificationScreen';
import AccountScreen from './screens/AccountScreen';
import EditAccountScreen from './screens/EditAccountScreen';
import QAScreen from './screens/QAScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CategoryScreen from './screens/CategoryScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import TheScreen from './screens/TheScreen';
import PlantCareScreen from './screens/PlantCareScreen';
import PlantCareDetailScreen from './screens/PlantCareDetailScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';

// Admin

import AdminProductScreen from './screens/admin/AdminProductScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminCategoryScreen from './screens/admin/AdminCategoryScreen';

import App from './app';
import { Provider } from 'react-redux'; // Add Provider
import store from './store'; // Import the Redux store
const Stack = createStackNavigator();

export default function RootLayout() {
  return (<Provider store={store}>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="app" component={App} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditAccount" component={EditAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QA" component={QAScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="The" component={TheScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlantCareS" component={PlantCareScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlantCareDetail" component={PlantCareDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TransactionHistoryS" component={TransactionHistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerShown: false }} />


      {/* Admin */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminProduct" component={AdminProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminCategory" component={AdminCategoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  </Provider>
  
  );
}
