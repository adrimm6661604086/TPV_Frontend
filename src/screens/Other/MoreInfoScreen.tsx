import React from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity, Image} from 'react-native';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigationTypes';

// Libraries
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Utils
import { parseDate } from '../../utils/index';
import theme from '../../utils/theme';
import { Transaction } from '../../types/interfaces';
import {defaultStyles} from '../styles';

type MoreInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShowMore'>;

type MoreInfoScreenProps = {
  transactions : Transaction[];
}

const MoreInfoScreen: React.FC<MoreInfoScreenProps>= ({transactions}) => {
  const navigator = useNavigation<MoreInfoScreenNavigationProp>(); 
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null); 

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={{...defaultStyles.arrowBack, elevation: 10}}
      >
        <Ionicons name="arrow-back" size={32} color={theme.palette.primary.main} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container} 
        style={styles.scrollView}>
        {transactions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
            styles.movementItem,
            index === transactions.length - 1 ? { marginBottom: 30 } : {},
            selectedIndex === index ? { 
          backgroundColor: `${theme.palette.secondary.main}80`,
          borderRadius: 10,
          padding: 5,
          zIndex: 10,
          elevation: 10,
            } : {}, 
            ]}
            onLongPress={() => {
            if (item.transactionType === 'PAYMENT') {
          setSelectedIndex(selectedIndex === index ? null : index); 
            }
            }}
            >
            {item.transactionType === 'PAYMENT' ? (
          <MaterialCommunityIcons name="cash-fast" size={24} color="green" />
            ) : (
          <MaterialCommunityIcons name="cash-refund" size={24} color="red" />
            )}
            {
          item.CardOrg === 'Visa' ? (<Image source={require('../../assets/cards/visa.png')} style={styles.cardImage} />) : 
          item.CardOrg === 'MasterCard' ? (<Image source={require('../../assets/cards/master.png')} style={styles.cardImage} />) :
          item.CardOrg === 'AmericanExpress' ? (<Image source={require('../../assets/cards/amex.png')} style={styles.cardImage} />) : 
          (<Image source={require('../../assets/cards/generic.png')} style={styles.cardImage} />)

            }
            <Text style={styles.movementAmount}>{item.amount} $</Text>
            <Text style={styles.movementDate}>{parseDate(item.transactionDate)}</Text>
            <Text style={styles.cardInfo}>
                {item.CardOrg} - **** {item.last4Digits}
              </Text>
          </TouchableOpacity>
        ))}
          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 70, 
  },
  scrollView: {
    maxHeight: '90%', 
    marginTop: 60,
    borderRadius: 10,
    padding: 20, 
  },
  transaction: {
    marginBottom: 10,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: theme.palette.text.light,
    borderRadius: 10,
    marginBottom: 10, 
    shadowColor: theme.palette.text.primary,
    shadowOffset: { width: 5, height: 5 }, 
    shadowOpacity: 0.3,  
    shadowRadius: 8,   
  },
  movementAmount: {
    fontSize: 20,
  },
  movementDate: {
    fontSize: 20,
    color: theme.palette.text.secondary,
  },
  cardImage: {
    width: 32, 
    height: 20, 
    borderRadius: 5
  }, 
  cardInfo: {
    fontSize: 14,
    color: theme.palette.text.tertiary,
  },
});
  
export default MoreInfoScreen;