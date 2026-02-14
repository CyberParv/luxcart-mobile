import React, { ReactNode } from 'react';
import { Platform, Pressable, PressableProps, View } from 'react-native';

import { cn } from '@/lib/utils';

export type CardProps = {
  children: ReactNode;
  className?: string;
  onPress?: PressableProps['onPress'];
};

export function Card({ children, className, onPress }: CardProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800',
        className
      )}
      style={
        Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 }
          },
          android: {
            elevation: 2
          },
          default: {
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 }
          }
        }) as any
      }
    >
      {children}
    </Container>
  );
}
