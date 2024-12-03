import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PaymentRefused: React.FC  = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>El pago ha sido rechazado</Text>
            <Image 
                source={require('../../assets/payment_refused.png')} 
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default PaymentRefused;