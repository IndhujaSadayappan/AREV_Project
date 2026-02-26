import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

const SplashScreen = ({ navigation }) => {
    const { t } = useAppContext();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>AREV Consultancy</Text>
                <Text style={styles.subtitle}>Chennai</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>{t.continue}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',  // ✅ Center vertically
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    subtitle: {
        fontSize: 22,
        color: '#5f6368',
        marginTop: 5,
    },
    button: {
        backgroundColor: '#1a73e8',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        elevation: 3,
        marginTop: 40, // spacing between text and button
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SplashScreen;