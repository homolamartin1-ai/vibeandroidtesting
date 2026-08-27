package com.booknow.android

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.random.Random

private val DATE_FMT = SimpleDateFormat("yyyy-MM-dd", Locale.US).apply { isLenient = false }
private fun parseDate(s: String): Date? = try { DATE_FMT.parse(s) } catch (e: Exception) { null }

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
        // FIXED: empty and wrong credentials are rejected.
        if (email.isBlank() || password.isBlank()) { error = "Email and password are required"; return false }
        if (email.trim() != VALID_EMAIL || password != VALID_PASSWORD) { error = "Invalid email or password"; return false }
        error = ""; isLoggedIn = true; return true
    }

    fun logout() { isLoggedIn = false; selectedRoom = null; currentBooking = null }

    fun selectRoom(room: Room) { selectedRoom = room }

    // FIXED: nights is computed from the actual dates (minimum 1).
    fun calculateNights(checkIn: String, checkOut: String): Int {
        val ci = parseDate(checkIn); val co = parseDate(checkOut)
        if (ci == null || co == null) return 1
        val days = ((co.time - ci.time) / (1000L * 60 * 60 * 24)).toInt()
        return maxOf(1, days)
    }

    fun createBooking(
        firstName: String, lastName: String, email: String, phone: String,
        checkIn: String, checkOut: String, guests: Int,
    ): Boolean {
        val room = selectedRoom ?: return false
        // FIXED: required fields, valid email, valid dates (check-out after check-in), positive guests.
        if (listOf(firstName, lastName, email, phone, checkIn, checkOut).any { it.isBlank() }) {
            error = "All fields are required"; return false
        }
        if (!Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").matches(email)) { error = "Enter a valid email"; return false }
        val ci = parseDate(checkIn); val co = parseDate(checkOut)
        if (ci == null || co == null) { error = "Dates must be YYYY-MM-DD"; return false }
        if (!co.after(ci)) { error = "Check-out must be after check-in"; return false }
        if (guests < 1) { error = "At least one guest is required"; return false }

        error = ""
        val nights = calculateNights(checkIn, checkOut)
        val total = room.discountedPrice * nights
        // FIXED: a booking reference is generated.
        val ref = "BN-" + (100000 + Random.nextInt(900000)).toString()
        currentBooking = Booking(ref, firstName, lastName, email, phone, checkIn, checkOut, guests, room, nights, total)
        return true
    }
}
