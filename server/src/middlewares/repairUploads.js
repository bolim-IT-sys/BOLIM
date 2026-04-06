import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "..", "uploads", "repairs");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    //console.log("Saving to:", uploadPath);
    const serial = req.body.serial_number || "unknown";
    const ext = path.extname(file.originalname);
    const cleanName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "")
      .toLowerCase();
    const filename = `${serial}-${Date.now()}-${cleanName}${ext}`;

    cb(null, filename);
  },
});

export const upload = multer({ storage });
