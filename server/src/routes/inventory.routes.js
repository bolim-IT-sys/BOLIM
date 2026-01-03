const express = require("express");
const {
  get_all_inventories,
  create_inventory,
  update_inventory,
  delete_inventory,
} = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/fetch-inventories", get_all_inventories);
router.post("/create-inventory", create_inventory);
router.put("/update-inventory/:id", update_inventory);
router.delete("/delete-inventory/:id", delete_inventory);

module.exports = router;
