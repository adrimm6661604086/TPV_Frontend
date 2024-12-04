// React
import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// Libraries
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Utils
import { BACKEND_URL } from '@env';
import { AuthComponent } from '../../screens/User/UserAuthScreen';
import styles from './styles';

interface LoginProps {
  currentComponent: AuthComponent;
  setCurrentComponent: (component: AuthComponent) => void;
  setIsAuthenticated : (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ currentComponent, setCurrentComponent, setIsAuthenticated }) => {
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

    axios.post(`${BACKEND_URL}/api/user/login-user`, userData)
      .then((response) => {
        if (response.data.status === 200) {
          AsyncStorage.setItem('userToken', response.data.token);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Login</Text>
          <View style={styles.innerContainer}>
            <View style={styles.twoSectionContainer}>
              <FeatherIcon name="mail" size={24} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.twoSectionContainer}>
              <FeatherIcon name="lock" size={24} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.twoButtonsContainer}>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: 'gray' }}
              onPress={() => setCurrentComponent(AuthComponent.Register)}
            >
              <Text style={styles.buttonText}>
                {currentComponent === AuthComponent.Register ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: '#2196F3' }}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
