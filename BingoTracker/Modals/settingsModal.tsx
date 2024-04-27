import Slider from "@react-native-community/slider";
import { Modal, View, TouchableOpacity, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
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
import ISettingsModalPropsOnClose from "./ISettingsModalPropsOnClose";
import ISettingsProps from "./ISettingsProps";
import _ from 'lodash'

interface SettingsModalProps {
    deviceType: DeviceType;

    screenOrientation: Orientation;

    isModalVisible: boolean;
    handleModalVisibleChange: (props: ISettingsModalPropsOnClose) => void;

    ballsQuantity: number;

    ballSize: number;
    handleBallSizeChange: (value: number) => void;

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
    handleModalVisibleChange,

    ballsQuantity,

    ballSize,
    handleBallSizeChange,

    ballColor,
    handleBallColorChange,

    ballNumberColor,
    handleBallNumberColorChange,

    backgroundColor,
    handleBackgroundColorChange

}: SettingsModalProps) {

    // Default props on close (just closes the modal)
    const defaultPropsOnClose: ISettingsModalPropsOnClose = {
        isVisible: false,
        storeChanges: false,
        saveChangesNeedResetAlert: false,
        settingsProps: null,
    }

    const [selectedColorOption, setSelectedColorOption] = useState<OptionsChangeableColors>(OptionsChangeableColors.BallColor);
    const [selectedColorOptionValue, setSelectedColorOptionValue] = useState<HsvColor>(toHsv(ballColor));

    const [newBallsQuantity, setNewBallsQuantity] = useState<number>(ballsQuantity);

    const [previousSettingsProps, setPreviousSettingsProps] = useState<ISettingsProps>();

    const [modalPropsOnClose, setModalPropsOnClose] = useState<ISettingsModalPropsOnClose>(defaultPropsOnClose);

    // Screenshot of the actual Settings Props
    const getActualSettingsProps = () =>{
        const actualSettingsProps = {
            BallsQuantity: ballsQuantity,
            BallsSize: ballSize,
            BallsColor: ballColor,
            BallsNumberColor: ballNumberColor,
            BackgroundColor: backgroundColor
        }
        return actualSettingsProps;
    }

    // Handle default values and refresh previousSettingsProps on modal visibility change 
    useEffect(() => {
        setNewBallsQuantity(ballsQuantity);
        setModalPropsOnClose(defaultPropsOnClose);

        const PreviousSettingsProps: ISettingsProps = getActualSettingsProps();
        setPreviousSettingsProps(PreviousSettingsProps);
    }, [isModalVisible])

    // Handle props on modal close based on Previous SettingsProps and new SettingsProps
    useEffect(() => {
        if(!previousSettingsProps) return;

        // New Settings Props calculated with actual data
        const NewSettingsProps: ISettingsProps = getActualSettingsProps();
        NewSettingsProps.BallsQuantity = newBallsQuantity;

        if(!_.isEqual(NewSettingsProps, previousSettingsProps)){
            // There are differences between old props and new props, override ModalPropsOnClose
            const newModalPropsonClose = {...modalPropsOnClose};
            newModalPropsonClose.storeChanges = true;
            newModalPropsonClose.settingsProps = NewSettingsProps;

            // Save Changes Need Reset only is triggered when balls quantity has changed
            if(newModalPropsonClose.settingsProps.BallsQuantity !== previousSettingsProps.BallsQuantity){
                newModalPropsonClose.saveChangesNeedResetAlert = true;
            }
            else{
                newModalPropsonClose.saveChangesNeedResetAlert = false;
            }

            setModalPropsOnClose(newModalPropsonClose);
        }
        else{
            setModalPropsOnClose(defaultPropsOnClose);
        }
    }, [
        newBallsQuantity,
        ballSize,
        ballColor,
        ballNumberColor,
        backgroundColor
    ])

    // Handle ball quantity 
    const handleBallsQuantityChangeLocal = (quantity: string) => {

        // Manages to only accept absolute numeric values
        const filteredNumbers = quantity.replace(/[^0-9]/g, '');
        const valueNumber = Math.abs(Number(filteredNumbers));

        setNewBallsQuantity(valueNumber);
    }

    // Handle ColorSelection option
    const handleOptionSelection = (option: OptionsChangeableColors) => {
        switch (option) {
            case OptionsChangeableColors.BallColor:
                setSelectedColorOptionValue(toHsv(ballColor));
                setSelectedColorOption(option);
                break;

            case OptionsChangeableColors.NumberColor:
                setSelectedColorOptionValue(toHsv(ballNumberColor));
                setSelectedColorOption(option);
                break;

            case OptionsChangeableColors.BackgroundColor:
                setSelectedColorOptionValue(toHsv(backgroundColor));
                setSelectedColorOption(option);
                break;

            default:
                break;
        }
    }

    // Handle ColorSelection option
    useEffect(() => {
        const hexColor = fromHsv(selectedColorOptionValue);

        switch (selectedColorOption) {
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
    }, [selectedColorOptionValue])

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
        inputBallsQuantitySize: {
            height: (deviceType === DeviceType.TABLET ? SIZES.SettingsSectionTitleTablet : SIZES.SettingsSectionTitlePhone) + 20,
            fontSize: deviceType === DeviceType.TABLET ? SIZES.SettingsSectionTitleTablet : SIZES.SettingsSectionTitlePhone,
        },
        textStyle: {
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
                handleModalVisibleChange(modalPropsOnClose);
            }}
        >

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, dynamicStyles.modalViewSize]}>
                        <View style={[styles.modalSection, dynamicStyles.modalSectionSize]}>

                            <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.BallQuantity}</Text>

                            <TextInput style={[styles.inputBallsQuantity, dynamicStyles.inputBallsQuantitySize]}
                                keyboardType="numeric"
                                onChangeText={handleBallsQuantityChangeLocal}
                                value={`${newBallsQuantity}`}
                            />

                            <Divider color="grey" orientation="horizontal" dividerStyle={{ marginVertical: '2%' }} />

                            <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.BallSize}: {ballSize}</Text>

                            <Slider
                                style={{ width: '100%' }}
                                minimumValue={30}
                                lowerLimit={30}
                                maximumValue={120}
                                upperLimit={120}
                                step={5}
                                value={ballSize}
                                onValueChange={handleBallSizeChange}
                            />

                            {!isVerticalOrientation(screenOrientation) && (
                                <TouchableOpacity
                                    onPress={() => handleModalVisibleChange(modalPropsOnClose)}
                                    style={styles.button}>
                                    <Text style={[styles.textStyle, dynamicStyles.textStyle]}>{STRINGS.Generics.Close}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Divider dividerStyle={{ marginHorizontal: '1%', marginVertical: '2%' }} color="grey" orientation={isVerticalOrientation(screenOrientation) ? 'horizontal' : 'vertical'} />

                        <View style={[styles.modalSection, dynamicStyles.modalSectionSize, { flexGrow: 1 }]}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={dynamicStyles.sectionTitle}>{STRINGS.SettingsModal.Colors}</Text>
                            </View>

                            <ColorSelection
                                style={{ width: '100%' }}
                                deviceType={deviceType}
                                onSelectOption={handleOptionSelection}
                                selectedOption={selectedColorOption}
                            />

                            <View style={{ flexGrow: 1, width: '100%' }}>
                                <TriangleColorPicker
                                    onColorChange={color => setSelectedColorOptionValue(color)}
                                    style={{ flex: 1 }}
                                    hideSliders
                                    color={selectedColorOptionValue}
                                />
                            </View>

                        </View>

                        {isVerticalOrientation(screenOrientation) && (
                            <TouchableOpacity
                                onPress={() => handleModalVisibleChange(modalPropsOnClose)}
                                style={styles.button}
                            >
                                <Text style={[styles.textStyle, dynamicStyles.textStyle]}>{STRINGS.Generics.Close}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    inputBallsQuantity: {
        width: '30%',
        textAlign: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SettingsModal;