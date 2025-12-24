console.log("listings.js loaded");

const container = document.getElementById("listingsContainer");

if (container) {
  console.log("listingsContainer found");

  listingsData.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}">
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.location}</p>
        <p class="price">₦${item.price.toLocaleString()}</p>
      </div>
    `;

    card.onclick = () => {
      console.log("Card clicked, ID:", item.id);
      localStorage.setItem("selectedListing", item.id);
      window.location.href = "details.html";
    };

    container.appendChild(card);
  });
} else {
  console.log("listingsContainer NOT found");
}
