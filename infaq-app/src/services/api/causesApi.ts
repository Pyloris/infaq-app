import { baseApi } from '../baseApi';

export interface Cause {
    id: string;
    name: string;
    percentage: number;
    icon: string;
    my_contribution: number;
}

export interface CausesResponse {
    success: boolean;
    data: {
        causes: Cause[];
    };
}

export const causesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCauses: builder.query<CausesResponse, void>({
            query: () => '/causes',
            providesTags: ['Causes'],
        }),
    }),
});

export const { useGetCausesQuery } = causesApi;
