import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.response.data?.error?.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="p-4">
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoFocus
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <ErrorView message={error} />}
        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Log In</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/signup')}>
          <Text>Create Account</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}