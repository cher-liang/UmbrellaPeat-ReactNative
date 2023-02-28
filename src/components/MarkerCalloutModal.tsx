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
import ImageView from "react-native-image-viewing";


import hasMessage from '../utils/CatchErrorMessage';

import NavigateAndDeleteButtons from './NavigateAndDeleteButtons';
import LocationCard from './LocationCard';
import MarkerImagesCard from './MarkerImagesCard';
import MarkerInfoCard from './MarkerInfoCard';


interface MarkerCalloutModalProps {
    visible: boolean,
    markerId: string,

    onDismiss: () => void,
    onMarkerDelete: (deviceId: string) => void,
}

const MarkerCalloutModal: React.FC<MarkerCalloutModalProps> = ({ visible, onDismiss, onMarkerDelete, markerId }) => {
    const theme = useTheme();

    const [timestamp, setTimeStamp] = useState(0);
    const [deviceId, setDeviceId] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [what3words, setWhat3Words] = useState('');
    const [photoURIs, setPhotoURIs] = useState<string[]>([]);

    const [imageViewVisible, setImageViewVisible] = useState(false);


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
                        setPhotoURIs(jsonParse['savedPhotoURIs'])
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

    function onDeleteButtonPressed() {
        onMarkerDelete(deviceId);
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.contentContainerStyle}
            >
                <View style={styles.markerInfoContainer}>
                    <MarkerInfoCard
                        deviceId={deviceId}
                        timestamp={new Date(timestamp)}
                    />
                </View>
                <View style={styles.cardContainer2}>

                    <LocationCard
                        latitude={latitude}
                        longitude={longitude}
                        what3words={what3words}
                        readonly
                        compact
                    />
                </View>
                <View style={styles.cardContainer}>
                    <MarkerImagesCard
                        readonly
                        compact
                        displayPhotoURIs={photoURIs}
                        onImagePress={() => { setImageViewVisible(true) }}
                    />
                </View>

                <NavigateAndDeleteButtons
                    onDeleteButtonPressed={onDeleteButtonPressed}
                />

                <ImageView
                    images={photoURIs.map(photoURI => { return { uri: photoURI } })}
                    imageIndex={0}
                    visible={imageViewVisible}
                    onRequestClose={() => setImageViewVisible(false)}
                />
            </Modal>
        </Portal>

    );
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 80,
        rowGap: 10
    },
    markerInfoContainer: {
        paddingHorizontal: 10,
    },
    cardContainer: {
        flex: 7,
        maxHeight: '60%',
        paddingHorizontal: 10,
    },
    cardContainer2: {
        flex: 3,
        maxHeight: '40%',
        paddingHorizontal: 10,
    },
});

export default MarkerCalloutModal;