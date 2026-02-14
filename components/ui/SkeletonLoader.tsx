import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';

export type SkeletonLoaderProps = ViewProps & {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

export function SkeletonLoader({ className, rounded = 'md', style, ...props }: SkeletonLoaderProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.45, 0.85]);
    return { opacity };
  });

  const radiusClass =
    rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-2xl' : rounded === 'sm' ? 'rounded-lg' : 'rounded-xl';

  return (
    <Animated.View
      {...props}
      className={cn('bg-neutral-200 dark:bg-neutral-800', radiusClass, className)}
      style={[animatedStyle, style]}
    />
  );
}
