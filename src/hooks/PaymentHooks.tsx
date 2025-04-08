// React
import { useState } from 'react';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Utils
// import { BACKEND_URL } from '@env';
const BACKEND_URL = 'http://192.168.1.103:5000';


// Interfaces
import { CreditCard } from '../types/interfaces';

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

interface PaymentResponse {
    success: boolean;
    message: string;
    data?: any;
}

const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<PaymentResponse | null>(null);

    const processPayment = async (creditCard: CreditCard, amount: number | string) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const userId = await AsyncStorage.getItem('userId'); 
            if (!userId) {
                throw new Error('No se encontró el ID del usuario.');
            }

            const apiResponse = await axios.post(
                `${BACKEND_URL}/api/transaction/payment`,
                {
                    userId: userId,
                    creditCardNumber: creditCard.number,
                    creditCardHolder: creditCard.name,
                    expirationDate: creditCard.expiry,
                    cvc: creditCard.cvc,
                    amount: amount,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (apiResponse.data.transaction) {
                const successResponse: PaymentResponse = {
                    success: true,
                    message: 'Payment processed successfully',
                    data: apiResponse.data,
                };
                setResponse(successResponse);
                return successResponse; 
            } else {
                const errorResponse: PaymentResponse = {
                    success: false,
                    message: apiResponse.data.message || 'Payment failed',
                };
                setResponse(errorResponse);
                return errorResponse; 
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred while processing the payment';
            setError(errorMessage);
            const errorResponse: PaymentResponse = {
                success: false,
                message: errorMessage,
            };
            setResponse(errorResponse); 
            return errorResponse;
        } finally {
            setLoading(false);
        }
    };

    const processReturn = async (transactionId: string, cardData: CreditCard ) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const userId = await AsyncStorage.getItem('userId'); 
            if (!userId) {
                throw new Error('No se encontró el ID del usuario.');
            }

            const apiResponse = await axios.post(
                `${BACKEND_URL}/api/transaction/return/${transactionId}`,	
                {
                    userId: userId,
                    creditCardNumber: cardData.number,
                    creditCardHolder: cardData.name,
                    expirationDate: cardData.expiry,
                    cvc: cardData.cvc,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (apiResponse.data.transaction) {
                const successResponse: PaymentResponse = {
                    success: true,
                    message: 'Payment returned successfully',
                    data: apiResponse.data,
                };
                setResponse(successResponse);
                return successResponse; 
            } else {
                const errorResponse: PaymentResponse = {
                    success: false,
                    message: apiResponse.data.message || 'Payment return failed',
                };
                setResponse(errorResponse);
                return errorResponse; 
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred while processing the payment return';
            setError(errorMessage);
            const errorResponse: PaymentResponse = {
                success: false,
                message: errorMessage,
            };
            setResponse(errorResponse); 
            return errorResponse;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, response, processPayment, processReturn };
};

export default usePayment;