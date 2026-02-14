import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useProductDetail } from '@/hooks/useProductDetail';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, error, refetch } = useProductDetail(id);
  const router = useRouter();

  if (isLoading) return <SkeletonLoader count={1} />;
  if (error) return <ErrorView message="Failed to load product" onRetry={refetch} />;
  if (!product) return <EmptyState title="Product not found" />;

  return (
    <ScrollView>
      <Image source={{ uri: product.image }} style={{ width: '100%', height: 300 }} />
      <View className="p-4">
        <Text className="text-lg font-bold">{product.title}</Text>
        <Text className="text-sm mt-2">{product.description}</Text>
        <Button onPress={() => {}}>
          <Text>Add to Cart</Text>
        </Button>
      </View>
    </ScrollView>
  );
}