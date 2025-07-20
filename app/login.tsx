// app/login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Connect to Laravel API here
    setTimeout(() => {
      setLoading(false);
      router.push('/'); // Change to your route
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              errors.email ? styles.inputError : null,
              { paddingLeft: 40 },
            ]}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={[
              styles.input,
              errors.password ? styles.inputError : null,
              { paddingLeft: 40, paddingRight: 40 },
            ]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        {/* Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign up */}
        <Text style={styles.registerText}>
          Don’t have an account?
          <Text style={styles.registerLink} onPress={() => router.push('/register')}>
            {' '}Sign Up
          </Text>
        </Text>

        {/* Continue as guest */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc6828',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0a0a0a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  icon: {
    position: 'absolute',
    top: 14,
    left: 12,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
    zIndex: 1,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f00',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    fontSize: 13,
    color: '#fc6828',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fc6828',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
  registerLink: {
    color: '#fc6828',
    fontWeight: '600',
  },
  guestText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'underline',
  },
});
