import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useBooking } from '../context/BookingContext';

export default function ConfirmationScreen({ navigation }) {
  const { resetBooking } = useBooking();

  const handleDone = () => {
    resetBooking();
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Icon & Message */}
        <View style={styles.header}>
          <View style={styles.checkIconWrap}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
          <Text style={styles.title} testID="confirm-title" accessibilityLabel="confirm-title">
            Booking Confirmed!
          </Text>
          {/* BUG-015: Generic message with no booking summary */}
          <Text style={styles.subtitle}>
            Thank you for choosing BookNow.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={handleDone}
          testID="btn-done"
          accessibilityLabel="btn-done"
        >
          <Text style={styles.doneBtnText}>Back to Rooms</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 40 },
  checkIconWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  checkIcon: { fontSize: 38, color: '#16a34a', fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 6, paddingHorizontal: 16, lineHeight: 20 },
  doneBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  doneBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
