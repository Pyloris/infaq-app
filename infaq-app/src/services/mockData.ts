/**
 * Mock response registry — development only.
 *
 * Each key matches the endpoint URL path used in RTK Query mutations.
 * Values match the exact backend response contract defined in feature types.
 *
 * ⚠️  This file is ONLY used when IS_MOCK_MODE = true in baseApi.ts.
 *     All types are imported from their canonical feature-type files.
 *     No runtime code from this file reaches production when flag is off.
 */

import type { SendOtpResponse, VerifyOtpResponse } from '@/features/auth/types';

// ── Registry type ─────────────────────────────────────────────────────────
// Add a new entry here for every endpoint that needs to be mocked.
export interface MockResponseRegistry {
    '/auth/send-otp': SendOtpResponse;
    '/auth/verify-otp': VerifyOtpResponse;
}

// ── Mock data ─────────────────────────────────────────────────────────────
export const MOCK_RESPONSES: MockResponseRegistry = {
    '/auth/send-otp': {
        success: true,
        message: 'OTP sent successfully.',
        sessionId: 'mock-session-id-dev-001',
    },

    '/auth/verify-otp': {
        success: true,
        token: 'mock-jwt-token-dev-001.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        user: {
            id: 'mock-user-001',
            phoneNumber: '8845561209',
            name: null,
        },
    },
};
