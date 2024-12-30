// React
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Libraries
import { useNavigation } from '@react-navigation/native';
import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList } from '../../types/navigationTypes';

// Utils
import theme from '../../utils/theme';
import { defaultStyles } from '../styles';
import { BACKEND_URL } from '@env';

// Initialize NFC Manager
NfcManager.start();

interface CardReaderScreenProps {
  amount: number;
}

type CardReaderScreenNavigationProp = NativeStackNavigationProp<
  PaymentStackParamList,
  'PaymentReader'
>;

const CardReaderScreen: React.FC<CardReaderScreenProps> = ({ amount }) => {
  const navigator = useNavigation<CardReaderScreenNavigationProp>();
  const [nfcData, setNfcData] = useState<TagEvent | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Comienza en modo lectura NFC

  useEffect(() => {
    // Iniciar lectura de NFC al montar el componente
    startNfcReading();
    
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const startNfcReading = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setNfcData(tag);
      Alert.alert('Credit Card Found', 'Proceeding to payment...');
      await fetchPaymentSheetParams(); // Fetch params y comienza pago
    } catch (error) {
      console.warn('NFC Reading Error:', error);
      Alert.alert('Error', 'Failed to read credit card. Try again.');
      setLoading(false);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  // Obtener parámetros para Payment Sheet
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/API/transaction/create-payment-stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          card: nfcData,
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      await initializePaymentSheet();
    } catch (error) {
      console.warn('Payment initialization error:', error);
      Alert.alert('Error', 'Failed to initialize payment. Try again.');
    }
  };

  // Inicializar Payment Sheet
  const initializePaymentSheet = async () => {
    if (!clientSecret) return;

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'TPV Virtual',
      allowsDelayedPaymentMethods: true,
    });

    if (error) {
      Alert.alert('Error initializing payment sheet', error.message);
    } else {
      openPaymentSheet();
    }
  };

  // Mostrar Payment Sheet
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Payment error: ${error.code}`, error.message);
    } else {
      Alert.alert('Payment successful', 'Thank you for your purchase!');
      // Almacenar la transferencia en el servidor
      await fetch(`${BACKEND_URL}/transaction/store-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentIntentId: clientSecret?.split('_secret')[0],
          
        }),
      });
    }
  };

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLIC_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="com.TPVVirtual.app" // required for 3D Secure and bank redirects
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigator.goBack()}
          style={defaultStyles.closeIcon}
        >
          <MaterialCommunityIcon 
            name='close' 
            size={32} 
            color={theme.palette.primary.main}
          />
        </TouchableOpacity>

        {
          loading && !nfcData ? (
            <>
              <MaterialCommunityIcon 
                name='credit-card-wireless-outline' 
                size={192} 
                color={theme.palette.default.main}
                style={{ ...styles.nfcIcon, borderColor: theme.palette.default.main }}
              />
              <Text style={{ ...styles.text, color: theme.palette.default.main }}>
                Hold the Credit Card close to the device
              </Text>
            </>
          ) : nfcData ? (
            <>
              <MaterialCommunityIcon
                name='credit-card-check-outline'
                size={192}
                color={theme.palette.primary.main}
                style={{ ...styles.nfcIcon, borderColor: theme.palette.primary.main }}
              />
              <Text style={{ ...styles.text, color: theme.palette.primary.main }}>
                Processing payment...
              </Text>
            </>
          ) : (
            <Text style={{ ...styles.text, color: theme.palette.error.main }}>
              NFC Reading Error
            </Text>
          )
        }
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  nfcIcon: {  
    borderRadius: 200,
    padding: 20,
    borderWidth: 3,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default CardReaderScreen;
