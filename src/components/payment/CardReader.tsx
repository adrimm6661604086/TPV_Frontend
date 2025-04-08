import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils
import theme from '../../utils/theme';

// Types
import { CreditCard, ParsedBytes } from '../../types/interfaces';

interface CardReaderProps {
  onCardRead: (cardData: CreditCard) => void;
  amount: number;
}

const CardReader: React.FC<CardReaderProps> = ({ onCardRead, amount }) => {
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const checkNfc = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        readNdef();
      }
    };

    checkNfc();
  }, []);

  const parseBytes = (byteSequence: Uint8Array): ParsedBytes => {
    let data = String.fromCharCode(...new Uint8Array(byteSequence));
    let lines = data.split('\n');
    let result: ParsedBytes = {};

    lines.forEach(line => {
      if (line.startsWith('PAN:')) result['PAN'] = line.split(': ')[1];
      else if (line.startsWith('Name:')) result['Name'] = line.split(': ')[1];
      else if (line.startsWith('Expiration:')) result['Expiration'] = line.split(': ')[1];
      else if (line.startsWith('CVC:')) result['CVC'] = line.split(': ')[1];
      else if (line.startsWith('PIN:')) result['PIN'] = line.split(': ')[1];
      else if (line.startsWith('AID:')) result['AID'] = line.split(': ')[1];
    });

    return result;
  };

  const readNdef = async () => {
    try {
      setIsReading(true);

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage) {
        const payload = Uint8Array.from(tag.ndefMessage[0].payload);
        const decodedJson = parseBytes(payload);

        const cardData: CreditCard = {
          number: decodedJson['PAN'] || '',
          expiry: decodedJson['Expiration'] || '',
          cvc: decodedJson['CVC'] || '',
          name: decodedJson['Name'] || '',
          pin: decodedJson['PIN'] || '',
          AID: decodedJson['AID'] || '',
        };

        onCardRead(cardData);
      }
    } catch (error) {
      console.error('Error reading NFC:', error);
      Alert.alert('Error', 'Failed to read NFC tag. Please try again.');
    } finally {
      setIsReading(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <MaterialCommunityIcon
        name="credit-card-wireless-outline"
        size={128}
        color={theme.palette.primary.main}
        style={styles.nfcIcon}
      />
      <Text style={styles.amountText}>{amount.toFixed(2)} $</Text>
      <Text style={styles.subtitle}>Acerque su tarjeta o dispositivo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  amountText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: theme.palette.primary.main,
    textAlign: 'center',
    marginTop: 10,
  },
  nfcIcon: {
    borderRadius: 200,
    padding: 20,
    borderWidth: 4,
    borderColor: theme.palette.primary.main,
    marginBottom: 20,
  },
});

export default CardReader;
