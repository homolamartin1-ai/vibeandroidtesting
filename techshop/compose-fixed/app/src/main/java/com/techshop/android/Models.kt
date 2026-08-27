package com.techshop.android

// TechShop catalog data. Shared by the catalog and cart.
// Prices are whole dollars for simple, testable math.

data class Product(
    val id: String,
    val name: String,
    val icon: String,
    val price: Int,
    val inStock: Boolean,
)

val PRODUCTS = listOf(
    Product("p1", "Wireless Headphones", "🎧", 60, true),
    Product("p2", "Mechanical Keyboard", "⌨️", 90, true),
    // Deliberately long name — the catalog cell must handle it (see BUG-007).
    Product("p3", "Ultra-Wide Curved 49-inch Professional Gaming Monitor with HDR", "🖥️", 700, true),
    Product("p4", "USB-C Hub", "🔌", 40, false),
)

// Valid discount codes: percentage off the subtotal.
val DISCOUNTS = mapOf("SAVE10" to 10, "SAVE20" to 20)

fun productFor(id: String): Product = PRODUCTS.first { it.id == id }
