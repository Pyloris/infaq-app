import { baseApi } from '../baseApi';

export interface UserDetails {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    city: string;
    state: string;
}

export interface PrivateTransaction {
    _id: string;
    transactionId: string;
    userId: UserDetails;
    pledgeId: string;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface PublicTransaction {
    _id: string;
    transactionId: string;
    userId: UserDetails;
    pledgeId: string;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface PrivateLedgerResponse {
    success: boolean;
    data: {
        transactions: PrivateTransaction[];
        metrics: {
            total_contribution: number;
        };
    };
}

export interface PublicLedgerResponse {
    success: boolean;
    data: {
        transactions: PublicTransaction[];
        metrics: {
            total_contribution: number;
        };
    };
}

export const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateLedger: builder.query<PrivateLedgerResponse, void>({
            query: () => '/transactions/me',
            providesTags: ['Pledge'], // Or a new 'Transaction' tag
        }),
        getPublicLedger: builder.query<PublicLedgerResponse, void>({
            query: () => '/transactions/all',
            // Typically public ledger might not need to be invalidated often, or same as above
            providesTags: ['Pledge'],
        }),
    }),
});

export const { useGetPrivateLedgerQuery, useGetPublicLedgerQuery } = transactionApi;
