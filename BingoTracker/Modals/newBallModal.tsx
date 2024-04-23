import { Modal, View, TouchableOpacity, StyleSheet, Text, TextInput } from "react-native";
import STRINGS from "../Constants/Strings";


interface NewBallModalProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;

    newNumber: string;
    handleNewNumberChange: (textNumber : string) => void;

    isAddNumberEnabled: boolean;
    handleAddNewBall: () => void;

}

function NewBallModal({ isModalVisible, setModalVisible, newNumber, handleNewNumberChange, isAddNumberEnabled, handleAddNewBall } : NewBallModalProps) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalSection}>
                        <TextInput
                            style={styles.textInput}
                            inputMode="numeric"
                            keyboardType="number-pad"
                            value={newNumber}
                            onChangeText={handleNewNumberChange}
                        />
                    </View>

                    {!isAddNumberEnabled && (
                        <View style={styles.numberAlreadyExists}>
                            <Text>{STRINGS.NewBallModal.NumberAlreadyExists}</Text>
                        </View>
                    )}

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.button}>

                            <Text style={styles.textStyle}>{STRINGS.Generics.Cancel}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleAddNewBall()}
                            style={styles.button}
                            disabled={!isAddNumberEnabled}>

                            <Text style={styles.textStyle}>{STRINGS.NewBallModal.AddBall}</Text>
                        </TouchableOpacity>
                    </View>
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
    textInput: {
        fontSize: 120,
        width: '100%',

        textAlign: 'center',
        borderColor: '#2196F3',
        borderWidth: 2,
    },
    numberAlreadyExists: {
        backgroundColor: '#eb6767',
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

export default NewBallModal;

