import Slider from "@react-native-community/slider";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { TriangleColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import STRINGS from "../Constants/Strings";
import Divider from "../Components/Divider";
import { useEffect, useState } from "react";
import ColorSelection from "../Components/ColorSelection";
import OptionsChangeableColors from "./Enums/OptionsChangeableColor";
import { DeviceType } from "expo-device";
import SIZES from "../Constants/Sizes";
import COLORS from "../Constants/Colors";
import { Orientation } from "expo-screen-orientation";

interface SettingsModalProps {
    deviceType: DeviceType;

    screenOrientation: Orientation;

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
    screenOrientation,

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

    // Get modal dimensions based on device and screen orientation
    const getModalDimensions = (side: 'Width' | 'Height') => {

        let modalWidth = 50;
        let modalHeight = 50;

        if (isVerticalOrientation(screenOrientation)) {
            modalHeight = deviceType === DeviceType.TABLET ? 70 : 85;
            modalWidth = deviceType === DeviceType.TABLET ? 70 : 75;
        }
        else {
            modalWidth = 70;
            modalHeight = 80;
        }

        switch (side) {
            case "Height":
                return modalHeight;

            case "Width":
                return modalWidth;
        }
    } 

    const dynamicStyles = StyleSheet.create({
        modalViewSize: {
            width: `${getModalDimensions('Width')}%`,
            height: `${getModalDimensions('Height')}%`,
            flexDirection: isVerticalOrientation(screenOrientation) ? 'column' : 'row',
        },
        modalSectionSize: {
            height: isVerticalOrientation(screenOrientation) ? 'auto' : '100%',
            width: isVerticalOrientation(screenOrientation) ? '100%' : '50%',
        },
        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: deviceType === DeviceType.TABLET ? SIZES.SettingsSectionTitleTablet : SIZES.SettingsSectionTitlePhone,
        },
        sectionTitle: {
            fontSize: deviceType === DeviceType.TABLET ? SIZES.SettingsSectionTitleTablet : SIZES.SettingsSectionTitlePhone,
            fontWeight: 'bold',
            marginBottom: '2%',
        },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, dynamicStyles.modalViewSize]}>

                    <View style={[styles.modalSection, dynamicStyles.modalSectionSize]}>
                        <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.BallSize}: {ballSize}</Text>

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

                        {!isVerticalOrientation(screenOrientation) && (
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.button}>
                                <Text style={dynamicStyles.textStyle}>{STRINGS.Generics.Close}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Divider dividerStyle={{ marginHorizontal: '1%' }} color="grey" orientation={isVerticalOrientation(screenOrientation) ? 'horizontal' : 'vertical'} />

                    <View style={[styles.modalSection, dynamicStyles.modalSectionSize, { flexGrow: 1 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.Colors}</Text>
                        </View>

                        <ColorSelection
                            style={{ width: '100%' }}
                            deviceType={deviceType}
                            onSelectOption={handleOptionSelection}
                            selectedOption={selectedOption}
                        />

                        <View style={{ flexGrow: 1, width: '100%' }}>
                            <TriangleColorPicker
                                onColorChange={color => setSelectedOptionValue(color)}
                                style={{ flex: 1 }}
                                hideSliders
                                color={selectedOptionValue}
                            />
                        </View>

                    </View>

                    {isVerticalOrientation(screenOrientation) && (
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.button}
                        >
                            <Text style={dynamicStyles.textStyle}>{STRINGS.Generics.Close}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export function isVerticalOrientation(orientation: Orientation) {
    return (orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN);
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: '3%',
        alignItems: 'center',
        shadowColor: COLORS.Shadow,
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
    modalSection: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 20,
        padding: '2%',
        marginTop: '1%',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.ModalButton,
    },
});

export default SettingsModal;