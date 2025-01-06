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
      address, city, country, IBAN, bankEntity, accountType
    } = formData;

    if (!name || !lastName || !email || !password || !phoneNumber || !DNI || !postalCode ||
        !address || !city || !country || !IBAN || !bankEntity || !accountType) {
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
        setCurrentComponent('Login'); 
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
          await AsyncStorage.setItem('userId', response.data.user.id);
          await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
          await AsyncStorage.setItem('language', 'es');
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
          const response = await axios.get(`${BACKEND_URL}/api/user/verify-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setIsAuthenticated(false);
          Alert.alert('Error Verifying', 'An error occurred. Please try again later.');
        }
      };
  
      checkAuthentication();
    }, []);
};

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    setError('User ID not found in AsyncStorage');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`${BACKEND_URL}/api/user/${userId}`);
                setUser(response.data.user);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            } 
        }
        fetchUser();
    }, []);

    return { user, loading, error };
};

export const useUserBankAccount = () => {
    const [bankData, setBankData] = useState<any | null>(null);
    const [loadingBankData, setLoading] = useState<boolean>(true);
    const [errorBankData, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchBankData = async () => {
          setLoading(true);
          try {
              const userId = await AsyncStorage.getItem('userId');
              if (!userId) {
                  setError('User ID not found in AsyncStorage');
                  setLoading(false);
                  return;
              }
              const response = await axios.get(`${BACKEND_URL}/api/account/${userId}`);
              setBankData(response.data.bankData);
          } catch (error) {
              if (axios.isAxiosError(error) && error.response) {
                  setError(error.response.data);
              } else {
                  setError('An unknown error occurred');
              }
          } finally {
              setLoading(false);
          }
      }
      fetchBankData();
    }, []);

    return { bankData, loadingBankData, errorBankData };
};
