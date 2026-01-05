document.addEventListener("DOMContentLoaded", () => {
  const userArea = document.getElementById("userArea");
  const postLink = document.getElementById("postLink");
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  const isLoggedIn = localStorage.getItem("loggedInUser");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole"); // Agent | Renter

  // ---- Hide desktop "Post Lodge" if not agent ----
  if (postLink) {
    postLink.style.display = (userRole && userRole.toLowerCase() === "agent") ? "inline-block" : "none";
  }

  const isMobile = window.innerWidth <= 768;

  // ---- USER AREA ----
  if (isLoggedIn && userName && userRole) {
    if (isMobile) {
      // Hide desktop nav if mobile
      const desktopNav = document.getElementById("navMenu");
      if (desktopNav) desktopNav.style.display = "none";

      // Mobile menu will be filled only on click
      if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener("click", e => {
          e.stopPropagation();

          // Fill menu only if not already filled
          if (!mobileNav.innerHTML) {
            mobileNav.innerHTML = `
              <div class="mobile-user">
                <img src="https://i.pravatar.cc/40?u=${userName}" alt="User">
                <span class="username">${userName}</span>
                <span class="role-badge">${userRole}</span>
              </div>

              <a href="index.html">Home</a>
              <a href="contact.html">Contact/Support</a>
              ${userRole.toLowerCase() === "agent" ? `<a href="post.html">Post Lodge</a>` : ``}

              <a href="profile.html">Profile</a>
              ${userRole.toLowerCase() === "agent" ? `<a href="listing.html">My Listings</a>` : `
                <a href="#">Saved Places</a>
                <a href="#">Contacted Agents</a>
              `}

              <button class="logout-btn">Logout</button>
            `;

            // Add logout functionality
            const logoutBtn = mobileNav.querySelector(".logout-btn");
            if (logoutBtn) {
              logoutBtn.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "login.html";
              });
            }
          }

          // Show/hide menu
          mobileNav.classList.toggle("active");
        });

        // Close mobile menu if clicked outside
        document.addEventListener("click", e => {
          if (!mobileNav.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileNav.classList.remove("active");
          }
        });
      }

    } else {
      // ---- DESKTOP ----
      userArea.innerHTML = `
        <div class="user-menu">
          <img src="https://i.pravatar.cc/40?u=${userName}" alt="User">
          <span class="username">${userName}</span>
          <span class="role-badge">${userRole}</span>
          <div class="user-dropdown">
            ${userRole.toLowerCase() === "agent" ? `
              <a href="post.html">Post Lodge</a>
              <a href="listing.html">My Listings</a>
            ` : `
              <a href="#">Saved Places</a>
              <a href="#">Contacted Agents</a>
            `}
            <a href="profile.html">Profile</a>
            <button class="logout-btn">Logout</button>
          </div>
        </div>
      `;

      const userMenu = userArea.querySelector(".user-menu");
      const dropdown = userArea.querySelector(".user-dropdown");

      // Desktop dropdown toggle
      if (userMenu && dropdown) {
        userMenu.addEventListener("click", e => {
          dropdown.classList.toggle("active");
          e.stopPropagation();
        });

        document.addEventListener("click", () => {
          dropdown.classList.remove("active");
        });
      }

      // Desktop logout
      const logoutBtn = userArea.querySelector(".logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "login.html";
        });
      }
    }
  } else {
    // ---- NOT LOGGED IN ----
    userArea.innerHTML = `
      <a href="login.html" class="login-link">Login</a>
      <a href="signup.html" class="signup-btn">Sign Up</a>
    `;
  }

  // ---- Mobile Search ----
  const searchModal = document.getElementById("searchModal");
  const mobileSearchPill = document.getElementById("mobileSearchPill");
  const closeSearchBtn = document.getElementById("closeSearchBtn");

  if (mobileSearchPill && searchModal) {
    mobileSearchPill.addEventListener("click", () => searchModal.classList.add("active"));
  }

  if (closeSearchBtn && searchModal) {
    closeSearchBtn.addEventListener("click", () => searchModal.classList.remove("active"));
  }

  window.mobileSearch = function () {
    document.getElementById("locationInput").value = document.getElementById("locationInputMobile").value;
    document.getElementById("minPrice").value = document.getElementById("minPriceMobile").value;
    document.getElementById("maxPrice").value = document.getElementById("maxPriceMobile").value;
    searchModal.classList.remove("active");
    if (typeof searchListings === "function") searchListings();
  };
});
