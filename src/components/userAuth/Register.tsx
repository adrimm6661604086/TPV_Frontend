import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';

// Libraries
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

// Components
import Dropdown from '../Dropdown';

// Hooks
import { useRegister } from '../../hooks/UserHooks';

// Utils
import { AuthComponent } from '../../screens/User/UserAuthScreen';
import styles from './styles';
import theme from '../../utils/theme';

interface RegisterProps {
  currentComponent: AuthComponent;
  setCurrentComponent: (component: AuthComponent) => void;
}

enum PasswordStrength {
  Weak = 'Weak',
  Medium = 'Medium',
  Strong = 'Strong',
  undefined = 'undefined',
}

const iconsize = 24;

const countries = [
  { label: "United States", value: "us" },
  { label: "Spain", value: "es" },
  { label: "England", value: "en" },
  { label: "Germany", value: "de" },
  { label: "Italy", value: "it" },
];

const Register: React.FC<RegisterProps> = ({ currentComponent, setCurrentComponent }) => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    DNI: '',
    postalCode: '',
    address: '',
    city: '',
    country: '',
    IBAN: '',
    bankEntity: 'BankSim',
    accountType: 'individual',
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.undefined);
  const [emailVerify, setEmailVerify] = useState<boolean | undefined>(undefined);
  const [phoneVerify, setPhoneVerify] = useState<boolean | undefined>(undefined);
  const { registerUser } = useRegister(setCurrentComponent);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = (step: number) => {
    if (handleStepperFilled(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleRegister();
      }
    } else {	
      Alert.alert('Error', 'Please fill out all fields');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegister = () => {
    registerUser(formData);
  };

  const onEmailChange = (text: string) => {
    handleInputChange('email', text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailVerify(emailRegex.test(text));
  };

  const onPhoneChange = (text: string) => {
    handleInputChange('phoneNumber', text);
    const phoneRegex = /^[0-9]{9,12}$/;
    setPhoneVerify(phoneRegex.test(text));
  };

  const onPasswordChange = (text: string) => {
    handleInputChange('password', text);
    let strengthLevel = PasswordStrength.Weak;

    if (text.length >= 8) {
      if (/[A-Z]/.test(text) && /[a-z]/.test(text)) {
        if (/\d/.test(text) && /[\W_]/.test(text)) {
          strengthLevel = PasswordStrength.Strong;
        } else {
          strengthLevel = PasswordStrength.Medium;
        }
      }
    }
    setPasswordStrength(strengthLevel);
  };

  const handleStepperFilled = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.lastName && formData.email && formData.password && formData.phoneNumber;
      case 2:
        return formData.DNI && formData.postalCode && formData.address && formData.city && formData.country;
      case 3:
        return formData.IBAN && formData.bankEntity;
      default:
        return false
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>

        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={[styles.step, step == 1 && styles.activeStep]}>
            <Text style={{
              color: step == 1 ? theme.palette.text.light : theme.palette.text.primary, 
              fontWeight: 600,
              textAlign:'center'}}> 1 </Text>
          </View>
          <View style={[styles.step, step == 2 && styles.activeStep]}>
            <Text style={{
              color: step == 2 ? theme.palette.text.light : theme.palette.text.primary, 
              fontWeight: 600,
              textAlign:'center'}}> 2 </Text>
          </View>
          <View style={[styles.step, step == 3 && styles.activeStep]}>
            <Text style={{
              color: step == 3 ? theme.palette.text.light : theme.palette.text.primary, 
              fontWeight: 600,
              textAlign:'center'}}> 3 </Text>
          </View>
        </View>

        {step === 1 && (
          <>
            <View style={styles.threeSectionContainer}>
              <FeatherIcon name="user" size={iconsize} color={theme.palette.default.main} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
            <View style={styles.twoSectionContainer}>
              {emailVerify === undefined ? (
                <FeatherIcon name="mail" color={theme.palette.default.main} size={iconsize} style={styles.icon} />
              ) : emailVerify == true ? (
                <FeatherIcon name="check-circle" color={theme.palette.success.main} size={iconsize} style={styles.icon} />
              ) : (
                <FeatherIcon name="x-circle" color={theme.palette.error.main} size={iconsize} style={styles.icon} />
              )}
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.twoSectionContainer}>
              {phoneVerify === undefined ? (
                <FeatherIcon name="phone" color={theme.palette.default.main} size={iconsize} style={styles.icon} />
              ) : phoneVerify == true ? (
                <FeatherIcon name="check-circle" color={theme.palette.success.main} size={iconsize} style={styles.icon} />
              ) : (
                <FeatherIcon name="x-circle" color={theme.palette.error.main} size={iconsize} style={styles.icon} />
              )}
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={onPhoneChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.twoSectionContainer}>
              {passwordStrength === PasswordStrength.Strong ? (
                <FeatherIcon name="check-circle" color="green" size={iconsize} style={styles.icon} />
              ) : passwordStrength === PasswordStrength.Medium ? (
                <Ionicon name="warning-outline" color={theme.palette.warn.main} size={iconsize} style={styles.icon} />
              ) : passwordStrength === PasswordStrength.Weak ? (
                <FeatherIcon name="x-circle" color={theme.palette.error.main} size={iconsize} style={styles.icon} />
              ) : (
                <FeatherIcon name="lock" color={theme.palette.default.main} size={iconsize} style={styles.icon} />
              )
              }
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={onPasswordChange}
                secureTextEntry
              />
            </View>
          </>
        )}

        {step === 2 && handleStepperFilled(1) &&(
          <>
            <View style={styles.threeSectionContainer}>
              <FontAwesomeIcon name="id-card-o" size={iconsize} color={theme.palette.default.main} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="DNI"
                value={formData.DNI}
                onChangeText={(text) => handleInputChange('DNI', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                value={formData.postalCode}
                onChangeText={(text) => handleInputChange('postalCode', text)}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />
            <Dropdown
              items={countries}
              width={"100%"}
              placeholder="Country"
              onSelect={(selectedItem) =>
                handleInputChange('country', selectedItem.value.toString())
              }
            />
          </>
        )}

        {step === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="IBAN"
              value={formData.IBAN}
              onChangeText={(text) => handleInputChange('IBAN', text)}
            />
            <Dropdown
              items={[
                { label: 'BankSim', value: 'BankSim' },
                { label: 'BBVA', value: 'BBVA' },
                { label: 'Caixabank', value: 'Caixabank' },
                { label: 'Santander', value: 'Santander' },
              ]}
              width={"100%"}
              placeholder="Bank Entity"
              onSelect={(selectedItem) =>
                handleInputChange('bankEntity', selectedItem.value.toString())
              }
            />

          </>
        )}


        {/* Navigation Buttons */}
        <View style={styles.twoButtonsContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: 'gray' }}
              onPress={handleBack}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: step === 3 ? theme.palette.primary.main: theme.palette.secondary.main }}
            onPress={() => handleNext(step)}
          >
            <Text style={styles.buttonText}>{step === 3 ? 'Submit' : 'Next'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: theme.palette.default.main }}
            onPress={() => setCurrentComponent(AuthComponent.Login)}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
