import React from 'react';
import { View, Text } from 'react-native';
import { useCheckout } from '@/hooks/useCheckout';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { data: checkout, isLoading, error, refetch } = useCheckout();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={1} />;
  if (error) return <ErrorView message="Failed to load checkout" onRetry={refetch} />;
  if (!checkout) return <EmptyState title="Checkout not available" />;

  return (
    <View className="p-4">
      <Text className="text-lg font-bold">Order Summary</Text>
      <Button onPress={() => {}}>
        <Text>Place Order</Text>
      </Button>
    </View>
  );
}