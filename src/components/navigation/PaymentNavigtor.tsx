// React
import React from 'react';

// Libraries
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import PaymentScreen from '../../screens/Payment/PaymentScreen';
import CardReaderScreen from '../../screens/Payment/CardReaderScreen';
import PINScreen from '../../screens/Payment/PINScreen';

const PaymentStack = createNativeStackNavigator();

const PaymentNavigator: React.FC = () => {  
    return (
        <PaymentStack.Navigator>
            <PaymentStack.Screen 
                name="Payment" 
                component={PaymentScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="Payment-Reader" 
                component={CardReaderScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="Payment-Pin" 
                component={PINScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="Payment-Confirmed" 
                component={PINScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="Payment-Refused" 
                component={PINScreen} 
                options={{ headerShown: false }}
            />                        

        </PaymentStack.Navigator>
    )
};

export default PaymentNavigator;