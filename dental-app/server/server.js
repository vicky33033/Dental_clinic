import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: "dgxfeqcp1",
  api_key: "625477488733784",
  api_secret: "TOWUG4ozVcyJ9Pvqrpn9QYa8-bU"
});

// 🔥 SECURE VIEW URL (IMPORTANT FIX)
app.get("/get-image", (req, res) => {
  try {
    let publicId = req.query.id;

    if (!publicId) {
      return res.status(400).json({ error: "Missing ID" });
    }

    // URL வந்தா clean பண்ணு
    if (publicId.startsWith("http")) {
      const parts = publicId.split("/");
      publicId = parts[parts.length - 1].split(".")[0];
    }

    // 🔥 CORRECT METHOD
    const url = cloudinary.url(publicId, {
      type: "private",
      secure: true,
      sign_url: true   // 🔥 VERY IMPORTANT
    });

    res.json({ url });

  } catch (err) {
    console.error("GET IMAGE ERROR:", err);
    res.status(500).json({ error: "Failed" });
  }
});

// 🔐 SIGNATURE
app.get("/get-signature", (req, res) => {

    const timestamp = Math.round(Date.now() / 1000);
  
    // 🔥 INCLUDE type HERE
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, type: "private" },
      cloudinary.config().api_secret
    );
  
    res.json({
      timestamp,
      signature,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name
    });
  });

app.get("/delete-image", async (req, res) => {
    try {
      const publicId = req.query.id;
  
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        type: "private"
      });
  
      res.json({ success: true, result });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  });

app.listen(3000, () => {
  console.log("✅ Server running http://localhost:3000");
});


