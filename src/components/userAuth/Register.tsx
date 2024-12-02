// React
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from 'react-native';

// Libraries
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Utils
import { BACKEND_URL } from '@env';
import { AuthComponent } from '../../screens/UserAuthScreen';


interface RegisterProps {
  setCurrentComponent: (component: AuthComponent) => void;
}

const Register: React.FC<RegisterProps> = ({ setCurrentComponent }) => {
  const navigator = useNavigation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [DNI, setDNI] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        .post(`${BACKEND_URL}/api/register-user`, userData)
        .then(response => {
          if (response.data.status) {
            
          } else {
            Alert.alert(JSON.stringify(response.data));
          }
        })
        .catch(e => console.log(e));

  };

  // function handleEmail(e) {
  //   const emailVar = e.nativeEvent.text;
  //   setEmail(emailVar);
  //   if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
  //     setEmail(emailVar);
  //     return true;
  //   }
  //   return false;
  // }

  // function handlePhone(e) {
  //   const phoneVar = e.nativeEvent.text;
  //   setPhoneNumber(phoneVar);
  //   if (/[6-9]{1}[0-9]{9}/.test(phoneVar)) {
  //     setPhoneNumber(phoneVar);
  //     return true;
  //   }
  //   return false;
  // }

  // function handlePassword(e) {
  //   const passwordVar = e.nativeEvent.text;
  //   setPassword(passwordVar);
  //   if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
  //     setPassword(passwordVar);
  //     return true;
  //   }
  //   return false;
  // }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.twofields}>
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={DNI}
          onChangeText={setDNI}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    paddingVertical: 50,
  },
  twofields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;
