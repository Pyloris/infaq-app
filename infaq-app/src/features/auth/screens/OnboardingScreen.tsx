import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { useOnboardUserMutation } from '@/services/api/authApi';
import { ActivityIndicator, Alert } from 'react-native';

type OnboardingNavProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen(): React.JSX.Element {
    const navigation = useNavigation<OnboardingNavProp>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const [onboardUser, { isLoading }] = useOnboardUserMutation();

    const handleCompleteSetup = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            await onboardUser({
                name: fullName.trim(),
                email: email.trim(),
            }).unwrap();

            navigation.navigate('Dashboard');
        } catch (err) {
            console.error('Onboarding failed:', err);
            Alert.alert('Error', 'Failed to complete setup. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Spacer for top margin */}
                    <View style={{ height: Spacing['5xl'] }} />

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>Join our community of giving</Text>

                    {/* Profile Card */}
                    <View style={styles.card}>
                        {/* Form Fields */}
                        <View style={styles.form}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>👤</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Abdullah Rahman"
                                    placeholderTextColor={Colors.textMuted}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>

                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>✉️</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="abdullah@example.com"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            {/* Security Note */}
                            <View style={styles.securityNote}>
                                <View style={styles.securityIconContainer}>
                                    <Text style={styles.securityIcon}>🛡️</Text>
                                </View>
                                <View style={styles.securityTextContainer}>
                                    <Text style={styles.securityTitle}>SECURE LEDGER</Text>
                                    <Text style={styles.securityDesc}>
                                        Your data is encrypted and remains private.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.7 }]}
                        onPress={handleCompleteSetup}
                        disabled={isLoading}
                        activeOpacity={0.9}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.buttonText}>Complete Setup  →</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F7F5', // Light green background to simulate the pattern
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing['3xl'],
        alignItems: 'center',
    },
    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.base,
        color: Colors.primaryLight,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    card: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing['2xl'],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 10,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: Colors.primaryLight,
        marginBottom: Spacing.xs,
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
        height: 54,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: Spacing.sm,
        opacity: 0.5,
    },
    input: {
        flex: 1,
        fontSize: FontSize.base,
        color: Colors.textPrimary,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F7F4',
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginTop: Spacing.sm,
    },
    securityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: Radius.full,
        backgroundColor: '#D1E7DD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    securityIcon: {
        fontSize: 20,
    },
    securityTextContainer: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: '#0F5132',
        marginBottom: 2,
    },
    securityDesc: {
        fontSize: 10,
        color: '#0F5132',
        opacity: 0.8,
    },
    button: {
        width: '100%',
        height: 60,
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    footerText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    footerLink: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
