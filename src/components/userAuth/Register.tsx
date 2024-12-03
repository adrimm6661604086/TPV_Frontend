// React
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

// Libraries
import axios from 'axios';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

// Utils
import { BACKEND_URL } from '@env';
import { AuthComponent } from '../../screens/User/UserAuthScreen';
import styles from './styles';


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

const Register: React.FC<RegisterProps> = ({ currentComponent, setCurrentComponent }) => {
  const iconsize = 24;
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.undefined);
  const [DNI, setDNI] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  const handleRegister = () => {
    if (!name || !lastName || !email || !password || !DNI || !phoneNumber || !address || !postalCode || !city) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    const userData = {
      name: name,
      lastName: lastName,
      email: email,
      password: password,
      DNI: DNI,
      phoneNumber: phoneNumber,
      address: address,
      postalCode: postalCode,
      city: city,
    };
    axios
        .post(`http://10.2.2.2:5000/api/register-user`, userData)
        .then(response => {
          if (response.data.status == 201) {
            Alert.alert('Success', 'User registered successfully');
            setCurrentComponent(AuthComponent.Login);
          } else {
            Alert.alert(JSON.stringify(response.data));
          }
        })
        .catch(e => console.log(e));
  };


  const onEmailChange = (text : string) => {
    setEmail(text);
    
    const handleEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email); 
    };

    setEmailVerify(handleEmail(text));
  };
  
  const onPhoneChange = (text : string) => {
    setPhoneNumber(text);

    const handlePhone = (phone: string) => {
      const phoneRegex = /^[0-9]{9,12}$/;  
      return phoneRegex.test(phone); 
    };

    setPhoneVerify(handlePhone(text))
  };
  
  const onPasswordChange = (text : string) => {
    setPassword(text);

    const handlePassword = (password: string) => {
      let strengthLevel = PasswordStrength.Weak;
    
      if (password.length >= 8) {
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
          if (/\d/.test(password) && /[\W_]/.test(password)) {
            strengthLevel = PasswordStrength.Strong; 
          } else {
            strengthLevel = PasswordStrength.Medium; 
          }
        }
      }
      return strengthLevel;
    };

    const strength = handlePassword(text);
    setPasswordStrength(strength);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.threeSectionContainer}>
          <FeatherIcon name="user" size={iconsize} color="black" style={styles.icon}/>          
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.twoSectionContainer}>
          {email.length < 1 ? 
          <FeatherIcon name="mail" size={iconsize} color="black" style={styles.icon}/> 
          : emailVerify ? (
            <FeatherIcon name="check-circle" color="green" size={iconsize} style={styles.icon}/>
          ) : (
            <FeatherIcon name="x-circle" color="red" size={iconsize} style={styles.icon}/>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.twoSectionContainer}>
          {password.length < 1 ? 
            <FeatherIcon name="lock" size={iconsize} color="black" style={styles.icon}/> 
          : passwordStrength == PasswordStrength.Medium ? (
            <Ionicon name="warning-outline" color="#f1c40f" size={iconsize} style={styles.icon}/>
          ) : passwordStrength == PasswordStrength.Strong ? (
            <FeatherIcon name="check-circle" color="green" size={iconsize} style={styles.icon}/>
          ) : (
            <FeatherIcon name="x-circle" color="red" size={iconsize} style={styles.icon}/>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
          />
        </View>
        <View style={styles.twoSectionContainer}>
          { phoneNumber.length < 1 ?
              <FontAwesomeIcon name="phone" size={iconsize} color="black" style={styles.icon}/>
            : phoneVerify ? (
              <FeatherIcon name="check-circle" color="green" size={iconsize} style={styles.icon}/>
            ) : (
              <FeatherIcon name="x-circle" color="red" size={iconsize} style={styles.icon}/>
            )
          }
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={onPhoneChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.threeSectionContainer}>
          <FontAwesomeIcon name="id-card-o" size={iconsize} color="black" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="DNI"
            value={DNI}
            onChangeText={setDNI}
          />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <View style={styles.twoButtonsContainer}>
          <TouchableOpacity 
            style={{...styles.button, backgroundColor: 'gray'}} 
            onPress={() => setCurrentComponent(AuthComponent.Login)}>
            <Text style={styles.buttonText}>
              { AuthComponent.Login }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.button, backgroundColor: 'green'}} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


export default Register;
