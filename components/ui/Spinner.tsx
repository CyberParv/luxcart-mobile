import React, { useMemo } from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import { colors } from '@/constants/colors';

type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = Omit<ActivityIndicatorProps, 'size'> & {
  size?: SpinnerSize;
  tone?: 'default' | 'muted' | 'brand';
};

export function Spinner({ size = 'md', tone = 'default', color, ...props }: SpinnerProps) {
  const resolvedSize = useMemo(() => {
    if (size === 'sm') return 'small' as const;
    if (size === 'lg') return 'large' as const;
    return 'small' as const;
  }, [size]);

  const resolvedColor = useMemo(() => {
    if (color) return color;
    if (tone === 'brand') return colors.brand[600];
    if (tone === 'muted') return colors.neutral[400];
    return colors.neutral[700];
  }, [color, tone]);

  return <ActivityIndicator {...props} size={resolvedSize} color={resolvedColor} />;
}
