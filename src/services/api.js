const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.bookit.it.com/api";

// General fetch helper
async function apiRequest(endpoint, method = "GET", body = null, token = null, options = {}) {
  const headers = { Accept: "application/json" };
  if (body !== null && !(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const query = options.query ? `?${new URLSearchParams(options.query).toString()}` : "";

  try {
    const response = await fetch(`${API_BASE}${endpoint}${query}`, {
      method,
      headers,
      body: body === null ? null : body instanceof FormData ? body : JSON.stringify(body)
    });

    const responseText = await response.text();
    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { detail: responseText };
    }

    if (!response.ok) {
      const errorMessage = getApiErrorMessage(data) ||
        `Request failed with status ${response.status} ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.warn(`API request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

/* ------------------- AUTH FUNCTIONS ------------------- */

/**
 * Sends Google ID token to backend or falls back to mock login
 */
export async function loginWithGoogleBackend(googleToken) {
  return apiRequest("/auth/google/", "POST", { id_token: googleToken });
}

export async function socialLogin(provider, credentials) {
  return apiRequest(`/auth/${encodeURIComponent(provider)}/`, "POST", credentials);
}

export async function loginUser(credentials) {
  return apiRequest("/auth/login/", "POST", credentials);
}

export async function obtainToken(credentials) {
  return apiRequest("/token/", "POST", credentials);
}

export async function refreshToken(refresh) {
  return apiRequest("/auth/token/refresh/", "POST", { refresh });
}

export async function verifyToken(token) {
  return apiRequest("/auth/token/verify/", "POST", { token });
}

export async function registerUser(userData) {
  return apiRequest("/auth/registration/", "POST", userData);
}

export async function registerUserLegacy(userData) {
  return apiRequest("/auth/register/", "POST", userData);
}

export async function verifyEmail(key) {
  return apiRequest("/auth/registration/verify-email/", "POST", { key });
}

export async function resendVerificationEmail(email) {
  return apiRequest("/auth/registration/resend-email/", "POST", { email });
}

export async function changePassword(passwords, token) {
  return apiRequest("/auth/password/change/", "POST", passwords, token);
}

export async function requestPasswordReset(email) {
  return apiRequest("/auth/password/reset/", "POST", { email });
}

export async function confirmPasswordReset(passwordData) {
  return apiRequest("/auth/password/reset/confirm/", "POST", passwordData);
}

export async function fetchCurrentUser(token) {
  return apiRequest("/auth/user/", "GET", null, token);
}

export async function updateCurrentUser(userData, token, method = "PATCH") {
  return apiRequest("/auth/user/", method, userData, token);
}

export async function signOutUser() {
  return apiRequest("/auth/logout/", "POST", null, localStorage.getItem("accessToken"));
}

export async function logoutUser(method = "POST", token = localStorage.getItem("accessToken")) {
  return apiRequest("/auth/logout/", method, null, token);
}

/* ------------------- LISTINGS FUNCTIONS ------------------- */

export async function fetchListings(filters = {}) {
  const data = await apiRequest("/listings/", "GET", null, null, { query: filters });
  if (!Array.isArray(data)) throw new Error("The listings response was not an array.");
  return data.map(item => normalizeListing(item));
}

export async function fetchListingById(id) {
  const data = await apiRequest(`/listings/${encodeURIComponent(id)}/`);
  return normalizeListing(data);
}

export async function searchListings({ location = '', minPrice = 0, maxPrice = Infinity }) {
  const filters = {};
  if (location) filters.search = location;
  if (minPrice) filters.first_price = minPrice;
  const allListings = await fetchListings(filters);

  return allListings.filter(item => {
    const matchesLocation = !location ||
      item.location.toLowerCase().includes(location.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(location.toLowerCase()));

    const itemPrice = item.displayPrice || item.price || 0;
    const matchesMin = itemPrice >= (Number(minPrice) || 0);
    const matchesMax = !maxPrice || itemPrice <= (Number(maxPrice) || Infinity);

    return matchesLocation && matchesMin && matchesMax;
  });
}

export async function createListing(listingData, imageFile = null, token = null) {
  const formData = new FormData();
  const fields = {
    lodge_name: listingData.title,
    description: listingData.description,
    first_price: listingData.first_price,
    year_price: listingData.year_price,
    location: listingData.location,
    room_type: listingData.room_type || toRoomType(listingData.rooms),
    total_rooms: listingData.total_rooms || 1,
    rules: listingData.rules,
    contact_email: listingData.agent_email,
    contact_phone: listingData.agent_phone,
    is_available: true
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
  });

  const amenities = Array.isArray(listingData.amenities)
    ? listingData.amenities
    : String(listingData.amenities || '').split(',').map(item => item.trim()).filter(Boolean);
  if (amenities.length > 0) formData.append('amenity_names', JSON.stringify(amenities));
  if (imageFile) formData.append('uploaded_images', imageFile, imageFile.name);

  return normalizeListing(await apiRequest('/listings/', 'POST', formData, token));
}

export async function updateListing(id, listingData, token = null) {
  const formData = new FormData();
  const fields = {
    lodge_name: listingData.title || listingData.lodge_name,
    description: listingData.description,
    first_price: listingData.first_price,
    year_price: listingData.year_price,
    location: listingData.location,
    room_type: listingData.room_type || toRoomType(listingData.rooms),
    total_rooms: listingData.total_rooms || listingData.rooms_count,
    room_number: listingData.room_number,
    agency: listingData.agency,
    is_available: listingData.is_available,
    rules: listingData.rules,
    contact_phone: listingData.contact_phone || listingData.agent_phone,
    contact_email: listingData.contact_email || listingData.agent_email
  };
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
  });
  const amenities = Array.isArray(listingData.amenities)
    ? listingData.amenities.map(item => typeof item === 'string' ? item : item.name)
    : String(listingData.amenities || '').split(',').map(item => item.trim()).filter(Boolean);
  if (amenities.length) formData.append('amenity_names', JSON.stringify(amenities));
  (listingData.uploadedImages || []).forEach(file => formData.append('uploaded_images', file, file.name));
  if (listingData.video) formData.append('video', listingData.video);
  return normalizeListing(await apiRequest(`/listings/${encodeURIComponent(id)}/`, 'PATCH', formData, token));
}

export async function deleteListing(id, token = null) {
  return apiRequest(`/listings/${encodeURIComponent(id)}/`, 'DELETE', null, token);
}

function toRoomType(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('self')) return 'SELF_CONTAINED';
  if (normalized.includes('one')) return 'ONE_BEDROOM';
  if (normalized.includes('two')) return 'TWO_BEDROOM';
  if (normalized.includes('studio')) return 'STUDIO';
  if (normalized.includes('shared')) return 'SHARED_ROOM';
  if (normalized.includes('single')) return 'SINGLE_ROOM';
  return 'OTHER';
}

export async function submitAgentRequest(formData) {
  try {
    const response = await fetch("https://formspree.io/f/xbdoojgo", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.ok;
  } catch (e) {
    console.error("Formspree submit error:", e);
    return true;
  }
}

// Normalize listing object structure for React UI consistency
function normalizeListing(item) {
  const price = Number(item.year_price || item.first_price || item.price || 0);

  let imageUrl = item.cover_image_url || item.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=75";
  let images = [];

  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    images = item.images.map(img => typeof img === 'string' ? { image_url: img } : img);
  } else {
    images = [{ image_url: imageUrl }];
  }

  let amenitiesList = [];
  if (Array.isArray(item.amenities)) {
    amenitiesList = item.amenities;
  } else if (typeof item.amenities === 'string') {
    amenitiesList = item.amenities.split(',').map(a => a.trim()).filter(Boolean);
  } else {
    amenitiesList = ["Water", "Electricity", "Security"];
  }

  return {
    id: item.id,
    title: item.title || item.lodge_name || "Student Lodge",
    location: item.location_display || item.location || "Awka, Anambra State",
    price: price,
    first_price: item.first_price || String(price * 1.2),
    year_price: item.year_price || item.price || String(price),
    displayPrice: price,
    cover_image_url: imageUrl,
    images: images,
    description: item.description || "Spacious student lodge in a calm and accessible neighborhood.",
    rooms: item.rooms || item.room_type || "Self-contained",
    room_type: item.room_type,
    total_rooms: item.total_rooms,
    room_number: item.room_number,
    amenities: amenitiesList,
    rules: item.rules || "No loud music after 10 PM. Maintain cleanliness.",
    agent_name: item.agent_name || item.agent_detail?.full_name || item.agent_detail?.username || "BookIt Agent",
    agent_phone: item.agent_phone || item.contact_phone || item.agent_detail?.phone_number || "+2349134850138",
    agent_email: item.agent_email || item.contact_email || item.agent_detail?.email || "agent@bookit.com",
    agent: item.agent,
    agency: item.agency,
    is_available: item.is_available !== false
  };
}

function getApiErrorMessage(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(getApiErrorMessage).filter(Boolean).join(", ");

  const directMessage = data.detail || data.message || data.error;
  if (directMessage) return getApiErrorMessage(directMessage);

  return Object.entries(data)
    .map(([field, value]) => {
      const message = getApiErrorMessage(value);
      return message ? `${field}: ${message}` : "";
    })
    .filter(Boolean)
    .join("; ");
}