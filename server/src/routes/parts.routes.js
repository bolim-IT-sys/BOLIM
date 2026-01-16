const express = require("express");
const { upload } = require("../middlewares/pinUpload");
const {
  getAllParts,
  createPart,
  updatePart,
  deletePart,
  inboundPart,
  getInbounds,
  outboundPart,
  getOutbounds,
  getAllOutbounds,
  getAllInbounds,
  addingItem,
  getItem,
  updateItem,
  markItemAvailable,
  outboundItem,
} = require("../controllers/parts.controller");

const router = express.Router();

router.get("/fetch-parts", getAllParts);
router.post("/create-part", createPart);
router.put("/update-part/:id", upload.single("image"), updatePart);
router.delete("/delete-part/:id", deletePart);

router.post("/inbound", inboundPart);
router.get("/fetch-all-inbounds", getAllInbounds);
router.get("/fetch-inbounds/:id", getInbounds);

router.post("/add-item", addingItem);
router.put("/update-item", updateItem);
router.put("/mark-item-available/:serialNumber", markItemAvailable);
router.put("/outbound-item/:serialNumber", outboundItem);
router.get("/fetch-items/:id", getItem);

router.post("/outbound", outboundPart);
router.get("/fetch-all-outbounds", getAllOutbounds);
router.get("/fetch-outbounds/:id", getOutbounds);

module.exports = router;
