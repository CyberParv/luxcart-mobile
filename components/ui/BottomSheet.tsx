import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  View
} from 'react-native';

import { cn } from '@/lib/utils';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  height?: number;
  className?: string;
};

export function BottomSheet({ visible, onClose, children, height, className }: BottomSheetProps) {
  const screenH = Dimensions.get('window').height;
  const sheetHeight = Math.min(height ?? Math.round(screenH * 0.6), Math.round(screenH * 0.9));

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  const open = () => {
    setMounted(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 })
    ]).start();
  };

  const close = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: sheetHeight, duration: 160, useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        cb?.();
      }
    });
  };

  useEffect(() => {
    if (visible) open();
    else if (mounted) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useMemo(() => {
    let startY = 0;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((v: number) => {
          startY = v;
        });
      },
      onPanResponderMove: (_, g) => {
        const next = Math.max(0, startY + g.dy);
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.dy > 80 || g.vy > 1.2;
        if (shouldClose) {
          close(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 }).start();
        }
      }
    });
  }, [onClose, translateY]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close(onClose)}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0" onPress={() => close(onClose)}>
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{ opacity: backdropOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] }) }}
          />
        </Pressable>

        <Animated.View
          style={{ height: sheetHeight, transform: [{ translateY }] }}
          className={cn(
            'bg-white dark:bg-neutral-950 rounded-t-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
            className
          )}
        >
          <View {...panResponder.panHandlers} className="py-3 items-center">
            <View className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </View>
          <View className="flex-1 px-5 pb-6">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
