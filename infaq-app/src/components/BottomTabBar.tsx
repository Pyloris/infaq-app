import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { FontSize, FontWeight } from '@/theme/spacing';

// ── Types ────────────────────────────────────────────────────────────────────
export type BottomTabId = 'home' | 'impact' | 'profile';

interface TabConfig {
    readonly id: BottomTabId;
    readonly label: string;
    readonly icon: string;
}

interface BottomTabBarProps {
    activeTab: BottomTabId;
    onTabPress?: (tab: BottomTabId) => void;
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS: readonly TabConfig[] = [
    { id: 'home', label: 'HOME', icon: '🏠' },
    { id: 'impact', label: 'IMPACT', icon: '📊' },
    { id: 'profile', label: 'PROFILE', icon: '👤' },
];

// ── Component ─────────────────────────────────────────────────────────────────
function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps): React.JSX.Element {
    return (
        <View style={styles.tabBar}>
            {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => onTabPress?.(tab.id)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                        accessibilityLabel={tab.label}
                        testID={`tab-${tab.id}`}
                    >
                        <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                            {tab.icon}
                        </Text>
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default memo(BottomTabBar);

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.white,
        paddingTop: 10,
        paddingBottom: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    tabIcon: {
        fontSize: 22,
        opacity: 0.4,
    },
    tabIconActive: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 10,
        color: Colors.textMuted,
        fontWeight: FontWeight.medium,
    },
    tabLabelActive: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
