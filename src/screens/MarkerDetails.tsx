import { useEffect, useState, FC } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TextInput,
    Text,
    Button,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import get3Words from '../services/What3Words';

import { HomeRouteProps, MarkerDetailsNavigationProps, MarkerDetailsRouteProps } from '../types/screens';

const MarkerDetails: FC = () => {
    const navigation = useNavigation<MarkerDetailsNavigationProps>();
    const route = useRoute<MarkerDetailsRouteProps>();

    const [deviceId, setDeviceId] = useState<string>();
    const [latitude, setLatitude] = useState(route.params.latitude.toFixed(4).toString())
    const [longitude, setLongtitude] = useState(route.params.longitude.toFixed(4).toString())
    const [what3words, setWhat3Words] = useState<string>();

    useEffect(() => {
        const fetchWhat3Words = async () => {
            setWhat3Words(await get3Words(Number(latitude!), Number(longitude!)));
        }
        fetchWhat3Words()
            .catch(console.error);
    }, [latitude, longitude]);

    const saveButtonPressed = async () => {
        navigation.navigate('Home',
            {
                device_id: deviceId!,
                latitude: Number(latitude!),
                longitude: Number(longitude!),
                what3words: what3words!,
            } )
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.childrenContainer}>
                <Text style={styles.text}>Device ID:</Text>
                <TextInput
                    style={styles.textInput}
                    value={deviceId}
                    onChangeText={setDeviceId} />
            </View>
            <View style={styles.coordinatesContainer}>
                <View style={styles.fiftyPercentContainer}>
                    <Text style={styles.text}>Latitude:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={latitude}
                        onChangeText={setLatitude}
                        placeholder={latitude}
                        keyboardType="numeric" />
                </View>
                <View style={styles.fiftyPercentContainer}>
                    <Text style={styles.text}>Longtitude:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={longitude}
                        onChangeText={setLongtitude}
                        placeholder={longitude}
                        keyboardType="numeric" />
                </View>
            </View>
            <View style={styles.childrenContainer}>
                <Text style={styles.text}>What3Words:</Text>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.what3wordstText}>
                    <Text style={{ color: 'red' }}>///</Text>
                    {what3words}
                </Text>
            </View>
            <View style={styles.coordinatesContainer}>
                <View style={styles.fiftyPercentContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveButtonPressed}>
                        <Text style={styles.ButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.fiftyPercentContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => { navigation.goBack() }}>
                        <Text style={styles.ButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginVertical: 20,
        marginHorizontal: 20
    },
    childrenContainer: {
        flex: 1,
        margin: 10
    },
    coordinatesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fiftyPercentContainer: {
        width: '45%',
        margin: 10,
    },
    textInput: {
        color: '#4f4f4f',
        height: 70,
        fontSize: 30,
        borderWidth: 1,
        borderColor: "#dadde1",
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: '#252526',
        marginBottom: 5,
    },
    what3wordstText: {
        color: '#4f4f4f',
        height: 50,
        borderWidth: 1,
        borderColor: "#dadde1",
        padding: 10,
        fontSize: 20,
    },
    saveButton: {
        flex: 1,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonText: {
        color: 'white',
        fontSize: 30,
    }
});

export default MarkerDetails;
