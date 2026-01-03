const inventoryService = require("../services/inventory.service");

const get_all_inventories = async (req, res) => {
  try {
    const inventories = await inventoryService.get_all_inventories();
    if (!inventories) {
      console.log("No inventories found.");
      res.json({
        success: false,
        message: "No inventories found.",
      });
    } else {
      // console.log("inventories found: ", inventories);
      res.status(200).json({ success: true, data: inventories });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching inventories.");

    res.json({
      success: false,
      message: err.message || "Fetching inventories failed.",
    });
  }
};

const create_inventory = async (req, res) => {
  try {
    // Optional: Validate request body first
    if (!req.body.inventory_name || !req.body.item_name) {
      return res.json({
        message: "Required fields are missing.",
      });
    }

    // Check if inventory already exists
    const existingInventory =
      await inventoryService.find_inventory_by_inventory_name(
        req.body.inventory_name
      );

    if (existingInventory) {
      return res.json({
        success: false,
        message: "Inventory already exists",
      });
    }

    const inventory = await inventoryService.create_inventory(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: inventory,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message: err.message || "Inventory creation failed",
    });
  }
};

const update_inventory = async (req, res) => {
  try {
    const inventory_id = req.params.id;

    // Check if inventory exists
    const existingInventory = await inventoryService.find_by_id(inventory_id);

    if (!existingInventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
      });
    }

    //checking if the inventory_name is already taken
    if (req.body.inventory_name) {
      const inventory_with_same_inventory_name =
        await inventoryService.find_inventory_by_inventory_name(
          req.body.inventory_name
        );

      if (inventory_with_same_inventory_name) {
        // console.log("Matching inventory name: ", inventoryWithSameInventoryname.inventory_name);
        // console.log(`${inventory_id} !== ${inventoryWithSameInventoryname.id}`);
        // console.log(inventory_id !== inventoryWithSameInventoryname.id);
        if (Number(inventory_id) !== inventory_with_same_inventory_name.id) {
          return res.json({
            success: false,
            message: "Inventoryname already taken.",
          });
        }
      }
      // console.log("No match found.");
    }

    const update_inventory = await inventoryService.update_inventory(
      inventory_id,
      req.body
    );

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Inventory updated successfully.",
      data: update_inventory,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message: err.message || "Inventory update failed",
    });
  }
};

const delete_inventory = async (req, res) => {
  try {
    const inventory_id = req.params.id;

    // Optional: Validate request body first
    if (!inventory_id) {
      return res.json({
        message: "inventory_id is required",
      });
    }
    // Check if inventory exists
    const existingInventory = await inventoryService.find_by_id(inventory_id);

    if (!existingInventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
      });
    }

    const update_inventory = await inventoryService.delete_inventory(
      inventory_id
    );

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully.",
      data: update_inventory,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message: err.message || "Inventory deletion failed",
    });
  }
};

module.exports = {
  get_all_inventories,
  create_inventory,
  update_inventory,
  delete_inventory,
};
