import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
    const { t, user, toggleLanguage, logout } = useAppContext();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>{t.welcome},</Text>
                    <Text style={styles.userId}>{user?.personId}</Text>
                </View>
                <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
                    <Text style={styles.langText}>{t.switchTo}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('SurveyForm')}
                >
                    <Text style={styles.menuText}>{t.newSurvey}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>{t.logout}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    welcome: {
        fontSize: 18,
        color: '#666',
    },
    userId: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    langToggle: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#e8f0fe',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1a73e8',
    },
    langText: {
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    menu: {
        flex: 1,
        gap: 20,
    },
    menuItem: {
        backgroundColor: '#ffffff',
        padding: 25,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    menuText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    logoutButton: {
        marginTop: 'auto',
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dc3545',
        borderRadius: 10,
    },
    logoutText: {
        color: '#dc3545',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;
