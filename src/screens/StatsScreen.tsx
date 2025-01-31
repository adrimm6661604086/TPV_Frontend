// React
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

// Libraries
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Hooks
import useStats from '../hooks/StatsHooks';

// Utils
import theme from '../utils/theme';
import BarChart from '../components/statistics/BarChart';
import { FilterType, StatsData } from '../types/interfaces';

const StatsScreen: React.FC = () => {
  const [chartData, setChartData] = useState<Record<string, StatsData>>({});
  const [timeTab, setTimeTab] = useState<FilterType>('weekly');

  const { stats, loading, error, fetchStats } = useStats();

  useEffect(() => {
    fetchStats(timeTab);
    if (stats) {

      setChartData({ [timeTab as string]: stats });
    }
  }, [timeTab]);

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
        <TouchableOpacity style={styles.reloadButton} onPress={() => fetchStats(timeTab)}>
          <MaterialIcon name="refresh" size={24} color="#FFFFFF" />
          <Text style={styles.reloadButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.subTabs}>
          {['daily', 'weekly', 'monthly', 'annually'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.subTab,
                timeTab === tab && styles.subTabActive,
              ]}
              onPress={() => setTimeTab( tab as FilterType)}
            >
              <Text
                style={[
                  styles.subTabText,
                  timeTab === tab && styles.subTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View> 

        <SafeAreaView style={styles.card}>          
          <BarChart
            data={chartData}
            barColor={theme.palette.primary.main}
            height={230}
            width={300}
            title={`${timeTab} statistics`}
          />

        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },  
  subTabs: {
    flexDirection: 'row',
    backgroundColor: theme.palette.background.dark,
    borderRadius: 10,
    padding: 5,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  subTabActive: {
    backgroundColor: theme.palette.primary.main,
    elevation: 2,
  },
  subTabText: {
    fontSize: 14,
    color: theme.palette.text.light,
  },
  subTabTextActive: {
    fontWeight: '600',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,    
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
});

export default StatsScreen;
