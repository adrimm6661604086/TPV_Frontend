// React
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Libraries
import { useNavigation } from '@react-navigation/native';
import NfcManager, { NfcEvents, NfcTech, Ndef } from 'react-native-nfc-manager';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList } from '../../types/navigationTypes';

// Utils
import theme from '../../utils/theme';
import { defaultStyles } from '../styles';

// Types
import { CreditCard } from '../../types/interfaces';

// Initialize NFC Manager
NfcManager.start();

interface CardReaderScreenProps {
  amount: number;
}
  
type CardReaderScreenNavigationProp = NativeStackNavigationProp<PaymentStackParamList,'PaymentReader'>;
  
const CardReaderScreen: React.FC<CardReaderScreenProps> = ({amount}) => {
  const navigator = useNavigation<CardReaderScreenNavigationProp>();
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [cardData, setCardData] = useState<CreditCard | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const checkNfc = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setNfcEnabled(await NfcManager.isEnabled());
        readNdef();
      } 
    };

    checkNfc();
  }, []);

  interface ParsedResult {
    PAN?: string;
    Name?: string;
    Expiration?: string;
    CVC?: string;
    PIN?: string;
    AID?: string;
  }

  function parseBytes(byteSequence: Uint8Array): ParsedResult {
    let data = String.fromCharCode(...new Uint8Array(byteSequence));

    let lines = data.split('\n');
    
    let result: ParsedResult = {};

    lines.forEach(line => {
        if (line.startsWith('PAN:')) {
            result['PAN'] = line.split(': ')[1];
        } else if (line.startsWith('Name:')) {
            result['Name'] = line.split(': ')[1];
        } else if (line.startsWith('Expiration:')) {
            result['Expiration'] = line.split(': ')[1];
        } else if (line.startsWith('CVC:')) {
            result['CVC'] = line.split(': ')[1];
        } else if (line.startsWith('PIN:')) {
            result['PIN'] = line.split(': ')[1];
        } else if (line.startsWith('AID:')) {
            result['AID'] = line.split(': ')[1];
        }
    });

    return result;
}

  const readNdef = async () => {
    try {
        setIsReading(true);
        setCardData(null);

        await NfcManager.requestTechnology(NfcTech.Ndef);

        const tag = await NfcManager.getTag();

        if (tag && tag.ndefMessage) {
            const payload = Uint8Array.from(tag.ndefMessage[0].payload);
            const decodedJson = parseBytes(payload);

            // console.log(decodedJson);

            const cardData: CreditCard = {
                number: decodedJson['PAN'] || '', 
                expiry: decodedJson['Expiration'] || '', 
                cvc: decodedJson['CVC'] || '', 
                name: decodedJson['Name'] || '', 
                pin: decodedJson['PIN'] || '', 
                AID: decodedJson['AID'] || '', 
            };

            setCardData(cardData); 
        }
    } catch (error) {
        console.error("Error reading NFC:", error);
        Alert.alert("Error", "Failed to read NFC tag. Please try again.");
    } finally {
        setIsReading(false);
        NfcManager.cancelTechnologyRequest();
    }
};

  useEffect(() => {
    if (cardData !== undefined && cardData !== null) {      
      navigator.navigate("PaymentPin", { cardData: cardData, amount: amount });
    }
  }, [cardData]);

  if (!nfcEnabled) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>NFC is not enabled</Text>
        <TouchableOpacity onPress={() => NfcManager.goToNfcSetting()}>
          <MaterialCommunityIcon name="nfc" size={100} color={theme.palette.primary.light} />
        </TouchableOpacity>
      </View>
    );
  } 

  return (
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
      <View style={styles.cardContainer}>
        <MaterialCommunityIcon 
          name="credit-card-wireless-outline" 
          size={128} 
          color={theme.palette.primary.main} 
          style={styles.nfcIcon} 
        />
        <Text style={styles.amountText}>{amount.toFixed(2)} $</Text>
        <Text style={styles.subtitle}>Acerque su tarjeta o dispositivo</Text>
        {cardData && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Card Data</Text>
            <Text style={styles.resultData}>Number: {cardData.number}</Text>
            <Text style={styles.resultData}>Expiry: {cardData.expiry}</Text>
            <Text style={styles.resultData}>CVC: {cardData.cvc}</Text>
            <Text style={styles.resultData}>Name: {cardData.name}</Text>
            <Text style={styles.resultData}>PIN: {cardData.pin}</Text>
            <Text style={styles.resultData}>AID: {cardData.AID}</Text>
          </View>
        )}
      </View>
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
  title: {
    fontSize: 24,
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
  cardInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  nfcIcon: {  
    borderRadius: 200,
    padding: 20,
    borderWidth: 4,
    borderColor:theme.palette.primary.main,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultData: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default CardReaderScreen;

// return (
//   <View style={styles.container}>
//     
   
//     {
//       nfcEnabled && !nfcTag ? ( // leyendo tarjeta, no encontrada = leyendo
//         <>
//           <MaterialCommunityIcon 
//           name='credit-card-wireless-outline' 
//           size={128} 
//           color={theme.palette.default.main}
//           style={{ 
//             ...styles.nfcIcon,
//             borderColor: theme.palette.default.main,
//           }}/>
//           <Text 
//             style={{
//               ...styles.text,
//               color: theme.palette.default.main,
//             }}
//           >
//             Hold the Credit Card close to the device
//           </Text>
//         </>
//       ) : !nfcEnabled && !nfcTag ? ( // no leyendo tarjeta, no encontrada = fallo de lectura
//         <>
//           <MaterialCommunityIcon
//             name='credit-card-remove-outline'
//             size={128}
//             color={theme.palette.error.main}
//             style={{ 
//               ...styles.nfcIcon,
//               borderColor: theme.palette.error.main,
//             }}
//           />
//           <Text 
//             style={{
//               ...styles.text,
//               color: theme.palette.error.main,
//             }}
//           >
//             Error reading the credit card
//           </Text>
//         </>
        
//       ) : !nfcEnabled && nfcTag ? ( // no leyendo tarjeta, encontrada = tarjeta encontrada
//         <>
//           <MaterialCommunityIcon
//           name='credit-card-check-outline'
//           size={128}
//           color={theme.palette.primary.main}
//           style={{ 
//             ...styles.nfcIcon,
//             borderColor: theme.palette.primary.main,
//           }}
//           />
//           <Text 
//             style={{
//               ...styles.text,
//               color: theme.palette.primary.main,
//             }}
//           >
//             Credit Card Confirmed
//           </Text>
//         </>
//       ) : (<Text style={{
//         ...styles.text, color:theme.palette.error.main
//       }}>NFC ERROR</Text>)
//     }
//     {/* <Text style={styles.title}>Card Reader</Text>
//     }
//     {/* {cardInfo && (
//       <View style={styles.cardInfo}>
//         <Text>Card Number: {cardInfo.cardNumber}</Text>
//         <Text>Card Holder: {cardInfo.cardHolder}</Text>
//         <Text>Expiry Date: {cardInfo.expiryDate}</Text>
//         <Text> {amount} </Text>
//       </View>
//     )} */}
//   </View>
// );