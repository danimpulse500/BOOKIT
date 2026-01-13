// api.js
// Base URL for your API
const API_BASE = "https://bookit-api-tpvz.onrender.com/api";

// Helper function to handle fetch requests
async function apiRequest(endpoint, method = "GET", body = null, token = null) {
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) headers["Authorization"] = `Token ${token}`;

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || JSON.stringify(data));
        }
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

/* ------------------- AUTH FUNCTIONS ------------------- */

// Register a new user
async function registerUser(userData) {
    /*
    userData = {
        email: "user@example.com",
        password1: "string",
        password2: "string",
        full_name: "string",
        phone_number: "string",
        is_agent: false
    }
    */
    return await apiRequest("/auth/registration/", "POST", userData);
}

// Login user
async function loginUser(credentials) {
    /*
    credentials = {
        email: "user@example.com",
        password: "string"
    }
    Returns: { key: "your_auth_token" }
    */
    return await apiRequest("/auth/login/", "POST", credentials);
}

/* ------------------- LISTINGS FUNCTIONS ------------------- */

// Create a new property listing (agents only)
async function createListing(listingData, token) {
    /*
    listingData = {
        title: "string",
        description: "string",
        price: 12345,
        location: "string",
        bedrooms: 3,
        bathrooms: 2,
        uploaded_images: ["url1", "url2"]
    }
    token = string from loginUser response
    */
    return await apiRequest("/listings/", "POST", listingData, token);
}

/* ------------------- EXAMPLE USAGE ------------------- */

// Example: Register a user
// registerUser({
//     email: "danimpulse500@gmail.com",
//     password1: "Account5@@",
//     password2: "Account5@@",
//     full_name: "Daniel Dominic",
//     phone_number: "+2349134850138",
//     is_agent: false
// }).then(res => console.log("Registered:", res))
//   .catch(err => console.error(err));

// Example: Login a user
// loginUser({
//     email: "danimpulse500@gmail.com",
//     password: "Account5@@"
// }).then(res => console.log("Logged in, token:", res.key))
//   .catch(err => console.error(err));

// Example: Create a listing (requires token from login)
// const token = "your_login_token_here";
// createListing({
//     title: "Nice Apartment",
//     description: "Beautiful 3-bedroom apartment",
//     price: 50000,
//     location: "Lagos",
//     bedrooms: 3,
//     bathrooms: 2,
//     uploaded_images: ["https://example.com/image1.jpg"]
// }, token).then(res => console.log("Listing created:", res))
//   .catch(err => console.error(err));


async function verifyEmail(key) {
    // Note: The endpoint /auth/registration/verify-email/ expects a POST with { "key": "..." }
    return await apiRequest("/auth/registration/verify-email/", "POST", { key })


// This code should run on the page corresponding to:
// yourfrontend.com

async function handleVerification() {
    // 1. Get the key from the URL (e.g., /account-confirm-email/MzI:1vfjlu:.../)
    const urlPath = window.location.pathname;
    const pathParts = urlPath.split('/');
    const key = pathParts[pathParts.length - 2]; // Grabs the key segment

    if (key) {
        try {
            console.log("Verifying email with key:", key);
            const response = await verifyEmail(key);
            console.log("Email verified successfully!", response);
            alert("Email verified! You can now log in.");
            window.location.href = "/login"; // Redirect to login
        } catch (error) {
            console.error("Verification failed:", error);
            alert("Verification link invalid or expired.");
        }
    }
}

// Call on page load
handleVerification();
