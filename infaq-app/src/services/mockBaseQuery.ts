/**
 * mockBaseQuery — development-only RTK Query base query.
 *
 * Implements the same `BaseQueryFn` signature as `fetchBaseQuery` so it is
 * a transparent drop-in. RTK Query lifecycle (isLoading, isSuccess, isError,
 * cache, invalidation) all behave identically to the real implementation.
 *
 * The mock:
 *  - Simulates realistic network latency (500–800ms)
 *  - Looks up the URL in MOCK_RESPONSES
 *  - Returns a properly shaped { data } success result
 *  - Returns a typed { error } result for unregistered endpoints
 *
 * ⚠️  Never import this in production — it is only wired via IS_MOCK_MODE.
 */

import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MOCK_RESPONSES, type MockResponseRegistry } from './mockData';

// ── Helpers ───────────────────────────────────────────────────────────────

const simulateNetworkDelay = (): Promise<void> =>
    new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 300), // 500–800ms
    );

const isRegisteredUrl = (url: string): url is keyof MockResponseRegistry =>
    url in MOCK_RESPONSES;

// ── Mock error shape matching FetchBaseQueryError ─────────────────────────

type MockError = FetchBaseQueryError;

// ── The mock base query ───────────────────────────────────────────────────

export const mockBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    MockError
> = async (args) => {
    await simulateNetworkDelay();

    // Normalise: args can be a plain string or a FetchArgs object
    const url = typeof args === 'string' ? args : args.url;

    if (isRegisteredUrl(url)) {
        return { data: MOCK_RESPONSES[url] };
    }

    // Unregistered endpoint — surface a clear dev-time error
    return {
        error: {
            status: 'CUSTOM_ERROR',
            error: `[MockBaseQuery] No mock registered for: ${url}. Add it to mockData.ts.`,
        } satisfies MockError,
    };
};
