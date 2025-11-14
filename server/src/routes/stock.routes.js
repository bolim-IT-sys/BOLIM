const express = require("express");
const {
  getAllStocks,
  createStock,
  updateStock,
  deleteStock,
} = require("../controllers/stock.controller");

const router = express.Router();

router.get("/fetchStocks", getAllStocks);
router.post("/createStock", createStock);
router.put("/updateStock/:id", updateStock);
router.delete("/deleteStock/:id", deleteStock);

module.exports = router;
