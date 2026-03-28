import React, { useCallback } from 'react';
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
import { useAppDispatch } from '@/app/hooks';
import { clearCredentials } from '@/features/auth/authSlice';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import BottomTabBar, { BottomTabId } from '@/components/BottomTabBar';
import PledgeCTA from '@/components/PledgeCTA';
import { PROFILE_MOCK } from '../mockProfileData';
import { useGetMeQuery } from '@/services/api/userApi';
import { baseApi } from '@/services/baseApi';
import type { PreferenceRow, AboutRow } from '../types';

// ── Types ────────────────────────────────────────────────────────────────────
type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileScreen(): React.JSX.Element {
    const navigation = useNavigation<ProfileNavProp>();
    const dispatch = useAppDispatch();

    const { data: meData } = useGetMeQuery();
    const apiUser = meData?.data.user;

    const { preferences, aboutRows, appVersion } =
        PROFILE_MOCK;

    // Fallback logic
    const displayName = apiUser?.name || PROFILE_MOCK.user.name;
    const displayEmail = apiUser?.email || PROFILE_MOCK.user.email;
    const avatarInitial = (apiUser?.name?.[0] || PROFILE_MOCK.user.avatarInitial).toUpperCase();
    const { quote } = PROFILE_MOCK.user;

    const handleLogout = useCallback(() => {
        dispatch(clearCredentials());
        dispatch(baseApi.util.resetApiState());
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, [dispatch, navigation]);

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
            {/* ── Header ───────────────────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.headerBack}>←</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Donor Profile</Text>
                <View></View>
            </View>

            <PledgeCTA />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Avatar ───────────────────────────────────────────────── */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitial}>{avatarInitial}</Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedTick}>✓</Text>
                    </View>
                </View>

                {/* ── Name ─────────────────────────────────────────────────── */}
                <Text style={styles.userName}>{displayName}</Text>

                {/* ── Email ────────────────────────────────────────────────── */}
                <Text style={styles.userEmail}>{displayEmail}</Text>

                {/* ── Quote ────────────────────────────────────────────────── */}
                <Text style={styles.quote}>{quote}</Text>



                {/* ── APP PREFERENCES ──────────────────────────────────────── */}
                <Text style={styles.groupLabel}>APP PREFERENCES</Text>
                <View style={styles.listCard}>
                    {preferences.map(
                        (row: PreferenceRow, idx: number) => (
                            <View key={row.id}>
                                <TouchableOpacity
                                    style={styles.listRow}
                                    activeOpacity={0.65}
                                    accessibilityRole="button"
                                    accessibilityLabel={row.label}
                                >
                                    <View style={styles.listRowLeft}>
                                        <View style={styles.listIconBox}>
                                            <Text style={styles.listIcon}>{row.icon}</Text>
                                        </View>
                                        <Text style={styles.listLabel}>{row.label}</Text>
                                    </View>
                                    <View style={styles.listRowRight}>
                                        {row.trailingLabel ? (
                                            <Text style={styles.listTrailing}>
                                                {row.trailingLabel}
                                            </Text>
                                        ) : null}
                                        <Text style={styles.chevron}>›</Text>
                                    </View>
                                </TouchableOpacity>
                                {idx < preferences.length - 1 ? (
                                    <View style={styles.divider} />
                                ) : null}
                            </View>
                        ),
                    )}
                </View>

                {/* ── ABOUT CHARITY APP ────────────────────────────────────── */}
                <Text style={styles.groupLabel}>ABOUT CHARITY APP</Text>
                <View style={styles.listCard}>
                    {aboutRows.map((row: AboutRow, idx: number) => (
                        <View key={row.id}>
                            <TouchableOpacity
                                style={styles.listRow}
                                activeOpacity={0.65}
                                accessibilityRole="button"
                                accessibilityLabel={row.label}
                            >
                                <View style={styles.listRowLeft}>
                                    <View style={styles.listIconBox}>
                                        <Text style={styles.listIcon}>{row.icon}</Text>
                                    </View>
                                    <Text style={styles.listLabel}>{row.label}</Text>
                                </View>
                                <Text style={styles.chevron}>›</Text>
                            </TouchableOpacity>
                            {idx < aboutRows.length - 1 ? (
                                <View style={styles.divider} />
                            ) : null}
                        </View>
                    ))}
                </View>

                {/* ── Logout ───────────────────────────────────────────────── */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Logout"
                    testID="logout-button"
                >
                    <Text style={styles.logoutIcon}>↪</Text>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* ── Version footer ───────────────────────────────────────── */}
                <Text style={styles.versionText}>
                    Version {appVersion} • Made with Ummah Love
                </Text>
            </ScrollView>

            <BottomTabBar activeTab="profile" onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
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
        paddingVertical: Spacing.md,
        backgroundColor: '#F3F8F4',
    },
    headerBack: {
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: FontWeight.medium,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    headerGear: {
        fontSize: 22,
    },

    // ── Scroll ──
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing.xl,
    },

    // ── Avatar ──
    avatarWrapper: {
        position: 'relative',
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.primarySurface,
        borderWidth: 3,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    verifiedTick: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: FontWeight.bold,
        lineHeight: 15,
    },

    // ── Name ──
    userName: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    quote: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },



    // ── Group label ──
    groupLabel: {
        alignSelf: 'flex-start',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semiBold,
        color: Colors.textMuted,
        letterSpacing: 1.1,
        marginBottom: Spacing.sm,
    },

    // ── List card ──
    listCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        overflow: 'hidden',
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.base,
    },
    listRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    listRowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    listIconBox: {
        width: 36,
        height: 36,
        borderRadius: Radius.md,
        backgroundColor: Colors.primarySurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listIcon: {
        fontSize: 18,
    },
    listLabel: {
        fontSize: FontSize.base,
        color: Colors.textPrimary,
        fontWeight: FontWeight.medium,
    },
    listTrailing: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
    chevron: {
        fontSize: 20,
        color: Colors.textMuted,
        fontWeight: FontWeight.regular,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: Spacing.base + 36 + Spacing.md, // indent past icon
    },

    // ── Logout ──
    logoutButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: '#FEE2E2',
        borderRadius: Radius.xl,
        paddingVertical: Spacing.base,
        marginBottom: Spacing.md,
    },
    logoutIcon: {
        fontSize: FontSize.lg,
        color: '#DC2626',
    },
    logoutText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semiBold,
        color: '#DC2626',
    },

    // ── Version footer ──
    versionText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
});
