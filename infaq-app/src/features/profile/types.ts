// Profile feature — type definitions

export interface ProfileBadge {
    readonly label: string;
    readonly variant: 'golden' | 'sadaqah';
}

export interface ProfileUser {
    readonly name: string;
    readonly avatarInitial: string;
    readonly badges: readonly ProfileBadge[];
    readonly quote: string;
}

export interface ProfileStats {
    readonly daysOfCharity: number;
    readonly impactPoints: string; // pre-formatted e.g. "4,500"
}

export interface MonthlyCommitment {
    readonly label: string;
    readonly formattedAmount: string;
    readonly isActive: boolean;
    readonly activeSince: string;
}

export type PreferenceRowId = 'notifications' | 'payment_methods' | 'language';

export interface PreferenceRow {
    readonly id: PreferenceRowId;
    readonly icon: string;
    readonly label: string;
    readonly trailingLabel?: string;
}

export type AboutRowId = 'help_center' | 'privacy_policy';

export interface AboutRow {
    readonly id: AboutRowId;
    readonly icon: string;
    readonly label: string;
}

export interface ProfileData {
    readonly user: ProfileUser;
    readonly stats: ProfileStats;
    readonly monthlyCommitment: MonthlyCommitment;
    readonly preferences: readonly PreferenceRow[];
    readonly aboutRows: readonly AboutRow[];
    readonly appVersion: string;
}
