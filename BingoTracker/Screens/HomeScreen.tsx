import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from "react";
import BallComponent from "../Components/Ball";
import SettingsModal from "../Modals/settingsModal";
import COLORS from "../Constants/Colors";
import STRINGS from "../Constants/Strings";
import * as Device from 'expo-device';
import RecentBalls from "../Components/RecentBalls";
import SIZES from "../Constants/Sizes";
import { Orientation, addOrientationChangeListener, getOrientationAsync, removeOrientationChangeListener } from "expo-screen-orientation";
import ISettingsModalPropsOnClose from "../Modals/ISettingsModalPropsOnClose";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ISettingsProps from "../Modals/ISettingsProps";

interface BallProps {
    ballNumber: number;
    isPressed: boolean;
}

const HomeScreen = () => {

    const [deviceType, setDeviceType] = useState<Device.DeviceType>();
    const [screenOrientation, setScreenOrientation] = useState<Orientation>();

    const [balls, setBalls] = useState<BallProps[]>([]);

    const [selectedBalls, setSelectedBalls] = useState<number[]>([]);

    const [ballsQuantity, setBallsQuantity] = useState<number>(75);

    const [ballSize, setBallSize] = useState<number>(SIZES.BallSizeDefaultTablet);
    const [ballColor, setBallColor] = useState<string>(COLORS.defaultBall);
    const [ballNumberColor, setBallNumberColor] = useState<string>(COLORS.defaultBackground);
    const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.defaultBackground);

    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

    // Handle device type
    useEffect(() => {
        const getDeviceType = async () => {
            const deviceTypeRetrieved = await Device.getDeviceTypeAsync();
            setDeviceType(deviceTypeRetrieved);

            setBallSize(deviceTypeRetrieved === Device.DeviceType.TABLET ? SIZES.BallSizeDefaultTablet : SIZES.BallSizeDefaultPhone);
        };

        getDeviceType();
    }, []);

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

    // Store settings in local storage
    const storeSettings = async (settingsProps: ISettingsProps) => {
        try {
            console.log('Storing executing')
            const jsonValue = JSON.stringify(settingsProps);
            await AsyncStorage.setItem('settings', jsonValue);

            console.log('Stored successfully')
        } catch (exception) {
            // saving error
            console.error("Failed to save settings:", exception);
        }
    }

    // Sets props to stored settings in local storage
    useEffect(() => {
        const getStoredSettings = async () => {
            try {
                const retrievedSettingsJSON = await AsyncStorage.getItem('settings');
                const parsed = retrievedSettingsJSON != null ? JSON.parse(retrievedSettingsJSON) : null;
                console.log('retrieved parsed: ', parsed);

                return parsed;

            } catch (exception) {
                console.error('Couldnt retrieve settings', exception);

                return null;
            }
        }

        const loadStoredSettings = async () => {

            const retrievedSettings: ISettingsProps = await getStoredSettings();

            if (retrievedSettings) {
                setBallsQuantity(retrievedSettings.BallsQuantity);
                setBallSize(retrievedSettings.BallsSize);
                setBallColor(retrievedSettings.BallsColor);
                setBallNumberColor(retrievedSettings.BallsNumberColor);
                setBackgroundColor(retrievedSettings.BackgroundColor);
            }
        }

        loadStoredSettings();
    }, []);

    // Reset Ball Status when Balls Quantity Changes
    useEffect(() => {
        resetBallsStatus();
    }, [ballsQuantity])

    const resetBallsStatus = () => {
        const newBalls: BallProps[] = [];
        for (let i = 1; i <= ballsQuantity; i++) {
            newBalls.push({ ballNumber: i, isPressed: false });
        }
        setBalls(newBalls);

        setSelectedBalls([]);
    }

    const handleBallPress = (ballNumber: number) => {
        const updatedBalls = [...balls];
        updatedBalls[ballNumber - 1] = { ballNumber: ballNumber, isPressed: !updatedBalls[ballNumber - 1].isPressed };

        setBalls(updatedBalls);

        let updatedSelectedBalls = [...selectedBalls];
        if (updatedSelectedBalls.includes(ballNumber)) {
            updatedSelectedBalls = updatedSelectedBalls.filter(ball => ball !== ballNumber);
        } else {
            updatedSelectedBalls.push(ballNumber);
        }

        setSelectedBalls(updatedSelectedBalls);
    }

    const handleResetButton = () => {
        Alert.alert(
            STRINGS.Alerts.Reset.Title,
            STRINGS.Alerts.Reset.Text,
            [
                { text: STRINGS.Alerts.Generic.Cancel, style: 'cancel' },
                {
                    text: STRINGS.Alerts.Generic.Reset,
                    onPress: () => {
                        resetBallsStatus();
                    }
                }
            ],
            { cancelable: true }
        )
    }

    const handleSettingsModalVisibility = (props: ISettingsModalPropsOnClose) => {

        // Alert for saving changes
        const handleSaveChangesNeedResetRequest = (settingsProps: ISettingsProps) => {
            Alert.alert(
                STRINGS.Alerts.SaveChangesNeedReset.Title,
                STRINGS.Alerts.SaveChangesNeedReset.Text,
                [
                    {
                        text: STRINGS.Alerts.Generic.DiscardChanges,
                        style: 'cancel',
                        onPress: () => {
                            const settingsDiscardingBallsQuantity = {
                                ...settingsProps,
                                BallsQuantity: ballsQuantity
                            };
                            storeSettings(settingsDiscardingBallsQuantity)
                        }
                    },
                    {
                        text: STRINGS.Alerts.Generic.Reset,
                        onPress: () => {
                            setBallsQuantity(settingsProps.BallsQuantity);
                            storeSettings(settingsProps)
                        }
                    }
                ],
                { cancelable: true }
            )
        }

        if (props.saveChangesNeedResetAlert) {
            handleSaveChangesNeedResetRequest(props.settingsProps);
        }
        else if(props.storeChanges){
            storeSettings(props.settingsProps);
        }

        setIsSettingsModalVisible(props.isVisible);
    }

    return (
        <View style={[styles.mainContainer, { backgroundColor: backgroundColor }]}>
            <View style={styles.topBarContainer}>

                <TouchableOpacity onPress={handleResetButton}>
                    <Ionicons name="refresh" style={{ fontSize: SIZES.HeaderIconSize, color: 'black' }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSettingsModalVisible(true)}>
                    <Ionicons name="settings-outline" style={{ fontSize: SIZES.HeaderIconSize, color: 'black' }} />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.ballsContainer}>

                    {balls.map(ballNumber => (
                        <BallComponent
                            key={ballNumber.ballNumber}
                            ballNumber={ballNumber.ballNumber}
                            ballNumberColor={ballNumberColor}
                            ballSize={ballSize}
                            ballColor={ballColor}
                            isPressed={ballNumber.isPressed}
                            handleOnPress={() => handleBallPress(ballNumber.ballNumber)}
                        />
                    ))}
                </View>
            </ScrollView>

            <RecentBalls
                ScreenOrientation={screenOrientation}
                deviceType={deviceType}
                BallColor={ballColor}
                BallNumberColor={ballNumberColor}
                BallSize={ballSize}
                SelectedBalls={selectedBalls}
            />

            <SettingsModal
                deviceType={deviceType}
                screenOrientation={screenOrientation}

                ballsQuantity={ballsQuantity}

                ballSize={ballSize}
                handleBallSizeChange={setBallSize}

                ballColor={ballColor}
                handleBallColorChange={setBallColor}

                ballNumberColor={ballNumberColor}
                handleBallNumberColorChange={setBallNumberColor}

                backgroundColor={backgroundColor}
                handleBackgroundColorChange={setBackgroundColor}

                isModalVisible={isSettingsModalVisible}
                handleModalVisibleChange={handleSettingsModalVisibility}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        width: '100%',
        marginBottom: '3%',
        paddingHorizontal: '10%',
        backgroundColor: 'white',
    },
    ballsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentBallsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '3%',
        width: '100%'
    },
    recentBallSection: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
});

export default HomeScreen;