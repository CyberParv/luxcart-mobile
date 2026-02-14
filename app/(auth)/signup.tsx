import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      await signup(email, password, name);
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error && <ErrorView message={error} />}
        <Button onPress={handleSignup} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Create Account</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/login')}>
          <Text>Already have an account? Log In</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}