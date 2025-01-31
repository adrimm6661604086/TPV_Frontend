// React
import { useState, useCallback } from 'react';

// Libraries
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utils
import { BACKEND_URL } from '@env';
import { StatsData, FilterType } from '../types/interfaces';


axios.interceptors.request.use((request) => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error', error);
    return Promise.reject(error);
  }
);

const useStats = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (filter: FilterType) => {
        setLoading(true);
        setError(null);

        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            let queryParam = '';
            if (typeof filter === 'string') {
                queryParam = `time-filter=${filter}`;
            } else {
                queryParam = `startDate=${filter.startDate}&endDate=${filter.endDate}`;
            }

            const response = await axios.get(`${BACKEND_URL}/api/stats/${userId}?${queryParam}`);

            setStats(response.data);
        } catch (err: any) {
            setError(err.message || 'Error fetching stats');
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, error, fetchStats };
};

export default useStats;
