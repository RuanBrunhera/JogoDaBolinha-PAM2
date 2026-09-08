import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

import React, { useEffect } from 'react';

export default function Exemplo11() {
    useEffect(() => {
        const subscription = Accelerometer.addListener((data) => {
            console.log(data);
        });

        return () => {
            subscription.remove();
        };
    }, []);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Acelerômetro</Text>

            <Text>X: --</Text>
            <Text>Y: --</Text>
            <Text>Z: --</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
});