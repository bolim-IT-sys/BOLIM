const express = require("express");
const {
  getAllStockItems,
  createStockItem,
  deployStockItem,
  updateStockItem,
  deleteStockItem,
} = require("../controllers/stockItem.controller");

const router = express.Router();

router.get("/fetchStockItems/:id", getAllStockItems);
router.post("/createStockItem", createStockItem);
router.put("/deployStockItem", deployStockItem);
router.put("/updateStockItem/:id", updateStockItem);
router.delete("/deleteStockItem/:id", deleteStockItem);

module.exports = router;
