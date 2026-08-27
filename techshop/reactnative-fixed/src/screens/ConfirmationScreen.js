import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmationScreen({ route }) {
  const { orderRef, total } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✓</Text>
      <Text testID="confirmation-title" style={styles.title}>
        Order Confirmed
      </Text>

      {/* FIXED (BUG-013): the order reference is displayed. */}
      <Text testID="confirmation-order-ref" style={styles.ref}>
        Order Reference: {orderRef}
      </Text>

      <Text testID="confirmation-total" style={styles.total}>
        Total Paid: ${total}
      </Text>
      <Text style={styles.note}>Thank you for shopping with TechShop.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  check: { fontSize: 56, color: '#2ecc71' },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1442', marginTop: 8 },
  ref: { fontSize: 16, color: '#1a1442', marginTop: 12, fontWeight: '600' },
  total: { fontSize: 18, color: '#3b2fb5', marginTop: 8, fontWeight: '700' },
  note: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center' },
});
