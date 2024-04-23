import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from "react";
import BallComponent from "../Components/Ball";
import SettingsModal from "../Modals/SettingsModal";
import NewBallModal from "../Modals/NewBallModal";
import COLORS from "../Constants/Colors";
import STRINGS from "../Constants/Strings";

const HomeScreen = () => {

    const [balls, setBalls] = useState<number[]>([]);
    const [ballSize, setBallSize] = useState<number>(100);

    const [ballColor, setBallColor] = useState<string>(COLORS.defaultBall);

    const [ballNumberColor, setBallNumberColor] = useState<string>(COLORS.defaultBackground);
    const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.defaultBackground);

    const [newNumber, setNewNumber] = useState<string>();
    const [isAddNumberEnabled, setIsAddNumberEnabled] = useState<boolean>(true);


    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [isNewBallModalVisible, setIsNewBallModalVisible] = useState(false);

    const handleNewNumberChange = (newNumber: string) => {
        const numericValue = newNumber.replace(/[^0-9]/g, '');
        setNewNumber(numericValue);

        if (balls.includes(Number(numericValue))) {
            setIsAddNumberEnabled(false);
            console.log(newNumber);
        }
        else {
            setIsAddNumberEnabled(true);
        }
    }

    const handleAddNewBall = () => {
        const newBalls: number[] = [...balls, Number(newNumber)];
        setBalls(newBalls);
        setNewNumber('');
        setIsNewBallModalVisible(false);
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
                        setBalls([]);
                    }
                }
            ],
            { cancelable: true }
        )
    }

    const handleBallPress = (ballNumber: number) => {
        Alert.alert(
            STRINGS.Alerts.DeleteBall.Title,
            STRINGS.Alerts.DeleteBall.Text,
            [
                { text: STRINGS.Alerts.Generic.Cancel, style: 'cancel' },
                {
                    text: STRINGS.Alerts.Generic.Delete,
                    onPress: () => {
                        const updatedBalls = balls.filter(BallNumber => BallNumber != ballNumber);
                        setBalls(updatedBalls);
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
                    <Ionicons name="refresh" style={{ fontSize: 40, color: 'black' }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSettingsModalVisible(true)}>
                    <Ionicons name="settings-outline" style={{ fontSize: 40, color: 'black' }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsNewBallModalVisible(true)}>
                    <Ionicons name="add-circle-outline" style={{ fontSize: 40, color: 'black' }} />
                </TouchableOpacity>
            </View>

            {balls.length > 0 ? (
                <ScrollView>
                    <View style={styles.ballsContainer}>

                        {balls.map(ballNumber => (
                            <BallComponent
                                key={ballNumber}
                                ballNumber={ballNumber}
                                ballNumberColor={ballNumberColor}
                                ballSize={ballSize}
                                ballColor={ballColor}
                                handleOnPress={() => handleBallPress(ballNumber)}
                            />
                        ))}
                    </View>
                </ScrollView>

            ) : (
                <View style={styles.centeredView}>
                    <Text>{STRINGS.HomeScreen.NoBalls}</Text>
                    <Ionicons name="add-circle-outline" style={{ fontSize: 40, color: 'black' }} />
                </View>
            )}

            <SettingsModal
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

            <NewBallModal
                isModalVisible={isNewBallModalVisible}
                setModalVisible={setIsNewBallModalVisible}

                newNumber={newNumber}
                handleNewNumberChange={handleNewNumberChange}

                isAddNumberEnabled={isAddNumberEnabled}
                handleAddNewBall={handleAddNewBall}
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

        height: '6%',
        width: '100%',
        marginBottom: '3%',
        paddingHorizontal: '10%',
        backgroundColor: 'white',
    },
    centeredView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ballsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;