console.log("search.js loaded");

// Initialize Supabase if not done globally
const supabaseUrl = "https://sgwgnysdejtobrbcglke.supabase.co";
const supabaseKey = "sb_publishable_ah6iNOPj5d1wdOveSypkhg_XnbIlIJ3";
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

async function searchListings() {
  const location = document.getElementById("locationInput").value.trim();
  const min = Number(document.getElementById("minPrice").value) || 0;
  const max = Number(document.getElementById("maxPrice").value) || Infinity;

  // Build the Supabase query
  let query = supabase.from("listings").select("*");

  if (location) {
    query = query.ilike("location", `%${location}%`); // case-insensitive match
  }

  query = query.gte("price", min).lte("price", max);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching listings:", error);
    alert("Failed to fetch listings. Check console.");
    return;
  }

  // Display listings on the page
  displayListings(data);
}

// Make function available globally for your HTML search button
window.searchListings = searchListings;
