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

interface DialpadPinPadProps {
    dialPadContent: (string | number)[];
    navigation: any;
    dialPadSize: number;
    dialPadTextSize: number;
    cardPin : string;
    pin: string;
    setPin: React.Dispatch<React.SetStateAction<string>>;
}

const DialpadPinPad: React.FC<DialpadPinPadProps> = ({
    dialPadContent,
    navigation,
    dialPadSize,
    dialPadTextSize,
    cardPin,
    pin,
    setPin,
}) => {
    const handlePress = (item: number | string) => {
        if (item === "delete") {
            setPin((prev) => prev.slice(0, -1));
        } else if (item === "confirm") {
            if (pin.length === 4 && pin === cardPin) {
                Alert.alert("PIN Confirmed", `Your PIN: ${pin}`);
            } else {
                Alert.alert("Invalid PIN", "PIN must be 4 digits long.");
            }
        } else if (typeof item === "number") {
            // Añadir número al PIN si no excede la longitud máxima
            setPin((prev) => (prev.length < 4 ? prev + item.toString() : prev));
        }
    };

    return (
        <FlatList
            data={dialPadContent}
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    disabled={item === ""}
                    onPress={() => handlePress(item)}
                >
                    <View
                        style={[
                            {
                                backgroundColor:
                                    item === "delete"
                                        ? theme.palette.error.main
                                        : item === "confirm"
                                        ? theme.palette.success.main
                                        : theme.palette.text.secondary,
                                width: dialPadSize,
                                height: dialPadSize,
                            },
                            styles.dialPadContainer,
                        ]}
                    >
                        {item === "delete" ? (
                            <Feather
                                name="delete"
                                size={24}
                                color={theme.palette.background.light}
                            />
                        ) : item === "confirm" ? (
                            <Feather
                                name="check"
                                size={24}
                                color={theme.palette.background.light}
                            />
                        ) : (
                            <Text
                                style={[
                                    { fontSize: dialPadTextSize },
                                    styles.dialPadText,
                                ]}
                            >
                                {item}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

export default DialpadPinPad;

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