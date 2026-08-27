import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onSubmit() {
    login(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>TechShop</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        testID="login-email"
        accessibilityLabel="Email"
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* ───────────────────────────────────────────────────────────
          BUG-001: secureTextEntry is false — the password is shown
          in plaintext. The requirement is a masked (secure) field.
          ─────────────────────────────────────────────────────────── */}
      <TextInput
        testID="login-password"
        accessibilityLabel="Password"
        style={styles.input}
        placeholder="Password"
        secureTextEntry={false}
        value={password}
        onChangeText={setPassword}
      />

      {error ? (
        <Text testID="login-error" style={styles.error}>
          {error}
        </Text>
      ) : null}

      {/* ───────────────────────────────────────────────────────────
          BUG-016: this button has NO testID / accessibilityIdentifier.
          It cannot be located reliably by ID — the mobile testability
          lesson. The fix is to add testID="login-submit".
          ─────────────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  brand: { fontSize: 34, fontWeight: '800', color: '#3b2fb5', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 28 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  error: { color: '#c0392b', marginBottom: 12 },
  button: {
    backgroundColor: '#3b2fb5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
