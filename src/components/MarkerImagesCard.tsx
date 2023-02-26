import { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    Image,
    // TextInput
} from "react-native"

import {
    Card,
    IconButton,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import hasAndroidPermission from '../utils/RequestCameraRollPermission'

interface CommonMarkerImagesCardProps {
    compact?: true
}
type ConditionalMarkerImagesCardProps =
    | {
        onPhotoURIsChange: (photoURIs: string[]) => void,
        readonly?: never,
        displayPhotoURIs?: never,
    }
    | {
        readonly: true,
        displayPhotoURIs: string[],
        onPhotoURIsChange?: never,
    }

type MarkerImagesCardProps = CommonMarkerImagesCardProps & ConditionalMarkerImagesCardProps;

const MarkerImagesCard: React.FC<MarkerImagesCardProps> = ({ readonly, compact, displayPhotoURIs,onPhotoURIsChange }) => {
    const theme = useTheme();
    const [photoURIs, setPhotoURIs] = useState<string[]>([]);

    useMemo(() => { if (!readonly) { onPhotoURIsChange!(photoURIs); } }, [photoURIs]);

    async function getPhotos() {
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            return;
        }

        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (!result.didCancel) {
            setPhotoURIs(photoURIs.concat(result!.assets!.map(asset => asset!["uri"]!)));
        }
    }

    function renderImagesOnly(){
        const ImagesOnly:JSX.Element[] = [];
        for (let i in displayPhotoURIs!){
            ImagesOnly.push(imageContainer(`images_${i}`,displayPhotoURIs[i]))
        }
        return (
            <ScrollView
                style={styles.contentContainerCompactPadding}
                horizontal
            >
                {
                    ImagesOnly
                }
            </ScrollView>);
    }

    

    function renderImagesAndButtons() {
        const ButtonsOrImages: JSX.Element[] = [];

        for (let i in photoURIs) {
            ButtonsOrImages.push(imageContainer(`images_${i}`, photoURIs[i]))
        }
        for (let i = 0; i < (3 - photoURIs?.length!); i++) {
            ButtonsOrImages.push(addImageButton(`buttons_${i}`));
        }
        if (photoURIs?.length) {
            ButtonsOrImages.push(deleteButton())
        }

        return (
            <ScrollView
                style={styles.contentContainer}
                horizontal
            >
                {
                    ButtonsOrImages
                }
            </ScrollView>);

    }

    function addImageButton(key: string): JSX.Element {
        return (
            <TouchableOpacity
                key={key}
                style={{ backgroundColor: theme.colors.secondaryContainer, ...styles.buttonOrImageContainer }}
                onPress={getPhotos}
            >
                <Icons name="plus" color={theme.colors.onSecondaryContainer} size={38} />
            </TouchableOpacity>
        )
    }

    function deleteButton(): JSX.Element {
        return (
            <TouchableOpacity
                key={'delete'}
                style={{ backgroundColor: theme.colors.error, ...styles.buttonOrImageContainer }}
                onPress={() => { setPhotoURIs([]) }}
            >
                <Icons name="delete-empty" color={theme.colors.onError} size={38} />
            </TouchableOpacity>
        )
    }

    function imageContainer(key: string, uri: string): JSX.Element {
        return (
            <TouchableWithoutFeedback key={key}>
                <Image
                    style={styles.buttonOrImageContainer}
                    resizeMode='cover'
                    source={{ width: 120, height: undefined, uri: uri }}
                />
            </TouchableWithoutFeedback>
        )
    }

    return (
        <Card
            mode='elevated'
            style={styles.inputContainerStyle}
            contentStyle={styles.cardContentStyle}
            onPress={() => { }}
        >
            {!compact
                && <Card.Title
                    title="Images"
                    titleVariant='titleMedium'
                    titleStyle={styles.title}
                    left={(props) => <IconButton size={props.size - 5} icon="image-multiple" />}
                />
            }
            <View style={{ flex: 5 }}>
                {readonly
                    ?renderImagesOnly()
                    :renderImagesAndButtons()
                }
            </View>
        </Card>

    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        flex: 1,
    },
    cardContentStyle: {
        flex: 1,
    },
    title: {
        fontSize: 25,
        top: 7
    },
    contentContainer: {
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    contentContainerCompactPadding: {
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    buttonOrImageContainer: {
        padding: 10,
        marginLeft: 10,
        borderRadius: 10,
        height: '100%',
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MarkerImagesCard;