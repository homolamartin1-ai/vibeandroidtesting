import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { calcDiscounted } from '../data/rooms';

const ICONS = {
  1: '🛏️',
  2: '🏡',
  3: '🏢',
  4: '👑'
};

export default function RoomsScreen({ navigation }) {
  const { rooms, selectRoom } = useBooking();
  const { logout } = useAuth();

  const renderRoom = ({ item }) => {
    const discounted = calcDiscounted(item.price, item.discount);

    return (
      <View style={styles.card} testID={`room-card-${item.id}`} accessibilityLabel={`room-card-${item.id}`}>
        {/* Image / Icon Preview with Available Badge */}
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>{ICONS[item.id] || '🛏️'}</Text>
          <View style={styles.badgeWrap}>
            <Text style={styles.badge} testID={`badge-available-${item.id}`} accessibilityLabel={`badge-available-${item.id}`}>
              Available
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardBody}>
          <Text style={styles.roomName} testID={`room-name-${item.id}`} accessibilityLabel={`room-name-${item.id}`}>
            {item.name}
          </Text>
          <Text style={styles.roomDesc} numberOfLines={3} testID={`room-desc-${item.id}`} accessibilityLabel={`room-desc-${item.id}`}>
            {item.desc}
          </Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.discountedPrice} testID={`room-price-${item.id}`} accessibilityLabel={`room-price-${item.id}`}>
              ${discounted}/night
            </Text>
            <View style={styles.discountBadgeWrap}>
              <Text style={styles.discountBadge}>{item.discount}% OFF</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              selectRoom(item);
              navigation.navigate('Booking');
            }}
            testID={`btn-select-room-${item.id}`}
            accessibilityLabel={`btn-select-room-${item.id}`}
          >
            <Text style={styles.bookButtonText}>Select Room</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Available Rooms</Text>
        <TouchableOpacity onPress={logout} testID="logout-btn" accessibilityLabel="logout-btn" style={styles.logoutBtn}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#f1f5f9' },
  navTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  logoutBtn: { padding: 4 },
  logoutIcon: { fontSize: 20 },
  list: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  previewBox: { height: 160, backgroundColor: '#f1f5f9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  previewIcon: { fontSize: 50 },
  badgeWrap: { position: 'absolute', top: 10, right: 10 },
  badge: { backgroundColor: '#10b981', color: '#ffffff', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  cardBody: { marginTop: 12 },
  roomName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  roomDesc: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  originalPrice: { fontSize: 14, textDecorationLine: 'line-through', color: '#94a3b8', marginRight: 8 },
  discountedPrice: { fontSize: 17, fontWeight: 'bold', color: '#2563eb', marginRight: 10 },
  discountBadgeWrap: { backgroundColor: '#ffedd5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  discountBadge: { fontSize: 12, fontWeight: 'bold', color: '#ea580c' },
  bookButton: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' }
});
