// React
import React, {useState, useEffect} from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

// Libraries
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes'; 

// Hooks
import useTransactions from '../hooks/TransactionHooks';

// Utils
import theme from '../utils/theme';
import { parseDate } from '../utils/index';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC  = () => {  
  const navigator = useNavigation<HomeScreenNavigationProp>();

  const [LastWeekBalance, setLastWeekBalance] = useState(0);
  const [TodayBalance, setTodayBalance] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);  
  
  const { transactions, loading, error, getBalanceOfLastWeek, getBalanceOfToday, fetchTransactions } = useTransactions();

  useEffect(() => {
    setLastWeekBalance(getBalanceOfLastWeek());
    setTodayBalance(getBalanceOfToday());
  }, [transactions]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={32} color={theme.palette.primary.main} />
      </View>
    );
  } 
  else if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>Ocurrió un error: {error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchTransactions}>
          <MaterialIcon name="refresh" size={24} color="#FFFFFF" />
          <Text style={styles.reloadButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last week Balance</Text>
        <Text style={styles.balanceAmount}>{LastWeekBalance} $</Text>
        <Text style={styles.balanceChange}>({TodayBalance} $)</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.movementsHeader}>
          <Text style={styles.cardTitle}>Last movements</Text>
          <TouchableOpacity
            onPress={() => {navigator.navigate('ShowMore', {transactions})}}
          >
            <Text style={styles.showMore}>Show more ...</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: 300 }}>
          {transactions.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
              styles.movementItem,
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
                item.CardOrg === 'Visa' ? (<Image source={require('../assets/cards/visa.png')} style={styles.cardImage} />) : 
                item.CardOrg === 'MasterCard' ? (<Image source={require('../assets/cards/master.png')} style={styles.cardImage} />) :
                item.CardOrg === 'AmericanExpress' ? (<Image source={require('../assets/cards/amex.png')} style={styles.cardImage} />) : 
                (<Image source={require('../assets/cards/generic.png')} style={styles.cardImage} />)

              }
              <Text style={styles.movementAmount}>{item.amount} $</Text>
              <Text style={styles.movementDate}>{parseDate(item.transactionDate)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={() => {navigator.navigate('Payment')}}>
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>

      {
        selectedIndex !== null && (
          <View style={styles.blurOverlay} />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 5,
    elevation: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginVertical: 20,
    textAlign: 'center',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardImage: {
    width: 32, 
    height: 20, 
    borderRadius: 5
  }
});

export default HomeScreen;
