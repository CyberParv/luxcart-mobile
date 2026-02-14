import React from 'react';
import { View, Text } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={1} />;
  if (error) return <ErrorView message="Failed to load profile" onRetry={refetch} />;
  if (!profile) return <EmptyState title="Profile not available" />;

  return (
    <View className="p-4">
      <Text className="text-lg font-bold">{profile.name}</Text>
      <Text>{profile.email}</Text>
      <Button onPress={() => router.push('/(tabs)/profile/edit')}>
        <Text>Edit Profile</Text>
      </Button>
    </View>
  );
}