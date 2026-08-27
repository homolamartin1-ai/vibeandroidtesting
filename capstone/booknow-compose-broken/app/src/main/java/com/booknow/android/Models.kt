package com.booknow.android

data class Room(
    val id: Int,
    val name: String,
    val description: String,
    val price: Double,
    val discount: Double,
    val icon: String,
) {
    // BUG: discount divides by 1000 instead of 100 — the discounted price is barely reduced.
    val discountedPrice: Double
        get() = price * (1.0 - (discount / 1000.0))
}

val SAMPLE_ROOMS = listOf(
    Room(1, "Deluxe Room", "King-size bed, city view, breakfast included.", 129.0, 20.0, "🛏️"),
    Room(2, "Superior Room", "Twin beds, garden view, rooftop pool access.", 89.0, 10.0, "🏨"),
    Room(3, "Family Suite", "Two bedrooms, living area, kitchenette, ocean views.", 199.0, 15.0, "🏢"),
    Room(4, "Penthouse Suite", "Private terrace, butler service, skyline views.", 299.0, 5.0, "👑"),
)
