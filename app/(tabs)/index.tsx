import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card, EmptyState } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export default function HomeScreen() {
  const { user, logout, isLoading } = useAuth();
  const toast = useToast();

  const onLogout = async () => {
    try {
      await logout();
      toast.info('Signed out', 'You have been logged out.');
    } catch (e: any) {
      toast.error('Logout failed', e?.message ?? 'Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 px-5 pt-5">
      <Card className="p-4">
        <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Dashboard</Text>
        <Text className="mt-1 text-neutral-600 dark:text-neutral-300">
          {user ? `Signed in as ${user.name ?? user.email}` : isLoading ? 'Loading session…' : 'Not signed in'}
        </Text>
        <View className="h-4" />
        <Button variant="outline" onPress={onLogout}>
          Log out
        </Button>
      </Card>

      <View className="h-5" />

      <EmptyState
        title="Nothing here yet"
        description="This is a production-ready scaffold. Add your features starting from this screen."
        actionLabel="Show toast"
        onAction={() => toast.success('Hello', 'Your scaffold is working.')}
      />
    </View>
  );
}
