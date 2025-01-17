// React
import React, {useState, useEffect} from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';

// Libraries
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentStackParamList, RootStackParamList } from '../types/navigationTypes'; 

// Hooks
import useTransactions from '../hooks/TransactionHooks';

// Utils
import theme from '../utils/theme';
import { Transaction } from '../types/interfaces';
import TransactionList from '../components/TransactionList';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;
type MainScreenNavigationProp = NativeStackNavigationProp<PaymentStackParamList, 'MainScreen'>;

type CombinedNavigationProp = CompositeNavigationProp<
  HomeScreenNavigationProp  ,
  MainScreenNavigationProp
>;

const HomeScreen: React.FC  = () => {  
  const navigator = useNavigation<CombinedNavigationProp>();

  const [LastWeekBalance, setLastWeekBalance] = useState(0);
  const [TodayBalance, setTodayBalance] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);  
  const [showMenu, setShowMenu] = useState(false);
  
  const { transactions, loading, error, getBalanceOfLastWeek, getBalanceOfToday, fetchTransactions } = useTransactions();

  useEffect(() => {
    setLastWeekBalance(getBalanceOfLastWeek());
    setTodayBalance(getBalanceOfToday());
  }, [transactions]);

  const handleReturn = (transaction : Transaction) => {
    Alert.alert(
      'Process Return',
      `Do you want to process a return for ${transaction.amount} $ to the card **** ${transaction.last4Digits}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setShowMenu(false);
            setSelectedIndex(null);
            navigator.navigate(
              'Payment', 
              { 
                screen: 'ReturnReader',
                params: { 
                  transactionId: transaction.id,
                  amount: Number(transaction.amount),
                }            
              }
            );
          },
        },
      ]
    );
  };

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
        <TouchableOpacity onPress={() => {fetchTransactions()}}>
          <Text style={styles.cardTitle}>Last week balance</Text>
        </TouchableOpacity>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceAmount}>{LastWeekBalance.toFixed(2)} $</Text>
          <Text style={{fontSize: 18, color: TodayBalance < 0.0 ? theme.palette.error.main : theme.palette.success.main}}>
              ({TodayBalance.toFixed(2)}) $
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <TransactionList
          transactions={transactions}
          maxHeight={280}
          onFetchTransactions={fetchTransactions}
          onShowMore={(transactions) => {
            (navigator as HomeScreenNavigationProp).navigate('ShowMore', { transactions });
          }}
          onLongPressTransaction={(transaction) => {
            setSelectedIndex(transactions.indexOf(transaction));
            setShowMenu(true);
          }}
        />
      </View>

      <TouchableOpacity 
        style={styles.paymentButton} 
        onPress={() => {
          navigator.navigate('Payment', 
            { 
              screen: 'PaymentSetter',
              params: undefined
            }
          );
        }}>
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showMenu}
        animationType="slide"
        onRequestClose={() => {
          setSelectedIndex(null);
          setShowMenu(false); 
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedIndex !== null) {
                  handleReturn(transactions[selectedIndex]);
                }
              }}
            >
              <MaterialCommunityIcons name="cash-refund" size={24} color="green" />
              <Text style={styles.menuText}>Process Return</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setSelectedIndex(null);
                setShowMenu(false);
              }}
            >
              <MaterialCommunityIcons name="close-circle-outline" size={24} color="red" />
              <Text style={styles.menuText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingRight: 10,
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
    padding: 5,
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
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
