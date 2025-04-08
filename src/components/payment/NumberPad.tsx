// React
import {
    Alert,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React from "react";

// Libraries
import Feather from "react-native-vector-icons/Feather";

// Utils
import theme from "../../utils/theme";

interface NumberPadProps {
    dialPadContent: (string | number)[];
    navigation: any;
    dialPadSize: number;
    dialPadTextSize: number;
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
}

const NumberPad: React.FC<NumberPadProps> = ({
    dialPadContent,
    navigation,
    dialPadSize,
    dialPadTextSize,
    amount,
    setAmount,
}) => {

    const handlePress = (item: number | string) => {
        if (item === "delete") {
            const valueWithoutDecimal = Math.floor(amount * 100); 
            const newValue = Math.floor(valueWithoutDecimal / 10);
            setAmount(newValue / 100);
        } else if (item === "confirm") {
            if (amount === 0) {
                Alert.alert("Payment", "Please enter an amount to pay.");
                return;
            } else {
                Alert.alert(
                    "Payment",
                    `Do you want to pay ${amount.toLocaleString('es-ES', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    })} $?`,
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { 
                            text: "OK", 
                            onPress: () => navigation.navigate("PaymentReader", { amount }) 
                        }
                    ]
                );
            }
        } else {
            const currentStr = amount.toFixed(2).replace('.', '').replace(/^0+/, ''); 
            const newAmountStr = currentStr + item; 
            setAmount(parseFloat(newAmountStr) / 100); 
        }
    };
    
      

    return (
    <FlatList
        data={dialPadContent}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
            return (
                <TouchableOpacity disabled={item === ""} onPress={() => handlePress(item)}>
                    <View
                        style={[
                        {
                            backgroundColor: item === "delete" ? theme.palette.error.main 
                            : item === "confirm" ? theme.palette.success.main 
                            : theme.palette.text.secondary,
                            width: dialPadSize,
                            height: dialPadSize,
                        },
                        styles.dialPadContainer,
                        ]}
                    >
                        {item === "delete" ? (
                            <Feather name="delete" size={24} color={theme.palette.background.light} />
                        ) : item === "confirm" ? (
                            <Feather name="check" size={24} color={theme.palette.background.light} />
                        )
                        :(
                            <Text style={[{ fontSize: dialPadTextSize }, styles.dialPadText]}>{item}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            );
        }}
    />
    );
};

export default NumberPad;

const styles = StyleSheet.create({
    dialPadContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    dialPadText: {        
        color: theme.palette.background.light,
    },
    });