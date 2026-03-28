import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { DASHBOARD_MOCK } from '../mockDashboardData';
import DonutCause from '../components/DonutCause';
import TransactionItem from '../components/TransactionItem';
import BottomTabBar, { BottomTabId } from '@/components/BottomTabBar';
// import PledgeCTA from '@/components/PledgeCTA'; // Removed in favor of in-place CTA
import { useGetMeQuery, useGetDashboardQuery } from '@/services/api/userApi';
import { useGetPledgeQuery } from '@/services/api/pledgeApi';
import { useAppDispatch } from '@/app/hooks';
import { baseApi } from '@/services/baseApi';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen(): React.JSX.Element {
    const navigation = useNavigation<DashboardNavProp>();
    const dispatch = useAppDispatch();

    const [isCausesExpanded, setIsCausesExpanded] = useState(false);

    // Fetch real user data
    const { data: meData } = useGetMeQuery();
    const apiUser = meData?.data.user;

    const { data: pledgeData } = useGetPledgeQuery();
    const pledge = pledgeData?.data.pledge;

    const { data: dashboardData } = useGetDashboardQuery();

    useEffect(() => {
        if (dashboardData) {
            console.log('Dashboard API data:', JSON.stringify(dashboardData, null, 2));
        }
    }, [dashboardData]);

    const { totalContribution: mockTotal, causes: mockCauses, recentTransactions: mockTxns } =
        DASHBOARD_MOCK;

    // Aggregated Contribution from Dashboard API
    const totalContributionFormatted = (dashboardData?.data?.total_contribution !== undefined)
        ? `₹${dashboardData.data.total_contribution.toLocaleString()}`
        : mockTotal.formattedAmount;

    // Aggregated Causes from Dashboard API
    const causesList = dashboardData?.data.causes || mockCauses.map(c => ({
        id: c.id,
        name: c.label,
        percentage: c.percentage,
        icon: c.icon,
        my_contribution: parseFloat(c.formattedAmount.replace(/[^0-9.]/g, ''))
    }));

    const displayedCauses = isCausesExpanded ? causesList : causesList.slice(0, 3);

    // Aggregated Recent Transactions from Dashboard API
    const recentTxnsList = dashboardData?.data.recent_transactions.map(t => ({
        id: t._id,
        title: 'Monthly Donation',
        formattedDate: new Date(t.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        method: 'UPI',
        formattedAmount: `₹${t.amount}`,
        status: (t.status === 'success' || t.status === 'pending' || t.status === 'failed') ? t.status : 'success' as const,
        icon: '🤲'
    })) || mockTxns;

    // Derive avatar initial and display name
    const displayName = apiUser?.name || DASHBOARD_MOCK.user.name;
    const avatarInitial = (apiUser?.name?.[0] || DASHBOARD_MOCK.user.avatarInitial).toUpperCase();

    const handleTabPress = useCallback(
        (tab: BottomTabId) => {
            if (tab === 'home') {
                navigation.navigate('Dashboard');
            } else if (tab === 'impact') {
                navigation.navigate('History');
            } else if (tab === 'profile') {
                navigation.navigate('Profile');
            }
        },
        [navigation],
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* ── Header ──────────────────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerLeft}
                    onPress={() => navigation.navigate('Profile')}
                    accessibilityRole="button"
                    accessibilityLabel="Go to Profile"
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitial}>{avatarInitial}</Text>
                    </View>
                    <View>
                        <Text style={styles.greeting}>Assalamu Alaikum,</Text>
                        <Text style={styles.userName}>{displayName}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => dispatch(baseApi.util.resetApiState())}
                    accessibilityRole="button"
                    accessibilityLabel="Refresh Data"
                    style={styles.refreshButton}
                >
                    <Text style={styles.refreshIcon}>🔄</Text>
                </TouchableOpacity>
            </View>

            {/* PledgeCTA removed here as per request to use in-place CTA */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Total Contribution card ──────────────────────────── */}
                <View style={styles.contributionCard}>
                    {/* Decorative watermark circle */}
                    <View style={styles.cardWatermark} />

                    <View style={styles.cardContent}>
                        <Text style={styles.cardLabel}>Total Contribution</Text>
                        <Text style={styles.cardAmount}>
                            {totalContributionFormatted}
                        </Text>
                        <View style={styles.islamicNoteRow}>
                            <Text style={styles.islamicNoteIcon}>⊕</Text>
                            <Text style={styles.islamicNoteText}>
                                {mockTotal.islamicNote}
                            </Text>
                        </View>
                    </View>

                    {/* Hands icon in top-right */}
                    <View style={styles.cardHandsCircle}>
                        <Text style={styles.cardHandsIcon}>🤲</Text>
                    </View>
                </View>

                {/* ── Monthly Pledge card ──────────────────────────────── */}
                {!pledge || pledge.status === 'stopped' ? (
                    <TouchableOpacity
                        style={styles.pledgeCTA}
                        onPress={() => navigation.navigate('StartDonation')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.pledgeCard}>
                            <View style={styles.pledgeTop}>
                                <View style={styles.pledgeLeft}>
                                    <View style={styles.pledgeIconBox}>
                                        <Text style={styles.pledgeIcon}>✨</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.pledgeTitle}>Set a Monthly Pledge</Text>
                                        <Text style={styles.pledgeSubtitle}>Help consistently from ₹100/mo</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.pledgeCard}>
                        <View style={styles.pledgeTop}>
                            <View style={styles.pledgeLeft}>
                                <View style={styles.pledgeIconBox}>
                                    <Text style={styles.pledgeIcon}>📅</Text>
                                </View>
                                <View>
                                    <Text style={styles.pledgeTitle}>Monthly Pledge</Text>
                                    <Text style={styles.pledgeSubtitle}>
                                        {(pledge.frequency || 'Monthly').charAt(0).toUpperCase() +
                                            (pledge.frequency || 'monthly').slice(1)} via UPI
                                    </Text>
                                </View>
                            </View>
                            {pledge.status === 'active' ? (
                                <View style={styles.activeBadge}>
                                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                                </View>
                            ) : (
                                <View style={[styles.activeBadge, { backgroundColor: '#FEF3C7' }]}>
                                    <Text style={[styles.activeBadgeText, { color: '#D97706' }]}>
                                        {pledge.status.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.pledgeBottom}>
                            <Text style={styles.pledgeAmount}>
                                ₹{pledge.amount}
                                <Text style={styles.pledgePerMonth}>/mo</Text>
                            </Text>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityLabel="Manage pledge"
                            >
                                <Text style={styles.manageLink}>Manage &gt;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ── Causes ────────────────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Causes</Text>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={isCausesExpanded ? "Show less causes" : "View all causes"}
                        onPress={() => setIsCausesExpanded(!isCausesExpanded)}
                    >
                        <Text style={styles.sectionLink}>{isCausesExpanded ? 'Show Less' : 'View All'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.causesRow}>
                    {displayedCauses.map((cause) => (
                        <View key={cause.id} style={styles.causeItem}>
                            <View style={styles.causeIconContainer}>
                                <Text style={styles.professionalIcon}>{cause.icon}</Text>
                            </View>
                            <Text style={styles.causeLabel}>{cause.name}</Text>
                            <Text style={styles.causeAmount}>₹{cause.my_contribution}</Text>
                            <Text style={styles.causePercent}>{cause.percentage}%</Text>
                        </View>
                    ))}
                </View>

                {/* ── Recent Transactions ──────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel="View history">
                        <Text style={styles.sectionLink}>History</Text>
                    </TouchableOpacity>
                </View>

                {recentTxnsList.map((txn) => (
                    <TransactionItem key={txn.id} transaction={txn} />
                ))}

                {/* Bottom padding for tab bar */}
                <View style={styles.bottomPad} />
            </ScrollView>

            {/* ── Bottom Tab Bar ───────────────────────────────────────── */}
            <BottomTabBar activeTab="home" onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F8F4',
    },

    // ── Header ──
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
        backgroundColor: '#F3F8F4',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: Radius.full,
        backgroundColor: Colors.primarySurface,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    greeting: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    userName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: Radius.full,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    refreshIcon: {
        fontSize: 18,
    },
    pledgeCTA: {
        marginBottom: Spacing.xl,
    },


    // ── Scroll ──
    scrollContent: {
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.sm,
    },

    // ── Total Contribution Card ──
    contributionCard: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 140,
    },
    cardWatermark: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 28,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    cardContent: {
        flex: 1,
        gap: Spacing.xs,
    },
    cardLabel: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: FontWeight.medium,
    },
    cardAmount: {
        fontSize: 34,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        letterSpacing: -0.5,
        marginTop: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    islamicNoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    islamicNoteIcon: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.75)',
    },
    islamicNoteText: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    cardHandsCircle: {
        width: 48,
        height: 48,
        borderRadius: Radius.full,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHandsIcon: {
        fontSize: 24,
    },

    // ── Monthly Pledge Card ──
    pledgeCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        padding: Spacing.base,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        gap: Spacing.md,
    },
    pledgeTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pledgeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    pledgeIconBox: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        backgroundColor: Colors.primarySurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pledgeIcon: {
        fontSize: 20,
    },
    pledgeTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    pledgeSubtitle: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: 1,
    },
    activeBadge: {
        backgroundColor: Colors.primarySurface,
        borderRadius: Radius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
    },
    activeBadgeText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        letterSpacing: 0.5,
    },
    pledgeBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pledgeAmount: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    pledgePerMonth: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.regular,
        color: Colors.textMuted,
    },
    manageLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semiBold,
        color: Colors.primary,
    },

    // ── Section Header ──
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.base,
    },
    sectionTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    sectionLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semiBold,
        color: Colors.primary,
    },

    // ── Causes Row ──
    causesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    causeItem: {
        width: '31%',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    causeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F8F4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8F1EB',
    },
    professionalIcon: {
        fontSize: 28,
    },
    causeLabel: {
        fontSize: FontSize.sm,
        color: Colors.textPrimary,
        fontWeight: FontWeight.medium,
        marginTop: Spacing.sm,
    },
    causeAmount: {
        fontSize: FontSize.xs,
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
    causePercent: {
        fontSize: FontSize.xs + 2,
        color: Colors.textMuted,
    },

    // ── Bottom padding ──
    bottomPad: {
        height: Spacing.xl,
    },
});
