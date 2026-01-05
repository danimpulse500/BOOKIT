console.log("post.js loaded");

// Initialize Supabase
const supabaseUrl = "https://sgwgnysdejtobrbcglke.supabase.co";
const supabaseKey = "sb_publishable_ah6iNOPj5d1wdOveSypkhg_XnbIlIJ3";
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("postForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  // Get current user
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    alert("You must be logged in to post a listing.");
    return;
  }
  const userEmail = session.user.email;

  const imageFile = document.getElementById("listingImage").files[0];
  let imageUrl = "images/default.jpg"; // fallback if no image uploaded

  if (imageFile) {
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("listings")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { publicUrl, error: urlError } = supabase.storage
        .from("listings")
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      imageUrl = publicUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image, using default image.");
    }
  }

  // Prepare new listing object
  const newListing = {
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    price: Number(document.getElementById("price").value),
    rooms: document.getElementById("rooms").value,
    amenities: document.getElementById("amenities").value
      .split(",")
      .map(a => a.trim())
      .filter(a => a),
    description: document.getElementById("description").value,
    rules: document.getElementById("rules").value,
    agent_name: document.getElementById("agentName").value, // optional, for display
    agent_email: userEmail, // <-- automatically set from logged-in user
    agent_phone: document.getElementById("agentPhone").value,
    image: imageUrl
  };

  // Insert into Supabase
  const { data: inserted, error } = await supabase
    .from("listings")
    .insert([newListing]);

  if (error) {
    console.error("Error posting listing:", error);
    alert("Failed to post listing.");
    return;
  }

  alert("Listing posted successfully!");
  window.location.href = "index.html";
});
