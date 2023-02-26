import { useState, useEffect, useMemo } from 'react';
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


interface CommonLocationCardProps {
    latitude: string,
    longitude: string,
    what3words?: string,
    compact?: true
}
type ConditionalLocationCardProps =
    | {
        onLatLngChange?: (lat: string, lng: string) => void,
        readonly?: never,
    }
    | {
        readonly?: true,
        onLatLngChange?: never,
    }

type LocationCardProps = CommonLocationCardProps & ConditionalLocationCardProps;

const LocationCard: React.FC<LocationCardProps> = ({ latitude, longitude, what3words, readonly, compact, onLatLngChange }) => {
    const theme = useTheme();

    const [_latitude, setLatitude] = useState<string>(latitude);
    const [_longitude, setLongitude] = useState<string>(longitude);

    useMemo(() => {
        if (!readonly) {
            onLatLngChange!(_latitude, _longitude);
        }
    }, [_latitude, _longitude]);

    function getLatitude() {
        if (!readonly) {
            return _latitude;
        } else {
            return latitude;
        }
    }

    function getLongitude() {
        if (!readonly) {
            return _longitude;
        } else {
            return longitude;
        }
    }

    return (
        <Card
            mode='elevated'
            style={(compact)?styles.inputContainerStyleWithPadding:styles.inputContainerStyle}
            onPress={() => { }}
        >
            {!compact
                && <Card.Title
                    title="Location"
                    titleVariant='titleMedium'
                    titleStyle={styles.title}
                    left={(props) => <IconButton {...props} icon="map-marker" />}
                />
            }
            <Card.Content>
                <View style={styles.latlngContainer}>

                    <View style={styles.latlng}>
                        <TextInput
                            mode='outlined'
                            label='Latitude'
                            value={getLatitude()}
                            style={{ backgroundColor: theme.colors.onSecondary, ...styles.textInput }}
                            theme={{ roundness: 10 }}
                            onChangeText={setLatitude}
                            editable={!readonly}
                        />
                    </View>
                    <View style={styles.latlng}>
                        <TextInput
                            mode='outlined'
                            label='Longtiude'
                            value={getLongitude()}
                            style={{ backgroundColor: theme.colors.onSecondary, ...styles.textInput }}
                            theme={{ roundness: 10 }}
                            onChangeText={setLongitude}
                            editable={!readonly}
                        />
                    </View>
                </View>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={compact?styles.textCompact:styles.text}
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
    },
    inputContainerStyleWithPadding: {
        flex: 1,
        paddingVertical: 20,
    },
    title: {
        fontSize: 25,
        top: 7
    },
    titleCompact: {
        fontSize: 20
    },
    latlngContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    latlng: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: '90%',
        fontSize: 22
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 20,
    },
    textCompact:{
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
    }
});

export default LocationCard;