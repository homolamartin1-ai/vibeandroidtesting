import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useBooking } from '../context/BookingContext';

export default function ConfirmationScreen({ navigation }) {
  const { currentBooking, resetBooking } = useBooking();

  if (!currentBooking) return null;

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
          <Text style={styles.subtitle}>
            Thank you for choosing BookNow. Your reservation has been secured.
          </Text>
        </View>

        {/* Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.caption}>Reference Number</Text>
            <Text style={styles.refNum} testID="confirm-ref" accessibilityLabel="confirm-ref">
              {currentBooking.referenceNumber}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Guest Name</Text>
            <Text style={styles.val} testID="confirm-name" accessibilityLabel="confirm-name">
              {currentBooking.fullName}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room</Text>
            <Text style={styles.val} testID="confirm-room" accessibilityLabel="confirm-room">
              {currentBooking.room.name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.val}>{currentBooking.checkInDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.val}>{currentBooking.checkOutDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Guests</Text>
            <Text style={styles.val}>{currentBooking.guests}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.val}>
              {currentBooking.nights} night{currentBooking.nights === 1 ? '' : 's'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Charged</Text>
            <Text style={styles.totalVal} testID="confirm-total" accessibilityLabel="confirm-total">
              {currentBooking.totalPrice}
            </Text>
          </View>
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
  header: { alignItems: 'center', marginBottom: 24, marginTop: 16 },
  checkIconWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  checkIcon: { fontSize: 38, color: '#16a34a', fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 6, paddingHorizontal: 16, lineHeight: 20 },
  card: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 18, marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  caption: { fontSize: 13, color: '#64748b' },
  label: { fontSize: 14, color: '#64748b' },
  val: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  refNum: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  totalVal: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },
  doneBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  doneBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
