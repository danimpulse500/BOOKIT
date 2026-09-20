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
 * Sends the Google OAuth access token to the backend.
 */
export async function loginWithGoogleBackend(accessToken) {
  return apiRequest("/auth/google/", "POST", { access_token: accessToken });
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

export async function createListing(listingData, imageFiles = null, token = null) {
  const formData = new FormData();

  const fields = {
    lodge_name: listingData.lodge_name || listingData.title,
    description: listingData.description,
    first_price: listingData.first_price,
    year_price: listingData.year_price,
    location: listingData.location,
    room_type: listingData.room_type || toRoomType(listingData.rooms),
    total_rooms: listingData.total_rooms || 1,
    room_number: listingData.room_number || '',
    video: listingData.video || '',
    is_available: listingData.is_available !== false,
    rules: listingData.rules || '',
    contact_phone: listingData.contact_phone || listingData.agent_phone,
    contact_email: listingData.contact_email || listingData.agent_email
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  const amenityNames = Array.isArray(listingData.amenity_names)
    ? listingData.amenity_names
    : Array.isArray(listingData.amenities)
      ? listingData.amenities
      : String(listingData.amenities || '').split(',').map(s => s.trim()).filter(Boolean);

  if (amenityNames.length > 0) {
    formData.append('amenity_names', JSON.stringify(amenityNames));
  }

  const filesToUpload = Array.isArray(imageFiles) 
    ? imageFiles 
    : imageFiles 
      ? [imageFiles] 
      : [];
  
  filesToUpload.forEach(file => {
    if (file instanceof File) {
      formData.append('uploaded_images', file, file.name);
    }
  });

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

// export function parseAmenities(amenitiesInput) {
//   if (!amenitiesInput) return ["Running Water", "Electricity"];

//   let result = [];

//   const extractItem = (item) => {
//     if (!item) return;
//     if (typeof item === 'string') {
//       let trimmed = item.trim();
//       if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
//         try {
//           const parsed = JSON.parse(trimmed);
//           if (Array.isArray(parsed)) {
//             parsed.forEach(extractItem);
//             return;
//           }
//         } catch {
//           // not valid JSON
//         }
//       }
//       trimmed = trimmed.replace(/^\[|\]$/g, '').replace(/^"|"$/g, '').replace(/\\"/g, '"').trim();
//       if (trimmed) {
//         if (trimmed.includes(',')) {
//           trimmed.split(',').forEach(sub => {
//             const cleanSub = sub.replace(/^"|"$/g, '').trim();
//             if (cleanSub) result.push(cleanSub);
//           });
//         } else {
//           result.push(trimmed);
//         }
//       }
//     } else if (typeof item === 'object') {
//       if (item.name) extractItem(item.name);
//       else if (item.title) extractItem(item.title);
//       else if (item.amenity) extractItem(item.amenity);
//     }
//   };

//   if (Array.isArray(amenitiesInput)) {
//     amenitiesInput.forEach(extractItem);
//   } else {
//     extractItem(amenitiesInput);
//   }

//   const unique = Array.from(new Set(result)).filter(Boolean);
//   return unique.length > 0 ? unique : ["Running Water", "Electricity"];
// }

function formatRoomType(value) {
  if (!value) return "Self-Contained";
  const s = String(value).toUpperCase();
  if (s.includes("SELF")) return "Self-Contained";
  if (s.includes("SINGLE")) return "Single Room";
  if (s.includes("TWO") || s.includes("2")) return "Two Bedroom";
  if (s.includes("ONE") || s.includes("1")) return "One Bedroom";
  if (s.includes("STUDIO")) return "Studio";
  if (s.includes("SHARED")) return "Shared Room";
  return value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function fetchAgentById(agentId) {
  try {
    const listings = await fetchListings();
    const agentListings = listings.filter(
      l => String(l.agent) === String(agentId) || String(l.agent_detail?.id) === String(agentId)
    );

    const firstMatch = agentListings[0];
    const agentDetail = firstMatch?.agent_detail || {};

    return {
      id: agentId,
      full_name: agentDetail.full_name || firstMatch?.agent_name || "David Chukwuchebem",
      username: agentDetail.username || "daviddominic767",
      email: agentDetail.email || firstMatch?.agent_email || "daviddominic767@gmail.com",
      phone_number: agentDetail.phone_number || firstMatch?.agent_phone || "08107045642",
      agency_name: agentDetail.agency_name || firstMatch?.agency || "BOOKIT AGENCY",
      location: firstMatch?.location || "Ifite Omohia",
      avatar: "/avatar.png",
      is_agent: true,
      date_joined: agentDetail.date_joined || "2026-08-27T09:33:29.073242Z",
      listings: agentListings.length > 0 ? agentListings : listings
    };
  } catch (err) {
    console.warn("fetchAgentById failed:", err);
    return {
      id: agentId,
      full_name: "David Chukwuchebem",
      username: "daviddominic767",
      email: "daviddominic767@gmail.com",
      phone_number: "08107045642",
      agency_name: "BOOKIT AGENCY",
      location: "Ifite Omohia",
      avatar: "/avatar.png",
      is_agent: true,
      date_joined: "2026-08-27T09:33:29.073242Z",
      listings: []
    };
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

  const amenitiesList = parseAmenities(item.amenities);
  const agentDetail = item.agent_detail || {};

  // ---- VIDEO NORMALIZATION ----
  // API may return `video_url` (absolute Cloudinary URL) and/or `video` (relative path).
  // Build a single absolute URL the UI can trust.
  const CLOUDINARY_BASE = "https://res.cloudinary.com/dx0faws91/";
  let videoUrl = null;

  if (item.video_url) {
    videoUrl = item.video_url;
  } else if (item.video) {
    videoUrl = String(item.video).startsWith("http")
      ? item.video
      : `${CLOUDINARY_BASE}${String(item.video).replace(/^\/+/, "")}`;
  }

  return {
    id: item.id,
    title: item.title || item.lodge_name || "Student Lodge",
    lodge_name: item.lodge_name || item.title || "Student Lodge",
    location: item.location_display || item.location || "Ifite Anambra",
    location_display: item.location_display || item.location || "Ifite Anambra",
    price: price,
    first_price: item.first_price || String(price * 1.2),
    year_price: item.year_price || (price ? String(price) : null),
    displayPrice: price,
    renewalPrice: item.year_price || price,
    cover_image_url: imageUrl,
    images: images,
    description: item.description || "Spacious student lodge in a calm and accessible neighborhood.",
    rooms: formatRoomType(item.room_type || item.rooms),
    room_type: item.room_type,
    total_rooms: item.total_rooms,
    room_number: item.room_number,
    amenities: amenitiesList,
    rules: item.rules || "No loud music after 10 PM. Maintain cleanliness.",

    // ---- VIDEO FIELDS (preserved for the UI) ----
    video: item.video || null,
    video_url: videoUrl,

    agent_name: item.agent_name || agentDetail.full_name || agentDetail.username || "David Chukwuchebem",
    agent_phone: item.agent_phone || item.contact_phone || agentDetail.phone_number || "08107045642",
    agent_email: item.agent_email || item.contact_email || agentDetail.email || "daviddominic767@gmail.com",
    agent_avatar: item.agent_avatar || agentDetail.avatar || "/avatar.png",
    agent: item.agent || agentDetail.id || 14,
    agent_detail: agentDetail,
    agency: item.agency || agentDetail.agency_name || "BOOKIT AGENCY",
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

export function parseAmenities(amenities) {
  if (!amenities || !Array.isArray(amenities)) return [];

  const result = [];
  amenities.forEach(item => {
    if (typeof item === 'string') {
      result.push(item);
      return;
    }
    if (item?.name && typeof item.name === 'string') {
      try {
        const parsed = JSON.parse(item.name);
        if (Array.isArray(parsed)) {
          result.push(...parsed);
          return;
        }
      } catch {
        result.push(item.name);
        return;
      }
    }
    if (item?.title) result.push(item.title);
    if (item?.label) result.push(item.label);
  });

  return [...new Set(result)];
}