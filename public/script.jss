function showAlert() {
  alert("Hello! You clicked the button 🚀");
}

// Add inside script.js
async function fetchAiims() {
  const res = await fetch("/api/scrape/aiims");
  const hospital = await res.json();

  if (hospital.hospital) {
    data.push({
      id: Date.now().toString(36),
      name: hospital.hospital,
      city: hospital.city,
      website: hospital.website,
      bedCharge: parseInt(hospital.bedCharge) || 0,
      emergencyCharge: parseInt(hospital.emergencyCharge) || 0,
      opdCharge: parseInt(hospital.opdCharge) || 0,
    });
    render();
  } else {
    alert("Could not fetch AIIMS charges.");
  }
}

// Example button hookup
document.body.insertAdjacentHTML(
  "beforeend",
  `<button id="aiimsBtn">🔎 Get AIIMS Delhi Charges</button>`
);
document.getElementById("aiimsBtn").addEventListener("click", fetchAiims);

