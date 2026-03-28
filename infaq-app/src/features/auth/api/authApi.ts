import { baseApi } from '@/services/baseApi';
import type {
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '../types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
            query: (credentials) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body: credentials,
            }),
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (payload) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useSendOtpMutation, useVerifyOtpMutation } = authApi;
