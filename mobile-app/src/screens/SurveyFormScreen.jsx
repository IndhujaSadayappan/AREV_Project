import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, Switch, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

// IMPORTANT: Replace with your actual backend IP/URL
// If testing on physical device, use your computer's local IP
const API_URL = 'http://192.168.43.251:5000/api';

const SurveyFormScreen = ({ navigation }) => {
    const { t, user } = useAppContext();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        numberPlate: '',
        vehicleType: 'Own', // Own or Rent
        investment: '',
        rentalAmount: '',
        dailyKM: '',
        petrolExpense: '',
        dailyIncome: '',
        maintenance: '',
        valueOfAuto: '',
        peakHours: '',
        totalAutosInCity: '',
        nightRideAcceptance: 'No', // Yes or No
        runDaysPerMonth: '',
        monthlyProfit: 0,
    });

    // Profit Calculation Logic
    useEffect(() => {
        const dailyIncome = parseFloat(formData.dailyIncome) || 0;
        const runDays = parseFloat(formData.runDaysPerMonth) || 0;
        const petrol = parseFloat(formData.petrolExpense) || 0;
        const maintenance = parseFloat(formData.maintenance) || 0;
        const rental = parseFloat(formData.rentalAmount) || 0;

        let profit = 0;
        if (formData.vehicleType === 'Own') {
            profit = (dailyIncome * runDays) - petrol - maintenance;
        } else {
            profit = (dailyIncome * runDays) - rental - petrol - maintenance;
        }

        setFormData(prev => ({ ...prev, monthlyProfit: profit.toFixed(2) }));
    }, [
        formData.dailyIncome, formData.runDaysPerMonth,
        formData.petrolExpense, formData.maintenance,
        formData.rentalAmount, formData.vehicleType
    ]);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const validate = () => {
        const errors = [];

        // Basic required fields
        if (!formData.name.trim()) errors.push(t.name);

        // Contact validation (10 digits)
        const contactReg = /^[0-9]{10}$/;
        if (!contactReg.test(formData.contact)) {
            errors.push(`${t.contact} (10 digits)`);
        }

        if (!formData.numberPlate.trim()) errors.push(t.numberPlate);

        // Numeric validations
        const checkPositive = (val, fieldLabel) => {
            const num = parseFloat(val);
            if (isNaN(num) || num < 0) {
                errors.push(`${fieldLabel} (Must be positive number)`);
            }
        };

        if (formData.vehicleType === 'Own') {
            checkPositive(formData.investment, t.investment);
            checkPositive(formData.valueOfAuto, t.valueOfAuto);
        } else {
            checkPositive(formData.rentalAmount, t.rentalAmount);
        }

        checkPositive(formData.dailyKM, t.dailyKM);
        checkPositive(formData.dailyIncome, t.dailyIncome);
        checkPositive(formData.petrolExpense, t.petrolExpense);
        checkPositive(formData.maintenance, t.maintenance);
        checkPositive(formData.runDaysPerMonth, t.runDaysPerMonth);

        // Logical check for run days
        if (parseInt(formData.runDaysPerMonth) > 31) {
            errors.push(`${t.runDaysPerMonth} (Max 31 days)`);
        }

        if (!formData.peakHours.trim()) errors.push(t.peakHours);
        checkPositive(formData.totalAutosInCity, t.totalAutosInCity);

        if (errors.length > 0) {
            Alert.alert(
                'Validation Error',
                'Please correct the following fields:\n\n' + errors.join('\n')
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                city: user.city,
                personId: user.personId,
                // Convert numbers
                investment: formData.vehicleType === 'Own' ? parseFloat(formData.investment) : null,
                rentalAmount: formData.vehicleType === 'Rent' ? parseFloat(formData.rentalAmount) : null,
                valueOfAuto: formData.vehicleType === 'Own' ? parseFloat(formData.valueOfAuto) : null,
                dailyKM: parseFloat(formData.dailyKM),
                petrolExpense: parseFloat(formData.petrolExpense),
                dailyIncome: parseFloat(formData.dailyIncome),
                maintenance: parseFloat(formData.maintenance),
                totalAutosInCity: parseInt(formData.totalAutosInCity),
                runDaysPerMonth: parseInt(formData.runDaysPerMonth),
                monthlyProfit: parseFloat(formData.monthlyProfit),
            };

            await axios.post(`${API_URL}/surveys`, payload);

            Alert.alert('Success', t.success);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', `${t.error}\n${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, field, keyboardType = 'default') => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={formData[field].toString()}
                onChangeText={(val) => handleInputChange(field, val)}
                keyboardType={keyboardType}
                placeholder={`Enter ${label}`}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t.newSurvey}</Text>
                <View style={{ width: 20 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderInput(t.name, 'name')}
                {renderInput(t.contact, 'contact', 'phone-pad')}
                {renderInput(t.numberPlate, 'numberPlate')}

                {/* Vehicle Type Toggle */}
                <View style={styles.typeContainer}>
                    <Text style={styles.label}>{t.vehicleType}</Text>
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, formData.vehicleType === 'Own' && styles.typeBtnActive]}
                            onPress={() => handleInputChange('vehicleType', 'Own')}
                        >
                            <Text style={[styles.typeBtnText, formData.vehicleType === 'Own' && styles.typeBtnTextActive]}>{t.own}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, formData.vehicleType === 'Rent' && styles.typeBtnActive]}
                            onPress={() => handleInputChange('vehicleType', 'Rent')}
                        >
                            <Text style={[styles.typeBtnText, formData.vehicleType === 'Rent' && styles.typeBtnTextActive]}>{t.rent}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {formData.vehicleType === 'Own' ? (
                    <>
                        {renderInput(t.investment, 'investment', 'numeric')}
                        {renderInput(t.valueOfAuto, 'valueOfAuto', 'numeric')}
                    </>
                ) : (
                    renderInput(t.rentalAmount, 'rentalAmount', 'numeric')
                )}

                {renderInput(t.dailyKM, 'dailyKM', 'numeric')}
                {renderInput(t.dailyIncome, 'dailyIncome', 'numeric')}
                {renderInput(t.petrolExpense, 'petrolExpense', 'numeric')}
                {renderInput(t.maintenance, 'maintenance', 'numeric')}
                {renderInput(t.runDaysPerMonth, 'runDaysPerMonth', 'numeric')}
                {renderInput(t.peakHours, 'peakHours')}
                {renderInput(t.totalAutosInCity, 'totalAutosInCity', 'numeric')}

                {/* Night Ride */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t.nightRideAcceptance}</Text>
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, formData.nightRideAcceptance === 'Yes' && styles.typeBtnActive]}
                            onPress={() => handleInputChange('nightRideAcceptance', 'Yes')}
                        >
                            <Text style={[styles.typeBtnText, formData.nightRideAcceptance === 'Yes' && styles.typeBtnTextActive]}>{t.yes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, formData.nightRideAcceptance === 'No' && styles.typeBtnActive]}
                            onPress={() => handleInputChange('nightRideAcceptance', 'No')}
                        >
                            <Text style={[styles.typeBtnText, formData.nightRideAcceptance === 'No' && styles.typeBtnTextActive]}>{t.no}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profit Display */}
                <View style={styles.profitCard}>
                    <Text style={styles.profitLabel}>{t.monthlyProfitLabel}</Text>
                    <Text style={styles.profitValue}>Rs. {formData.monthlyProfit}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitBtnText}>{t.submit}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        fontSize: 24,
        color: '#1a73e8',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    typeContainer: {
        marginBottom: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 10,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f9fa',
    },
    typeBtnActive: {
        backgroundColor: '#1a73e8',
        borderColor: '#1a73e8',
    },
    typeBtnText: {
        color: '#666',
        fontWeight: 'bold',
    },
    typeBtnTextActive: {
        color: '#fff',
    },
    profitCard: {
        backgroundColor: '#e8f0fe',
        padding: 20,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a73e8',
    },
    profitLabel: {
        fontSize: 14,
        color: '#1a73e8',
        marginBottom: 5,
    },
    profitValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    submitBtn: {
        backgroundColor: '#28a745',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledBtn: {
        opacity: 0.7,
    },
});

export default SurveyFormScreen;
