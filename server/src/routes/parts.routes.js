const express = require("express");
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
} = require("../controllers/parts.controller");

const router = express.Router();

router.get("/fetchParts", getAllParts);
router.post("/createPart", createPart);
router.put("/updatePart/:id", updatePart);
router.delete("/deletePart/:id", deletePart);

router.post("/inbound", inboundPart);
router.get("/fetchAllInbounds", getAllInbounds);
router.get("/fetchInbounds/:id", getInbounds);

router.post("/outbound", outboundPart);
router.get("/fetchAllOutbounds", getAllOutbounds);
router.get("/fetchOutbounds/:id", getOutbounds);

module.exports = router;
