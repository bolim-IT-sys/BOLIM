const multer = require("multer");
const path = require("path");

// Folder where images will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "pinImage"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname)); // keep file extension
  },
});
// console.log("Storing image.");

exports.upload = multer({ storage });
