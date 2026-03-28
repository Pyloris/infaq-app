export interface HistoryTransaction {
    id: string;
    transactionId: string;
    title: string;
    date?: string;
    formattedDate: string;
    category?: string;
    amount: string;
    status: 'success' | 'pending' | 'failed' | 'SUCCESS';
    icon: string;
}

export const HISTORY_MOCK = {
    totalImpact: {
        amount: '₹42,500',
        donationsCount: 12,
        badge: 'GOLD CONTRIBUTOR',
    },
    transactions: [
        {
            id: '1',
            title: 'Clean Water Initiative',
            date: '14 Oct 2023',
            category: 'Zakat',
            amount: '₹5,000',
            status: 'SUCCESS',
            icon: '💧',
        },
        {
            id: '2',
            title: 'Orphan Aid Fund',
            date: '02 Oct 2023',
            category: 'Sadaqah',
            amount: '₹12,000',
            status: 'SUCCESS',
            icon: '👶',
        },
        {
            id: '3',
            title: 'Hunger Relief',
            date: '28 Sep 2023',
            category: 'General',
            amount: '₹2,500',
            status: 'SUCCESS',
            icon: '🍴',
        },
        {
            id: '4',
            title: 'Education Support',
            date: '15 Sep 2023',
            category: 'Zakat',
            amount: '₹20,000',
            status: 'SUCCESS',
            icon: '🎓',
        },
        {
            id: '5',
            title: 'Medical Emergency Fund',
            date: '01 Sep 2023',
            category: 'Sadaqah',
            amount: '₹3,000',
            status: 'SUCCESS',
            icon: '🏥',
        },
    ] as HistoryTransaction[],
};
