// Auth feature type definitions

export interface SendOtpRequest {
    phoneNumber: string;
    countryCode: string;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
    /** Server-generated session token to be used for OTP verification */
    sessionId: string;
}

export interface VerifyOtpRequest {
    sessionId: string;
    otp: string;
}

export interface User {
    _id: string;
    mobileNumber: string;
    isOnboarded: boolean;
    name: string | null;
    email: string | null;
    city?: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface VerifyOtpResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface ApiErrorResponse {
    status: number;
    data: {
        message: string;
        errors?: Record<string, string[]>;
    };
}

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}
