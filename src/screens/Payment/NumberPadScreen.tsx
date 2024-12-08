// React
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

// Libraries
import Ionicons from 'react-native-vector-icons/Ionicons';

// Navigation
import { useNavigation } from '@react-navigation/native';

// Components
import DialpadKeypad from "../../components/payment/DialpadKeypad";

// Utiles
import { iconSize } from '../../utils';
import theme from '../../utils/theme';
import {defaultStyles} from '../styles';

const { width, height } = Dimensions.get("window");

const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, "delete", 0, "confirm"];
const dialPadSize = width * 0.2;
const dialPadTextSize = dialPadSize * 0.4;

const NumberPadScreen = () => {
  const navigator = useNavigation();
  const [amount, setAmount] = useState(0.0);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={defaultStyles.arrowBack}
      >
        <Ionicons name="arrow-back" size={iconSize} color={theme.palette.primary.main} />
      </TouchableOpacity>
      <View style={styles.textContainer}>          
        <Text style={styles.pinText}>Select Amount</Text>
        <Text style={styles.pinSubText}>Please enter the amount you want to pay</Text>
        <Text style={styles.amountText}>{amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</Text>
        <DialpadKeypad
          dialPadContent={dialPadContent}
          dialPadSize={dialPadSize}
          navigation={navigator}
          dialPadTextSize={dialPadTextSize}
          amount={amount}
          setAmount={setAmount}
        /> 
      </View>
    </SafeAreaView>
  );
};
   
   
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.light,
        paddingHorizontal: 10,
        paddingVertical: 50,
    },
    textContainer: {
        marginVertical: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    pinText: {
        fontSize: 30,
        fontWeight: "medium",
        color: theme.palette.primary.main,
    },
    pinSubText: {
        fontSize: 18,
        fontWeight: "medium",
        color: theme.palette.text.secondary,
    },
    amountText: {
        width: 200,
        textAlign: "center",
        color: theme.palette.primary.main,
        fontSize: 30,
        fontWeight: "medium",
        borderWidth: 1,
        borderColor: theme.palette.primary.dark,
        padding: 10,
        marginVertical: 30,
    },
});

export default NumberPadScreen;