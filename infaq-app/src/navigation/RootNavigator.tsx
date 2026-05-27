import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import OtpVerificationScreen from '@/features/auth/screens/OtpVerificationScreen';
import StartDonationScreen from '@/features/donation/screens/StartDonationScreen';
import ManagePledgeScreen from '@/features/donation/screens/ManagePledgeScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import HistoryScreen from '@/features/history/screens/HistoryScreen';
import OnboardingScreen from '@/features/auth/screens/OnboardingScreen';

// ── Root Stack Param List ──
export type RootStackParamList = {
    Login: undefined;
    OtpVerification: {
        phoneNumber: string;
        countryCode: string;
    };
    Onboarding: undefined;
    StartDonation: undefined;
    ManagePledge: undefined;
    Dashboard: undefined;
    Profile: undefined;
    History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#FFFFFF' },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ animation: 'fade' }}
                />
                <Stack.Screen
                    name="OtpVerification"
                    component={OtpVerificationScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="StartDonation"
                    component={StartDonationScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="ManagePledge"
                    component={ManagePledgeScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ animation: 'fade' }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ animation: 'fade' }}
                />
                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ animation: 'fade' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
