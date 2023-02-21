import React from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

interface MapButtonProps {
    onPressIn: () => void;
    onPressOut?: () => void;
    source: ImageSourcePropType;
}

const MapButtons: React.FC<MapButtonProps> = ({ onPressIn, onPressOut, source }) => (
    <TouchableOpacity style={styles.button} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Image source={source} style={styles.image} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        marginBottom: 15,
        backgroundColor: '#F6F6F6',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 30,
        height: 30,
    },
});

export default MapButtons;