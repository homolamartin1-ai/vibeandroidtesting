package com.techshop.android

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

// Hardcoded demo credentials (Sprint 1 — no backend).
const val VALID_EMAIL = "demo@techshop.com"
const val VALID_PASSWORD = "password123"

class AppViewModel : ViewModel() {

    // ---- Auth ----
    var isAuthenticated by mutableStateOf(false)
        private set
    var error by mutableStateOf("")
        private set

    fun login(email: String, password: String): Boolean {
        // FIXED (BUG-002): empty fields are rejected.
        if (email.isBlank() || password.isBlank()) {
            error = "Email and password are required"
            isAuthenticated = false
            return false
        }
        // FIXED (BUG-003): only the valid credentials are accepted.
        if (email.trim() != VALID_EMAIL || password != VALID_PASSWORD) {
            error = "Invalid email or password"
            isAuthenticated = false
            return false
        }
        error = ""
        isAuthenticated = true
        return true
    }

    fun logout() {
        isAuthenticated = false
        error = ""
    }

    // ---- Cart: productId -> quantity ----
    val items = mutableStateMapOf<String, Int>()
    var discountCode by mutableStateOf("")

    fun addToCart(p: Product) {
        items[p.id] = (items[p.id] ?: 0) + 1
    }

    fun setQuantity(id: String, quantity: Int) {
        // FIXED (BUG-005): quantity is clamped to a minimum of 1.
        if (items.containsKey(id)) items[id] = maxOf(1, quantity)
    }

    fun removeItem(id: String) { items.remove(id) }

    fun clearCart() { items.clear(); discountCode = "" }

    val subtotal: Int
        get() = items.entries.sumOf { productFor(it.key).price * it.value }

    val discountPercent: Int
        get() = DISCOUNTS[discountCode] ?: 0

    // FIXED (BUG-004): discount divides by 100 — the correct percentage.
    val discountAmount: Double
        get() = subtotal * discountPercent / 100.0

    val total: Double
        get() = subtotal - discountAmount
}
