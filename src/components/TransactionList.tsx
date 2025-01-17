import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils
import theme from '../utils/theme';
import { parseDate } from '../utils/index';

// Types
import { Transaction } from '../types/interfaces';

interface TransactionListProps {
  transactions: Transaction[];
  maxHeight?: number;
  onFetchTransactions?: () => void;
  onShowMore?: (transactions: Transaction[]) => void;
  groupByMonth?: boolean;
  onLongPressTransaction?: (transaction: Transaction) => void;
}

const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {};
  transactions.forEach((transaction) => {
    const date = new Date(transaction.transactionDate);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Group by year-month
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(transaction);
  });
  return Object.entries(grouped).map(([key, transactions]) => ({
    monthYear: `${String(new Date(`${key}-01`).getMonth() + 1).padStart(2, '0')}/${key.split('-')[0].slice(-2)}`, // MM/YY format
    transactions,
  }));
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  maxHeight,
  onFetchTransactions,
  onShowMore,
  groupByMonth = false,
  onLongPressTransaction,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const groupedTransactions = groupByMonth ? groupTransactionsByMonth(transactions) : [];
  const displayedTransactions = !groupByMonth && (maxHeight ?? 0) < 350 ? transactions.slice(0, 5) : transactions;

  return (
    <View>
      {onFetchTransactions && (
        <View style={styles.movementsHeader}>
          <TouchableOpacity onPress={onFetchTransactions}>
            <Text style={styles.cardTitle}>Last movements</Text>
          </TouchableOpacity>
          {onShowMore && (
            <TouchableOpacity onPress={() => onShowMore(transactions)}>
              <Text style={styles.showMore}>Show more ...</Text>
            </TouchableOpacity>
          )}
          </View>
        )}

        {groupByMonth ? (
          <ScrollView style={{ maxHeight }}>
            {groupedTransactions.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.groupContainer}>
              <Text style={styles.groupHeader}>{group.monthYear}</Text>
              {group.transactions.map((item, index) => {
                const uniqueIndex = `${groupIndex}-${index}`;
                return (
                  <TouchableOpacity
                    key={uniqueIndex}
                    style={[styles.movementItem, selectedIndex === uniqueIndex ? styles.selectedItem : {}]}
                    onLongPress={() => {
                      setSelectedIndex(uniqueIndex);
                      if (onLongPressTransaction) onLongPressTransaction(item);
                    }}
                  >
                    <TransactionRow item={item} />
                  </TouchableOpacity>
                );
              })}
            </View>
            ))}
          </ScrollView>
          ) : (
            <ScrollView style={{ maxHeight }}>
              {displayedTransactions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.movementItem, selectedIndex === `${index}` ? styles.selectedItem : {}]}
                  onLongPress={() => {
                    setSelectedIndex(index.toString());
                    if (onLongPressTransaction) onLongPressTransaction(item);
                  }}
                >
                  <TransactionRow item={item} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          </View>
  );
};

const TransactionRow: React.FC<{ item: Transaction }> = ({ item }) => (
  <>
    {item.transactionType === 'PAYMENT' ? (
      <MaterialCommunityIcons name="cash-fast" size={24} color="green" />
    ) : (
      <MaterialCommunityIcons name="cash-refund" size={24} color="red" />
    )}
    {item.CardOrg === 'Visa' ? (
      <Image source={require('../assets/cards/visa.png')} style={styles.cardImage} />
    ) : item.CardOrg === 'MasterCard' ? (
      <Image source={require('../assets/cards/master.png')} style={styles.cardImage} />
    ) : item.CardOrg === 'AmericanExpress' ? (
      <Image source={require('../assets/cards/amex.png')} style={styles.cardImage} />
    ) : (
      <Image source={require('../assets/cards/generic.png')} style={styles.cardImage} />
    )}
    <Text style={styles.movementAmount}>{item.amount} $</Text>
    <Text style={styles.movementDate}>{parseDate(item.transactionDate, 'short')}</Text>
  </>
);

const styles = StyleSheet.create({
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  showMore: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.palette.primary.main,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: `${theme.palette.secondary.main}80`,
    borderRadius: 10,
  },
  cardImage: {
    width: 40,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  movementAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  movementDate: {
    fontSize: 14,
    color: '#777',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    marginBottom: 10,
  },
});

export default TransactionList;
