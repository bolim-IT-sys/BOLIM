const Inventory = require("../models/inventory.model");
const bcrypt = require("bcrypt");

const get_all_inventories = async () => {
  return await Inventory.findAll({
    order: [["inventory_name", "ASC"]],
  });
};

const find_by_id = async (id) => {
  try {
    const inventory = await Inventory.findOne({
      where: { id: id },
      raw: true,
    });
    // console.log("Inventory ID confirm: ", inventory);
    return inventory;
  } catch (error) {
    console.log("Error Finding Inventory: ", error);
    throw error;
  }
};

const find = async (inventory_name) => {
  try {
    const inventory = await Inventory.findOne({
      where: { inventory_name: inventory_name },
      raw: true,
    });
    // console.log("Checking inventory existense... ", inventory ? `Found` : "Cannot Found");
    return inventory;
  } catch (error) {
    console.log("Error Finding Inventory: ", error);
    throw error;
  }
};

const find_inventory_by_inventory_name = async (inventory_name) => {
  try {
    const inventory = await Inventory.findOne({
      where: { inventory_name: inventory_name },
    });
    // console.log("Checking inventory_name: ", inventory_name, inventory);
    return inventory;
  } catch (error) {
    throw error;
  }
};

const create_inventory = async (inventory_data) => {
  try {
    const { inventory_name, item_name, unique_item } = inventory_data;

    // console.log("Adding Inventory.");
    const inventory = await Inventory.create({
      inventory_name: inventory_name,
      item_name: item_name,
      unique_item: unique_item,
    });

    // Return inventory without password
    return {
      id: inventory.id,
      inventory_name: inventory.inventory_name,
    };
  } catch (error) {
    throw error;
  }
};

const update_inventory = async (inventory_id, inventory_data) => {
  try {
    const inventory = await Inventory.findByPk(inventory_id);

    if (!inventory) {
      throw new Error("Inventory not found.");
    }

    // prepare the data
    const updateData = {
      unique_item: inventory_data.unique_item,
    };

    if (inventory_data.inventory_name) {
      updateData.inventory_name = inventory_data.inventory_name;
    }

    if (inventory_data.item_name) {
      updateData.item_name = inventory_data.item_name;
    }

    await inventory.update(updateData);

    // console.log("Inventory updated successfully.");

    // Return inventory without password
    return {
      id: inventory.id,
      inventory_name: inventory.inventory_name,
    };
  } catch (error) {
    console.error("Error updating inventory: ", error);
    throw error;
  }
};

const delete_inventory = async (inventory_id) => {
  try {
    const inventory = await Inventory.findByPk(inventory_id);

    if (!inventory) {
      throw new Error("Inventory not found.");
    }

    // IF USER IS FOUND DELETE
    await inventory.destroy(inventory_id);

    // console.log("Inventory deleted successfully.");

    // Return inventory without password
    return {
      id: inventory.id,
      inventory_name: inventory.inventory_name,
    };
  } catch (error) {
    console.error("Error updating inventory: ", error);
    throw error;
  }
};

module.exports = {
  find_inventory_by_inventory_name,
  get_all_inventories,
  create_inventory,
  update_inventory,
  delete_inventory,
  find,
  find_by_id,
};
