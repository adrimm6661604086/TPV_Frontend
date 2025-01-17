// React
import React from 'react';

// Libraries
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CardReaderScreen from '../../screens/Payment/CardReaderScreen';
import PINScreen from '../../screens/Payment/PINScreen';
import NumberPadScreen from '../../screens/Payment/NumberPadScreen';
import PaymentVerification from '../../screens/Payment/PaymentVerification';

// Types
import { PaymentStackParamList } from '../../types/navigationTypes';
import BottomTabNavigator from './BottomTabNavigator';

const PaymentStack = createNativeStackNavigator<PaymentStackParamList>();

const PaymentNavigator: React.FC = () => {  
    return (
        <PaymentStack.Navigator>
            <PaymentStack.Screen 
                name="PaymentSetter" 
                component={NumberPadScreen} 
                options={{ headerShown: false }}
            />
            <PaymentStack.Screen 
                name="PaymentReader" 
                options={{ headerShown: false }}
            >
                {props => {
                    const { route } = props;
                    const amount = route.params?.amount;
                    return <CardReaderScreen 
                        {...props}  
                        transactionId={null}                      
                        amount={amount} 
                        actionType="payment" 
                    />;
                }}
            </PaymentStack.Screen>
            <PaymentStack.Screen
                name="ReturnReader"
                options={{ headerShown: false }}
            >
                {props => {
                    const { route } = props;
                    const amount = route.params?.amount;
                    const transactionId = route.params?.transactionId;
                    return <CardReaderScreen 
                        {...props} 
                        transactionId={transactionId}
                        amount={amount} 
                        actionType="return" 
                    />;
                }}
            </PaymentStack.Screen>
            <PaymentStack.Screen 
                name="PaymentPin" 
                options={{ headerShown: false }}
            >
                {props => {
                        const { route } = props;
                        const cardData = route.params?.cardData;
                        const amount = route.params?.amount;
                        return <PINScreen {...props} cardData={cardData} amount={amount}/>;
                    }}   
            </PaymentStack.Screen>        
            <PaymentStack.Screen
                name="PaymentVerification"
                options={{ headerShown: false }}
            >         
                {props => {
                    const { route } = props;                    
                    const creditCard = route.params?.creditCard;
                    const amount = route.params?.amount;
                    const transactionId = route.params?.transactionId;
                    return <PaymentVerification {...props} 
                        creditCard={creditCard}  
                        amount={amount} 
                        transactionId={transactionId}
                        actionType={transactionId ? 'return' : 'payment'}
                    />;
                }}
            </PaymentStack.Screen>
            <PaymentStack.Screen 
                name="MainScreen" 
                component={BottomTabNavigator} 
                options={{ headerShown: false }}
            /> 
        </PaymentStack.Navigator>
    )
};

export default PaymentNavigator;