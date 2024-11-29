import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="person" size={32} color="#4CAF50" />
        <Text style={styles.userName}>TPV Virtual</Text>
        <View style={styles.headerIcons}>
          <Icon name="mail-outline" size={24} color="#4CAF50" />
        </View>
      </View>

      {/* Balance Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last week Balance</Text>
        <Text style={styles.balanceAmount}>1.234.567,89 $</Text>
        <Text style={styles.balanceChange}>(+2.273 $)</Text>
      </View>

      {/* Movements Section */}
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

      {/* Make Payment Button */}
      <TouchableOpacity style={styles.paymentButton}>
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceChange: {
    fontSize: 16,
    color: 'green',
  },
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showMore: {
    color: '#4CAF50',
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  movementAmount: {
    fontSize: 14,
  },
  movementDate: {
    fontSize: 12,
    color: '#888888',
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#333333',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default HomeScreen;
