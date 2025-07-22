// app/register.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather'; // For icons
import { useAuth } from './contexts/auth-context';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim()) return setError('Name is required');
    if (name.length < 2) return setError('Name must be at least 2 characters');
    if (!email) return setError('Email is required');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Invalid email');
    if (phone && !/^\+?[\d\s\-]+$/.test(phone)) return setError('Invalid phone number');
    if (!password) return setError('Password is required');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return setError('Password must contain upper, lower, and number');
    }
    if (password !== confirmPassword) return setError('Passwords do not match');

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const success = await login(formData.email, formData.password);
      if (success) router.replace('/');
      else setError('Registration succeeded but login failed');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Join AutoBalkan</Text>
          <Text style={styles.subheader}>Create your account to buy or sell cars in the Balkans</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <InputField
            icon="user"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(val: string) => handleInputChange('name', val)}
          />
          <InputField
            icon="mail"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val: string) => handleInputChange('email', val)}
          />
          <InputField
            icon="phone"
            placeholder="Phone Number (optional)"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(val: string) => handleInputChange('phone', val)}
          />
          <InputField
            icon="lock"
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(val: string) => handleInputChange('password', val)}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <InputField
            icon="lock"
            placeholder="Confirm Password"
            secureTextEntry={!showConfirm}
            value={formData.confirmPassword}
            onChangeText={(val: string) => handleInputChange('confirmPassword', val)}
            rightIcon={showConfirm ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowConfirm(!showConfirm)}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('../index')}>
            <Text style={styles.guestLink}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const InputField = ({
  icon,
  rightIcon,
  onRightIconPress,
  ...props
}: {
  icon: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  [key: string]: any;
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Icon name={icon} size={18} color="#999" style={styles.iconLeft} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Icon name={rightIcon} size={18} color="#999" style={styles.iconRight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fc6828',  // Orange background for whole screen
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',     // White card container
    borderRadius: 20,
    padding: 24,
    elevation: 8,                // Android shadow
    shadowColor: '#000',         // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  registerButton: {
    backgroundColor: '#fc6828',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#fc6828',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  loginText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  guestLink: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
