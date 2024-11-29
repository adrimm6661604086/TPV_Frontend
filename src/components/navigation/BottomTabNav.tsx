/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../../screens/HomeScreen';
import StatsScreen from '../../screens/StatsScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Stats') {
              iconName = 'bar-chart';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            return <Icon name={iconName ?? 'default-icon'} size={42} color={color} />;
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarIconStyle: {
            width: 'auto',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarItemStyle: {
            width: 60,
            height: 60,
            alignSelf: 'center',
          },
          tabBarStyle: {
            backgroundColor: '#101010',
            height: 80,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }

export default BottomTabNavigator;
