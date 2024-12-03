import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { BACKEND_URL } from '@env';

const SettingsScreen: React.FC  = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/pay`);
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setMessage('No se pudo cargar el mensaje');
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
export default SettingsScreen;
