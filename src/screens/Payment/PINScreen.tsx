// React
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PINScreen: React.FC = () => {
    const [pin, setPin] = useState('');

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