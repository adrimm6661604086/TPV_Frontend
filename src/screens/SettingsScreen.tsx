  import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

// Libraries
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utils
import theme from '../utils/theme';
import Dropdown from '../components/Dropdown';

const SettingsScreen = () => {
  // Estados para manejar los desplegables
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isUserAgreementOpen, setIsUserAgreementOpen] = useState(false);
  const [isInformationOpen, setIsInformationOpen] = useState(false);

  const languageOptions = [
    {
      label: 'English',
      value: 'en',
      image: require('../assets/flags/uk.png'),
    },
    {
      label: 'Español',
      value: 'es',
      image: require('../assets/flags/spain.png'),
    },
  ];

  // Estados de los camnibios en las preferences
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);


  useEffect(() => {
    const getLanguage = async () => {
      try {
        const language = await AsyncStorage.getItem('language');
        if (language) {
          setSelectedLanguage(language);
        }
      } catch (error) {
        console.error('Error getting language: ', error);
      }
    };
    getLanguage();
  }, []);

  // Función para cambiar el estado de un desplegable
  const toggleSection = (section: string) => {
    if (section === 'preferences') {
      setIsPreferencesOpen(!isPreferencesOpen);
    } else if (section === 'privacyPolicy') {
      setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen);
    } else if (section === 'userAgreement') {
      setIsUserAgreementOpen(!isUserAgreementOpen);
    } else if (section === 'information') {
      setIsInformationOpen(!isInformationOpen);
    }
  };

  // Función para cambiar el idioma
  const handleLanguage = (item: { label: string; value: string; image?: any }) => {
    const saveLanguage = async (language : string) => {
      try {
        await AsyncStorage.setItem('language', language);
      } catch (error) {
        console.error('Error saving language: ', error);
      }
    };
    saveLanguage(item.value);
    setSelectedLanguage(item.value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.section, height : 'auto' }}>
        <View style={styles.card}>
          <FeatherIcon name="sliders" size={24} color={theme.palette.primary.main} />
          <TouchableOpacity style={styles.innerCard} onPress={() => toggleSection('preferences')}>
            <Text style={styles.itemText}>Preferences</Text>
            <FeatherIcon name={isPreferencesOpen ? "chevron-up" : "chevron-down"} size={24} color={theme.palette.primary.main} />
          </TouchableOpacity>
        </View>
        {isPreferencesOpen && (
          <View style={styles.subContainer}>
            <View style={styles.subSection}>
              <Text style={styles.subItemText}>Language</Text>
              <Dropdown 
              width={150}
              items={languageOptions} 
              onSelect={(item) => handleLanguage(item)}/>              
            </View>
            <Text >Currency: USD</Text>
          </View>
        )}
        </View>

        <View style={{...styles.section, height : 'auto' }}>
          <View style={styles.card}>
            <FontAwesome6Icon name="file-shield" size={24} color={theme.palette.primary.main} />
            <TouchableOpacity style={styles.innerCard} onPress={() => toggleSection('privacyPolicy')}>  
              <Text style={styles.itemText}>Privacy Policy</Text>
              <FeatherIcon name={isPrivacyPolicyOpen ? "chevron-up" : "chevron-down"} size={24} color={theme.palette.primary.main} />
            </TouchableOpacity>
          </View>
          {isPrivacyPolicyOpen && (
            <View style={styles.subContainer}>
              <Text >Here is the privacy policy...</Text>
            </View>
          )}
        </View>
          
      
        <View style={{...styles.section, height : 'auto' }}>
          <View style={styles.card}>
            <FontAwesome6Icon name="file-signature" size={24} color={theme.palette.primary.main} />
            <TouchableOpacity style={styles.innerCard} onPress={() => toggleSection('userAgreement')}>
              <Text style={styles.itemText}>User Agreement</Text>
              <FeatherIcon name={isUserAgreementOpen ? "chevron-up" : "chevron-down"} size={24} color={theme.palette.primary.main} />
            </TouchableOpacity>
          </View>
          {isUserAgreementOpen && (
            <View style={styles.subContainer}>
              <Text >Here is the user agreement...</Text>
            </View>
          )}
        </View>

          <View style={{...styles.section, height: 'auto'}}>
            <View style={styles.card}>
              <FeatherIcon name="info" size={24} color={theme.palette.primary.main} />
              <TouchableOpacity style={styles.innerCard} onPress={() => toggleSection('information')}>
                <Text style={styles.itemText}>Information</Text>
                <FeatherIcon name={isInformationOpen ? "chevron-up" : "chevron-down"} size={24} color={theme.palette.primary.main} />
              </TouchableOpacity>
            </View>
            {isInformationOpen && (
              <View style={styles.subContainer}>
                <Text >Here is some general information...</Text>
              </View>
            )}  
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: theme.palette.background.light,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 0,

  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: 'relative',
  },
  innerCard: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  subContainer: {
    paddingVertical: 20,
  },
  subSection : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subItemText: {
    fontSize: 16,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  pickerText: {
    fontSize: 16,
  },
  pickerInput: {
    height: 50,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 4,
    paddingLeft: 10,
  },
});

export default SettingsScreen;
