import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";

interface DividerProps {
    width? : number;
    orientation?: 'horizontal' | 'vertical';
    color : string;
    dividerStyle?: StyleProp<ViewStyle>;
}

function Divider({width = 1, orientation = 'horizontal', color, dividerStyle = null} : DividerProps){
    
    const styles = StyleSheet.create({
        defaultStyle: {
            width: orientation === 'horizontal' ? '100%' : width,
            height: orientation === 'vertical' ? '100%' : width,
            backgroundColor: color,
        }
    })

    return (
        <View style={[styles.defaultStyle, dividerStyle]} />
    )
}

export default Divider;