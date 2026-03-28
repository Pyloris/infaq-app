import { baseApi } from '../baseApi';

export type PledgeFrequency = 'one-time' | 'monthly' | 'yearly';
export type PledgeStatus = 'active' | 'pending' | 'stopped';

export interface Pledge {
    _id: string;
    amount: number;
    frequency: PledgeFrequency;
    status: PledgeStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface PledgeResponse {
    success: boolean;
    message?: string;
    data: {
        pledge: Pledge | null;
    };
}

export interface CreatePledgeRequest {
    amount: number;
    frequency: PledgeFrequency;
}

export const pledgeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPledge: builder.query<PledgeResponse, void>({
            query: () => '/pledge',
            providesTags: ['Pledge'],
        }),
        createOrUpdatePledge: builder.mutation<PledgeResponse, CreatePledgeRequest>({
            query: (pledge) => ({
                url: '/pledge',
                method: 'POST',
                body: pledge,
            }),
            invalidatesTags: ['Pledge'],
        }),
    }),
});

export const { useGetPledgeQuery, useCreateOrUpdatePledgeMutation } = pledgeApi;
