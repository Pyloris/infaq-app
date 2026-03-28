import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { useVerifyOtpMutation, useLoginMutation } from '@/services/api/authApi';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '../authSlice';
import type { ApiErrorResponse } from '../types';

// ── Constants ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 4;
const RESEND_COUNTDOWN_SECONDS = 60;

type OtpNavProp = NativeStackNavigationProp<RootStackParamList, 'OtpVerification'>;
type OtpRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;

// ── Helper ─────────────────────────────────────────────────────────────────
function formatCountdown(seconds: number): string {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function OtpVerificationScreen(): React.JSX.Element {
    const navigation = useNavigation<OtpNavProp>();
    const route = useRoute<OtpRouteProp>();
    const dispatch = useAppDispatch();

    const { phoneNumber, countryCode } = route.params;
    const maskedPhone = `${countryCode} ${phoneNumber}`;

    // OTP digit state — array of 4 single-character strings
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [fieldError, setFieldError] = useState<string>('');
    const [countdown, setCountdown] = useState<number>(RESEND_COUNTDOWN_SECONDS);
    const [canResend, setCanResend] = useState<boolean>(false);

    // Refs for focusing each input box
    const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

    // RTK Query mutations
    const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
    const [login, { isLoading: isResending }] = useLoginMutation();

    // Server error extraction
    const serverError =
        error && 'data' in error
            ? (error as ApiErrorResponse).data?.message ?? 'Verification failed.'
            : error
                ? 'Unable to verify. Check your connection.'
                : null;

    const displayError = fieldError || serverError;

    // ── Countdown Timer ────────────────────────────────────────────────────
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-focus first input on mount
    useEffect(() => {
        const timeout = setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 400);
        return () => clearTimeout(timeout);
    }, []);

    // ── Digit Change Handler ───────────────────────────────────────────────
    const handleDigitChange = useCallback((text: string, index: number) => {
        if (fieldError) setFieldError('');

        // Only accept single digit
        const digit = text.replace(/\D/g, '').slice(-1);
        const updated = [...digits];
        updated[index] = digit;
        setDigits(updated);

        // Advance focus to next box
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [digits, fieldError]);

    // ── Backspace Handler ──────────────────────────────────────────────────
    const handleKeyPress = useCallback(
        (key: string, index: number) => {
            if (key === 'Backspace') {
                if (!digits[index] && index > 0) {
                    // Clear previous box and move focus back
                    const updated = [...digits];
                    updated[index - 1] = '';
                    setDigits(updated);
                    inputRefs.current[index - 1]?.focus();
                }
            }
        },
        [digits],
    );

    // ── Verify Handler ─────────────────────────────────────────────────────
    const handleVerify = useCallback(async () => {
        setFieldError('');
        const otp = digits.join('');

        if (otp.length < OTP_LENGTH) {
            setFieldError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
            return;
        }

        try {
            const result = await verifyOtp({
                mobile_number: phoneNumber,
                otp
            }).unwrap();

            console.log(result);

            // On success, store token
            dispatch(setCredentials({ token: result.data.token }));

            // On success, check onboarding and navigate accordingly
            if (result.data.onboarding_required) {
                // If onboarding required, navigate accordingly
                navigation.navigate('Onboarding');
            } else {
                navigation.navigate('Dashboard');
            }
        } catch (err) {
            // Handled via RTK Query error state
        }
    }, [digits, phoneNumber, verifyOtp, dispatch, navigation]);

    // ── Resend Handler ─────────────────────────────────────────────────────
    const handleResend = useCallback(async () => {
        if (!canResend || isResending) return;
        try {
            await login({ mobile_number: phoneNumber }).unwrap();
            // Reset state
            setDigits(Array(OTP_LENGTH).fill(''));
            setFieldError('');
            setCountdown(RESEND_COUNTDOWN_SECONDS);
            setCanResend(false);
            inputRefs.current[0]?.focus();
        } catch {
            // Silently fail — user can retry
        }
    }, [canResend, isResending, phoneNumber, countryCode]);

    const otp = digits.join('');
    const isButtonDisabled = isLoading || otp.length < OTP_LENGTH;

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
                    {/* ── Back Button ── */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    {/* ── Shield Icon with Badge ── */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.shieldIcon}>🛡️</Text>
                        <View style={styles.checkBadge}>
                            <Text style={styles.checkBadgeTick}>✓</Text>
                        </View>
                    </View>

                    {/* ── Heading ── */}
                    <Text style={styles.heading}>Verify Your Number</Text>
                    <Text style={styles.subheadingLine1}>
                        We have sent a verification code to
                    </Text>
                    <Text style={styles.phoneDisplay}>{maskedPhone}</Text>

                    {/* ── OTP Input Boxes ── */}
                    <View style={styles.otpRow}>
                        {Array.from({ length: OTP_LENGTH }).map((_, idx) => {
                            const isFocusedBox = !digits[idx] && digits.slice(0, idx).every(Boolean);
                            const isFilled = Boolean(digits[idx]);
                            const isActive = isFilled || isFocusedBox;

                            return (
                                <TextInput
                                    key={idx}
                                    ref={(ref) => {
                                        inputRefs.current[idx] = ref;
                                    }}
                                    style={[
                                        styles.otpBox,
                                        isActive
                                            ? styles.otpBoxActive
                                            : styles.otpBoxInactive,
                                    ]}
                                    value={digits[idx]}
                                    onChangeText={(text) => handleDigitChange(text, idx)}
                                    onKeyPress={({ nativeEvent }) =>
                                        handleKeyPress(nativeEvent.key, idx)
                                    }
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                    caretHidden
                                    accessibilityLabel={`OTP digit ${idx + 1}`}
                                    testID={`otp-input-${idx}`}
                                />
                            );
                        })}
                    </View>

                    {/* ── Error Message ── */}
                    {displayError ? (
                        <Text style={styles.errorText}>{displayError}</Text>
                    ) : null}

                    {/* ── Resend Section ── */}
                    <Text style={styles.noCodeText}>Did not receive the code?</Text>
                    <View style={styles.resendRow}>
                        <Text style={styles.resendLabel}>Resend OTP in </Text>
                        {canResend ? (
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={isResending}
                                accessibilityRole="button"
                                accessibilityLabel="Resend OTP"
                            >
                                {isResending ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.primary}
                                    />
                                ) : (
                                    <Text style={styles.resendLink}>Resend now</Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.countdownText}>
                                {formatCountdown(countdown)}
                            </Text>
                        )}
                    </View>

                    {/* ── Verify Button ── */}
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            isButtonDisabled && styles.verifyButtonDisabled,
                        ]}
                        onPress={handleVerify}
                        disabled={isButtonDisabled}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Verify and proceed"
                        testID="verify-button"
                    >
                        {isLoading ? (
                            <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                            <Text style={styles.verifyButtonText}>
                                Verify &amp; Proceed  ✓
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────
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
        paddingTop: Spacing.xl,
        paddingBottom: Spacing['3xl'],
    },

    // ── Back ──
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: Spacing['2xl'],
    },
    backArrow: {
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: FontWeight.medium,
    },

    // ── Shield Icon ──
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: Radius.full,
        backgroundColor: Colors.primarySurface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
        // Badge positioning
        position: 'relative',
    },
    shieldIcon: {
        fontSize: 40,
    },
    checkBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 24,
        height: 24,
        borderRadius: Radius.full,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    checkBadgeTick: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: FontWeight.bold,
        lineHeight: 14,
    },

    // ── Heading ──
    heading: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: Spacing.sm,
    },
    subheadingLine1: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    phoneDisplay: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing['3xl'],
    },

    // ── OTP Boxes ──
    otpRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
        alignSelf: 'flex-start',
        marginLeft: Spacing.xs,
    },
    otpBox: {
        width: 64,
        height: 64,
        borderRadius: Radius.md,
        textAlign: 'center',
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        borderWidth: 1.5,
    },
    otpBoxActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    otpBoxInactive: {
        borderColor: Colors.border,
        backgroundColor: Colors.surfaceGray,
    },

    // ── Error ──
    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error,
        alignSelf: 'flex-start',
        marginBottom: Spacing.md,
        marginLeft: Spacing.xs,
    },

    // ── Resend ──
    noCodeText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.xs,
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing['3xl'],
    },
    resendLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    countdownText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    resendLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },

    // ── Verify Button ──
    verifyButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonDisabled: {
        opacity: 0.55,
    },
    verifyButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semiBold,
        color: Colors.white,
        letterSpacing: 0.2,
    },
});
