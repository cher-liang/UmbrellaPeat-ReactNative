import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface MapButtonProps {
    onPressIn: () => void;
    onPressOut?: () => void;
}

const MyLocationButton: React.FC<MapButtonProps> = ({ onPressIn, onPressOut }) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={{ backgroundColor: theme.colors.secondaryContainer, ...styles.button }}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <MaterialIcons name="my-location" color={theme.colors.onSecondaryContainer} size={38}/>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    button: {
        // elevated effect
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 3, // Android

        width: 66,
        height: 66,
        borderRadius: 33,
        marginBottom: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyLocationButton;