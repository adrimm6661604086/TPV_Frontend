// React
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

// Libraries
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

// Navigators
import BottomTabNavigator from './src/components/navigation/BottomTabNavigator';
import PaymentNavigator from './src/components/navigation/PaymentNavigtor';

// Screens
import UserAuthScreen from './src/screens/User/UserAuthScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';
import { RootStackParamList } from './src/types/navigationTypes';

// Hooks
import { useVerifyAuth } from './src/hooks/UserHooks';

// Utils
import theme from './src/utils/theme';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useVerifyAuth(setIsAuthenticated);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <RootStack.Navigator>
            {isAuthenticated ? (
              <RootStack.Screen 
                name="Main" 
                component={BottomTabNavigator} 
                options={{ headerShown: false }}
              >
              </RootStack.Screen>
            ) : (
              <RootStack.Screen 
                name="UserAuth"
                options={{ headerShown: false }}
              >
                {props => <UserAuthScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
              </RootStack.Screen>
            )}
            <RootStack.Screen 
              name="Profile"
              options={{ headerShown: false }}
            >
              {props => <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </RootStack.Screen>
            <RootStack.Screen
              name="Payment"
              component={PaymentNavigator}
              options={{ headerShown: false }}
            />

        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
});

export default App;
