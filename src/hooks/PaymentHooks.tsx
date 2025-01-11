import { useState } from 'react';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Utils
import { BACKEND_URL } from '@env';

interface CreditCard {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
}

interface PaymentResponse {
    success: boolean;
    message: string;
    data?: any;
}

const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<PaymentResponse | null>(null);

    const processPayment = async (creditCard: CreditCard, amount: number | string, ) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const userId = await AsyncStorage.getItem('userId'); 
            if (!userId) {
                throw new Error('No se encontró el ID del usuario.');
            }

            const res = await axios.post(`${BACKEND_URL}/api/transaction/payment`, {
                userId: userId,
                creditCardNumber: creditCard.number,
                creditCardHolder: creditCard.name,
                expirationDate: creditCard.expiry,
                cvc: creditCard.cvc,
                amount: amount,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setResponse({ success: true, message: 'Payment processed successfully', data: res.data });
            } else {
                setResponse({ success: false, message: res.data.message || 'Payment failed' });
            }
        } catch (err) {
            setError('An error occurred while processing the payment');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, response, processPayment };
};

export default usePayment;