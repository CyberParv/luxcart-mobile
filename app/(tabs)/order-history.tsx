import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { Button, Card, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function OrderHistoryScreen() {
  const { data: orders, isLoading, error, refetch } = useOrders();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={5} />;
  if (error) return <ErrorView message="Failed to load orders" onRetry={refetch} />;
  if (!orders?.length) return <EmptyState title="No orders found" />;

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.orderNumber}</Text>
          <Button onPress={() => router.push(`/(tabs)/order/${item.id}`)}>
            <Text>View Details</Text>
          </Button>
        </Card>
      )}
    />
  );
}