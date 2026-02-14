import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useOrderDetail } from '@/hooks/useOrderDetail';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: order, isLoading, error, refetch } = useOrderDetail(id);
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={1} />;
  if (error) return <ErrorView message="Failed to load order" onRetry={refetch} />;
  if (!order) return <EmptyState title="Order not found" />;

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold">Order #{order.orderNumber}</Text>
      <Text>Status: {order.status}</Text>
      <Button onPress={() => {}}>
        <Text>Track Order</Text>
      </Button>
    </ScrollView>
  );
}