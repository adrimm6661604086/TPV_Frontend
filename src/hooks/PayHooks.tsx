// React
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Axios
import axios from 'axios';
import { BACKEND_URL, STRIPE_PUBLIC_KEY } from '@env';


const usePay = () => {
    const storePayment = async (paymentIntentId : string , amount: number , description: string, metadata: any) => {
        if  (paymentIntentId === '' || amount === 0 || description === '') {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/transaction/store-payment`, {
                paymentIntentId,
                amount,
                description,
                metadata,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 201 || response.data.status === 200 ) {
                Alert.alert('Success', 'Payment successfully');
            }
        } catch (error) {
            console.error('Error during payment:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    }

    return { storePayment }
}