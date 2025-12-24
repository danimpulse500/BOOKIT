document.getElementById("postForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Get existing listings from localStorage or fallback to data.js
  const listings = JSON.parse(localStorage.getItem("listings")) || [...listingsData];

  const newListing = {
    id: Date.now(),
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    price: Number(document.getElementById("price").value),
    rooms: document.getElementById("rooms").value,
    amenities: document.getElementById("amenities").value.split(",").map(a => a.trim()).filter(a => a),
    description: document.getElementById("description").value,
    rules: document.getElementById("rules").value,
    agentName: document.getElementById("agentName").value,
    agentPhone: document.getElementById("agentPhone").value,
    image: "images/default.jpg"
  };

  listings.push(newListing);
  localStorage.setItem("listings", JSON.stringify(listings));

  alert("Listing posted successfully!");
  window.location.href = "index.html";
});
