// React
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

// Libraries
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import BottomTabNavigator from './src/components/navigation/BottomTabNavigator';

// Screens
import UserAuthScreen from './src/screens/UserAuthScreen';

const RootStack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };
    fetchToken();
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <RootStack.Navigator>
            {isAuthenticated ? (
              <RootStack.Screen name="Home" component={BottomTabNavigator} />
            ) : (
              <RootStack.Screen name="UserAuth">
                {props => <UserAuthScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
              </RootStack.Screen>
            )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
