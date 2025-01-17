import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import CardReader from '../../components/payment/CardReader';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList } from '../../types/navigationTypes';

// Utils
import theme from '../../utils/theme';
import { defaultStyles } from '../styles';

// Types
import { CreditCard } from '../../types/interfaces';

interface CardReaderScreenProps {
  transactionId: string | null;
  amount: number;
  actionType: 'payment' | 'return'; 
}

type CardReaderScreenNavigationProp = NativeStackNavigationProp<PaymentStackParamList, 'PaymentReader'>;

const CardReaderScreen: React.FC<CardReaderScreenProps> = ({ transactionId, amount, actionType }) => {
  const navigator = useNavigation<CardReaderScreenNavigationProp>();

  const handleCardRead = (cardData: CreditCard) => {
    if (actionType === 'payment') {
      navigator.navigate(
        'PaymentPin', 
        { 
          cardData, 
          amount, 
        }
      );
    } else {
      navigator.navigate(
        'PaymentVerification', 
        { 
          creditCard: cardData, 
          amount, 
          transactionId
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigator.goBack()} style={defaultStyles.closeIcon}>
        <MaterialCommunityIcon name="close" size={32} color={theme.palette.primary.main} />
      </TouchableOpacity>
      <CardReader onCardRead={handleCardRead} amount={amount}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.light,
    padding: 20,
  },
});

export default CardReaderScreen;
