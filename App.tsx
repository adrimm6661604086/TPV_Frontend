// React
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

// Libraries
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import BottomTabNavigator from './src/components/navigation/BottomTabNavigator';
import PaymentNavigator from './src/components/navigation/PaymentNavigtor';

// Screens
import UserAuthScreen from './src/screens/User/UserAuthScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';
import MoreInfoScreen from './src/screens/Other/MoreInfoScreen';
import { RootStackParamList } from './src/types/navigationTypes';

// Hooks
import { useVerifyAuth } from './src/hooks/UserHooks';

// Utils
import theme from './src/utils/theme';
import { BACKEND_URL } from '@env';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [message, setMessage] = useState<string>('');
  
  useVerifyAuth(setIsAuthenticated);

  // useEffect(() => {
  //   const testFetch = async () => {
  //     try {
  //     const response = await fetch(`${BACKEND_URL}/api/test`, {
  //       method: 'GET',
  //       headers: {
  //       'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await response.json();
  //     setMessage(data.message);
  //     } catch (error) {
  //     console.error('Error testing:', error);
  //     }
  //   }
  //   testFetch();
  // }, []);


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
            <RootStack.Screen
              name="ShowMore"
              options={{ headerShown: false }}
            >
              {props => {
                const { route } = props;
                const transactions = route.params?.transactions;
                return <MoreInfoScreen {...props} transactions={transactions} />
              }}
            </RootStack.Screen>

        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    // <SafeAreaView>
    //   <Text>{message}</Text>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
});

export default App;
