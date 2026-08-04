export const mockListings = [
  {
    id: 1,
    title: "Sunny Lodge",
    lodge_name: "Sunny Lodge",
    location: "Temp site",
    price: 120000,
    first_price: "120000.00",
    year_price: "100000.00",
    cover_image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80" },
      { image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Clean and secure rooms near Unizik campus. Constant water supply and quiet study environment.",
    rooms: "Self-contained",
    amenities: ["Water", "Electricity", "Security", "WiFi"],
    rules: "No loud music after 10pm",
    agent_name: "Daniel Dominic",
    agent_phone: "08011112222",
    agent_email: "daniel@bookit.com",
    is_available: true
  },
  {
    id: 2,
    title: "Green House Lodge",
    lodge_name: "Green House Lodge",
    location: "Ifite-Up School",
    price: 180000,
    first_price: "180000.00",
    year_price: "150000.00",
    cover_image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Spacious lodge with constant water and prepaid electricity meter for each room.",
    rooms: "Single Room",
    amenities: ["Water", "WiFi", "Security", "Parking"],
    rules: "No smoking inside the premises",
    agent_name: "Daniel Dominic",
    agent_phone: "08098765432",
    agent_email: "daniel@bookit.com",
    is_available: true
  },
  {
    id: 3,
    title: "Dominic Lodge",
    lodge_name: "Dominic Lodge",
    location: "Amansea",
    price: 250000,
    first_price: "250000.00",
    year_price: "200000.00",
    cover_image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Comfortable modern lodge with high security, tiled floors, and vehicle parking space.",
    rooms: "Self-contained",
    amenities: ["Water", "Electricity", "Security", "WiFi", "Parking"],
    rules: "No loud parties without permission",
    agent_name: "Daniel Dominic",
    agent_phone: "08033334444",
    agent_email: "daniel@bookit.com",
    is_available: true
  },
  {
    id: 4,
    title: "Sunny Hostel",
    lodge_name: "Sunny Hostel",
    location: "Okpuno",
    price: 115000,
    first_price: "115000.00",
    year_price: "95000.00",
    cover_image_url: "https://images.unsplash.com/photo-1599929457522-9f4b9ca3e9ab?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1599929457522-9f4b9ca3e9ab?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Affordable rooms with easy public transport access to campus and main market.",
    rooms: "Single Room",
    amenities: ["Water", "Security"],
    rules: "Keep common areas clean",
    agent_name: "Ms Stella",
    agent_phone: "08055556666",
    agent_email: "stella@bookit.com",
    is_available: true
  },
  {
    id: 5,
    title: "Haven Suites",
    lodge_name: "Haven Suites",
    location: "Aroma",
    price: 195000,
    first_price: "195000.00",
    year_price: "160000.00",
    cover_image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Modern student hostel with prime central location near Aroma Junction.",
    rooms: "Self-contained",
    amenities: ["WiFi", "Water", "Security", "Electricity"],
    rules: "No smoking in rooms",
    agent_name: "Mr John",
    agent_phone: "08012345678",
    agent_email: "john@bookit.com",
    is_available: true
  },
  {
    id: 6,
    title: "Campus View Lodge",
    lodge_name: "Campus View Lodge",
    location: "Unizik Gate",
    price: 235000,
    first_price: "235000.00",
    year_price: "190000.00",
    cover_image_url: "https://images.unsplash.com/photo-1592928304483-7d05723e61b5?auto=format&fit=crop&w=800&q=80",
    images: [
      { image_url: "https://images.unsplash.com/photo-1592928304483-7d05723e61b5?auto=format&fit=crop&w=800&q=80" }
    ],
    description: "Right opposite the university main gate. Save money on daily commuting!",
    rooms: "Self-contained",
    amenities: ["WiFi", "Security", "Parking", "Water"],
    rules: "No unauthorized guests after midnight",
    agent_name: "Mrs Jane",
    agent_phone: "08098765432",
    agent_email: "jane@bookit.com",
    is_available: true
  }
];

export const LOCATIONS = [
  { id: "", label: "All Locations" },
  { id: "Ifite, Anambra state", label: "Ifite, Anambra state" },
  { id: "Amansea", label: "Amansea" },
  { id: "Ifite-Up School", label: "Ifite-Up School" },
  { id: "Ifite-Down School", label: "Ifite-Down School" },
  { id: "Permanent Site", label: "Permanent Site" },
  { id: "Temp site", label: "Temp Site" },
  { id: "Unizik Gate", label: "Unizik Gate" },
  { id: "Awka Road", label: "Awka Road" },
  { id: "Aroma", label: "Aroma" },
  { id: "Okpuno", label: "Okpuno" }
];
