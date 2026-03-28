// Spacing scale (4px base grid)
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
} as const;

// Border radius scale
export const Radius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
} as const;

// Font size scale
export const FontSize = {
    xs: 12,
    sm: 13,
    md: 14,
    base: 15,
    lg: 16,
    xl: 18,
    '2xl': 22,
    '3xl': 28,
} as const;

// Font weights
export const FontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
};
