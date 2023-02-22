import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput,HelperText, useTheme } from "react-native-paper";

import hasMessage from "../utils/CatchErrorMessage";

interface DeviceIDTextInputProps {
    onChangeText: (text: string) => void;
    triggerError: boolean;
}

const DeviceIDTextInput: React.FC<DeviceIDTextInputProps> = ({ onChangeText,triggerError }) => {
    const theme= useTheme();

    // const [deviceId,setDeviceId]= useState("");
    // const [showXIcon, setShowXIcon] = useState<boolean>(false);
    const [errorBool, setErrorBool]= useState<boolean>(false);

    const [existingDeviceIDs, setExistingDeviceIDs] = useState<readonly string[]>([]);

    useEffect(() => {
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

    useEffect(()=>{
        setErrorBool(triggerError)
    },[triggerError])

    function validateDeviceID(deviceId: string) {
        if (existingDeviceIDs.includes(deviceId)) {
            setErrorBool(true);
        } else {
            setErrorBool(false);
            onChangeText(deviceId);
        }
    }

    function renderXIcon() {
        if (errorBool) {
            return <TextInput.Icon icon="close-circle-outline" color={theme.colors.error} />
        } else {
            return null
        }
    }

    return (
        <View style={styles.inputContainerStyle}>
            <TextInput
                label="Device ID"
                placeholder="Enter unique device id"
                onChangeText={validateDeviceID}
                right={renderXIcon()}
                error={errorBool}

                mode='outlined'
                theme={{
                    roundness:25
                }}
            />
            <HelperText type="error" visible={errorBool}>
                Device ID must be unique
            </HelperText>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        flex:1,
        marginHorizontal: 10,
    }
});

export default DeviceIDTextInput;