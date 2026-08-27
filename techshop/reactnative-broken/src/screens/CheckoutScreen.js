import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

// Fields required by the spec. All must be filled to submit.
const FIELDS = [
  { key: 'firstName', label: 'First Name', keyboard: 'default' },
  { key: 'lastName', label: 'Last Name', keyboard: 'default' },
  { key: 'email', label: 'Email', keyboard: 'email-address' },
  { key: 'phone', label: 'Phone', keyboard: 'number-pad' },
  { key: 'card', label: 'Card Number', keyboard: 'number-pad' },
  { key: 'expiry', label: 'Expiry (MM/YY)', keyboard: 'default' },
  // BUG-010: CVV uses the default keyboard, so letters/symbols are
  // accepted. The spec requires a numeric keypad and exactly 3 digits.
  { key: 'cvv', label: 'CVV', keyboard: 'default' },
];

export default function CheckoutScreen({ navigation }) {
  const { total, clearCart } = useCart();
  const [form, setForm] = useState({});

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit() {
    // ───────────────────────────────────────────────────────────────
    // BUG-012: no validation — submits with any/all fields empty.
    // BUG-009: expiry is never checked, so past dates are accepted.
    // BUG-010: CVV is never checked for 3 numeric digits.
    // The fix: validate every field before navigating.
    // ───────────────────────────────────────────────────────────────
    const orderRef = 'TS-' + Math.floor(100000 + Math.random() * 900000);
    clearCart();
    navigation.navigate('Confirmation', { orderRef, total });
  }

  // ─────────────────────────────────────────────────────────────────
  // BUG-017: this is a plain View, not a KeyboardAvoidingView + scroll.
  // When the CVV field (last, near the bottom) is focused, the software
  // keyboard covers it and it cannot scroll into view.
  // The fix: wrap in KeyboardAvoidingView + ScrollView.
  // ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      {FIELDS.map((f) => (
        <TextInput
          key={f.key}
          testID={`checkout-${f.key}`}
          accessibilityLabel={f.label}
          style={styles.input}
          placeholder={f.label}
          keyboardType={f.keyboard}
          autoCapitalize="none"
          value={form[f.key] || ''}
          onChangeText={(v) => update(f.key, v)}
        />
      ))}

      <TouchableOpacity testID="checkout-submit" style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: '800', color: '#1a1442', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 10 },
  button: { backgroundColor: '#3b2fb5', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
