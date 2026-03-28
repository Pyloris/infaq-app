import type { DashboardData } from './types';

export const DASHBOARD_MOCK: DashboardData = {
    user: {
        name: 'Omar Farooq',
        avatarInitial: 'O',
        notificationCount: 2,
    },

    totalContribution: {
        formattedAmount: '₹45,250',
        islamicNote: 'May Allah reward your generosity',
    },

    monthlyPledge: {
        formattedAmount: '₹1,000',
        paymentMethod: 'UPI Recurring Payment',
        isActive: true,
    },

    causes: [
        { id: 'education', label: 'Education', icon: '🏛️', percentage: 60, formattedAmount: '₹27,150' },
        { id: 'orphan_care', label: 'Orphan Care', icon: '🫂', percentage: 30, formattedAmount: '₹13,575' },
        { id: 'water_aid', label: 'Water Aid', icon: '🚰', percentage: 10, formattedAmount: '₹4,525' },
    ],

    recentTransactions: [
        {
            id: 'txn-001',
            title: 'Education Fund',
            formattedDate: '12 Oct 2023',
            method: 'UPI',
            formattedAmount: '₹500',
            status: 'success',
            icon: '🎓',
        },
        {
            id: 'txn-002',
            title: 'Orphan Support',
            formattedDate: '01 Oct 2023',
            method: 'Recurring',
            formattedAmount: '₹1,000',
            status: 'success',
            icon: '🧡',
        },
        {
            id: 'txn-003',
            title: 'Food Drive',
            formattedDate: '25 Sep 2023',
            method: 'UPI',
            formattedAmount: '₹250',
            status: 'success',
            icon: '🍽️',
        },
    ],
};
