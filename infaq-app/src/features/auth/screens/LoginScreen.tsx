import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { useLoginMutation } from '@/services/api/authApi';
import type { ApiErrorResponse } from '../types';

// Simple phone number validator
const isValidPhoneNumber = (phone: string): boolean =>
    /^\d{7,15}$/.test(phone.trim());

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen(): React.JSX.Element {
    const navigation = useNavigation<LoginNavProp>();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [fieldError, setFieldError] = useState<string>('');

    const [login, { isLoading, error }] = useLoginMutation();

    // Extract server error message
    const serverError =
        error && 'data' in error
            ? (error as ApiErrorResponse).data?.message ?? 'Something went wrong.'
            : error
                ? 'Unable to reach the server. Check your connection.'
                : null;

    const handleGetOtp = useCallback(async () => {
        setFieldError('');

        if (!phoneNumber.trim()) {
            setFieldError('Phone number is required.');
            return;
        }
        if (!isValidPhoneNumber(phoneNumber)) {
            setFieldError('Please enter a valid phone number.');
            return;
        }

        try {
            await login({
                mobile_number: phoneNumber.trim(),
            }).unwrap();

            navigation.navigate('OtpVerification', {
                phoneNumber: phoneNumber.trim(),
                countryCode: '+91',
            });
        } catch (err) {
            // Error handled via RTK Query error state below
            console.log(err)
        }
    }, [phoneNumber, login, navigation]);

    const handlePhoneChange = useCallback((text: string) => {
        // Only allow digits
        const cleaned = text.replace(/\D/g, '');
        setPhoneNumber(cleaned);
        if (fieldError) setFieldError('');
    }, [fieldError]);

    const displayError = fieldError || serverError;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Mosque Icon ── */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.mosqueIcon}>🕌</Text>
                    </View>

                    {/* ── Heading ── */}
                    <Text style={styles.heading}>Welcome Back</Text>
                    <Text style={styles.subheading}>
                        Please enter your phone number to sign in{'\n'}and continue your journey of giving.
                    </Text>

                    {/* ── Phone Number Section ── */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Phone Number</Text>

                        <View
                            style={[
                                styles.inputRow,
                                displayError ? styles.inputRowError : null,
                            ]}
                        >
                            {/* Country Code Picker (static for now) */}
                            <TouchableOpacity
                                style={styles.countryPicker}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="Select country code"
                            >
                                <Text style={styles.countryCode}>+91</Text>
                                <Text style={styles.chevron}>▾</Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.inputDivider} />

                            {/* Phone Input */}
                            <View style={styles.phoneInputWrapper}>
                                <Text style={styles.phoneIcon}>📞</Text>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="Enter phone number"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="phone-pad"
                                    returnKeyType="done"
                                    maxLength={15}
                                    value={phoneNumber}
                                    onChangeText={handlePhoneChange}
                                    onSubmitEditing={handleGetOtp}
                                    accessibilityLabel="Phone number input"
                                    testID="phone-input"
                                />
                            </View>
                        </View>

                        {/* Error or OTP hint */}
                        {displayError ? (
                            <View style={styles.hintRow}>
                                <Text style={styles.errorText}>{displayError}</Text>
                            </View>
                        ) : (
                            <View style={styles.hintRow}>
                                <Text style={styles.hintIcon}>ℹ</Text>
                                <Text style={styles.hintText}>
                                    We will send you a One Time Password (OTP) to this mobile number.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ── Get OTP Button ── */}
                    <TouchableOpacity
                        style={[styles.otpButton, isLoading && styles.otpButtonDisabled]}
                        onPress={handleGetOtp}
                        disabled={isLoading}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Get OTP"
                        testID="get-otp-button"
                    >
                        {isLoading ? (
                            <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                            <Text style={styles.otpButtonText}>Get OTP  →</Text>
                        )}
                    </TouchableOpacity>

                    {/* ── Or continue with ── */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* ── Biometric Buttons ── */}
                    <View style={styles.biometricRow}>
                        <TouchableOpacity
                            style={styles.biometricButton}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Sign in with Face ID"
                        >
                            <Text style={styles.biometricIcon}>🧑</Text>
                            <Text style={styles.biometricLabel}>Face ID</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.biometricButton}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Sign in with Touch ID"
                        >
                            <Text style={styles.biometricIcon}>☝️</Text>
                            <Text style={styles.biometricLabel}>Touch ID</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Sign Up Footer ── */}
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            accessibilityRole="button"
                            accessibilityLabel="Sign up"
                        >
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing['5xl'],
        paddingBottom: Spacing['2xl'],
    },

    // ── Icon ──
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: Radius.full,
        backgroundColor: Colors.primarySurface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    mosqueIcon: {
        fontSize: 36,
    },

    // ── Heading ──
    heading: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
        letterSpacing: -0.3,
    },
    subheading: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.regular,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing['3xl'],
    },

    // ── Field Section ──
    fieldSection: {
        width: '100%',
        marginBottom: Spacing.xl,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semiBold,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    // ── Input Row ──
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        height: 54,
    },
    inputRowError: {
        borderColor: Colors.error,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        gap: Spacing.xs,
    },
    countryCode: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.textPrimary,
    },
    chevron: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 1,
    },
    inputDivider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.border,
    },
    phoneInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
    },
    phoneIcon: {
        fontSize: FontSize.base,
    },
    phoneInput: {
        flex: 1,
        fontSize: FontSize.base,
        color: Colors.textPrimary,
        paddingVertical: 0,
        height: '100%',
    },

    // ── Hint & Error ──
    hintRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: Spacing.sm,
        gap: Spacing.xs,
    },
    hintIcon: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        lineHeight: 18,
    },
    hintText: {
        flex: 1,
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        lineHeight: 18,
    },
    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error,
        lineHeight: 18,
    },

    // ── OTP Button ──
    otpButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    otpButtonDisabled: {
        opacity: 0.65,
    },
    otpButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semiBold,
        color: Colors.white,
        letterSpacing: 0.2,
    },

    // ── Divider ──
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: Spacing.xl,
        gap: Spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.divider,
    },
    dividerText: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        fontWeight: FontWeight.regular,
    },

    // ── Biometric ──
    biometricRow: {
        flexDirection: 'row',
        width: '100%',
        gap: Spacing.md,
        marginBottom: Spacing['3xl'],
    },
    biometricButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        height: 52,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        backgroundColor: Colors.white,
    },
    biometricIcon: {
        fontSize: FontSize.lg,
    },
    biometricLabel: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.textPrimary,
    },

    // ── Footer ──
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        fontWeight: FontWeight.regular,
    },
    footerLink: {
        fontSize: FontSize.base,
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
