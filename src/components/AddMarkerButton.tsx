import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface MapButtonProps {
    onPress: () => void;
}

const AddMarkerButton: React.FC<MapButtonProps> = ({ onPress }) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={{ backgroundColor: theme.colors.secondaryContainer, ...styles.button }}
            onPress={onPress}
        >
            <Icon name="plus-circle-outline" color={theme.colors.onSecondaryContainer} size={38}/>
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

export default AddMarkerButton;