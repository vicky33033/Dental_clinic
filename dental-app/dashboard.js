import { db } from "./firebase.js";
import { 
  collection, 
  getDocs, 
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function getSecureImage(publicId) {
  try {
    const res = await fetch(`https://dental-clinic-b8or.onrender.com/get-image?id=${publicId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch image URL");
    }

    const data = await res.json();
    return data.url;

  } catch (err) {
    console.error("Image fetch error:", err);
    return "#"; // fallback
  }
}

window.deleteImage = async function (patientId, publicId) {

  if (!confirm("Delete this image?")) return;

  // 🔥 Step 1: delete from Cloudinary
  await fetch(`https://dental-clinic-b8or.onrender.com/delete-image?id=${publicId}`);

  // 🔥 Step 2: get doc
  const docRef = doc(db, "patients", patientId);
  const snap = await getDoc(docRef);
  const data = snap.data();

  // 🔥 Step 3: remove image
  const updatedImages = data.images.filter(img => img !== publicId);

  // 🔥 Step 4: update Firestore
  await updateDoc(docRef, {
    images: updatedImages
  });

  alert("Deleted successfully 🔥");

  loadPatients();
};

async function loadPatients() {

  const table = document.getElementById("patientTable");
  table.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "patients"));

  for (const docSnap of querySnapshot.docs) {

    const data = docSnap.data();

    let imageLinks = "-";

    if (data.images && data.images.length > 0) {

      imageLinks = "";
    
      for (let i = 0; i < data.images.length; i++) {
    
        let img = data.images[i];
    
        // 🔥 If already full URL → direct use
        if (img.startsWith("http")) {
          imageLinks += `<a href="${img}" target="_blank">View</a><br>`;
        } 
        else {
          // 🔥 If public_id → get secure URL
          const secureUrl = await getSecureImage(img);
          imageLinks += `
          <a href="${secureUrl}" target="_blank">View</a>
          <button onclick="deleteImage('${data.patientId}', '${img}')">Delete</button>
          <br>`;
        }
      }
    }

    const row = `
      <tr>
        <td>${data.patientId || "-"}</td>
        <td>${data.name || "-"}</td>
        <td>${data.age || "-"}</td>
        <td>${data.phone || "-"}</td>
        <td>${data.date || "-"}</td>
        <td>${data.time || "-"}</td>
        <td>${data.gender || "-"}</td>
        <td>${data.complaints || "-"}</td>
        <td>${data.diagnosis || "-"}</td>
        <td>${data.opd || "-"}</td>
        <td>${imageLinks}</td>
      </tr>
    `;

    table.innerHTML += row;
  }
}

loadPatients();