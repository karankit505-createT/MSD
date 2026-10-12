const cloudinary = require("../config/cloudinary");

// Upload image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Convert buffer to base64 and upload to Cloudinary
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "msd",           // uploads go into /msd folder in Cloudinary
      resource_type: "image",
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,       // HTTPS image URL
      public_id: result.public_id,  // Cloudinary public ID
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Image upload failed", details: error.message });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Image deletion failed", details: error.message });
  }
};

module.exports = { uploadImage, deleteImage };
