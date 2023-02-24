import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
} from "react-native"

import {
    Card,
    IconButton,
    Modal,
    Portal,
    Text,
    useTheme
} from 'react-native-paper';
import hasMessage from '../utils/CatchErrorMessage';
import LocationCard from './LocationCard';
import MarkerImagesCard from './MarkerImagesCard';
import MarkerInfoCard from './MarkerInfoCard';


interface MarkerCalloutModalProps {
    visible: boolean,
    onDismiss: () => void,

    markerId: string,
}

const MarkerCalloutModal: React.FC<MarkerCalloutModalProps> =
    ({ visible, onDismiss, markerId }) => {
        const theme = useTheme();

        const [timestamp, setTimeStamp] = useState(0);
        const [deviceId, setDeviceId] = useState('');
        const [latitude, setLatitude] = useState('');
        const [longitude, setLongitude] = useState('');
        const [what3words, setWhat3Words] = useState('');

        useEffect(() => {
            const fetchMarkerDataFromAsyncStorage = async () => {
                try {
                    if (markerId) {
                        const jsonValue = await AsyncStorage.getItem(markerId);
                        if (jsonValue) {
                            const jsonParse = JSON.parse(jsonValue);
                            // add in edited timestamp later !!!
                            setDeviceId(jsonParse['deviceId']);
                            setTimeStamp(jsonParse['timestamp']);
                            setLatitude(jsonParse['latitude'].toFixed(5).toString());
                            setLongitude(jsonParse['longitude'].toFixed(5).toString());
                            setWhat3Words(jsonParse['what3words']);
                        } else {
                            console.error("Error fetching ", markerId, " from AsyncStorage")
                        }
                    }
                } catch (e) {
                    if (hasMessage(e)) {
                        console.error('Caught error: ' + (e.message || e));
                    } else {
                        console.error('Unknown error: ' + e);
                    }
                };


            }
            fetchMarkerDataFromAsyncStorage();
        }, [markerId])

        // const [visible, setVisible] = useState(false);

        // const showModal = () => setVisible(true);
        // const hideModal = () => setVisible(false);

        return (
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={onDismiss}
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    <MarkerInfoCard
                        deviceId={deviceId}
                        timestamp={new Date(timestamp)}
                    />
                    <LocationCard
                        latitude={latitude}
                        longitude={longitude}
                        what3words={what3words}
                        readonly
                    />
                    <MarkerImagesCard
                    />
                </Modal>
            </Portal>

        );
    }

const styles = StyleSheet.create({
    contentContainerStyle: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 100,
    },
});

export default MarkerCalloutModal;