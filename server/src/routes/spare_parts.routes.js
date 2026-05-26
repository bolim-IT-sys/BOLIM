const express = require("express");
const router = express.Router();
const Spare = require("../models/spare_parts.model");
const Category = require("../models/category.model");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");

// view category
router.get("/category", async (req, res) => {
  try {
    const records = await Category.findAll();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// view
router.get("/view", async (req, res) => {
  try {
    const records = await Spare.findAll();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const record = await Spare.create(req.body);

    res.status(201).json(record);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create spare part",
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Spare.update(req.body, {
      where: { id },
    });

    const updatedRecord = await Spare.findByPk(id);

    res.json(updatedRecord);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update part",
    });
  }
});

module.exports = router;
