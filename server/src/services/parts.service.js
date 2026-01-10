const Part = require("../models/parts.model");
const Inbound = require("../models/inbound.model");
const Outbound = require("../models/outbound.model");
const ITStock = require("../models/itStock.model");
const sequelize = require("../database");

const getAllParts = async () => {
  return await Part.findAll({
    order: [[`partNumber`, `ASC`]],
  });
};

const findById = async (id) => {
  try {
    const parts = await Part.findOne({
      where: { id: id },
    });
    // console.log("Part ID confirm: ", parts);
    return parts;
  } catch (error) {
    console.log("Error Finding Part: ", error);
    throw error;
  }
};

const normalizeSerial = (value) =>
  value.replace(/[\u200E\u200F\u202A-\u202E]/g, "").trim();

const findItemBySerialNumber = async (serialNumber) => {
  try {
    const item = await ITStock.findOne({
      where: { serialNumber: normalizeSerial(serialNumber) },
      raw: true,
    });
    // console.log("Item found: ", item);
    return item;
  } catch (error) {
    console.log("Error Finding Item: ", error);
    throw error;
  }
};

const find = async (name) => {
  try {
    const parts = await Part.findOne({
      where: { name: name },
      raw: true,
    });
    console.log(
      "Checking parts existense... ",
      parts ? `Found` : "Cannot Found"
    );
    return parts;
  } catch (error) {
    console.log("Error Finding Part: ", error);
    throw error;
  }
};

const findPartByPartNumber = async (partNumber) => {
  try {
    const parts = await Part.findOne({
      where: { partNumber: partNumber },
    });
    // console.log("Checking parts item name: ", partNumber, parts);
    return parts;
  } catch (error) {
    throw error;
  }
};

const findPartByPartname = async (name) => {
  try {
    const parts = await Part.findOne({
      where: sequelize.where(
        sequelize.fn(
          "JSON_CONTAINS",
          sequelize.col("availableItems"),
          JSON.stringify(name)
        ),
        1
      ),
    });
    // console.log("Checking name: ", name);
    return parts;
  } catch (error) {
    throw error;
  }
};

const createPart = async (PartData) => {
  try {
    const { type, partNumber, specs, category, unitPrice, company } = PartData;

    // Hash password before storing

    // console.log("Adding parts.");
    const parts = await Part.create({
      type: type,
      partNumber: partNumber,
      specs: specs,
      category: category,
      unitPrice: parseFloat(unitPrice),
      company: company,
    });

    // Return parts without password
    return {
      id: parts.id,
      partNumber: parts.partNumber,
    };
  } catch (error) {
    throw error;
  }
};

const updatePart = async (partsId, PartData) => {
  try {
    const parts = await Part.findByPk(partsId);

    if (!parts) {
      throw new Error("Part not found.");
    }

    // prepare the data
    const updateData = {};

    if (PartData.partNumber) {
      updateData.partNumber = PartData.partNumber;
    }

    if (PartData.specs) {
      updateData.specs = PartData.specs;
    }

    if (PartData.category) {
      updateData.category = PartData.category;
    }

    if (PartData.unitPrice) {
      updateData.unitPrice = PartData.unitPrice;
    }

    if (PartData.company) {
      updateData.company = PartData.company;
    }

    if (PartData.quantity) {
      updateData.quantity = PartData.quantity;
    }

    if (PartData.image) {
      updateData.image = PartData.image;
    }

    await parts.update(updateData);

    // console.log("Part updated successfully.");

    // Return parts without password
    return {
      id: parts.id,
      name: parts.name,
    };
  } catch (error) {
    console.error("Error updating parts: ", error);
    throw error;
  }
};

const deletePart = async (partsId) => {
  try {
    const parts = await Part.findByPk(partsId);

    if (!parts) {
      throw new Error("Part not found.");
    }

    // DELETING INBOUNDS AND OUTBOUNDS FOR THIS PART
    await Inbound.destroy({
      where: { partId: partsId },
    });
    await Outbound.destroy({
      where: { partId: partsId },
    });

    // IF USER IS PART DELETE
    await parts.destroy(partsId);

    // console.log("Part deleted successfully.");

    // Return parts without password
    return {
      id: parts.id,
      name: parts.name,
    };
  } catch (error) {
    console.error("Error updating parts: ", error);
    throw error;
  }
};

const inboundPart = async (inboundData) => {
  try {
    const { lotNo, partId, from, quantity, inboundDate } = inboundData;

    // Hash password before storing
    // console.log("Data received in inbounding: ", inboundData);

    // console.log("Inbounding part.");
    const inbound = await Inbound.create({
      lotNo: lotNo,
      partId: partId,
      from: from,
      quantity: quantity,
      inboundDate: inboundDate,
    });

    // Return parts without password
    return {
      id: inbound.id,
      quantity: inbound.quantity,
    };
  } catch (error) {
    throw error;
  }
};

const addItem = async (itemDetails) => {
  try {
    const { from, stockId, serialNumber, PRDate, receivedDate } = itemDetails;

    // Hash password before storing
    // console.log("Data received in inbounding: ", inboundData);

    // console.log("Inbounding part.");
    const addItem = await ITStock.create({
      stockId: stockId,
      from: from,
      serialNumber: serialNumber,
      PRDate: PRDate,
      receivedDate: receivedDate,
    });

    // Return parts without password
    return {
      stockId: addItem.stockId,
      quantity: addItem.serialNumber,
    };
  } catch (error) {
    throw error;
  }
};

const deployItem = async (itemData) => {
  try {
    const item = await ITStock.findOne({
      where: { serialNumber: itemData.serialNumber },
    });

    // console.log("Item found: ", item);

    if (!item) {
      throw new Error("Item not found.");
    }

    // prepare the data
    const updateData = {
      from: itemData.from,
      to: itemData.to,
    };

    if (itemData.deployedDate) {
      updateData.deployedDate = itemData.deployedDate;
    }
    if (itemData.station) {
      updateData.station = itemData.station;
    }
    if (itemData.department) {
      updateData.department = itemData.department;
    }
    if (itemData.remarks) {
      updateData.remarks = itemData.remarks;
    }

    await item.update(updateData);

    // console.log("Item deployed successfully.");

    // Return parts without password
    return {
      id: item.id,
      serialNumber: item.serialNumber,
    };
  } catch (error) {
    console.error("Error deploying item: ", error);
    throw error;
  }
};

const getItems = async (id) => {
  try {
    const items = await ITStock.findAll({
      where: { stockId: id },
      order: [["remarks", "ASC"]],
      raw: true,
    });
    // console.log("Inbounds fetched: ", inbounds);
    return items;
  } catch (error) {
    console.log("Error Finding Stock Items: ", error);
    throw error;
  }
};

const getAllInbounds = async () => {
  try {
    const inbounds = await Inbound.findAll({});
    // console.log("Inbounds fetched: ", inbounds);
    return inbounds;
  } catch (error) {
    console.log("Error inbounds: ", error);
    throw error;
  }
};

const getInbounds = async (id) => {
  try {
    const inbounds = await Inbound.findAll({
      where: { partId: id },
      raw: true,
    });
    // console.log("Inbounds fetched: ", inbounds);
    return inbounds;
  } catch (error) {
    console.log("Error Finding Part: ", error);
    throw error;
  }
};

const outboundPart = async (outboundData) => {
  try {
    const { from, to, partId, quantity, outboundDate } = outboundData;

    // Hash password before storing
    // console.log("Data received in outbounding: ", outboundData);

    // console.log("Inbounding part.");
    const outbound = await Outbound.create({
      from: from,
      to: to,
      partId: partId,
      quantity: quantity,
      outboundDate: outboundDate,
    });

    // Return parts without password
    return {
      id: outbound.id,
      quantity: outbound.quantity,
    };
  } catch (error) {
    throw error;
  }
};

const getAllOutbounds = async () => {
  try {
    const allOutbounds = await Outbound.findAll({});
    // console.log("Outbounds fetched: ", outbounds);
    return allOutbounds;
  } catch (error) {
    console.log("Error Outbounds: ", error);
    throw error;
  }
};

const getOutbounds = async (id) => {
  try {
    const outbounds = await Outbound.findAll({
      where: { partId: id },
      raw: true,
    });
    // console.log("Outbounds fetched: ", outbounds);
    return outbounds;
  } catch (error) {
    console.log("Error Finding Part Outbounds: ", error);
    throw error;
  }
};

module.exports = {
  findPartByPartname,
  findPartByPartNumber,
  getAllParts,
  createPart,
  updatePart,
  deletePart,
  find,
  findById,
  findItemBySerialNumber,
  inboundPart,
  addItem,
  deployItem,
  getItems,
  getAllInbounds,
  getInbounds,
  outboundPart,
  getAllOutbounds,
  getOutbounds,
};
