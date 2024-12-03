import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';

// Libraries
import CurrencyInput from 'react-native-currency-input';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

// Utils
import theme from '../../utils/theme';

const PaymentScreen: React.FC  = () => {
  const navigator = useNavigation();
  const [amount, setAmount] = useState<number | null>(null);

  const handlePayment = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }
    Alert.alert('Payment', `Starting payment transaction: ${amount} $`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.arrowBack}
        onPress={() => navigator.goBack()}>
        <FeatherIcon name="arrow-left" size={32} color="#4CAF50" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Amount to Pay</Text>
      <CurrencyInput 
        style={styles.input}
        placeholder="Amount"
        value={amount}
        minValue={0}
        onChangeValue={setAmount}
        prefix="$"
        delimiter=","
        separator="."
        precision={2}
      />
      <Button title="Start Payment" onPress={handlePayment} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: theme.palette.primary.main,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  arrowBack: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
});

export default PaymentScreen;