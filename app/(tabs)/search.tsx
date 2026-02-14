import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearch } from '@/hooks/useSearch';
import { Button, Card, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading, error, refetch } = useSearch(query);
  const router = useRouter();

  const handleSearch = (text) => {
    setQuery(text);
    refetch();
  };

  if (isLoading) return <SkeletonLoader count={5} />;
  if (error) return <ErrorView message="Failed to search" onRetry={refetch} />;
  if (!results?.length) return <EmptyState title="No results found" />;

  return (
    <View className="p-4">
      <TextInput
        placeholder="Search products..."
        value={query}
        onChangeText={handleSearch}
        className="mb-4"
      />
      <FlatList
        data={results}
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
    </View>
  );
}