import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { useGetPledgeQuery, useCreateOrUpdatePledgeMutation } from '@/services/api/pledgeApi';

// ── Types & Constants ───────────────────────────────────────────────────────
type ManagePledgeNavProp = NativeStackNavigationProp<RootStackParamList, 'ManagePledge'>;

interface AmountOption {
    readonly label: string;
    readonly value: number;
    readonly popular?: boolean;
}

const AMOUNT_OPTIONS: readonly AmountOption[] = [
    { label: '₹100', value: 100 },
    { label: '₹500', value: 500, popular: true },
    { label: '₹1000', value: 1000 },
    { label: '₹2k', value: 2000 },
] as const;

export default function ManagePledgeScreen(): React.JSX.Element {
    const navigation = useNavigation<ManagePledgeNavProp>();

    const { data: pledgeData, isLoading: isPledgeLoading } = useGetPledgeQuery();
    const currentPledge = pledgeData?.data.pledge;

    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>('');

    const [updatePledge, { isLoading: isUpdating }] = useCreateOrUpdatePledgeMutation();

    useEffect(() => {
        if (currentPledge?.amount) {
            const amount = currentPledge.amount;
            const isStandard = AMOUNT_OPTIONS.some(opt => opt.value === amount);
            if (isStandard) {
                setSelectedAmount(amount);
            } else {
                setCustomAmount(amount.toString());
            }
        }
    }, [currentPledge]);

    const handleAmountSelect = useCallback((value: number) => {
        setSelectedAmount(value);
        setCustomAmount('');
    }, []);

    const handleCustomAmountChange = useCallback((text: string) => {
        const cleaned = text.replace(/\D/g, '');
        setCustomAmount(cleaned);
        if (cleaned) {
            setSelectedAmount(0); // deselect preset when custom is typed
        }
    }, []);

    const handleUpdatePledge = useCallback(async () => {
        const amount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

        if (!amount || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please select or enter a valid donation amount.');
            return;
        }

        try {
            await updatePledge({
                amount,
                frequency: 'monthly',
            }).unwrap();

            Alert.alert('Success', 'Your pledge has been updated successfully.', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
            ]);
        } catch (err: any) {
            const errorMsg = err?.data?.message || 'Failed to update pledge. Please try again.';
            Alert.alert('Error', errorMsg);
        }
    }, [customAmount, selectedAmount, updatePledge, navigation]);

    if (isPledgeLoading) {
        return (
            <View style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* ── Header Row ── */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.backText}>← BACK</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Giving Icon ── */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.givingIcon}>⚙️</Text>
                    </View>

                    {/* ── Title ── */}
                    <Text style={styles.titleLine1}>Manage Your</Text>
                    <Text style={styles.titleLine2}>Monthly Contribution</Text>

                    <Text style={styles.subtitle}>
                        Update your recurring impact with seamless UPI payments.
                    </Text>

                    {/* ── Amount Selection ── */}
                    <Text style={styles.sectionLabel}>SELECT NEW AMOUNT</Text>

                    <View style={styles.amountsRow}>
                        {AMOUNT_OPTIONS.map((option) => {
                            const isSelected = selectedAmount === option.value;
                            return (
                                <View key={option.value} style={styles.chipWrapper}>
                                    {option.popular ? (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularBadgeText}>Popular</Text>
                                        </View>
                                    ) : null}
                                    <TouchableOpacity
                                        style={[
                                            styles.chip,
                                            isSelected ? styles.chipSelected : styles.chipDefault,
                                        ]}
                                        onPress={() => handleAmountSelect(option.value)}
                                        activeOpacity={0.75}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected: isSelected }}
                                        accessibilityLabel={`Select ${option.label}`}
                                    >
                                        <Text
                                            style={[
                                                styles.chipLabel,
                                                isSelected
                                                    ? styles.chipLabelSelected
                                                    : styles.chipLabelDefault,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>

                    {/* ── Custom Amount Card ── */}
                    <View style={styles.customCard}>
                        <Text style={styles.customCardLabel}>Or enter a custom amount</Text>

                        <View style={styles.customInputRow}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <TextInput
                                style={styles.customInput}
                                value={customAmount}
                                onChangeText={handleCustomAmountChange}
                                placeholder="0"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                accessibilityLabel="Custom donation amount"
                                testID="custom-amount-input"
                            />
                        </View>

                        <View style={styles.billingRow}>
                            <Text style={styles.billingIcon}>↻</Text>
                            <Text style={styles.billingText}>Billed monthly via UPI</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* ── Bottom CTA (outside scroll so it stays pinned) ── */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
                        onPress={handleUpdatePledge}
                        activeOpacity={0.85}
                        disabled={isUpdating}
                        accessibilityRole="button"
                        accessibilityLabel="Update pledge"
                    >
                        {isUpdating ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.updateButtonText}>Update Pledge  →</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F5FAF6', 
    },

    // ── Header ──
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    backText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.textMuted,
        letterSpacing: 0.5,
    },

    // ── Scroll ──
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xl,
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
    givingIcon: {
        fontSize: 36,
    },

    // ── Title ──
    titleLine1: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    titleLine2: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: Spacing.md,
    },
    subtitle: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing['2xl'],
    },

    // ── Section Label ──
    sectionLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semiBold,
        color: Colors.textMuted,
        letterSpacing: 1.2,
        textAlign: 'center',
        marginBottom: Spacing.base,
    },

    // ── Amount Chips ──
    amountsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing['2xl'],
        alignItems: 'flex-end',
    },
    chipWrapper: {
        alignItems: 'center',
        position: 'relative',
    },
    popularBadge: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        marginBottom: -8,
        zIndex: 1,
        elevation: 2,
    },
    popularBadgeText: {
        fontSize: 10,
        fontWeight: FontWeight.semiBold,
        color: Colors.white,
    },
    chip: {
        width: 70,
        height: 70,
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    chipSelected: {
        borderColor: Colors.primary,
        borderWidth: 2,
        backgroundColor: Colors.white,
    },
    chipDefault: {
        borderColor: Colors.border,
        backgroundColor: Colors.white,
    },
    chipLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semiBold,
    },
    chipLabelSelected: {
        color: Colors.primary,
    },
    chipLabelDefault: {
        color: Colors.textPrimary,
    },

    // ── Custom Amount Card ──
    customCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: Spacing.lg,
    },
    customCardLabel: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        marginBottom: Spacing.base,
        textAlign: 'center',
    },
    customInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceGray,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.base,
        width: '100%',
        height: 52,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    rupeeSymbol: {
        fontSize: FontSize.xl,
        color: Colors.textMuted,
        fontWeight: FontWeight.regular,
    },
    customInput: {
        flex: 1,
        fontSize: FontSize.xl,
        color: Colors.textPrimary,
        paddingVertical: 0,
    },
    billingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    billingIcon: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
    billingText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },

    // ── Bottom CTA ──
    bottomSection: {
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.sm,
        backgroundColor: '#F5FAF6',
        alignItems: 'center',
    },
    updateButton: {
        width: '100%',
        height: 60,
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: Spacing.md,
    },
    updateButtonDisabled: {
        opacity: 0.7,
        backgroundColor: Colors.textMuted,
    },
    updateButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semiBold,
        color: Colors.white,
        letterSpacing: 0.2,
    },
});
