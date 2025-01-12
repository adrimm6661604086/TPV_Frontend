// React
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

// Libraries
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

// Navigation
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList, RootStackParamList } from '../../types/navigationTypes';

// Components
import DialpadPinPad from '../../components/payment/DialpadPinPad';

// Hooks
import usePayment from '../../hooks/PaymentHooks';

// Utils
import theme from '../../utils/theme';
import { defaultStyles } from '../styles';

// Types
import { CreditCard } from '../../types/interfaces';

const { width } = Dimensions.get('window');

const pinPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0, 'confirm'];
const pinPadSize = width * 0.2;
const pinPadTextSize = pinPadSize * 0.4;

type PinScreenNavigationProp = NativeStackNavigationProp<PaymentStackParamList, 'PaymentPin'>;

interface PINScreenProps {
  cardData: CreditCard;
  amount: number | string;
}

const PINScreen: React.FC<PINScreenProps> = ({ cardData, amount }) => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();
  const [pin, setPin] = useState<string>('');
  const [verification, setVerification] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const paymentHook = usePayment();

  const handlePayment = async () => {
    try {
      setVerification('processing');
      await paymentHook.processPayment(cardData, amount);
      
      if (paymentHook.response?.success) {
        setVerification('success');
        console.log('Payment successful');
      } else if (paymentHook.response?.success!) {
        setVerification('error');
        console.error('Payment failed:', paymentHook.response?.message || paymentHook.error);
      }
    } catch (error) {
      setVerification('error');
      console.error('Payment failed:', error);
    }
  };

  
  useEffect(() => {
    if (verification === 'success') {
      const timer = setTimeout(() => {
        navigator.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }, 3000); 
      return () => clearTimeout(timer);
    } else if (verification === 'error') {
      const timer = setTimeout(() => {
        setVerification('idle'); // Reset state after showing error animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verification]);

  return (
    <SafeAreaView style={styles.container}>
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
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigator.goBack()}
            style={defaultStyles.arrowBack}
          >
            <Ionicons name="arrow-back" size={32} color={theme.palette.primary.main} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.pinText}>Enter PIN</Text>
            <Text style={styles.pinSubText}>Please enter your 4-digit PIN</Text>
            <Text style={styles.pinDisplay}>
              {'●'.repeat(pin.length).padEnd(4, '○')}
            </Text>
            <DialpadPinPad
              dialPadContent={pinPadContent}
              dialPadSize={pinPadSize}
              dialPadTextSize={pinPadTextSize}
              cardPin={cardData.pin}
              pin={pin}
              setPin={setPin}
              setShowAnimation={(status) => {
                if (status === 'success') {
                  handlePayment();
                } else {
                  setVerification('error'); 
                }
              }}
            />
          </View>
        </>  
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.light,
    paddingHorizontal: 10,
  },
  textContainer: {
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 24,
    fontWeight: 'medium',
    color: theme.palette.text.secondary,
  },
  pinSubText: {
    fontSize: 16,
    fontWeight: 'medium',
    color: theme.palette.text.secondary,
  },
  pinDisplay: {
    width: 200,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: theme.palette.primary.dark,
    padding: 10,
    marginVertical: 30,
  },
  animation: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PINScreen;
