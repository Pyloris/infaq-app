import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import type { Transaction } from '../types';

interface TransactionItemProps {
    transaction: Transaction;
}

const STATUS_COLOR: Record<Transaction['status'], string> = {
    success: Colors.primary,
    pending: '#D97706',
    failed: Colors.error,
};

const STATUS_LABEL: Record<Transaction['status'], string> = {
    success: 'Success',
    pending: 'Pending',
    failed: 'Failed',
};

function TransactionItem({ transaction }: TransactionItemProps): React.JSX.Element {
    return (
        <View style={styles.card}>
            {/* Icon circle */}
            <View style={styles.iconCircle}>
                <Text style={styles.icon}>{transaction.icon}</Text>
            </View>

            {/* Title + meta */}
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>
                    {transaction.title}
                </Text>
                <Text style={styles.meta}>
                    {transaction.formattedDate}
                    {'  •  '}
                    {transaction.method}
                </Text>
            </View>

            {/* Amount + status */}
            <View style={styles.right}>
                <Text style={styles.amount}>{transaction.formattedAmount}</Text>
                <Text
                    style={[
                        styles.status,
                        { color: STATUS_COLOR[transaction.status] },
                    ]}
                >
                    {STATUS_LABEL[transaction.status]}
                </Text>
            </View>
        </View>
    );
}

export default memo(TransactionItem);

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: Radius.full,
        backgroundColor: Colors.primarySurface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    icon: {
        fontSize: 20,
    },
    details: {
        flex: 1,
        gap: 3,
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semiBold,
        color: Colors.textPrimary,
    },
    meta: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
    right: {
        alignItems: 'flex-end',
        gap: 3,
        marginLeft: Spacing.sm,
    },
    amount: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semiBold,
        color: Colors.textPrimary,
    },
    status: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semiBold,
    },
});
