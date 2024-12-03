import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PaymentConfirmed: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>¡Pago Completado!</Text>
            <Image 
                source={{ uri: 'https://example.com/payment-confirmed.png' }} 
                style={styles.image} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default PaymentConfirmed;