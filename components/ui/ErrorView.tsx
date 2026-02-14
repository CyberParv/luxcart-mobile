import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from './Button';
import { colors } from '@/constants/colors';

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
  title?: string;
};

export function ErrorView({ title = 'Something went wrong', message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-neutral-950">
      <Ionicons name="alert-circle-outline" size={34} color={colors.red[600]} />
      <Text className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50 text-center">{title}</Text>
      <Text className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 text-center">
        {message ?? 'An unexpected error occurred. Please try again.'}
      </Text>
      {onRetry ? (
        <View className="mt-5 w-full">
          <Button variant="primary" onPress={onRetry}>
            Retry
          </Button>
        </View>
      ) : null}
    </View>
  );
}
