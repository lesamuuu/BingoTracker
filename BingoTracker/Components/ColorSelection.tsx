import { View, TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";
import SIZES from "../Constants/Sizes";
import OptionsChangeableColors from "../Modals/Enums/OptionsChangeableColor";
import { DeviceType } from "expo-device";
import COLORS from "../Constants/Colors";

interface ColorSelectionProps {
    deviceType: DeviceType;
    selectedOption: OptionsChangeableColors;
    onSelectOption: (option: string) => void;
    style?: ViewStyle;
}

function ColorSelection({ deviceType, selectedOption, onSelectOption, style } : ColorSelectionProps) {

    const optionsChangableColors = Object.values(OptionsChangeableColors) as string[];

    const dynamicStyles = StyleSheet.create({
        optionText: {
            fontSize: deviceType === DeviceType.TABLET? SIZES.SettingsTextTablet : SIZES.SettingsTextPhone,
        },
    });

    return (
        <View style={style}>
            {optionsChangableColors.map(option => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.optionButton,
                        option === selectedOption && styles.selectedOptionButton
                    ]}
                    onPress={() => onSelectOption(option)}
                >
                    <Text style={dynamicStyles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    optionButton: {
        padding: '2%',
        marginVertical: '1%',
        backgroundColor: COLORS.ColorSelectionUnSelected,
        borderRadius: 5,
    },
    selectedOptionButton: {
        backgroundColor: COLORS.ColorSelectionSelected,
    },
});

export default ColorSelection;