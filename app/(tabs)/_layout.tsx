import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/constants/colors';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/(auth)/login');
  }, [isAuthenticated, isLoading, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.brand[600],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          backgroundColor: Platform.OS === 'web' ? '#ffffff' : undefined
        },
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerTitleStyle: {
          color: colors.neutral[900]
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
