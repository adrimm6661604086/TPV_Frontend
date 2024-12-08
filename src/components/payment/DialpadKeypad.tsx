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

interface DialpadKeypadProps {
    dialPadContent: (string | number)[];
    navigation: any;
    dialPadSize: number;
    dialPadTextSize: number;
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
}

const DialpadKeypad: React.FC<DialpadKeypadProps> = ({
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
                    `Do you want to pay ${amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $?`,
                    [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate("Payment-Reader", { amount }) }
                    ]
                );
            }
        } else {
            const currentStr = amount.toString().replace('.', '');
            const newAmountStr = currentStr + item;
            setAmount(parseFloat(newAmountStr) / 100); 
            console.log(amount);

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
                            backgroundColor: item === "" ? "transparent" : theme.palette.secondary.main,
                            width: dialPadSize,
                            height: dialPadSize,
                        },
                        styles.dialPadContainer,
                        ]}
                    >
                        {item === "delete" ? (
                            <Feather name="delete" size={24} color="#000" />
                        ) : item === "confirm" ? (
                            <Feather name="check" size={24} color="#000" />
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

export default DialpadKeypad;

const styles = StyleSheet.create({
    dialPadContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        borderRadius: 50,
        borderColor: "transparent",
    },
        dialPadText: {
        color: "#000",
    },
    });