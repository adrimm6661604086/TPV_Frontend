// React
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Libraries
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes'; 

// Utils
import theme from '../utils/theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC  = () => {  
  const navigator = useNavigation<HomeScreenNavigationProp>();

  const startPayment = () => {
    navigator.navigate('Payment');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last week Balance</Text>
        <Text style={styles.balanceAmount}>1.234.567,89 $</Text>
        <Text style={styles.balanceChange}>(+2.273 $)</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.movementsHeader}>
          <Text style={styles.cardTitle}>Last movements</Text>
          <TouchableOpacity>
            <Text style={styles.showMore}>Show more ...</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {[
            { amount: '2400,00 $', date: '1/1/24 9:00' },
            { amount: '29,99 $', date: '2/2/24 10:00' },
            { amount: '12,99 $', date: '3/3/24 11:00' },
            { amount: '5,45 $', date: '4/4/24 12:00' },
            { amount: '6,32 $', date: '5/5/24 13:00' },
            { amount: '0,99 $', date: '5/5/24 10:30' },
            { amount: '8,92 $', date: '5/5/24 13:00' },
          ].map((item, index) => (
            <View key={index} style={styles.movementItem}>
              <Text style={styles.movementAmount}>{item.amount}</Text>
              <Text style={styles.movementDate}>{item.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={startPayment}>
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceChange: {
    fontSize: 18,
    color: 'green',
  },
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showMore: {
    fontSize: 16,
    color: theme.palette.primary.dark,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  movementAmount: {
    fontSize: 16,
  },
  movementDate: {
    fontSize: 16,
    color: theme.palette.text.secondary,
  },
  paymentButton: {
    backgroundColor: theme.palette.primary.main,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
