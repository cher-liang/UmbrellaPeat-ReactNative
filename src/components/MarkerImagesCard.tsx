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
import RNFS from 'react-native-fs';

import hasAndroidPermission from '../utils/RequestCameraRollPermission'

interface MarkerImagesCardProps {
    // latitude: string,
    // longitude: string,
    // what3words: string | undefined,
    // onLatLngChange: (lat: string, lng: string) => void
}
const MarkerImagesCard: React.FC<MarkerImagesCardProps> = ({ }) => {
    const theme = useTheme();
    const [photoURIs, setPhotoURIs] = useState<string[]>([]);

    async function getPhotos() {
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            return;
        }

        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (!result.didCancel){
            setPhotoURIs(photoURIs.concat(result!.assets!.map(asset => asset!["uri"]!)));
        }
    }

    function renderImagesAndButtons() {
        const ButtonsOrImages: JSX.Element[] = []

        for (let i in photoURIs) {
            ButtonsOrImages.push(imageContainer(`images_${i}`, photoURIs[i]))
        }
        for (let i = 0; i < (3 - photoURIs?.length!); i++) {
            ButtonsOrImages.push(addImageButton(`buttons_${i}`));
        }
        if (photoURIs?.length){
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

    function addImageButton(key: string):JSX.Element {
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

    function deleteButton():JSX.Element {
        return (
            <TouchableOpacity
                key={'delete'}
                style={{ backgroundColor: theme.colors.error, ...styles.buttonOrImageContainer }}
                onPress={()=>{setPhotoURIs([])}}
            >
                <Icons name="delete-empty" color={theme.colors.onError} size={38} />
            </TouchableOpacity>
        )
    }

    function imageContainer(key: string, uri: string):JSX.Element {
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
            <Card.Title
                title="Images"
                titleVariant='titleMedium'
                titleStyle={styles.title}
                left={(props) => <IconButton size={props.size - 5} icon="image-multiple" />}
            />
            <View style={{ flex: 5 }}>
                {
                    renderImagesAndButtons()
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
        // flexGrow:1,
        flexDirection: "row",
        // justifyContent:"space-between",
        // backgroundColor:'yellow',
        width: '100%',
        // rowGap:10,  
        paddingHorizontal: 25,
        paddingBottom: 15,
    },
    buttonOrImageContainer: {
        padding: 10,
        marginLeft: 10,
        borderRadius: 10,
        height: '90%',
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MarkerImagesCard;