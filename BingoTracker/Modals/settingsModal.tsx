import Slider from "@react-native-community/slider";
import { Modal, View, TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import { ColorPicker } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import STRINGS from "../Constants/Strings";


interface SettingsModalProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;

    ballSize: number;
    setBallSize: (value: number) => void;

    ballHsvColor: HsvColor;
    handleColorChange: (hsvColor: HsvColor) => void;

}

function SettingsModal({ isModalVisible, setModalVisible, ballSize, setBallSize, ballHsvColor, handleColorChange }: SettingsModalProps) {


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
                        <Text>{STRINGS.SettingsModal.BallSize}: {ballSize}</Text>

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

                    <View style={styles.modalSectionColorPicker}>
                        <ColorPicker
                            onColorChange={color => handleColorChange(color)}
                            style={{ flex: 1 }}
                            hideSliders
                            color={ballHsvColor}
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
    modalSection: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalSectionColorPicker: {
        width: '100%',
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
        textAlign: 'center'
    }
});

export default SettingsModal;