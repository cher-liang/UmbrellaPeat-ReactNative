import { useState, FC, useMemo, useRef } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import get3Words from '../services/What3Words';

import { HomeRouteProps, MarkerDetailsNavigationProps, MarkerDetailsRouteProps } from '../types/screens';
import ScreenWrapper from '../ScreenWrapper';

import DeviceIDTextInput from '../components/DeviceIDTextInput';
import LocationCard from '../components/LocationCard';
import { Button, useTheme } from 'react-native-paper';
import MarkerImagesCard from '../components/MarkerImagesCard';

import hasMessage from '../utils/CatchErrorMessage';

type AvoidingViewProps = {
    children: React.ReactNode;
};

const TextInputAvoidingView = ({ children }: AvoidingViewProps) => {
    return Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
            style={styles.wrapper}
            behavior="padding"
            keyboardVerticalOffset={80}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <>{children}</>
    );
};

const MarkerDetails: FC = () => {
    const theme = useTheme();

    const navigation = useNavigation<MarkerDetailsNavigationProps>();
    const route = useRoute<MarkerDetailsRouteProps>();

    const deviceId = useRef('');
    const [latitude, setLatitude] = useState(route.params.latitude.toFixed(5).toString());
    const [longitude, setLongitude] = useState(route.params.longitude.toFixed(5).toString());
    const [what3words, setWhat3Words] = useState<string>();

    const [existingDeviceIDs, setExistingDeviceIDs] = useState<readonly string[]>([]);
    const [deviceIdError, setDeviceIdError] = useState<'must unique' | 'empty' | ''>('');


    useMemo(() => {
        const fetchExistingDeviceIDs = async () => {
            try {
                setExistingDeviceIDs(await AsyncStorage.getAllKeys());
            } catch (e) {
                if (hasMessage(e)) {
                    console.error('Caught error: ' + (e.message || e));
                } else {
                    console.error('Unknown error: ' + e);
                }
            };
        }
        fetchExistingDeviceIDs();
    }, []);


    async function saveButtonPressed() {
        validateDeviceId();
        if (deviceIdError === '') {
            navigation.navigate('Home',
                {
                    deviceId: deviceId.current!,
                    latitude: Number(latitude!),
                    longitude: Number(longitude!),
                    what3words: what3words!,
                })
        }
    };

    async function onLatLngChange(latitude: string, longitude: string) {
        setLatitude(latitude);
        setLongitude(longitude);
        const fetchWhat3Words = async () => {
            setWhat3Words(await get3Words(Number(latitude!), Number(longitude!)));
        }
        fetchWhat3Words()
            .catch(console.error);
    }

    async function onDeviceIdChange(text: string) {
        deviceId.current = text;
        validateDeviceId();
    }

    async function validateDeviceId() {
        if (deviceId.current) {
            if (existingDeviceIDs.includes(deviceId.current)) {
                setDeviceIdError('must unique');
            } else {
                setDeviceIdError('');
            }
        } else {
            setDeviceIdError('empty');
        }
    }



    return (
        <TextInputAvoidingView>
            <ScreenWrapper
                keyboardShouldPersistTaps={'never'}
                removeClippedSubviews={false}
            >
                <View style={styles.mainContainer}>
                    <DeviceIDTextInput
                        onChangeText={onDeviceIdChange}
                        errorType={deviceIdError}
                    // triggerError={triggerDeviceIDError}
                    />
                    <LocationCard
                        latitude={latitude}
                        longitude={longitude}
                        what3words={what3words}
                        onLatLngChange={onLatLngChange}
                    />
                    <MarkerImagesCard />
                    {/* <LocationCard
                        latitude={latitude}
                        longitude={longitude}
                        what3words={what3words}
                        onLatLngChange={onLatLngChange}
                    /> */}

                </View>
                <View style={styles.footer}>

                    <View style={styles.fiftyPercentContainer}>
                        <View style={styles.fiftyPercent}>
                            <Button
                                icon="content-save-outline"
                                mode="elevated"
                                onPress={saveButtonPressed}
                                style={styles.button}
                                labelStyle={styles.fontStyle}
                            >
                                Save
                            </Button>
                        </View>
                        <View style={styles.fiftyPercent}>
                            <Button
                                icon="close-box-outline"
                                mode="elevated"
                                buttonColor={theme.colors.inversePrimary}
                                onPress={() => { navigation.goBack() }}
                                style={styles.button}
                                labelStyle={styles.fontStyle}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>

            </ScreenWrapper>
        </TextInputAvoidingView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    footer: {
        flex: 1,
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
    fiftyPercentContainer: {
        flex: 1,
        margin: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    fiftyPercent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        marginHorizontal: 10,
    },
    button: {
        flex: 1,
    },
    fontStyle: {
        fontSize: 22,
        lineHeight: 30,
        margin: 5
    }
});

export default MarkerDetails;
