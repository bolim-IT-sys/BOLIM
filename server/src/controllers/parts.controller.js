const partService = require("../services/parts.service");
const fs = require("fs");
const path = require("path");

const getAllParts = async (req, res) => {
  try {
    const parts = await partService.getAllParts();
    if (!parts) {
      console.log("No parts found.");
      res.status(404).json({
        success: false,
        message: "No parts found.",
      });
    } else {
      // console.log("Parts found: ", parts);
      res.json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching parts.");

    res.status(500).json({
      success: false,
      message: err.message || "Fetching parts failed",
    });
  }
};

const createPart = async (req, res) => {
  try {
    // Optional: Validate request body first
    if (
      !req.body.partNumber ||
      !req.body.specs ||
      !req.body.category ||
      !req.body.unitPrice ||
      !req.body.company
    ) {
      // console.log("Please fill in all required fields.");
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if user already exists
    const existingPart = await partService.findPartByPartNumber(
      req.body.partNumber
    );

    if (existingPart) {
      return res.status(409).json({
        success: false,
        message: "Part already exists",
      });
    }

    const user = await partService.createPart(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "Part created successfully",
      data: user,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Part creation failed",
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
      !req.body.partNumber ||
      !req.body.specs ||
      !req.body.category ||
      !req.body.unitPrice ||
      !req.body.company
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

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
            console.log("Old image deleted:", existingPart.image);
          }
        });
      }

      // Assign new image filename
      data.image = req.file.filename;
    }

    // console.log("Existing match: ", existingPart);
    if (!existingPart) {
      return res.status(404).json({
        success: false,
        message: "Part not found.",
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
      console.log("No changes made.");
      return res.status(409).json({
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
        console.log("Matching part number: ", userWithSamePartNumber);
        return res.status(409).json({
          success: false,
          message: "Part number already taken.",
        });
      }
      console.log("No match found.");
    }
    const updatePart = await partService.updatePart(PartId, data);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Part updated successfully",
      data: updatePart,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Part update failed",
    });
  }
};

const deletePart = async (req, res) => {
  try {
    const PartId = req.params.id;

    // Optional: Validate request body first
    if (!PartId) {
      return res.status(400).json({
        message: "PartId is required",
      });
    }
    // Check if user exists
    const existingPart = await partService.findById(PartId);

    if (!existingPart) {
      return res.status(404).json({
        success: false,
        message: "Part not found.",
      });
    }

    const updatePart = await partService.deletePart(PartId);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "Part removed successfully!",
      data: updatePart,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "Part deletion failed",
    });
  }
};

const inboundPart = async (req, res) => {
  try {
    // console.log("Data received in Controller: ", req.body);
    // Optional: Validate request body first
    if (!req.body.partId || !req.body.quantity || !req.body.inboundDate) {
      // console.log("Please fill in all required fields.");
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if part exists
    const isPartExisting = await partService.findById(req.body.partId);

    if (!isPartExisting) {
      return res.status(404).json({
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
    res.status(500).json({
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
      res.status(404).json({
        success: false,
        message: "No inbounds found.",
      });
    } else {
      // console.log("Part inbounds found: ", parts);
      res.json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching inbounds: ", err);

    res.status(500).json({
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
      res.status(404).json({
        success: false,
        message: "No inbounds found.",
      });
    } else {
      // console.log("Part inbounds found: ", parts);
      res.json({ success: true, data: parts });
    }
  } catch (err) {
    // You can add specific error handling here if needed
    console.log("Error fetching inbounds: ", err);

    res.status(500).json({
      success: false,
      message: err.message || "Fetching part inbounds failed",
    });
  }
};

const outboundPart = async (req, res) => {
  try {
    // console.log("Data received in Controller: ", req.body);
    // Optional: Validate request body first
    if (!req.body.partId || !req.body.quantity || !req.body.outboundDate) {
      // console.log("Please fill in all required fields.");
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if part exists
    const isPartExisting = await partService.findById(req.body.partId);

    if (!isPartExisting) {
      return res.status(404).json({
        success: false,
        message: "Part does not exist.",
      });
    }

    const updateData = {
      quantity: isPartExisting.quantity - Number(req.body.quantity),
    };

    if (updateData.quantity < 0) {
      return res.status(409).json({
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
    res.status(500).json({
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
      res.status(404).json({
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

    res.status(500).json({
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
      res.status(404).json({
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

    res.status(500).json({
      success: false,
      message: err.message || "Fetching part outbounds failed",
    });
  }
};

module.exports = {
  getAllParts,
  createPart,
  updatePart,
  deletePart,
  inboundPart,
  getAllInbounds,
  getInbounds,
  outboundPart,
  getAllOutbounds,
  getOutbounds,
};
