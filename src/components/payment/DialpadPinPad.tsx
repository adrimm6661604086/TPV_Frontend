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
    dialPadSize: number;
    dialPadTextSize: number;
    cardPin: string;
    pin: string;
    setPin: React.Dispatch<React.SetStateAction<string>>;
    setShowAnimation: React.Dispatch<React.SetStateAction<string | null>>;
}

const DialpadPinPad: React.FC<DialpadPinPadProps> = ({
    dialPadContent,
    dialPadSize,
    dialPadTextSize,
    cardPin,
    pin,
    setPin,
    setShowAnimation,
}) => {

    const handlePress = (item: number | string) => {
        if (item === "delete") {
            setPin((prev) => prev.slice(0, -1));
        } else if (item === "confirm") {
            if (pin.length === 4 && pin === cardPin) {
                setShowAnimation("success");
            } else {
                setShowAnimation("error");
            }
        } else if (typeof item === "number") {
            setPin((prev) => (prev.length < 4 ? prev + item.toString() : prev));
        }
    };

    

    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default DialpadPinPad;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dialPadContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    dialPadText: {
        color: theme.palette.background.light,
    },
});
