import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

function ColorSelection({ options, selectedOption, onSelectOption }) {
    return (
        <View>
            {options.map(option => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.optionButton,
                        option === selectedOption && styles.selectedOptionButton
                    ]}
                    onPress={() => onSelectOption(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    optionButton: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    selectedOptionButton: {
        backgroundColor: 'lightblue',
    },
    optionText: {
        fontSize: 16,
    },
});

export default ColorSelection;