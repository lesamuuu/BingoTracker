import { View, Text, StyleSheet } from "react-native";
import COLORS from "../Constants/Colors";
import STRINGS from "../Constants/Strings";
import SIZES from "../Constants/Sizes";
import BallComponent from "./Ball";
import { DeviceType } from "expo-device";
import { Orientation } from "expo-screen-orientation";
import { isVerticalOrientation } from "../Modals/settingsModal";

interface RecentBallsProps {
    deviceType: DeviceType;
    ScreenOrientation: Orientation;
    SelectedBalls: number[];
    BallSize: number;
    BallNumberColor: string;
    BallColor: string;
}

function RecentBalls({ deviceType, ScreenOrientation, SelectedBalls, BallSize, BallNumberColor, BallColor }: RecentBallsProps) {

    let totalCallsText = STRINGS.HomeScreen.TotalCalls;
    let currentCallText = STRINGS.HomeScreen.CurrentCall;
    let previousCallsText = STRINGS.HomeScreen.PreviousCalls;

    if(isVerticalOrientation(ScreenOrientation) && deviceType === DeviceType.PHONE){
        totalCallsText = STRINGS.HomeScreen.TotalCallsShort;
        currentCallText = STRINGS.HomeScreen.CurrentCallShort;
        previousCallsText = STRINGS.HomeScreen.PreviousCallsShort;
    }

    const dynamicStyles = StyleSheet.create({
        recentBallTitle: {
            fontSize: deviceType === DeviceType.TABLET ? SIZES.RecentBallTitleTablet : SIZES.RecentBallTitlePhone,
            fontWeight: 'bold',
        }
    });

    if (SelectedBalls.length > 0) {
        return (
            <View style={styles.recentBallsContainer}>

                <View style={styles.recentBallSection}>
                    <Text style={dynamicStyles.recentBallTitle}>{totalCallsText}</Text>
                    <BallComponent
                        key={'TotalCalls'}
                        ballNumber={SelectedBalls.length}
                        ballNumberColor={'black'}
                        ballSize={BallSize}
                        ballColor={COLORS.totalCalls}
                        isPressed={true}
                        handleOnPress={() => { }}
                    />
                </View>


                <View style={styles.recentBallSection}>
                    <Text style={dynamicStyles.recentBallTitle}>{currentCallText}</Text>
                    <BallComponent
                        key={SelectedBalls[SelectedBalls.length - 1]}
                        ballNumber={SelectedBalls[SelectedBalls.length - 1]}
                        ballNumberColor={BallNumberColor}
                        ballSize={BallSize}
                        ballColor={COLORS.currentCall}
                        isPressed={true}
                        handleOnPress={() => { }}
                    />
                </View>

                <View style={styles.recentBallSection}>
                    <Text style={dynamicStyles.recentBallTitle}>{previousCallsText}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        {SelectedBalls.slice(-4).map(ballNumber => (
                            <BallComponent
                                key={ballNumber}
                                ballNumber={ballNumber}
                                ballNumberColor={BallNumberColor}
                                ballSize={BallSize}
                                ballColor={ballNumber === SelectedBalls[SelectedBalls.length - 1] ? COLORS.currentCall : BallColor}
                                isPressed={true}
                                handleOnPress={() => { }}
                            />
                        ))}
                    </View>

                </View>
            </View>
        )
    }
    else return null;

}

const styles = StyleSheet.create({
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
export default RecentBalls;