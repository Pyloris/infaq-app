import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { mockBaseQuery } from './mockBaseQuery';

// ── Environment ────────────────────────────────────────────────────────────
const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

/**
 * DEV MODE TOGGLE
 *
 * Set to `true`  → All API calls use mockBaseQuery (no real HTTP requests)
 * Set to `false` → All API calls use fetchBaseQuery (real backend)
 *
 * When switching to production backend:
 *  1. Set IS_MOCK_MODE = false
 *  2. Set EXPO_PUBLIC_API_BASE_URL in your .env
 *  3. Zero screen or feature code changes required
 */
const IS_MOCK_MODE = false;

// ── Production base query (JWT-ready) ──────────────────────────────────────
const prodBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
});

// ── Base API ───────────────────────────────────────────────────────────────
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: IS_MOCK_MODE ? mockBaseQuery : prodBaseQuery,
    // Tag types will be extended in feature-specific APIs via injectEndpoints
    tagTypes: ['Auth', 'Pledge', 'Causes'],
    endpoints: () => ({}),
});
