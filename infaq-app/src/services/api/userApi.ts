import { baseApi } from '../baseApi';
import type { User } from '@/features/auth/types';
import type { Cause } from './causesApi';



export interface MeResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export interface DashboardTransaction {
    _id: string;
    userId: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface DashboardResponse {
    success: boolean;
    data: {
        total_contribution: number;
        causes: Cause[];
        recent_transactions: DashboardTransaction[];
    };
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<MeResponse, void>({
            query: () => '/user/me',
            providesTags: ['Auth'],
        }),
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => '/user/dashboard',
            providesTags: ['Causes', 'Pledge'], // Invalidate if pledge changes, or use a new tag
        }),
    }),
});

export const { useGetMeQuery, useGetDashboardQuery } = userApi;
