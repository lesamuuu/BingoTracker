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
import { getOrientationAsync, Orientation, addOrientationChangeListener, removeOrientationChangeListener } from "expo-screen-orientation";

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

    const [screenOrientation, setScreenOrientation] = useState<Orientation>();

    const [modalViewHeight, setModalViewHeight] = useState<number>(0);
    const [sliderSectionHeight, setSliderSectionHeight] = useState<number>(0);
    const [closeButtonHeight, setCloseButtonHeight] = useState<number>(0);
    const [colorPickerViewHeight, setColorPickerViewHeight] = useState<number>(0);

    // Handle orientation change
    useEffect(() => {
        const handleOrientationChange = async () => {
            const orientation = await getOrientationAsync();
            setScreenOrientation(orientation);
        };

        const listener = addOrientationChangeListener(handleOrientationChange);

        handleOrientationChange();

        return () => {
            removeOrientationChangeListener(listener);
        };
    }, []);

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

    // Function to handle layout event for modalView
    const handleModalViewLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setModalViewHeight(height);
    };

    // Function to handle layout event for modalView
    const handleSliderSectionLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setSliderSectionHeight(height);
    };

    // Function to handle layout event for TouchableOpacity
    const handleCloseButtonLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setCloseButtonHeight(height);
    };

    useEffect(() => {
        // Calculate the height of the problematic view
        const calculatedProblematicHeight = modalViewHeight - sliderSectionHeight - closeButtonHeight;
        console.log('Modal: ', modalViewHeight, 'Slider: ', sliderSectionHeight, 'Button: ', closeButtonHeight, 'Problem: ', calculatedProblematicHeight);
        setColorPickerViewHeight(calculatedProblematicHeight);
    }, [modalViewHeight, sliderSectionHeight, closeButtonHeight]);

    const dynamicStyles = StyleSheet.create({
        modalViewSize: {
            width: isVerticalOrientation(screenOrientation) ? '50%' : '70%',
            height: isVerticalOrientation(screenOrientation) ? '50%' : '80%',

        },
        modalSectionsContainer: {
            width: '100%',
            height: isVerticalOrientation(screenOrientation) ? 'auto' : '100%',
            flexDirection: isVerticalOrientation(screenOrientation) ? 'column' : 'row',
        },
        modalSectionSize: {
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
                <View style={[styles.modalView, dynamicStyles.modalViewSize]} onLayout={handleModalViewLayout}>

                    <View style={dynamicStyles.modalSectionsContainer}>

                        <View style={[styles.modalSection, dynamicStyles.modalSectionSize]} onLayout={handleSliderSectionLayout}>
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

                        <Divider color="grey" orientation={isVerticalOrientation(screenOrientation) ? 'horizontal' : 'vertical'} />

                        <View style={[styles.modalSection, dynamicStyles.modalSectionSize,
                        { borderColor: 'green', borderWidth: 1 }]}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.Colors}</Text>
                            </View>

                            <ColorSelection
                                style={{ width: '100%', height: 'auto' }}
                                deviceType={deviceType}
                                onSelectOption={handleOptionSelection}
                                selectedOption={selectedOption}
                            />

                            <View style={{ flex: 1, width: '100%', borderWidth: 1, flexDirection: 'row'}}>
                                <Divider color="red" orientation="vertical" />
                                <TriangleColorPicker
                                    onColorChange={color => setSelectedOptionValue(color)}
                                    style={{ flex: 1, width: '100%', height:'100%' }}
                                    hideSliders
                                    color={selectedOptionValue}
                                />
                            </View>

                        </View>
                    </View>

                    {isVerticalOrientation(screenOrientation) && (
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.button}
                            onLayout={handleCloseButtonLayout}
                        >
                            <Text style={dynamicStyles.textStyle}>{STRINGS.Generics.Close}</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </Modal>
    )
}

function isVerticalOrientation(orientation: Orientation) {
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
    modalHeader: {

    },
    modalSection: {
        justifyContent: 'space-between',
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
        backgroundColor: COLORS.ModalButton,
    },
});

export default SettingsModal;