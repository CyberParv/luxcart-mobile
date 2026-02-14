import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  containerClassName,
  style,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  const showPasswordToggle = !!secureTextEntry;

  const resolvedRightIcon = useMemo(() => {
    if (showPasswordToggle) return isSecure ? 'eye-off-outline' : 'eye-outline';
    return rightIcon;
  }, [isSecure, rightIcon, showPasswordToggle]);

  const onPressRight = () => {
    if (showPasswordToggle) {
      setIsSecure((v) => !v);
      return;
    }
    onRightIconPress?.();
  };

  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? <Text className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</Text> : null}

      <View
        className={cn(
          'h-12 flex-row items-center rounded-xl border px-3',
          error
            ? 'border-red-500/70 dark:border-red-500/70'
            : 'border-neutral-200 dark:border-neutral-800',
          'bg-white dark:bg-neutral-950'
        )}
      >
        {leftIcon ? (
          <View className="mr-2">
            <Ionicons name={leftIcon} size={18} color={colors.neutral[500]} />
          </View>
        ) : null}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.neutral[400]}
          className={cn('flex-1 text-base text-neutral-900 dark:text-neutral-50')}
          style={[{ height: 48 }, style]}
        />

        {resolvedRightIcon ? (
          <Pressable
            accessibilityRole="button"
            onPress={onPressRight}
            hitSlop={10}
            className="ml-2"
          >
            <Ionicons name={resolvedRightIcon as any} size={18} color={colors.neutral[500]} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</Text> : null}
    </View>
  );
}
