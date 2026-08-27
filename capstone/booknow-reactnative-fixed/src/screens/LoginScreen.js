import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    const res = login(email, password);
    if (res.success) {
      setErrorMessage('');
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.inner}>
        <View style={styles.spacer} />

        {/* Logo & Title */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🏢</Text>
          </View>
          <Text style={styles.title} testID="app-title" accessibilityLabel="app-title">
            BookNow
          </Text>
          <Text style={styles.subtitle}>Hotel Room Booking</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              testID="login-user"
              accessibilityLabel="login-user"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              testID="login-pass"
              accessibilityLabel="login-pass"
            />
          </View>

          {errorMessage ? (
            <Text style={styles.error} testID="login-error" accessibilityLabel="login-error">
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            testID="login-btn"
            accessibilityLabel="login-btn"
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  spacer: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 28 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  iconText: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#64748b', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: '#ffffff', color: '#0f172a' },
  error: { color: '#ef4444', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' }
});
