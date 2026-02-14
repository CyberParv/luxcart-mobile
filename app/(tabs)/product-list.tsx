import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { Button, Card, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function ProductListScreen() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={5} />;
  if (error) return <ErrorView message="Failed to load products" onRetry={refetch} />;
  if (!products?.length) return <EmptyState title="No products found" />;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
          <Button onPress={() => router.push(`/(tabs)/product/${item.id}`)}>
            <Text>View Details</Text>
          </Button>
        </Card>
      )}
    />
  );
}