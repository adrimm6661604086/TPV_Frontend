// React
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Libraries
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes'; 
  
// Screens
import HomeScreen from '../../screens/HomeScreen';
import StatsScreen from '../../screens/StatsScreen';
import SettingsScreen from '../../screens/SettingsScreen';

// Uitls
import theme from '../../utils/theme';

const Tab = createBottomTabNavigator();
type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const BottomTabNavigator: React.FC  = () => {
    const navigator = useNavigation<MainScreenNavigationProp>();

    return (
      <>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigator.navigate('Profile')}>
          <Icon name="person" size={32} color={theme.palette.primary.main} />
        </TouchableOpacity>
        <Text style={styles.userName}>TPV Virtual</Text>
        <View style={styles.headerIcons}>
          <Icon name="mail-outline" size={24} color={theme.palette.primary.main}/>
        </View>
      </View>
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
              return <Icon name={iconName ?? 'default-icon'} size={32} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: theme.palette.primary.main,
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
              backgroundColor: theme.palette.background.default,
              height: 60,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Stats" component={StatsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </>
    );
  }

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.palette.background.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default BottomTabNavigator;
