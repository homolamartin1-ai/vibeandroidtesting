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
        // ─────────────────────────────────────────────────────────────
        // BUG-002: empty fields are accepted — there is no validation.
        // BUG-003: wrong credentials still navigate to the catalog.
        // The requirement: reject empties AND wrong credentials. Here we
        // always authenticate, whatever the input.
        // ─────────────────────────────────────────────────────────────
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
        // ─────────────────────────────────────────────────────────────
        // BUG-005: quantity is allowed to go below 1 (down to negatives).
        // The requirement is a minimum of 1 — there is no clamp here.
        // ─────────────────────────────────────────────────────────────
        if (items.containsKey(id)) items[id] = quantity
    }

    fun removeItem(id: String) { items.remove(id) }

    fun clearCart() { items.clear(); discountCode = "" }

    val subtotal: Int
        get() = items.entries.sumOf { productFor(it.key).price * it.value }

    val discountPercent: Int
        get() = DISCOUNTS[discountCode] ?: 0

    // ─────────────────────────────────────────────────────────────────
    // BUG-004: discount divides by 1000 instead of 100 — a "10% off"
    // code subtracts subtotal * 10 / 1000, one tenth of the real
    // discount, so totals are wrong whenever a code is applied.
    // ─────────────────────────────────────────────────────────────────
    val discountAmount: Double
        get() = subtotal * discountPercent / 1000.0

    val total: Double
        get() = subtotal - discountAmount
}
