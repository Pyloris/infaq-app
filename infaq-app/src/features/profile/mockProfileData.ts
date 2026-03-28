import type { ProfileData } from './types';

export const PROFILE_MOCK: ProfileData = {
    user: {
        name: 'Ahmed Abdullah',
        avatarInitial: 'AA',
        badges: [
            { label: 'GOLDEN DONOR', variant: 'golden' },
            { label: 'SADAQAH MEMBER', variant: 'sadaqah' },
        ],
        quote: '"The best of people are those that bring most benefit to the rest of mankind."',
    },

    stats: {
        daysOfCharity: 128,
        impactPoints: '4,500',
    },

    monthlyCommitment: {
        label: 'Monthly Sadaqah (UPI)',
        formattedAmount: '₹500.00 / month',
        isActive: true,
        activeSince: 'Active since Oct 2023',
    },

    preferences: [
        { id: 'payment_methods', icon: '💳', label: 'Payment Methods' },
        { id: 'language', icon: '🌐', label: 'Language', trailingLabel: 'English' },
    ],

    aboutRows: [
        { id: 'help_center', icon: 'ℹ️', label: 'Help Center' },
        { id: 'privacy_policy', icon: '🛡️', label: 'Privacy Policy' },
    ],

    appVersion: '2.4.1',
};
