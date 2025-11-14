const stockService = require("../services/stock.service");

const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.json({ success: true, data: stocks });
  } catch (err) {
    next(err);
  }
};

const createStock = async (req, res) => {
  try {
    // Optional: Validate request body first
    if (!req.body.name) {
      return res.status(400).json({
        message: "Stockname is required",
      });
    }

    // Check if user already exists
    const existingStock = await stockService.findStockByStockname(
      req.body.name
    );

    if (existingStock) {
      return res.status(409).json({
        success: false,
        message: "Stock name already exists",
      });
    }

    const user = await stockService.createStock(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Stock created successfully",
      data: user,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Stock creation failed",
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const StockId = req.params.id;

    // Optional: Validate request body first
    if (!req.body.name) {
      return res.status(400).json({
        message: "Stockname and password are required",
      });
    }

    // Check if user exists
    const existingStock = await stockService.findById(StockId);

    if (!existingStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

    //checking if the username is already taken
    if (req.body.name) {
      const userWithSameStockname = await stockService.findStockByStockname(
        req.body.name
      );

      if (userWithSameStockname) {
        console.log("Matching user name: ", userWithSameStockname);

        return res.status(409).json({
          success: false,
          message: "Stockname already taken.",
        });
      }
      console.log("No match found.");
    }

    const updateStock = await stockService.updateStock(StockId, req.body);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updateStock,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Stock update failed",
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    const StockId = req.params.id;

    // Optional: Validate request body first
    if (!StockId) {
      return res.status(400).json({
        message: "StockId is required",
      });
    }
    // Check if user exists
    const existingStock = await stockService.findById(StockId);

    if (!existingStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

    const updateStock = await stockService.deleteStock(StockId);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
      data: updateStock,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Stock deletion failed",
    });
  }
};

module.exports = {
  getAllStocks,
  createStock,
  updateStock,
  deleteStock,
};
