import React, { ReactNode, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  PressableProps,
  Text,
  View
} from 'react-native';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const { containerClass, textClass, spinnerColor } = useMemo(() => {
    const base = 'rounded-xl items-center justify-center flex-row';
    const sizeClass =
      size === 'sm' ? 'h-10 px-3' : size === 'lg' ? 'h-14 px-5' : 'h-12 px-4';

    switch (variant) {
      case 'secondary':
        return {
          containerClass: cn(base, sizeClass, 'bg-neutral-100 dark:bg-neutral-900'),
          textClass: 'text-neutral-900 dark:text-neutral-50 font-semibold',
          spinnerColor: colors.neutral[900]
        };
      case 'outline':
        return {
          containerClass: cn(
            base,
            sizeClass,
            'bg-transparent border border-neutral-200 dark:border-neutral-800'
          ),
          textClass: 'text-neutral-900 dark:text-neutral-50 font-semibold',
          spinnerColor: colors.neutral[900]
        };
      case 'ghost':
        return {
          containerClass: cn(base, sizeClass, 'bg-transparent'),
          textClass: 'text-brand-700 dark:text-brand-300 font-semibold',
          spinnerColor: colors.brand[600]
        };
      case 'destructive':
        return {
          containerClass: cn(base, sizeClass, 'bg-red-600'),
          textClass: 'text-white font-semibold',
          spinnerColor: '#ffffff'
        };
      case 'primary':
      default:
        return {
          containerClass: cn(base, sizeClass, 'bg-brand-600'),
          textClass: 'text-white font-semibold',
          spinnerColor: '#ffffff'
        };
    }
  }, [size, variant]);

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: Platform.OS !== 'web',
      speed: 20,
      bounciness: 6
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      {...props}
      className={cn(isDisabled ? 'opacity-60' : 'opacity-100', className)}
    >
      <Animated.View style={{ transform: [{ scale }] }} className={containerClass}>
        {loading ? (
          <View className="mr-2">
            <ActivityIndicator color={spinnerColor} />
          </View>
        ) : null}
        <Text className={textClass}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}
