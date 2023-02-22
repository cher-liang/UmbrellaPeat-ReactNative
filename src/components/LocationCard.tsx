import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    // TextInput
} from "react-native"

import {
    Card,
    IconButton,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';


interface LocationCardProps {
    latitude: string,
    longitude: string,
    what3words: string | undefined,
    onLatLngChange: (lat: string, lng: string) => void
}
const LocationCard: React.FC<LocationCardProps> = ({ latitude, longitude, what3words, onLatLngChange }) => {
    const theme = useTheme();

    const [_latitude,setLatitude] = useState<string>(latitude);
    const [_longitude,setLongitude] = useState<string>(longitude);

    useEffect(() => {
        onLatLngChange(_latitude,_longitude);
    }, [_latitude, _longitude]);

    return (
        <Card
            mode='elevated'
            style={styles.inputContainerStyle}
            onPress={()=>{}}
        >
            <Card.Title
                title="Location"
                titleVariant='titleMedium'
                titleStyle={styles.title}
                left={(props) => <IconButton {...props} icon="map-marker" />}
            />
            <Card.Content>
                <View style={styles.latlngContainer}>

                    <View style={styles.latlng}>
                        <TextInput
                            mode='outlined'
                            label='Latitude'
                            value={_latitude}
                            style={{ backgroundColor: theme.colors.onSecondary, ...styles.textInput }}
                            theme={{ roundness: 10 }}
                            onChangeText={setLatitude}
                        />
                    </View>
                    <View style={styles.latlng}>
                        <TextInput
                            mode='outlined'
                            label='Latitude'
                            value={_longitude}
                            style={{ backgroundColor: theme.colors.onSecondary, ...styles.textInput }}
                            theme={{ roundness: 10 }}
                            onChangeText={setLongitude}
                        />
                    </View>
                </View>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.text}
                >
                    <Text style={{ color: 'red' }}>///</Text>
                    {what3words}
                </Text>
            </Card.Content>
        </Card>

    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        flex: 1,
        margin: 10,
    },
    title: {
        fontSize: 25,
        top: 7
    },
    latlngContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    latlng: {
        flex:1,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width:'90%',
        fontSize: 22
    },
    text:{
        fontSize: 20,
        margin:10
    }
});

export default LocationCard;