import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import BottomTabBar, { BottomTabId } from '@/components/BottomTabBar';
import PledgeCTA from '@/components/PledgeCTA';
import HistoryItem from '../components/HistoryItem';
import { useGetMeQuery } from '@/services/api/userApi';
import { useGetPrivateLedgerQuery, useGetPublicLedgerQuery } from '@/services/api/transactionApi';

type HistoryNavProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

type TabType = 'myDonations' | 'publicLedger';

export default function HistoryScreen(): React.JSX.Element {
    const navigation = useNavigation<HistoryNavProp>();

    const { data: meData } = useGetMeQuery();
    const apiUser = meData?.data.user;

    const [activeSubTab, setActiveSubTab] = useState<TabType>('myDonations');

    // Fetch ledger data
    const { data: privateData, refetch: refetchPrivate } = useGetPrivateLedgerQuery(undefined, {
        skip: activeSubTab !== 'myDonations'
    });
    const { data: publicData, refetch: refetchPublic } = useGetPublicLedgerQuery(undefined, {
        skip: activeSubTab !== 'publicLedger'
    });

    const activeData = activeSubTab === 'myDonations' ? privateData : publicData;

    const displayName = apiUser?.name || 'Infaq Donor';
    const avatarInitial = (apiUser?.name?.[0] || 'I').toUpperCase();

    // Map API transactions to UI format
    const transactions = activeData?.data.transactions.map(t => {
        const isPrivate = activeSubTab === 'myDonations';
        const userName = t.userId.name || 'Donor';

        console.log(t);

        return {
            id: t._id,
            transactionId: t.transactionId,
            title: isPrivate ? 'Monthly Contribution' : userName,
            description: isPrivate
                ? t.transactionId
                : `Verified contribution`,
            formattedDate: new Date(t.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            amount: `₹${t.amount}`,
            method: t.pledgeId ? 'Recurring' : 'Direct',
            status: t.status as 'success' | 'pending' | 'failed',
            icon: '🤲',
            user: isPrivate ? undefined : {
                name: userName,
                avatarInitial: userName.charAt(0).toUpperCase()
            }
        };
    }) || [];

    const stats = activeData?.data.metrics || { total_contribution: 0 };
    const formattedTotalAmount = `₹${stats.total_contribution.toLocaleString()}`;
    const donationsCount = activeData?.data.transactions.length || 0;

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

    const renderHeader = () => (
        <View style={styles.headerSpacer}>


            {/* ── Total Impact Card ────────────────────────────────────────── */}
            <View style={styles.impactCard}>
                {/* Decorative Pattern / Glassmorphism effect */}
                <View style={styles.impactCardPattern1} />
                <View style={styles.impactCardPattern2} />

                <View style={styles.impactCardContent}>
                    <Text style={styles.impactLabel}>
                        {activeSubTab === 'myDonations' ? 'YOUR TOTAL IMPACT' : 'PLATFORM TOTAL IMPACT'}
                    </Text>
                    <View style={styles.impactAmountRow}>
                        <Text style={styles.impactAmount}>{formattedTotalAmount}</Text>
                        <Text style={styles.impactCount}>
                            {donationsCount} Donations
                        </Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {activeSubTab === 'myDonations' ? 'GENEROUS DONOR' : 'COMMUNITY POWER'}
                        </Text>
                    </View>
                </View>
                {/* Heart hand icon using Emoji/Text */}
                <View style={styles.heartDecorator}>
                    <Text style={styles.heartIcon}>🤲</Text>
                </View>
            </View>

            {/* ── Top Tabs ────────────────────────────────────────────────── */}
            <View style={styles.tabSwitcher}>
                <TouchableOpacity
                    style={[
                        styles.subTab,
                        activeSubTab === 'myDonations' && styles.subTabActive,
                    ]}
                    onPress={() => setActiveSubTab('myDonations')}
                >
                    <Text
                        style={[
                            styles.subTabText,
                            activeSubTab === 'myDonations' && styles.subTabTextActive,
                        ]}
                    >
                        My Donations
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.subTab,
                        activeSubTab === 'publicLedger' && styles.subTabActive,
                    ]}
                    onPress={() => setActiveSubTab('publicLedger')}
                >
                    <Text
                        style={[
                            styles.subTabText,
                            activeSubTab === 'publicLedger' && styles.subTabTextActive,
                        ]}
                    >
                        Public Ledger
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <View style={styles.trustedCard}>
                <View style={styles.trustedIconContainer}>
                    <View style={styles.checkmarkIcon}>
                        <View style={styles.checkmarkPart1} />
                        <View style={styles.checkmarkPart2} />
                    </View>
                </View>
                <View style={styles.trustedContent}>
                    <Text style={styles.trustedTitle}>TRUSTED TRANSACTION</Text>
                    <Text style={styles.trustedDescription}>
                        Every rupee donated is recorded on our immutable ledger. Tap any
                        transaction to view the blockchain verification hash and fund
                        allocation report.
                    </Text>
                </View>
            </View>
            {/* Space for Tab Bar */}
            <View style={{ height: Spacing['5xl'] }} />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Background Decorative Element */}
            <View style={styles.bgDecorativeCircle} />

            {/* ── Global Header ───────────────────────────────────────────── */}
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

                <View style={{ width: 44 }} />
            </View>

            <PledgeCTA />

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <HistoryItem transaction={item} />}
                ListHeaderComponent={renderHeader()}
                ListFooterComponent={renderFooter()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onRefresh={() => activeSubTab === 'myDonations' ? refetchPrivate() : refetchPublic()}
                refreshing={false}
            />

            <BottomTabBar activeTab="impact" onTabPress={handleTabPress} />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    bgDecorativeCircle: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#F3F8F4',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
        backgroundColor: '#FFFFFF',
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
    listContent: {
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing.xl,
    },
    headerSpacer: {
        marginTop: Spacing.sm,
    },
    tabSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9', // light gray
        borderRadius: Radius.lg,
        padding: 4,
        marginBottom: Spacing.xl,
    },
    subTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: Radius.md,
    },
    subTabActive: {
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    subTabText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        fontWeight: FontWeight.medium,
    },
    subTabTextActive: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
    impactCard: {
        backgroundColor: '#2D6A4F',
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#2D6A4F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    impactCardPattern1: {
        position: 'absolute',
        top: -20,
        left: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    impactCardPattern2: {
        position: 'absolute',
        bottom: -40,
        right: 20,
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 20,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    impactCardContent: {
        flex: 1,
        zIndex: 5,
    },
    impactLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: FontWeight.bold,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    impactAmountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    impactAmount: {
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        letterSpacing: -0.5,
    },
    impactCount: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FontWeight.medium,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: Spacing.lg,
        paddingVertical: 6,
        borderRadius: Radius.full,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    badgeText: {
        fontSize: 10,
        color: Colors.white,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
    },
    heartDecorator: {
        position: 'absolute',
        right: 15,
        bottom: 10,
        zIndex: 1,
    },
    heartIcon: {
        fontSize: 60,
        opacity: 0.2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterText: {
        fontSize: 11,
        fontWeight: FontWeight.bold,
        color: Colors.textSecondary,
        letterSpacing: 1,
    },
    filterIconBox: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        gap: 3,
    },
    filterLine: {
        height: 2,
        backgroundColor: Colors.textSecondary,
        borderRadius: 1,
    },
    footerContainer: {
        marginTop: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
    trustedCard: {
        flexDirection: 'row',
        backgroundColor: '#F8FBF9',
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    trustedIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkmarkIcon: {
        width: 14,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    checkmarkPart1: {
        position: 'absolute',
        width: 2,
        height: 6,
        backgroundColor: Colors.white,
        transform: [{ rotate: '-45deg' }],
        left: 3,
        bottom: 0,
    },
    checkmarkPart2: {
        position: 'absolute',
        width: 2,
        height: 10,
        backgroundColor: Colors.white,
        transform: [{ rotate: '45deg' }],
        right: 3,
        bottom: 0,
    },
    trustedContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    trustedTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: 6,
        letterSpacing: 0.8,
    },
    trustedDescription: {
        fontSize: 12,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
});
