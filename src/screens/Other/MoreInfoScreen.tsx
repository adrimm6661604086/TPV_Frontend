import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigationTypes';

// Libraries
import Ionicons from 'react-native-vector-icons/Ionicons';

// Components
import TransactionList from '../../components/TransactionList';

// Utils
import { parseDate } from '../../utils/index';
import theme from '../../utils/theme';
import { Transaction } from '../../types/interfaces';
import { defaultStyles } from '../styles';


const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transactionDate);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Group by year-month
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(transaction);
  });

  return Object.entries(grouped).map(([key, transactions]) => ({
    monthYear: `${String(new Date(`${key}-01`).getMonth() + 1).padStart(2, '0')}/${key.split('-')[0].slice(-2)}`, // MM/YY format
    transactions,
  }));
};

type MoreInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShowMore'>;

type MoreInfoScreenProps = {
  transactions: Transaction[];
};

const MoreInfoScreen: React.FC<MoreInfoScreenProps> = ({ transactions }) => {
  const navigator = useNavigation<MoreInfoScreenNavigationProp>();
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  const groupedTransactions = groupTransactionsByMonth(transactions);

  const handleReturn = (transaction : Transaction) => {
    Alert.alert(
      'Process Return',
      `Do you want to process a return for ${transaction.amount} $ to the card **** ${transaction.last4Digits}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setSelectedTransaction(null);
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
      ],
    );    
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background.light }}>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={{ ...defaultStyles.arrowBack, elevation: 10 }}
      >
        <Ionicons name="arrow-back" size={32} color={theme.palette.primary.main} />
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => fetchTransactions()}
        style={{...defaultStyles.refreshBtn , elevation: 10 }}
      >
        <Ionicons name="refresh" size={32} color={theme.palette.primary.main} />
      </TouchableOpacity> */}


      <View style={styles.transactoonListContainer}>
        <TransactionList
          transactions={transactions}
          groupByMonth
          onLongPressTransaction={(transaction) => setSelectedTransaction(transaction)}
        />
      </View>
      {selectedTransaction && (
        <Modal
          transparent
          animationType="fade"
          visible={!!selectedTransaction}
          onRequestClose={() => setSelectedTransaction(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <Text style={styles.modalDetail}>
                Amount: {selectedTransaction.amount} $
              </Text>
              <Text style={styles.modalDetail}>
                Date: {parseDate(selectedTransaction.transactionDate, 'long')}
              </Text>
              <Text style={styles.modalDetail}>
                {selectedTransaction.CardOrg} - ****
                {selectedTransaction.last4Digits}
              </Text>
              <Text style={styles.modalDetail}>
                Type: {selectedTransaction.transactionType}
              </Text>
              <View style={styles.modalButtonContainer}>
                {selectedTransaction.transactionType === 'PAYMENT' ? (
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: theme.palette.error.main }]}
                    onPress={() => handleReturn(selectedTransaction)}
                  >
                    <Text style={styles.modalButtonText}>Return</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setSelectedTransaction(null)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 70,
  },
  transactoonListContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 60,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: '90%',
    marginTop: 60,
    borderRadius: 10,
    padding: 20,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
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
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  movementAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  movementDate: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  cardImage: {
    width: 32,
    height: 20,
    borderRadius: 5,
  },
  cardInfo: {
    fontSize: 12,
    color: theme.palette.text.tertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalButton: {
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default MoreInfoScreen;
