// React
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Libraries
import { useNavigation } from '@react-navigation/native';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils
import { iconSize, NFCSize } from '../../utils';
import theme from '../../utils/theme';
import { defaultStyles } from '../styles';

// Initialize NFC Manager
NfcManager.start();


interface CardReaderScreenProps {
  amount: number;
}

const CardReaderScreen: React.FC<CardReaderScreenProps> = ({amount}) => {
  interface CardInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
  }

  const navigator = useNavigation();
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [nfcTag, setNfcTag] = useState<number | null>(null);

  // const handleReadCard = () => {
  //   const dummyCardInfo = {
  //     cardNumber: '1234 5678 9012 3456',
  //     cardHolder: 'John Doe',
  //     expiryDate: '12/24',
  //   };
  //   setCardInfo(dummyCardInfo);
  //   Alert.alert('Card Read', `Card Number: ${dummyCardInfo.cardNumber}`);
  // };

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  useEffect(() => {
    // (async () => {
    //   const enabled = await NfcManager.isEnabled();
    //   setNfcEnabled(enabled);
    //   await readNdef();
    // })();
    setNfcTag(null);
    setNfcEnabled(true);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={defaultStyles.closeIcon}
      >
         <MaterialCommunityIcon 
          name='close' 
          size={iconSize} 
          color={theme.palette.primary.main}
        />
      </TouchableOpacity>
     
      {
        nfcEnabled && !nfcTag ? ( // leyendo tarjeta, no encontrada = leyendo
          <>
            <MaterialCommunityIcon 
            name='credit-card-wireless-outline' 
            size={NFCSize} 
            color={theme.palette.default.main}
            style={{ 
              ...styles.nfcIcon,
              borderColor: theme.palette.default.main,
            }}/>
            <Text 
              style={{
                ...styles.text,
                color: theme.palette.default.main,
              }}
            >
              Hold the Credit Card close to the device
            </Text>
          </>
        ) : !nfcEnabled && !nfcTag ? ( // no leyendo tarjeta, no encontrada = fallo de lectura
          <>
            <MaterialCommunityIcon
              name='credit-card-remove-outline'
              size={NFCSize}
              color={theme.palette.error.main}
              style={{ 
                ...styles.nfcIcon,
                borderColor: theme.palette.error.main,
              }}
            />
            <Text 
              style={{
                ...styles.text,
                color: theme.palette.error.main,
              }}
            >
              Error reading the credit card
            </Text>
          </>
          
        ) : !nfcEnabled && nfcTag ? ( // no leyendo tarjeta, encontrada = tarjeta encontrada
          <>
            <MaterialCommunityIcon
            name='credit-card-check-outline'
            size={NFCSize}
            color={theme.palette.primary.main}
            style={{ 
              ...styles.nfcIcon,
              borderColor: theme.palette.primary.main,
            }}
            />
            <Text 
              style={{
                ...styles.text,
                color: theme.palette.primary.main,
              }}
            >
              Credit Card Confirmed
            </Text>
          </>
        ) : (<Text style={{
          ...styles.text, color:theme.palette.error.main
        }}>NFC ERROR</Text>)
      }
      {/* <Text style={styles.title}>Card Reader</Text>
      }
      {/* {cardInfo && (
        <View style={styles.cardInfo}>
          <Text>Card Number: {cardInfo.cardNumber}</Text>
          <Text>Card Holder: {cardInfo.cardHolder}</Text>
          <Text>Expiry Date: {cardInfo.expiryDate}</Text>
          <Text> {amount} </Text>
        </View>
      )} */}
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