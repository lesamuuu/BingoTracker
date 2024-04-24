import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from "react";
import BallComponent from "../Components/Ball";
import SettingsModal from "../Modals/settingsModal";
import COLORS from "../Constants/Colors";
import STRINGS from "../Constants/Strings";
import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import RecentBalls from "../Components/RecentBalls";
import SIZES from "../Constants/Sizes";


interface BallProps {
    ballNumber: number;
    isPressed: boolean;
}

const HomeScreen = () => {

    const [deviceType, setDeviceType] = useState<Device.DeviceType>();

    const [balls, setBalls] = useState<BallProps[]>([]);

    const [selectedBalls, setSelectedBalls] = useState<number[]>([]);

    const [ballSize, setBallSize] = useState<number>(SIZES.BallSizeDefaultTablet);

    const [ballColor, setBallColor] = useState<string>(COLORS.defaultBall);

    const [ballNumberColor, setBallNumberColor] = useState<string>(COLORS.defaultBackground);
    const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.defaultBackground);

    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

    // Get device type
    useEffect(() => {
        const getDeviceType = async () => {
            const deviceType = await Device.getDeviceTypeAsync();
            setDeviceType(deviceType);
        };

        getDeviceType();
    }, []);

    // Handle Device Type
    useEffect(() => {
        setBallSize(deviceType === Device.DeviceType.TABLET ? SIZES.BallSizeDefaultTablet : SIZES.BallSizeDefaultPhone);

        const setLandsacepeScreenOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        };

        if (deviceType === Device.DeviceType.PHONE) {
            setLandsacepeScreenOrientation();
        }

    }, [deviceType]);

    // Reset Ball Status
    useEffect(() => {
        resetBallsStatus();
    }, [])

    const resetBallsStatus = () => {
        const newBalls: BallProps[] = [];
        for (let i = 1; i <= 50; i++) {
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
                    text: STRINGS.Alerts.Generic.Delete,
                    onPress: () => {
                        resetBallsStatus();
                    }
                }
            ],
            { cancelable: true }
        )
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
                deviceType={deviceType}
                BallColor={ballColor}
                BallNumberColor={ballNumberColor}
                BallSize={ballSize}
                SelectedBalls={selectedBalls}
            />


            <SettingsModal
                deviceType={deviceType}
                
                ballColor={ballColor}
                handleBallColorChange={setBallColor}

                ballNumberColor={ballNumberColor}
                handleBallNumberColorChange={setBallNumberColor}

                backgroundColor={backgroundColor}
                handleBackgroundColorChange={setBackgroundColor}

                ballSize={ballSize}
                setBallSize={setBallSize}

                isModalVisible={isSettingsModalVisible}
                setModalVisible={setIsSettingsModalVisible}
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