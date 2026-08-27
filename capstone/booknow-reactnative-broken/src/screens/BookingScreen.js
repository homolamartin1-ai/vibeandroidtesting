import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useBooking } from '../context/BookingContext';
import { calcDiscounted } from '../data/rooms';

export default function BookingScreen({ navigation }) {
  const { selectedRoom, createBooking } = useBooking();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-08-25');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-28');
  const [guests, setGuests] = useState(2);

  if (!selectedRoom) return null;

  // BUG-011: Frozen at 1 night
  const nights = 1;
  const pricePerNight = parseFloat(calcDiscounted(selectedRoom.price, selectedRoom.discount));
  const totalPrice = (pricePerNight * nights).toFixed(2);

  // BUG-012: Submits unconditionally
  const handleSubmit = () => {
    createBooking({
      firstName,
      lastName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      guests
    });

    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Room Header Card */}
        <View style={styles.roomCard}>
          <Text style={styles.roomName} testID="booking-room-name" accessibilityLabel="booking-room-name">
            {selectedRoom.name}
          </Text>
          <Text style={styles.roomPrice} testID="booking-room-price" accessibilityLabel="booking-room-price">
            ${calcDiscounted(selectedRoom.price, selectedRoom.discount)} / night
          </Text>
        </View>

        {/* Guest Information Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Guest Information</Text>

          <View style={styles.nameRow}>
            <View style={styles.halfCol}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#94a3b8"
                value={firstName}
                onChangeText={setFirstName}
                testID="book-fname"
                accessibilityLabel="book-fname"
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#94a3b8"
                value={lastName}
                onChangeText={setLastName}
                testID="book-lname"
                accessibilityLabel="book-lname"
              />
            </View>
          </View>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            testID="book-email"
            accessibilityLabel="book-email"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#94a3b8"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            testID="book-phone"
            accessibilityLabel="book-phone"
          />
        </View>

        {/* Stay Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Stay Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-in Date</Text>
            <TextInput
              style={styles.dateInput}
              value={checkInDate}
              onChangeText={setCheckInDate}
              testID="book-checkin"
              accessibilityLabel="book-checkin"
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-out Date</Text>
            <TextInput
              style={styles.dateInput}
              value={checkOutDate}
              onChangeText={setCheckOutDate}
              testID="book-checkout"
              accessibilityLabel="book-checkout"
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guests: {guests}</Text>
            <View style={styles.stepperWrap}>
              {/* BUG-010: Stepper allows negative and 0 */}
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setGuests((g) => g - 1)}
              >
                <Text style={styles.stepperText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal} testID="book-guests" accessibilityLabel="book-guests">
                {guests}
              </Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setGuests((g) => g + 1)}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per night</Text>
            <Text style={styles.summaryValue}>${pricePerNight.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nights</Text>
            <Text style={styles.summaryValue} testID="summary-nights" accessibilityLabel="summary-nights">
              {nights}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalValue} testID="summary-total" accessibilityLabel="summary-total">
              ${totalPrice}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          testID="btn-book-now"
          accessibilityLabel="btn-book-now"
        >
          <Text style={styles.submitBtnText}>Confirm & Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 16 },
  roomCard: { backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12, marginBottom: 16 },
  roomName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  roomPrice: { fontSize: 16, fontWeight: '600', color: '#2563eb', marginTop: 4 },
  sectionCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  halfCol: { width: '48%' },
  label: { fontSize: 12, fontWeight: '500', color: '#64748b', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, color: '#0f172a' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  detailLabel: { fontSize: 15, color: '#0f172a' },
  dateInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, backgroundColor: '#f8fafc', color: '#0f172a' },
  stepperWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 2 },
  stepperBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  stepperText: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  stepperVal: { fontSize: 15, fontWeight: '600', color: '#0f172a', paddingHorizontal: 8 },
  summaryCard: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  submitBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
