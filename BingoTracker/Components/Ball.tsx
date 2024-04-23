import { TouchableOpacity, View, Text, StyleSheet } from "react-native";


interface BallProps {
    ballNumber: number;
    ballSize: number;
    ballColor: string;
    handleOnPress: () => void;
}
function BallComponent({ ballNumber, ballSize = 100, ballColor, handleOnPress }: BallProps) {

    const styles = StyleSheet.create({
        ball: {
            width: ballSize,
            height: ballSize,
            borderRadius: ballSize/2,
            backgroundColor: ballColor,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
        },
        text: {
            color: 'white',
            fontSize: ballSize/2,
        },
    });

    return (
        <TouchableOpacity onPress={handleOnPress}>
            <View style={styles.ball}>
                <Text style={styles.text}>{ballNumber}</Text>
            </View>
        </TouchableOpacity>
    )
}



export default BallComponent;