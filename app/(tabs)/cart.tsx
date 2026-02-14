import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCart } from '@/hooks/useCart';
import { Button, Card, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { data: cart, isLoading, error, refetch } = useCart();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={3} />;
  if (error) return <ErrorView message="Failed to load cart" onRetry={refetch} />;
  if (!cart?.items?.length) return <EmptyState title="Your cart is empty" />;

  return (
    <FlatList
      data={cart.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
          <Button onPress={() => {}}>
            <Text>Remove</Text>
          </Button>
        </Card>
      )}
    />
  );
}