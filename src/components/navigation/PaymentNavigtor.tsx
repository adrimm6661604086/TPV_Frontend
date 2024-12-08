// React
import React from 'react';

// Libraries
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import PaymentScreen from '../../screens/Payment/PaymentScreen';
import CardReaderScreen from '../../screens/Payment/CardReaderScreen';
import PINScreen from '../../screens/Payment/PINScreen';
import NumberPadScreen from '../../screens/Payment/NumberPadScreen';

type PaymentStackParamList = {
    "Payment": undefined;
    "Payment-Reader": { amount: number };
    "Payment-Pin": undefined;
    "Payment-Confirmed": undefined;
    "Payment-Refused": undefined;
};

const PaymentStack = createNativeStackNavigator<PaymentStackParamList>();

const PaymentNavigator: React.FC = () => {  
    return (
        <PaymentStack.Navigator>
            <PaymentStack.Screen 
                name="Payment" 
                component={NumberPadScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="Payment-Reader" 
                options={{ headerShown: false }}
            >
                {props => {
                    const { route } = props;
                    const amount = route.params?.amount;
                    return <CardReaderScreen {...props} amount={amount} />;
                }}
            </PaymentStack.Screen>
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