import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { useGetPledgeQuery } from '@/services/api/pledgeApi';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function PledgeCTA(): React.JSX.Element | null {
    const navigation = useNavigation<NavProp>();
    const { data: pledgeData, isLoading, isError } = useGetPledgeQuery();

    // Only show if no pledge exists, not loading, and no error
    const hasNoPledge = !isLoading && !isError && (!pledgeData?.data.pledge || pledgeData.data.pledge.status === 'stopped');

    if (!hasNoPledge) {
        return null;
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('StartDonation')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Setup monthly donation"
        >
            <View style={styles.leftContent}>
                <Text style={styles.icon}>🤲</Text>
                <View>
                    <Text style={styles.title}>Setup Monthly Donation</Text>
                    <Text style={styles.subtitle}>Make a recurring impact from ₹100/mo</Text>
                </View>
            </View>
            <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E4D3B', // Deep Emerald
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing['2xl'],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    icon: {
        fontSize: 20,
    },
    title: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    subtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 1,
    },
    arrow: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: FontWeight.medium,
    },
});
