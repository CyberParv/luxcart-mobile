import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from './Button';
import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center rounded-2xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800', className)}>
      <View className="mb-3">
        {icon ?? <Ionicons name="sparkles-outline" size={28} color={colors.neutral[500]} />}
      </View>
      <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50 text-center">{title}</Text>
      {description ? (
        <Text className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 text-center">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-4 w-full">
          <Button variant="secondary" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
