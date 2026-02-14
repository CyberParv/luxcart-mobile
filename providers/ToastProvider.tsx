import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
};

type ToastContextType = {
  show: (variant: ToastVariant, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function iconFor(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return { name: 'checkmark-circle-outline' as const, color: colors.green[600] };
    case 'error':
      return { name: 'close-circle-outline' as const, color: colors.red[600] };
    case 'warning':
      return { name: 'warning-outline' as const, color: colors.amber[600] };
    case 'info':
    default:
      return { name: 'information-circle-outline' as const, color: colors.brand[600] };
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const timerRef = useRef<any>(null);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(translateY, { toValue: -10, duration: 160, useNativeDriver: Platform.OS !== 'web' })
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToast({ id, variant, title, message });

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: Platform.OS !== 'web' })
      ]).start();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, 3200);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo<ToastContextType>(
    () => ({
      show,
      success: (t, m) => show('success', t, m),
      error: (t, m) => show('error', t, m),
      warning: (t, m) => show('warning', t, m),
      info: (t, m) => show('info', t, m)
    }),
    [show]
  );

  const icon = toast ? iconFor(toast.variant) : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0">
          <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={cn('mx-4 mt-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4')}
          >
            <Pressable onPress={hide} className="flex-row items-start">
              {icon ? (
                <View className="mr-3 mt-0.5">
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>
              ) : null}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{toast.title}</Text>
                {toast.message ? (
                  <Text className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{toast.message}</Text>
                ) : null}
              </View>
              <View className="ml-3">
                <Ionicons name="close" size={18} color={colors.neutral[500]} />
              </View>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
