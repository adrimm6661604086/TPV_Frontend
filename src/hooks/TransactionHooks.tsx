// React
import { useState, useEffect, useCallback } from 'react';

// Libraries
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utils
import { BACKEND_URL } from '@env';
import { Transaction } from '../types/interfaces';

axios.interceptors.request.use((request) => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error', error);
    return Promise.reject(error);
  }
);

const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true); 
        setError(null); 
    
        try {
          const userId = await AsyncStorage.getItem('userId'); 
          if (!userId) {
            throw new Error('No se encontró el ID del usuario.');
          }
          
          const response = await axios.get(`${BACKEND_URL}/api/transaction/${userId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          console.log(`Transactions received for user ${userId}`);
          setTransactions(response.data.transactions); 
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data.message || 'Error en la respuesta del servidor');
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false); 
        }
      }, []); 

    const getBalanceOfLastWeek = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const balance = transactions.reduce((acc, transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            if (transactionDate >= oneWeekAgo) {
                const amount = parseFloat(transaction.amount);
                if (transaction.transactionType === 'PAYMENT') {
                    return acc + amount;
                } else if (transaction.transactionType === 'RETURN') {
                    return acc - amount;
                }
            }
            return acc;
        }, 0);
    
        return balance;
    };

    const getBalanceOfToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00.000
    
        const balance = transactions.reduce((acc, transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            transactionDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00.000
    
            if (transactionDate.getTime() === today.getTime()) {
                const amount = parseFloat(transaction.amount);
                if (transaction.transactionType === 'PAYMENT') {
                    return acc + amount;
                } else if (transaction.transactionType === 'RETURN') {
                    return acc - amount;
                }
            }
            return acc;
        }, 0);
    
        return balance;
    };

    useEffect(() => {
        fetchTransactions();
      }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        getBalanceOfLastWeek,
        getBalanceOfToday, 
        fetchTransactions
    };
};

export default useTransactions;