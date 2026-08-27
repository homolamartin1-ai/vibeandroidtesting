export const ROOMS = [
  {
    id: 1,
    name: "Deluxe Room",
    desc: "Comfortable room with king-size bed, city view, and complimentary breakfast included.",
    price: 129,
    discount: 20
  },
  {
    id: 2,
    name: "Superior Room",
    desc: "Spacious room with twin beds, garden view, and access to the rooftop pool.",
    price: 89,
    discount: 10
  },
  {
    id: 3,
    name: "Family Suite",
    desc: "Generous family suite with two bedrooms, a spacious living area, kitchenette, and ocean views.",
    price: 199,
    discount: 15
  },
  {
    id: 4,
    name: "Penthouse Suite",
    desc: "Exclusive top-floor suite with private terrace, butler service, and panoramic skyline views.",
    price: 299,
    discount: 5
  }
];

export function calcDiscounted(price, discountPct) {
  return (price * (1 - discountPct / 100)).toFixed(2);
}
