// React
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';

// Libraries
import { useNavigation, CommonActions } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Hooks
import { useUser, useUserBankAccount } from '../../hooks/UserHooks';

// Utils
import theme from '../../utils/theme';

// Types
import { User } from '../../types/interfaces';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes'; 
  
type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  setIsAuthenticated: (value: boolean) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setIsAuthenticated }) => {
  const navigator = useNavigation<ProfileScreenNavigationProp>();
  

  const { user, loading, error } = useUser();
  const { bankData, loadingBankData, errorBankData } = useUserBankAccount();

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            setIsAuthenticated(false);  
            AsyncStorage.removeItem('userToken');  
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(false)); 
            
            navigator.dispatch(
              CommonActions.reset({
                index: 0, 
                routes: [{ name: 'UserAuth' }],
              })
            );
          }
        }
      ]
    );
  };  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigator.goBack()}
        >
          <FeatherIcon name="arrow-left" size={32} color={theme.palette.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <FeatherIcon name="user" size={48} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.name}>{`${user?.name} ${user?.lastName}`}</Text>
            <Text style={styles.date}>{user?.createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <FeatherIcon name="chevron-right" size={24} color={theme.palette.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Bank Information */}
      <View style={styles.infoCard}>        
        <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Bank Information</Text>
            <View style={styles.infoContent}>
              <MaterialCommunityIcon name="bank" size={24} color={theme.palette.primary.main} style={styles.icon} />
              <View>
                <Text style={styles.infoTitle}>Entity</Text>
                <Text style={styles.infoSubtitle}>{bankData?.bankEntity}</Text>
              </View>        
            </View>
            <View style={styles.infoContent}>
              <MaterialCommunityIcon name="alpha-i-circle" size={24} color={theme.palette.primary.main} style={styles.icon} />
              <View>
                <Text style={styles.infoTitle}>IBAN</Text>
                <Text style={styles.infoSubtitle}>{bankData?.IBAN}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <FeatherIcon name="chevron-right" size={24} color={theme.palette.primary.main} />
          </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <View style={styles.infoCard}>        
        <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoContent}>
              <MaterialIcons name="phone" size={24} color={theme.palette.primary.main} style={styles.icon} />
              <Text style={styles.infoTitle}>{user?.phoneNumber}</Text>
            </View>
            <View style={styles.infoContent}>
              <MaterialIcons name="mail" size={24} color={theme.palette.primary.main} style={styles.icon} />
              <Text style={styles.infoTitle}>{user?.email}</Text>
            </View>
            <View style={styles.infoContent}>
              
            </View>
          </View>
          <TouchableOpacity>
            <FeatherIcon name="chevron-right" size={24} color={theme.palette.primary.main} />
          </TouchableOpacity>
      </View>

      {/* App preferences */}
      <View style={styles.infoCard}>        
        <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>App preferences</Text>
            <View style={styles.infoContent}>
              <MaterialIcons name='currency-exchange' size={24} color={theme.palette.primary.main} style={styles.icon} />
              <View>
                <Text style={styles.infoTitle}>Currency</Text>
                <Text style={styles.infoSubtitle}>$</Text>
              </View>
            </View>  
            <View style={styles.infoContent}>
              <MaterialIcons name='language' size={24} color={theme.palette.primary.main} style={styles.icon} />
              <View>
                <Text style={styles.infoTitle}>Language</Text>
                <Text style={styles.infoSubtitle}>{user?.country}</Text>
              </View>
            </View>          
          </View>
          <TouchableOpacity>
            <FeatherIcon name="chevron-right" size={24} color={theme.palette.primary.main} />
          </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}> Logout </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',  
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,

    marginVertical: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  email: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.palette.text.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  infoSection: {
    justifyContent: 'space-between',
  },
  infoContent: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  logoutButton: {
    backgroundColor: theme.palette.primary.main,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
