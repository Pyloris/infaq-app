import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/theme/spacing';
import { HistoryTransaction } from '../mockHistoryData';

interface HistoryItemProps {
    transaction: HistoryTransaction;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ transaction }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{transaction.icon}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.title}>{transaction.title}</Text>
                <Text style={styles.subtitle}>
                    {transaction.formattedDate} • {transaction.transactionId}
                </Text>
            </View>
            <View style={styles.rightSide}>
                <Text style={styles.amount}>{transaction.amount}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        backgroundColor: Colors.surfaceGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    icon: {
        fontSize: 20,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    rightSide: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    statusBadge: {
        backgroundColor: Colors.primarySurface,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.sm,
    },
    statusText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
});

export default HistoryItem;
