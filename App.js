import 'react-native-gesture-handler'; // Add this line at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import DemoScreen from './screens/DemoScreen';
import LiveScreen from './screens/LiveScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#004D40' },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#a8dadc',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Demo" component={DemoScreen} />
        <Tab.Screen name="Live" component={LiveScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
