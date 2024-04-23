import Slider from "@react-native-community/slider";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorPicker, TriangleColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import STRINGS from "../Constants/Strings";
import Divider from "../Components/Divider";
import { useEffect, useState } from "react";
import _ from 'lodash'


interface SettingsModalProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;

    ballSize: number;
    setBallSize: (value: number) => void;

    ballColor: string;
    handleBallColorChange: (hexColor: string) => void;

    ballNumberColor: string;
    handleBallNumberColorChange: (hexColor: string) => void;

    backgroundColor: string;
    handleBackgroundColorChange: (hexColor: string) => void;
}

const ColorSelection = ({ options, selectedOption, onSelectOption }) => {
    return (
        <View>
            {options.map(option => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles1.optionButton,
                        option === selectedOption && styles1.selectedOptionButton
                    ]}
                    onPress={() => onSelectOption(option)}
                >
                    <Text style={styles1.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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

enum OptionsChangableColors {
    BallColor = 'Ball Color',
    NumberColor = 'Number Color',
    BackgroundColor = 'Background Color',
}

function SettingsModal({
    isModalVisible,
    setModalVisible,

    ballSize,
    setBallSize,

    ballColor,
    handleBallColorChange,

    ballNumberColor,
    handleBallNumberColorChange,

    backgroundColor,
    handleBackgroundColorChange

}: SettingsModalProps) {

    const [selectedOption, setSelectedOption] = useState<OptionsChangableColors>(OptionsChangableColors.BallColor);
    const [selectedOptionValue, setSelectedOptionValue] = useState<HsvColor>(toHsv(ballColor));


    const optionsChangableColors = ['Ball Color', 'Number Color', 'Background Color'];

    const handleOptionSelection = (option: OptionsChangableColors) => {
        switch (option) {
            case OptionsChangableColors.BallColor:
                setSelectedOptionValue(toHsv(ballColor));
                setSelectedOption(option);
                break;

            case OptionsChangableColors.NumberColor:
                setSelectedOptionValue(toHsv(ballNumberColor));
                setSelectedOption(option);
                break;

            case OptionsChangableColors.BackgroundColor:
                setSelectedOptionValue(toHsv(backgroundColor));
                setSelectedOption(option);
                break;

            default:
                break;
        }
    }

    /*
    const handleNumberColorChangeDebounced = _.debounce((color) => {
        handleBallNumberColorChange(color);
    }, 1000); // Adjust the debounce delay as needed
    */

    useEffect( () => {

        const hexColor = fromHsv(selectedOptionValue);

        switch (selectedOption) {
            case OptionsChangableColors.BallColor:
                handleBallColorChange(hexColor)
                break;

            case OptionsChangableColors.NumberColor:
                handleBallNumberColorChange(hexColor)
                break;

            case OptionsChangableColors.BackgroundColor:
                handleBackgroundColorChange(hexColor)
                break;

            default:
                break;
        }
    }, [selectedOptionValue])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>

                    <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>{STRINGS.SettingsModal.BallSize}: {ballSize}</Text>

                        <Slider
                            style={{ width: '100%' }}
                            minimumValue={60}
                            lowerLimit={60}
                            maximumValue={150}
                            upperLimit={150}
                            step={10}
                            value={ballSize}
                            onValueChange={setBallSize}
                        />
                    </View>

                    <Divider color="grey" />

                    <View style={[styles.modalSection, styles.modalSectionColorPicker]}>
                        <Text style={styles.sectionTitle}>COLORS</Text>

                        <ColorSelection
                            options={optionsChangableColors}
                            onSelectOption={handleOptionSelection}
                            selectedOption={selectedOption}
                        />

                        <TriangleColorPicker
                            onColorChange={color => setSelectedOptionValue(color)}
                            //onColorSelected={color => setSelectedOptionValue(toHsv(color))}
                            style={{ flex: 1 }}
                            hideSliders
                            color={selectedOptionValue}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.button}>
                        <Text style={styles.textStyle}>{STRINGS.Generics.Cancel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '50%',
        height: '50%',

        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

        justifyContent: 'space-between',
        alignContent: 'center',
    },
    modalHeader: {

    },
    modalSection: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalSectionColorPicker: {
        alignItems: 'stretch',
        height: '80%',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default SettingsModal;