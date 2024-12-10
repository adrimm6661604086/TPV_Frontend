// React
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axios
import axios from 'axios';
import { BACKEND_URL } from '@env';

// Interface
import { User } from '../types/interfaces';

export const useRegister = (setCurrentComponent: (component: any) => void) => {
  const registerUser = async (formData: any) => {
    const {
      name, lastName, email, password, phoneNumber, DNI, postalCode,
      address, city, country, IBAN, bankEntity,
    } = formData;

    if (!name || !lastName || !email || !password || !phoneNumber || !DNI || !postalCode ||
        !address || !city || !country || !IBAN || !bankEntity) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/register-user`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        setCurrentComponent('Login'); // Cambiar a tu componente de Login
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return { registerUser };
};

export const useLogin = (setIsAuthenticated: (value: boolean) => void) => {
    const loginUser = async (email: string, password: string) => {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }
  
      const userData = { email, password };
  
      try {
        const response = await axios.post(`${BACKEND_URL}/api/user/login-user`, userData);
        if (response.data.status === 200) {
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
          setIsAuthenticated(true);
        } else {
          Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    };
  
    return { loginUser };
};

export const useVerifyAuth = (setIsAuthenticated: (value: boolean) => void) => {
    useEffect(() => {
      const checkAuthentication = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
  
        try {
          const response = await axios.get(`${BACKEND_URL}/api/users/verify-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error: any) {
          console.error('Error verifying authentication:', error.response?.data || error.message);
          setIsAuthenticated(false);
        }
      };
  
      checkAuthentication();
    }, []);
};

export const useUser = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/user/${userId}`)
            .then((response) => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response.data);
                setLoading(false);
            });
    }, [userId]);

    return { user, loading, error };
};

export const useUserBankAccount = (userId: string) => {
    const [bankData, setBankData] = useState<any | null>(null);
    const [loadingBankData, setLoading] = useState<boolean>(true);
    const [errorBankData, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/account/${userId}`)
            .then((response) => {
                setBankData(response.data.bankData);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response.data);
                setLoading(false);
            });
    }, [userId]);

    return { bankData, loadingBankData, errorBankData };
};
