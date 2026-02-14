import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useWishlist } from '@/hooks/useWishlist';
import { Button, Card, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function WishlistScreen() {
  const { data: wishlist, isLoading, error, refetch } = useWishlist();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={3} />;
  if (error) return <ErrorView message="Failed to load wishlist" onRetry={refetch} />;
  if (!wishlist?.items?.length) return <EmptyState title="Your wishlist is empty" />;

  return (
    <FlatList
      data={wishlist.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
          <Button onPress={() => {}}>
            <Text>Add to Cart</Text>
          </Button>
        </Card>
      )}
    />
  );
}