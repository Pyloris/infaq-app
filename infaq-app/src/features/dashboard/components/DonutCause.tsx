/**
 * DonutCause — circular progress ring with a centered icon.
 *
 * Uses the standard React Native "half-clip rotation" technique:
 *  - Two overflow:hidden half-containers (left and right)
 *  - Each contains a full circle with half-colored / half-transparent border
 *  - Rotating the inner circle reveals/hides the colored arc through the clip
 *
 * This produces smooth arc rendering with zero native dependencies.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { FontSize, FontWeight } from '@/theme/spacing';
import type { Cause } from '../types';

// ── Constants ────────────────────────────────────────────────────────────────
const SIZE = 78;
const STROKE = 7;
const HALF = SIZE / 2;
const INNER = SIZE - STROKE * 2;

interface DonutCauseProps {
    cause: Cause;
}

function DonutCause({ cause }: DonutCauseProps): React.JSX.Element {
    const pct = Math.min(Math.max(cause.percentage, 0), 100);

    /**
     * Right clip: reveals the first half of the arc (0% → 50%).
     * Inner circle has green on TOP + RIGHT, transparent on BOTTOM + LEFT.
     * rotation: -180° (0% visible) → 0° (50% = full right half visible)
     */
    const rightRotation = (Math.min(pct, 50) / 50) * 180 - 180;

    /**
     * Left clip: reveals the second half of the arc (50% → 100%).
     * Inner circle has green on BOTTOM + LEFT, transparent on TOP + RIGHT.
     * rotation: -180° (0% visible) → 0° (50% = full left half visible)
     * Only engaged when pct > 50.
     */
    const leftRotation = pct > 50 ? ((pct - 50) / 50) * 180 - 180 : -180;

    return (
        <View style={styles.wrapper}>
            {/* Gray background track */}
            <View style={styles.bgRing} />

            {/* Right clip — first 0–50% of arc */}
            <View style={styles.rightClip}>
                <View
                    style={[
                        styles.arcHalf,
                        styles.arcRight,
                        { transform: [{ rotate: `${rightRotation}deg` }] },
                    ]}
                />
            </View>

            {/* Left clip — second 50–100% of arc */}
            <View style={styles.leftClip}>
                <View
                    style={[
                        styles.arcHalf,
                        styles.arcLeft,
                        { transform: [{ rotate: `${leftRotation}deg` }] },
                    ]}
                />
            </View>

            {/* Center icon */}
            <View style={styles.center}>
                <Text style={styles.icon}>{cause.icon}</Text>
            </View>
        </View>
    );
}

export default memo(DonutCause);

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    wrapper: {
        width: SIZE,
        height: SIZE,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgRing: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        borderRadius: HALF,
        borderWidth: STROKE,
        borderColor: '#DDE8E2',
    },

    // ── Right clip: shows the physical right half of the container ──
    rightClip: {
        position: 'absolute',
        top: 0,
        left: HALF,       // clip starts at horizontal center
        width: HALF,
        height: SIZE,
        overflow: 'hidden',
    },
    // ── Left clip: shows the physical left half of the container ──
    leftClip: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: HALF,
        height: SIZE,
        overflow: 'hidden',
    },

    // ── Half-colored circle shared base ──
    arcHalf: {
        position: 'absolute',
        top: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: HALF,
        borderWidth: STROKE,
    },
    // Right arc: colored on TOP + RIGHT sides, transparent elsewhere
    // Positioned at right:0 inside clip so its center aligns with container center
    arcRight: {
        right: 0,
        borderTopColor: Colors.primary,
        borderRightColor: Colors.primary,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    // Left arc: colored on BOTTOM + LEFT sides, transparent elsewhere
    // Positioned at left:0 inside clip so its center aligns with container center
    arcLeft: {
        left: 0,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Colors.primary,
        borderLeftColor: Colors.primary,
    },

    // ── Inner icon container ──
    center: {
        position: 'absolute',
        width: INNER,
        height: INNER,
        borderRadius: INNER / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },
    icon: {
        fontSize: 22,
    },
});
