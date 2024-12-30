// React
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Stripe
import { StripeProvider } from '@stripe/stripe-react-native';

interface PINScreenProps {
    amount: number;
    creditCardNumber: string;
    creditCardHolder: string;
    expiryDate: string;
    cvc: string;
    PIN: string;
}

const PINScreen: React.FC = () => {
    const [pin, setPin] = useState('');
    const [publishableKey, setPublishableKey] = useState('');
    
    const fetchPublishableKey = async () => {
        // const key = await fetchKey(); // fetch key from your server here
        // setPublishableKey(key);
    };

    useEffect(() => {
        fetchPublishableKey();
    }, []);
    

    const handleNumberPress = (num: string) => {
        if (pin.length < 4) {
            setPin(pin + num);
        }
    };

    const handleDeletePress = () => {
        setPin(pin.slice(0, -1));
    };

    const handleSubmit = () => {
        console.log('PIN entered:', pin);
    };

    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier" // required for Apple Pay
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            >
        <View style={styles.container}>
            <Text style={styles.title}>Enter PIN</Text>
            <TextInput
                style={styles.pinInput}
                value={pin}
                secureTextEntry
                editable={false}
            />
            <View style={styles.keypad}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.key}
                        onPress={() => handleNumberPress(num)}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.key} onPress={handleDeletePress}>
                    <Text style={styles.keyText}>Del</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={handleSubmit}>
                    <Text style={styles.keyText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    </StripeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    pinInput: {
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 20,
        textAlign: 'center',
        width: '50%',
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    key: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#ddd',
        borderRadius: 30,
    },
    keyText: {
        fontSize: 24,
    },
});

export default PINScreen;