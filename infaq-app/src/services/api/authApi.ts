import { baseApi } from '../baseApi';
import type { User } from '@/features/auth/types';

export interface LoginRequest {
    mobile_number: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface VerifyOtpRequest {
    mobile_number: string;
    otp: string;
}



export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
        onboarding_required: boolean;
    };
}

export interface OnboardUserRequest {
    name: string;
    email: string;
}

export interface OnboardUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: [],
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (credentials) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        onboardUser: builder.mutation<OnboardUserResponse, OnboardUserRequest>({
            query: (credentials) => ({
                url: '/auth/onboard-user',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const { useLoginMutation, useVerifyOtpMutation, useOnboardUserMutation } = authApi;
