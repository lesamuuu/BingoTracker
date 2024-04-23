import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from "react";
import BallComponent from "../Components/Ball";
import { fromHsv } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import SettingsModal from "../Modals/settingsModal";
import NewBallModal from "../Modals/newBallModal";

const HomeScreen = () => {

    const [balls, setBalls] = useState<number[]>([]);
    const [ballSize, setBallSize] = useState<number>(100);

    const [ballHsvColor, setBallHsvColor] = useState<HsvColor>({ h: 225, s: 99, v: 99 });
    const [ballHexColor, setBallHexColor] = useState<string>('#0341fc');

    const [newNumber, setNewNumber] = useState<string>();
    const [isAddNumberEnabled, setIsAddNumberEnabled] = useState<boolean>(true);


    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [isNewBallModalVisible, setIsNewBallModalVisible] = useState(false);

    useEffect(() => {
        const newBalls: number[] = [];
        for (let i = 0; i <= 90; i++) {
            newBalls.push(i);
        }

        setBalls(newBalls);
    }, []);

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

    const handleColorChange = (hsvColor: HsvColor) => {
        const hexColor = fromHsv(hsvColor);
        setBallHexColor(hexColor);
        setBallHsvColor(hsvColor);
    }

    const handleResetButton = () => {
        Alert.alert(
            'Delete all balls',
            'Are you sure you want to delete all the balls?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
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
            'Delete ball',
            'Are you sure you want to delete this ball?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
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
        <View style={styles.mainContainer}>
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

            <ScrollView>
                <View style={styles.ballsContainer}>
                    {balls.map(ballNumber => (
                        <BallComponent
                            key={ballNumber}
                            ballNumber={ballNumber}
                            ballSize={ballSize}
                            ballColor={ballHexColor}
                            handleOnPress={() => handleBallPress(ballNumber)}
                        />
                    ))}
                </View>
            </ScrollView>

            <SettingsModal 
                ballHsvColor={ballHsvColor}
                handleColorChange={handleColorChange}

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
        alignItems: 'center',
        backgroundColor: 'red',
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
    ballsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;