import Slider from "@react-native-community/slider";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorPicker, TriangleColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import STRINGS from "../Constants/Strings";
import Divider from "../Components/Divider";
import { useEffect, useState } from "react";
import ColorSelection from "../Components/ColorSelection";
import OptionsChangeableColors from "./Enums/OptionsChangeableColor";
import { DeviceType } from "expo-device";

interface SettingsModalProps {
    deviceType: DeviceType;

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

function SettingsModal({
    deviceType,

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

    const [selectedOption, setSelectedOption] = useState<OptionsChangeableColors>(OptionsChangeableColors.BallColor);
    const [selectedOptionValue, setSelectedOptionValue] = useState<HsvColor>(toHsv(ballColor));

    const optionsChangableColors = Object.values(OptionsChangeableColors) as string[];

    // Handle ColorSelection option
    const handleOptionSelection = (option: OptionsChangeableColors) => {
        switch (option) {
            case OptionsChangeableColors.BallColor:
                setSelectedOptionValue(toHsv(ballColor));
                setSelectedOption(option);
                break;

            case OptionsChangeableColors.NumberColor:
                setSelectedOptionValue(toHsv(ballNumberColor));
                setSelectedOption(option);
                break;

            case OptionsChangeableColors.BackgroundColor:
                setSelectedOptionValue(toHsv(backgroundColor));
                setSelectedOption(option);
                break;

            default:
                break;
        }
    }

    // Handle ColorSelection option
    useEffect(() => {
        const hexColor = fromHsv(selectedOptionValue);

        switch (selectedOption) {
            case OptionsChangeableColors.BallColor:
                handleBallColorChange(hexColor)
                break;

            case OptionsChangeableColors.NumberColor:
                handleBallNumberColorChange(hexColor)
                break;

            case OptionsChangeableColors.BackgroundColor:
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
                            minimumValue={40}
                            lowerLimit={40}
                            maximumValue={150}
                            upperLimit={150}
                            step={5}
                            value={ballSize}
                            onValueChange={setBallSize}
                        />
                    </View>

                    <Divider color="grey" />

                    <View style={[styles.modalSection, styles.modalSectionColorPicker]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.sectionTitle}>{STRINGS.SettingsModal.Colors}</Text>
                        </View>

                        <ColorSelection
                            options={optionsChangableColors}
                            onSelectOption={handleOptionSelection}
                            selectedOption={selectedOption}
                        />

                        <TriangleColorPicker
                            onColorChange={color => setSelectedOptionValue(color)}
                            style={{ flex: 1 }}
                            hideSliders
                            color={selectedOptionValue}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.button}>
                        <Text style={styles.textStyle}>{STRINGS.Generics.Close}</Text>
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
        padding: '3%',
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
        flex: 1,
        alignItems: 'stretch',
    },
    button: {
        borderRadius: 20,
        padding: '2%',
        marginTop: '1%',
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
        marginBottom: '2%',
    },
});

export default SettingsModal;