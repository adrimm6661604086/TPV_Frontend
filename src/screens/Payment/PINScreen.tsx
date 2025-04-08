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
import PinPad from '../../components/payment/PinPad';

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
  const navigator = useNavigation<PinScreenNavigationProp>();
  const [pin, setPin] = useState<string>('');
  const [check, setCheck] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (check === true) {
      navigator.navigate('PaymentVerification', { 
        creditCard: cardData, 
        amount: Number(amount),
        transactionId: null,
        check: true,
      });
    } else if (check === false) {
      navigator.navigate('PaymentVerification', {
        creditCard: cardData,
        amount: Number(amount),
        transactionId: null,
        check: false,
      });
    }
  }, [check]);

  return (
    <SafeAreaView style={styles.container}>
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
        <PinPad
          dialPadContent={pinPadContent}
          dialPadSize={pinPadSize}
          dialPadTextSize={pinPadTextSize}
          cardPin={cardData.pin}
          pin={pin}
          setPin={setPin}
          handleOnConfirm={(status) => {
            if (status === 'success') {
              setCheck(true);
            } else {
              setCheck(false);
            }
          }}
        />
      </View>
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
