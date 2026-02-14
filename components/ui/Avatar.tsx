import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name?: string | null;
  uri?: string | null;
  source?: ImageSourcePropType;
  size?: AvatarSize;
  className?: string;
};

function initialsFromName(name?: string | null) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

export function Avatar({ name, uri, source, size = 'md', className }: AvatarProps) {
  const dims = useMemo(() => {
    switch (size) {
      case 'sm':
        return { w: 32, text: 'text-xs' };
      case 'lg':
        return { w: 56, text: 'text-lg' };
      case 'xl':
        return { w: 72, text: 'text-2xl' };
      case 'md':
      default:
        return { w: 44, text: 'text-base' };
    }
  }, [size]);

  const fallback = initialsFromName(name);
  const imgSource = source ?? (uri ? { uri } : null);

  return (
    <View
      className={cn(
        'items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden',
        className
      )}
      style={{ width: dims.w, height: dims.w }}
    >
      {imgSource ? (
        <Image source={imgSource as any} style={{ width: dims.w, height: dims.w }} resizeMode="cover" />
      ) : (
        <Text className={cn('font-semibold text-neutral-700 dark:text-neutral-200', dims.text)}>{fallback}</Text>
      )}
    </View>
  );
}
