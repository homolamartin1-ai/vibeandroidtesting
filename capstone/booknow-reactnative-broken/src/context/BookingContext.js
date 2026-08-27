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

  // BUG-009/010/011/012/013/014/016: Zero validation, frozen at 1 night, no ref number
  const createBooking = (formData) => {
    const { firstName, lastName, email, phone, checkInDate, checkOutDate, guests } = formData;
    
    const nights = 1; // Frozen night
    const pricePerNight = parseFloat(calcDiscounted(selectedRoom.price, selectedRoom.discount));
    const totalPrice = (pricePerNight * nights).toFixed(2);
    
    const booking = {
      referenceNumber: '', // Empty reference number
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: `${firstName || ''} ${lastName || ''}`,
      email: email || '',
      phone: phone || '',
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
