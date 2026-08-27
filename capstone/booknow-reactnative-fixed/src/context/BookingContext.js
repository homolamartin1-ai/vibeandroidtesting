import React, { createContext, useState, useContext } from 'react';
import { ROOMS, calcDiscounted } from '../data/rooms';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [rooms] = useState(ROOMS);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);

  const selectRoom = (room) => {
    setSelectedRoom(room);
  };

  const createBooking = (formData) => {
    const { firstName, lastName, email, phone, checkInDate, checkOutDate, guests } = formData;
    
    if (!firstName?.trim()) return { success: false, error: 'First name is required.' };
    if (!lastName?.trim()) return { success: false, error: 'Last name is required.' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email?.trim())) return { success: false, error: 'Please enter a valid email address.' };
    
    const phoneRegex = /^[0-9 +\-().]{7,}$/;
    if (!phoneRegex.test(phone?.trim())) return { success: false, error: 'Please enter a valid phone number.' };
    
    const inD = new Date(checkInDate);
    const outD = new Date(checkOutDate);
    const nights = Math.round((outD - inD) / (1000 * 60 * 60 * 24));
    
    if (isNaN(nights) || nights <= 0) {
      return { success: false, error: 'Check-out date must be after check-in date.' };
    }
    
    if (!guests || guests < 1) {
      return { success: false, error: 'Number of guests must be at least 1.' };
    }
    
    const pricePerNight = parseFloat(calcDiscounted(selectedRoom.price, selectedRoom.discount));
    const totalPrice = (pricePerNight * nights).toFixed(2);
    const referenceNumber = `BKN-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const booking = {
      referenceNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone.trim(),
      checkInDate,
      checkOutDate,
      guests,
      room: selectedRoom,
      nights,
      totalPrice: `$${totalPrice}`
    };
    
    setCurrentBooking(booking);
    return { success: true, booking };
  };

  const resetBooking = () => {
    setSelectedRoom(null);
    setCurrentBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        selectedRoom,
        selectRoom,
        currentBooking,
        createBooking,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
