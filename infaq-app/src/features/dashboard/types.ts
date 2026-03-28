// Dashboard feature — type definitions

export interface DashboardUser {
    name: string;
    avatarInitial: string;
    notificationCount: number;
}

export interface TotalContribution {
    formattedAmount: string;
    islamicNote: string;
}

export interface MonthlyPledge {
    formattedAmount: string;
    paymentMethod: string;
    isActive: boolean;
}

export type CauseId = 'education' | 'orphan_care' | 'water_aid';

export interface Cause {
    readonly id: CauseId;
    readonly label: string;
    readonly icon: string;
    /** Integer 0–100 */
    readonly percentage: number;
    /** e.g. "$20" or "₹5,000" */
    readonly formattedAmount: string;
}

export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionMethod = 'UPI' | 'Recurring';

export interface Transaction {
    readonly id: string;
    readonly title: string;
    readonly formattedDate: string;
    readonly method: TransactionMethod;
    readonly formattedAmount: string;
    readonly status: TransactionStatus;
    readonly icon: string;
}

export interface DashboardData {
    readonly user: DashboardUser;
    readonly totalContribution: TotalContribution;
    readonly monthlyPledge: MonthlyPledge;
    readonly causes: readonly Cause[];
    readonly recentTransactions: readonly Transaction[];
}
