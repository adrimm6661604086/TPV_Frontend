// React
import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';


// Navigation
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList } from '../../types/navigationTypes';

// Libraries
import LottieView from 'lottie-react-native';

// Hooks
import usePayment from '../../hooks/PaymentHooks';

// Interfaces
import { CreditCard } from '../../types/interfaces';

// Utils
import theme from '../../utils/theme';

interface PaymentVerificationProps {
    creditCard: CreditCard;
    amount: number;
    transactionId: string | null;
    actionType: 'payment' | 'return';
}

type VerificationScreenNavigationProp = NativeStackNavigationProp<PaymentStackParamList, 'PaymentVerification'>;

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ creditCard, amount, transactionId, actionType }) => {
    const navigator = useNavigation<VerificationScreenNavigationProp>();
    const [verification, setVerification] = useState<'processing' | 'success' | 'error' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); 

    const paymentHook = usePayment();

    const handlePayment = async () => {
      if (isProcessing) return;
  
      try {
          setIsProcessing(true);
  
          const paymentResponse = await paymentHook.processPayment(creditCard, amount); 
          if (paymentResponse.success) {
              setVerification('success');
              console.log('Payment successful');
          } else {
              setVerification('error');
              console.error('Payment failed:', paymentResponse.message);
          }
      } catch (error) {
          setVerification('error');
          console.error('Payment failed:', error);
      } finally {
          setIsProcessing(false);
      }
    };

    const handleReturn = async () => {
      if (isProcessing) return;
  
      if (transactionId === null) {
          console.error('Transaction ID is required for return');
          return;
      } else {
        try {
          setIsProcessing(true);
    
          const returnResponse = await paymentHook.processReturn(transactionId, creditCard); 
          if (returnResponse.success) {
            setVerification('success');
            console.log('Return successful');
          } else {
            setVerification('error');
            console.error('Return failed:', returnResponse.message);
          }
        } catch (error) {
          setVerification('error');
          console.error('Return failed:', error);
        } finally {
          setIsProcessing(false);
        };
      }
  };

    useEffect(() => {
        if (actionType === 'payment' && transactionId === null) {
          handlePayment();
        } else if (actionType === 'return' && transactionId !== null) {
          handleReturn();
        }
    }, []);
    
    useEffect(() => {
      if (verification === 'success' || verification === 'error') {
        const timer = setTimeout(() => {
          setVerification(null); // Restablecer el estado de verification
          setIsProcessing(false); // Restablecer el estado de isProcessing
          navigator.reset({
            index: 0,
            routes: [{ name: 'MainScreen' }],
          });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [verification]);

    return (
        <View style={styles.container}>
            {verification === 'processing' ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.palette.primary.main} />
              <Text style={styles.pinText}>Processing Payment...</Text>
            </View>
          ) : verification === 'success' || verification === 'error' ? (
            <>
              <LottieView
                source={
                  verification === 'success'
                    ? require('../../assets/animations/success.json')
                    : require('../../assets/animations/error.json')
                }
                autoPlay
                loop={false}
                style={styles.animation}
              />
              <Text
                style={[
                  styles.pinText,
                  {
                    color:
                      verification === 'success'
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  },
                ]}
              >
                {verification === 'success' ? 
                  ( paymentHook.response?.success ? 'Payment Successful' : 'Payment Failed') 
                  : 'Pin Incorrect'}
              </Text>
            </>
          ) : null
        }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.light,
    },
    loadingContainer: {
        alignItems: 'center',
    },
    pinText: {
        fontSize: 20,
        marginTop: 20,
    },
    animation: {
        width: Dimensions.get('window').width / 1.5,
        height: Dimensions.get('window').width / 1.5,
    },
});

export default PaymentVerification;