package com.booknow.android

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

const val VALID_EMAIL = "demo@booknow.com"
const val VALID_PASSWORD = "password123"

data class Booking(
    val reference: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val checkIn: String,
    val checkOut: String,
    val guests: Int,
    val room: Room,
    val nights: Int,
    val total: Double,
)

class BookViewModel : ViewModel() {
    var isLoggedIn by mutableStateOf(false); private set
    var error by mutableStateOf("")
    var selectedRoom by mutableStateOf<Room?>(null); private set
    var currentBooking by mutableStateOf<Booking?>(null); private set

    fun login(email: String, password: String): Boolean {
        // BUG: login bypasses validation — empty and wrong credentials are accepted.
        error = ""
        isLoggedIn = true
        return true
    }

    fun logout() { isLoggedIn = false; selectedRoom = null; currentBooking = null }

    fun selectRoom(room: Room) { selectedRoom = room }

    // BUG: nights is frozen at 1 regardless of the dates entered.
    fun calculateNights(checkIn: String, checkOut: String): Int = 1

    fun createBooking(
        firstName: String, lastName: String, email: String, phone: String,
        checkIn: String, checkOut: String, guests: Int,
    ): Boolean {
        val room = selectedRoom ?: return false
        // BUG: no field, date, or guest validation — an empty/invalid form still books.
        val nights = 1
        val total = room.discountedPrice * nights
        // BUG: no reference number is generated.
        currentBooking = Booking("", firstName, lastName, email, phone, checkIn, checkOut, guests, room, nights, total)
        return true
    }
}
