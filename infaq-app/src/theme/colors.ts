// Color palette for Infaq Islamic Charity App
// Minimal, elegant Islamic aesthetic

export const Colors = {
    // Primary brand – deep Islamic green
    primary: '#2D6A4F',
    primaryLight: '#40916C',
    primarySurface: '#EAF4EF',

    // Backgrounds
    background: '#FFFFFF',
    surfaceGray: '#F8F9FA',

    // Borders
    border: '#E0E4E8',
    borderFocus: '#2D6A4F',

    // Typography
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textOnPrimary: '#FFFFFF',

    // Status
    error: '#DC2626',
    errorSurface: '#FEF2F2',

    // Divider & misc
    divider: '#E5E7EB',
    white: '#FFFFFF',
    black: '#000000',

    // Country code picker background
    pickerSurface: '#F3F4F6',
} as const;

export type ColorKey = keyof typeof Colors;
