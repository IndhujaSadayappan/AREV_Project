import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';

const LoginScreen = () => {
    const { t, login } = useAppContext();
    const [city, setCity] = useState('');
    const [personId, setPersonId] = useState('');

    const handleLogin = () => {
        const cityTrimmed = city.trim();
        const personIdTrimmed = personId.trim();

        if (cityTrimmed && personIdTrimmed) {
            login(cityTrimmed, personIdTrimmed);
        } else {
            let errorMsg = 'Please fill all fields';
            if (!cityTrimmed && !personIdTrimmed) {
                errorMsg = 'Please enter City and Person ID';
            } else if (!cityTrimmed) {
                errorMsg = 'Please enter City';
            } else {
                errorMsg = 'Please enter Person ID';
            }
            Alert.alert('Login Error', errorMsg);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.header}>{t.login}</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t.city}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Chennai"
                        value={city}
                        onChangeText={setCity}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t.personId}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. SP001"
                        value={personId}
                        onChangeText={setPersonId}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>{t.login}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#1a73e8',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
