const partService = require("../services/parts.service");
const fs = require("fs");
const path = require("path");

const getAllParts = async (req, res) => {
  try {
    const parts = await partService.getAllParts();
    if (!parts) {
      // console.log("No parts found.");
      res.json({
        success: false,
        message: "No parts found.",
      });
    } else {
      // console.log("Parts found: ", parts);
      res.status(200).json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    // console.log("Error fetching parts.");

    res.json({
      success: false,
      message: err.message || "Fetching parts failed.",
    });
  }
};

const createPart = async (req, res) => {
  try {
    // Optional: Validate request body first
    if (
      !req.body.type ||
      !req.body.partNumber ||
      !req.body.specs ||
      !req.body.category ||
      !req.body.unitPrice ||
      !req.body.company
    ) {
      // console.log("Please fill in all required fields.");
      return res.json({
        message: "Please fill in all required fields.",
      });
    }

    const type = req.body.type;

    // Check if user already exists
    const existingPart = await partService.findPartByPartNumber(
      req.body.partNumber
    );

    if (existingPart) {
      return res.json({
        success: false,
        message: `${
          type === "pin"
            ? "Pin"
            : type === "it"
            ? "Item"
            : type === "material"
            ? "Material"
            : "INVALID TYPE"
        } already exists.`,
      });
    }

    const user = await partService.createPart(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: `New ${
        type === "pin"
          ? "pin"
          : type === "it"
          ? "item"
          : type === "material"
          ? "material"
          : "INVALID TYPE"
      } created successfully.`,
      data: user,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message:
        err.message ||
        `${
          type === "pin"
            ? "Pin"
            : type === "it"
            ? "Item"
            : type === "material"
            ? "Material"
            : "INVALID TYPE"
        } creation failed`,
    });
  }
};

const updatePart = async (req, res) => {
  try {
    const PartId = req.params.id;
    // console.log("=== DEBUG INFO ===");
    // console.log("Headers:", req.headers);
    // console.log("Body:", req.body);
    // console.log("File:", req.file);
    // console.log("Files:", req.files); // In case it's an array
    // console.log("==================");
    // const PartId = req.params.id;

    if (
      !req.body.type ||
      !req.body.partNumber ||
      !req.body.specs ||
      !req.body.category ||
      !req.body.unitPrice ||
      !req.body.company
    ) {
      return res.json({
        message: "Please fill in all required fields.",
      });
    }

    const type = req.body.type;

    const data = {
      partNumber: req.body.partNumber,
      specs: req.body.specs,
      category: req.body.category,
      unitPrice: req.body.unitPrice,
      company: req.body.company,
    };

    // Check if part exists
    const existingPart = await partService.findById(PartId);

    if (req.file) {
      // Delete old image if it exists
      if (existingPart.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads/pinImage",
          existingPart.image
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          } else {
            // console.log("Old image deleted:", existingPart.image);
          }
        });
      }

      // Assign new image filename
      data.image = req.file.filename;
    }

    // console.log("Existing match: ", existingPart);
    if (!existingPart) {
      return res.json({
        success: false,
        message: `${
          type === "pin"
            ? "Pin"
            : type === "it"
            ? "Item"
            : type === "material"
            ? "Material"
            : "INVALID TYPE"
        } not found.`,
      });
    }

    // CHECKING IF CHANGES WERE MADE.
    if (
      data.image === existingPart.image &&
      data.partNumber === existingPart.partNumber &&
      data.specs === existingPart.specs &&
      data.category === existingPart.category &&
      parseFloat(data.unitPrice) === existingPart.unitPrice &&
      data.company === existingPart.company
    ) {
      // console.log("No changes made.");
      return res.json({
        success: false,
        message: "No changes made.",
      });
    }

    //checking if the username is already taken
    if (data.partNumber !== existingPart.partNumber) {
      const userWithSamePartNumber = await partService.findPartByPartNumber(
        data.partNumber
      );

      if (userWithSamePartNumber) {
        // console.log("Matching part number: ", userWithSamePartNumber);
        return res.json({
          success: false,
          message: `${
            type === "pin"
              ? "Pin number"
              : type === "it"
              ? "Item name"
              : type === "material"
              ? "Material name"
              : "INVALID TYPE"
          } already taken.`,
        });
      }
      // console.log("No match found.");
    }
    const updatePart = await partService.updatePart(PartId, data);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: `${
        type === "pin"
          ? "Pin"
          : type === "it"
          ? "Item"
          : type === "material"
          ? "Material"
          : "INVALID TYPE"
      } updated successfully.`,
      data: updatePart,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message:
        err.message ||
        `${
          type === "pin"
            ? "Pin"
            : type === "it"
            ? "Item"
            : type === "material"
            ? "Material"
            : "INVALID TYPE"
        } update failed.`,
    });
  }
};

const deletePart = async (req, res) => {
  try {
    const PartId = req.params.id;

    // Optional: Validate request body first
    if (!PartId) {
      return res.json({
        message: "PartId is required",
      });
    }
    // Check if user exists
    const existingPart = await partService.findById(PartId);

    if (!existingPart) {
      return res.json({
        success: false,
        message: "Part not found.",
      });
    }

    if (existingPart.image) {
      // Delete old image if it exists
      if (existingPart.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads/pinImage",
          existingPart.image
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          } else {
            // console.log("Old image deleted:", existingPart.image);
          }
        });
      }
    }

    const deletePart = await partService.deletePart(PartId);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Part removed successfully!",
      data: deletePart,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message: err.message || "Part deletion failed",
    });
  }
};

const inboundPart = async (req, res) => {
  try {
    // console.log("Data received in Controller: ", req.body);
    // Optional: Validate request body first
    if (
      !req.body.lotNo ||
      !req.body.from ||
      !req.body.partId ||
      !req.body.quantity ||
      !req.body.inboundDate
    ) {
      // console.log("Please fill in all required fields.");
      return res.json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if part exists
    const isPartExisting = await partService.findById(req.body.partId);

    if (!isPartExisting) {
      return res.json({
        success: false,
        message: "Part does not exist.",
      });
    }

    const updateData = {
      quantity: Number(req.body.quantity) + isPartExisting.quantity,
    };

    const inbound = await partService.inboundPart(req.body);

    const updatePartQty = await partService.updatePart(
      req.body.partId,
      updateData
    );

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Part inbound successful.",
      data: inbound,
      updatePartQty,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    console.error("Error occured: ", err);
    res.json({
      success: false,
      message: err.message || "Part creation failed",
    });
  }
};

const getAllInbounds = async (req, res) => {
  try {
    // console.log("Fetching all inbounds.");

    const parts = await partService.getAllInbounds();
    if (!parts) {
      // console.log("No inbounds found.");
      res.json({
        success: false,
        message: "No inbounds found.",
      });
    } else {
      // console.log("Part inbounds found: ", parts);
      res.status(200).json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching inbounds: ", err);

    res.json({
      success: false,
      message: err.message || "Fetching part inbounds failed",
    });
  }
};

const getInbounds = async (req, res) => {
  try {
    const partId = req.params.id;
    // console.log("Fetching inbounds.");

    const parts = await partService.getInbounds(partId);
    if (!parts) {
      // console.log("No inbounds found.");
      res.json({
        success: false,
        message: "No inbounds found.",
      });
    } else {
      // console.log("Part inbounds found: ", parts);
      res.status(200).json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching inbounds: ", err);

    res.json({
      success: false,
      message: err.message || "Fetching part inbounds failed",
    });
  }
};

const outboundPart = async (req, res) => {
  try {
    // console.log("Data received in Controller: ", req.body);
    // Optional: Validate request body first
    if (
      !req.body.from ||
      !req.body.to ||
      !req.body.partId ||
      !req.body.quantity ||
      !req.body.outboundDate
    ) {
      // console.log("Please fill in all required fields.");
      return res.json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if part exists
    const isPartExisting = await partService.findById(req.body.partId);

    if (!isPartExisting) {
      return res.json({
        success: false,
        message: "Part does not exist.",
      });
    }

    const updateData = {
      quantity: isPartExisting.quantity - Number(req.body.quantity),
    };

    if (updateData.quantity < 0) {
      return res.json({
        success: false,
        message: "Part stock is insufficient.",
      });
    }

    const outbound = await partService.outboundPart(req.body);

    const updatePartQty = await partService.updatePart(
      req.body.partId,
      updateData
    );

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Part outbound successful.",
      data: outbound,
      updatePartQty,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    console.error("Error occured: ", err);
    res.json({
      success: false,
      message: err.message || "Part creation failed",
    });
  }
};

const getAllOutbounds = async (req, res) => {
  try {
    // console.log("Fetching all outbounds.");

    const parts = await partService.getAllOutbounds();
    if (!parts) {
      // console.log("No outbounds found.");
      res.json({
        success: false,
        message: "No outbounds found.",
      });
    } else {
      // console.log("Part outbounds found: ", parts);
      res.status(200).json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching outbounds: ", err);

    res.json({
      success: false,
      message: err.message || "Fetching part outbounds failed",
    });
  }
};

const getOutbounds = async (req, res) => {
  try {
    const partId = req.params.id;
    // console.log("Fetching outbounds.");

    const parts = await partService.getOutbounds(partId);
    if (!parts) {
      // console.log("No outbounds found.");
      res.json({
        success: false,
        message: "No outbounds found.",
      });
    } else {
      // console.log("Part outbounds found: ", parts);
      res.json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching outbounds: ", err);

    res.json({
      success: false,
      message: err.message || "Fetching part outbounds failed",
    });
  }
};

const addingItem = async (req, res) => {
  try {
    // console.log("data in controller: ", req.body);

    // console.log("Data received in Controller: ", req.body);
    // Optional: Validate request body first
    if (
      !req.body.stockId ||
      !req.body.serialNumber ||
      !req.body.PRDate ||
      !req.body.receivedDate
    ) {
      // console.log("Please fill in all required fields.");
      return res.json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // console.log("data in controller: ", req.body);

    // Check if part exists
    const isPartExisting = await partService.findItemBySerialNumber(
      req.body.serialNumber
    );

    if (isPartExisting) {
      // console.log("Serial Number already exist.");
      return res.json({
        success: false,
        message: "Serial Number already exist.",
      });
    }

    const addItem = await partService.addItem(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Item added succesfully.",
      data: addItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    console.error("Error occured: ", err);
    res.json({
      success: false,
      message: err.message || "Adding item failed",
    });
  }
};

const outboundItem = async (req, res) => {
  try {
    const serialNumber = req.params.serialNumber;

    // console.log("Data in backend: ", req.body);

    if (
      !req.body.from ||
      !req.body.to ||
      !req.body.serialNumber ||
      !req.body.deployedDate ||
      !req.body.station ||
      !req.body.department ||
      !req.body.remarks
    ) {
      return res.json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if part exists
    const existingItem = await partService.findItemBySerialNumber(serialNumber);

    // console.log("Existing match: ", existingItem);
    if (!existingItem) {
      return res.json({
        success: false,
        message: "Item not found.",
      });
    }

    if (existingItem.remarks === "deployed") {
      return res.json({
        success: false,
        message: "Item is already deployed.",
      });
    }

    const deployItem = await partService.deployItem(req.body);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Item deployed successfully",
      data: deployItem,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.json({
      success: false,
      message: err.message || "Item deployment failed",
    });
  }
};

const getItem = async (req, res) => {
  try {
    const partId = req.params.id;
    // console.log("Fetching inbounds.");

    const items = await partService.getItems(partId);
    if (!items) {
      // console.log("No inbounds found.");
      res.json({
        success: false,
        message: "No items found.",
      });
    } else {
      // console.log("Part inbounds found: ", parts);
      res.json({ success: true, data: items });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching stock items: ", err);

    res.json({
      success: false,
      message: err.message || "Fetching stock items failed",
    });
  }
};

module.exports = {
  getAllParts,
  createPart,
  updatePart,
  deletePart,
  inboundPart,
  addingItem,
  outboundItem,
  getItem,
  getAllInbounds,
  getInbounds,
  outboundPart,
  getAllOutbounds,
  getOutbounds,
};
