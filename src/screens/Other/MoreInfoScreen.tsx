import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';

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
import { defaultStyles } from '../styles';

// Helper to group transactions by month and year
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

  const handleReturn = (transaction: Transaction) => {
    console.log('Return processed for:', transaction);
    setSelectedTransaction(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background.light }}>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={{ ...defaultStyles.arrowBack, elevation: 10 }}
      >
        <Ionicons name="arrow-back" size={32} color={theme.palette.primary.main} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
        {groupedTransactions.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.groupContainer}>
            <Text style={styles.groupHeader}>
              {group.monthYear}
            </Text>
            {group.transactions.map((item, index) => (
              <TouchableOpacity
                key={`${groupIndex}-${index}`}
                style={[
                  styles.movementItem,
                  selectedTransaction === item
                    ? {
                        backgroundColor: `${theme.palette.secondary.main}80`,
                        borderRadius: 10,
                      }
                    : {},
                ]}
                onLongPress={() => setSelectedTransaction(item)}
              >
                <View style={styles.iconContainer}>
                  {item.transactionType === 'PAYMENT' ? (
                    <MaterialCommunityIcons name="cash-fast" size={24} color="green" />
                  ) : (
                    <MaterialCommunityIcons name="cash-refund" size={24} color="red" />
                  )}
                </View>
                <View style={styles.cardImageContainer}>
                  {item.CardOrg === 'Visa' ? (
                    <Image source={require('../../assets/cards/visa.png')} style={styles.cardImage} />
                  ) : item.CardOrg === 'MasterCard' ? (
                    <Image source={require('../../assets/cards/master.png')} style={styles.cardImage} />
                  ) : item.CardOrg === 'AmericanExpress' ? (
                    <Image source={require('../../assets/cards/amex.png')} style={styles.cardImage} />
                  ) : (
                    <Image source={require('../../assets/cards/generic.png')} style={styles.cardImage} />
                  )}
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.movementAmount}>{item.amount} $</Text>
                  <Text style={styles.movementDate}>{parseDate(item.transactionDate, 'short')}</Text>
                  <Text style={styles.cardInfo}>
                    {item.CardOrg} - **** {item.last4Digits}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

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
