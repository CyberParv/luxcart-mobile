import React from 'react';
import { View, Text } from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { data: settings, isLoading, error, refetch } = useSettings();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={1} />;
  if (error) return <ErrorView message="Failed to load settings" onRetry={refetch} />;
  if (!settings) return <EmptyState title="Settings not available" />;

  return (
    <View className="p-4">
      <Text className="text-lg font-bold">Settings</Text>
      <Button onPress={() => {}}>
        <Text>Change Theme</Text>
      </Button>
    </View>
  );
}