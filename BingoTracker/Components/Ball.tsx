import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import SIZES from "../Constants/Sizes";


interface BallProps {
    ballNumber: number;
    ballSize: number;
    ballColor: string;
    ballNumberColor: string;
    isPressed: boolean;
    handleOnPress: () => void;
}
function BallComponent({
    ballNumber,
    ballSize = SIZES.BallSizeDefaultTablet,
    ballColor,
    ballNumberColor = 'white',
    isPressed = false,
    handleOnPress
}: BallProps) {

    const styles = StyleSheet.create({
        ball: {
            width: ballSize,
            height: ballSize,
            borderRadius: ballSize / 2,
            backgroundColor: isPressed ? ballColor : ballColor,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            overflow: 'hidden'
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        text: {
            color: ballNumberColor,
            fontSize: ballSize / 2,
        },
    });

    return (
        <TouchableOpacity onPress={handleOnPress}>
            <View style={styles.ball}>
                {!isPressed && <View style={styles.overlay} />}
                <Text style={styles.text}>{ballNumber}</Text>
            </View>
        </TouchableOpacity>
    )
}



export default BallComponent;