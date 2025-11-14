const stockItemService = require("../services/stockItem.service");

const getAllStockItems = async (req, res) => {
  try {
    const stockId = req.params.id;
    // console.log("Fetching items for stock: ", stockId);

    if (!stockId) {
      console.log("Stock ID is required");
      return res.status(404).json({
        success: false,
        message: `Stock ID is required`,
      });
    }

    // console.log("Fetching items for ID: ", stockId);
    const stockItems = await stockItemService.getAllStockItems(stockId);
    return res.json({ success: true, data: stockItems });
  } catch (err) {
    console.log("Error in getAllStockItems controller:", err);
    return res.json({ success: false, data: [] });
  }
};

const createStockItem = async (req, res) => {
  try {
    // console.log("Data received by backend: ", req.body);
    // Optional: Validate request body first
    if (
      !req.body.stockId ||
      !req.body.serialNumber ||
      !req.body.PRDate ||
      !req.body.receivedDate
    ) {
      return res.status(400).json({
        message: "Required fields not filled",
      });
    }

    // Check if stockItem already exists
    const existingStockItem =
      await stockItemService.findStockItemBySerialNumber(req.body.serialNumber);

    console.log("existingStockItem", existingStockItem);

    if (existingStockItem) {
      return res.status(409).json({
        success: false,
        message: "Serial number already exists",
      });
    }

    const stockItem = await stockItemService.createStockItem(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: `${stockItem.serialNumber} added successfully!`,
      data: stockItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    console.error("Error occured: ", err);
    res.status(500).json({
      success: false,
      message: err.message || "StockItem creation failed",
    });
  }
};

const deployStockItem = async (req, res) => {
  try {
    const { serialNumber, deployedDate, station, department, remarks } =
      req.body;

    console.log(
      "In controller: ",
      serialNumber,
      deployedDate,
      station,
      department,
      remarks
    );

    // Optional: Validate request body first
    if (!serialNumber || !deployedDate || !station || !department || !remarks) {
      return res.status(400).json({
        message: "Required fields not field.",
      });
    }

    // Check if Item exists
    const existingStockItem = await stockItemService.findById(serialNumber);

    console.log("Matching Serial: ", existingStockItem);

    if (!existingStockItem) {
      return res.status(404).json({
        success: false,
        message:
          "Item not available/found. Make sure that the Item is added in the inventory.",
      });
    }

    if (existingStockItem.remarks === "DEPLOYED") {
      return res.status(409).json({
        success: false,
        message: "Item is already deployed.",
      });
    }

    const updateData = req.body;

    const deployStockItem = await stockItemService.deployStockItem(
      existingStockItem.id,
      updateData
    );

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "StockItem deployed successfully!",
      data: deployStockItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "StockItem deployment failed",
    });
  }
};

const updateStockItem = async (req, res) => {
  try {
    const StockItemId = req.params.id;

    // Optional: Validate request body first
    if (!req.body.name) {
      return res.status(400).json({
        message: "StockItemname and password are required",
      });
    }

    // Check if stockItem exists
    const existingStockItem = await stockItemService.findById(StockItemId);

    if (!existingStockItem) {
      return res.status(404).json({
        success: false,
        message: "StockItem not found.",
      });
    }

    //checking if the stockItemname is already taken
    if (req.body.name) {
      const stockItemWithSameStockItemname =
        await stockItemService.findStockItemByStockItemname(req.body.name);

      if (stockItemWithSameStockItemname) {
        console.log(
          "Matching stockItem name: ",
          stockItemWithSameStockItemname
        );

        return res.status(409).json({
          success: false,
          message: "StockItemname already taken.",
        });
      }
      console.log("No match found.");
    }

    const updateStockItem = await stockItemService.updateStockItem(
      StockItemId,
      req.body
    );

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "StockItem updated successfully",
      data: updateStockItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "StockItem update failed",
    });
  }
};

const deleteStockItem = async (req, res) => {
  try {
    const StockItemId = req.params.id;

    // Optional: Validate request body first
    if (!StockItemId) {
      return res.status(400).json({
        message: "StockItemId is required",
      });
    }
    // Check if stockItem exists
    const existingStockItem = await stockItemService.findById(StockItemId);

    if (!existingStockItem) {
      return res.status(404).json({
        success: false,
        message: "StockItem not found.",
      });
    }

    const updateStockItem = await stockItemService.deleteStockItem(StockItemId);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "StockItem deleted successfully",
      data: updateStockItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "StockItem deletion failed",
    });
  }
};

module.exports = {
  getAllStockItems,
  createStockItem,
  deployStockItem,
  updateStockItem,
  deleteStockItem,
};
