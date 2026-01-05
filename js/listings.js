console.log("listings.js loaded");

// Initialize Supabase
const supabaseUrl = "https://sgwgnysdejtobrbcglke.supabase.co";
const supabaseKey = "sb_publishable_ah6iNOPj5d1wdOveSypkhg_XnbIlIJ3";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch all listings from Supabase
async function fetchListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    console.log("No listings found.");
    return [];
  }

  return data;
}

// Display listings on the page
function displayListings(listings) {
  const container = document.getElementById("listingsContainer");
  if (!container) return;

  container.innerHTML = ""; // Clear previous listings

  if (listings.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:20px;">No listings available.</p>`;
    return;
  }

  listings.forEach(item => {
    const card = document.createElement("div");
    card.className = "listing-card"; // matches your CSS

    card.innerHTML = `
      <img src="${item.image || 'images/default.jpg'}" alt="${item.title}">
      <div class="card-body">
        <h4>${item.title}</h4>
        <p>${item.location}</p>
        <p class="price">₦${item.price.toLocaleString()}</p>
      </div>
    `;

    card.onclick = () => {
      localStorage.setItem("selectedListing", item.id);
      window.location.href = "details.html";
    };

    container.appendChild(card);
  });
}

// Initial load of all listings
window.addEventListener("DOMContentLoaded", async () => {
  const listings = await fetchListings();
  displayListings(listings);
});

// Make displayListings global so search.js can call it
window.displayListings = displayListings;
