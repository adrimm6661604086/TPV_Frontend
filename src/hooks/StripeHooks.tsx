// React
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import stripePackage from 'stripe';

// Utils
import { BACKEND_URL, STRIPE_PUBLIC_KEY } from '@env';
  
type CardDetails = {
    number: string;
    expMonth: string;
    expYear: string;
    cvc: string;
};

const useStripePay = () => {
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [stripe, setStripe] = useState<any>(null);

    useEffect(() => {
        const fetchPrivateKey = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/stripe/private-key`, {
                    headers: {
                        'Stripe-Public-Key': STRIPE_PUBLIC_KEY
                    }
                });
                if (response.data && response.data.privateKey) {
                    setPrivateKey(privateKey);
                } else {
                    Alert.alert('Error', 'No se pudo recuperar la clave privada de Stripe');
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un problema al recuperar la clave privada de Stripe');
            }
        };

        fetchPrivateKey();
        if (privateKey) {
            setStripe(new stripePackage(privateKey));
        }
    }, []);

    const tokenCard = async (cardData : CardDetails) => {
        if (!cardData) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
          }
        
          try {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
        
            // Validar si la tarjeta está expirada
            if (
              parseInt(cardData.expYear) < currentYear ||
              (parseInt(cardData.expYear) === currentYear && parseInt(cardData.expMonth) < currentMonth)
            ) {
              Alert.alert('Error', 'La tarjeta está expirada');
              return;
            }
        
            // Crear el token con Stripe
            const {token, error} = await stripe.tokens.create({
                card: cardData
              });
        
            if (error) {
              Alert.alert('Error', error.message || 'Error al tokenizar la tarjeta');
              return;
            }
        
            return token.id;

            // Crear un PaymentMethod usando los datos de la tarjeta
            // const paymentMethod = await stripe.paymentMethods.create({
            //     type: 'card',
            //     card: {
            //     number: cardData.number,
            //     exp_month: cardData.exp_month,
            //     exp_year: cardData.exp_year,
            //     cvc: cardData.cvc,
            //     },
            // });
        
            // // Crear un PaymentIntent
            // const paymentIntent = await stripe.paymentIntents.create({
            //     amount: amount, // Monto en centavos
            //     currency: currency,
            //     payment_method: paymentMethod.id,
            //     confirm: true, // Confirmar el pago inmediatamente
            // });
        
            // return ({
            //     paymentIntentId: paymentIntent.id,
            //     clientSecret: paymentIntent.client_secret,
            // }); 
        } catch (error) {
            console.error('Error during payment:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const payStripe = async (token: string, amount: number, currency: string) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/stripe/pay`, {
                token,
                amount,
                currency
            });
            if (response.data && response.data.success) {
                Alert.alert('Success', 'Payment successful');
            } else {
                Alert.alert('Error', 'Payment failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    return { tokenCard, payStripe };
}

export default useStripePay;