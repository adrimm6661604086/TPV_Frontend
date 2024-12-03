// React
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const CardReaderScreen: React.FC  = () => {
  interface CardInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
  }

  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  const handleReadCard = () => {
    const dummyCardInfo = {
      cardNumber: '1234 5678 9012 3456',
      cardHolder: 'John Doe',
      expiryDate: '12/24',
    };
    setCardInfo(dummyCardInfo);
    Alert.alert('Card Read', `Card Number: ${dummyCardInfo.cardNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read Card Information</Text>
      <Button title="Read Card" onPress={handleReadCard} />
      {cardInfo && (
        <View style={styles.cardInfo}>
          <Text>Card Number: {cardInfo.cardNumber}</Text>
          <Text>Card Holder: {cardInfo.cardHolder}</Text>
          <Text>Expiry Date: {cardInfo.expiryDate}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default CardReaderScreen;