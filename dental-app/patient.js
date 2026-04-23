import { db } from "./firebase.js";
import { collection, getDocs, setDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.addPatient = async function () {

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const complaints = document.getElementById("complaints").value;
  const opd = document.getElementById("opd").value;
  const diagnosis = document.getElementById("diagnosis").value;

  try {
    // 🔥 Step 1: Generate Patient ID
    const querySnapshot = await getDocs(collection(db, "patients"));
    const count = querySnapshot.size + 1;
    const patientId = "PAT" + String(count).padStart(3, '0');

    // 🔥 Step 2: File Upload (Parallel)
    const files = document.getElementById("file").files;
    let fileURLs = [];

    if (files.length > 0) {

      // 🔐 Get signature from backend
      const sigRes = await fetch("http://localhost:3000/get-signature");

      if (!sigRes.ok) {
        throw new Error("Signature API failed");
      }

      const sigData = await sigRes.json();

      // ⚡ Parallel upload
      const uploadPromises = Array.from(files).map(file => {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);

        // 🔥🔥 MOST IMPORTANT LINE
        formData.append("type", "private");  

        return fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData
          }
        )
        .then(res => res.json())
        .then(data => {
          console.log("Upload Response:", data);

          if (data.public_id) {
            return data.public_id; // 🔐 store only ID
          } else {
            console.error("Upload failed:", data);
            return null;
          }
        })
        .catch(err => {
          console.error("Upload error:", err);
          return null;
        });

      });

      const results = await Promise.all(uploadPromises);

      fileURLs = results.filter(url => url);
    }

    // 🔥 Step 3: Save to Firestore
    await setDoc(doc(db, "patients", patientId), {
      patientId,
      name,
      age,
      gender,
      phone,
      date,
      time,
      complaints,
      opd,
      diagnosis,
      images: fileURLs   // 🔥 array of public_id
    });

    alert("Saved with ID: " + patientId);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};