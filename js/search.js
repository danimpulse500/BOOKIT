function searchListings() {
  const location = document.getElementById("locationInput").value.toLowerCase();
  const min = Number(document.getElementById("minPrice").value) || 0;
  const max = Number(document.getElementById("maxPrice").value) || Infinity;

  const filtered = listingsData.filter(item =>
    item.location.toLowerCase().includes(location) &&
    item.price >= min &&
    item.price <= max
  );

  displayListings(filtered);
}
function searchListings() {
  const locationInput = document.getElementById("locationInput");
  if (!locationInput) return;

  const location = locationInput.value.toLowerCase();
  const min = Number(document.getElementById("minPrice").value) || 0;
  const max = Number(document.getElementById("maxPrice").value) || Infinity;

  const filtered = listingsData.filter(item =>
    item.location.toLowerCase().includes(location) &&
    item.price >= min &&
    item.price <= max
  );

  displayListings(filtered);
}
