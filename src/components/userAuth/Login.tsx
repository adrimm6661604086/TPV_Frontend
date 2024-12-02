// React
import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// Libraries
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utils
import { BACKEND_URL } from '@env';
import { AuthComponent } from '../../screens/UserAuthScreen';


interface LoginProps {
  setCurrentComponent: (component: AuthComponent) => void;
  setIsAuthenticated : (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentComponent, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userData = {
      email : email,
      password : password,
    };

    axios.post(`${BACKEND_URL}/api/login-user`, userData)
      .then((response) => {
        if (response.data.success) {
          AsyncStorage.setItem('token', response.data.token);
          AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
          setIsAuthenticated(true);
        } else {
          Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
      }).catch((error) => {
        console.error('Error during login:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2196F3',
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

export default Login;
