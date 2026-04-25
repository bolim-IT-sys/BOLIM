// server.js
const express = require("express");
const cors = require("cors");
const sequelize = require("./database/index.js");
const repairRoutes = require("./routes/repair_records.routes");
const maintenanceRoutes = require("./routes/maintenance_records.routes");
const movementRoutes = require("./routes/movement.routes.js");
const app = express();

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const PORT = process.env.PORT;
// const HOST = "0.0.0.0";

const corsOptions = {
  origin: [process.env.FRONTEND_URL], // allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you need cookies or auth headers
};

// Middleware to parse JSON
app.use(express.json());
app.use(cors(corsOptions));

// API ROUTES
app.use(
  "/api/uploads/pinImage",
  express.static(path.join(__dirname, "uploads/pinImage")),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/repairs", repairRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/movement", movementRoutes);
//console.log("Static path:", path.join(__dirname, "uploads"));

const exportRoutes = require("./routes/export.routes.js");
app.use("/api", exportRoutes);

const authRoutes = require("./routes/auth.routes.js");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/user.routes.js");
app.use("/api/users", userRoutes);

const inventoryRoutes = require("./routes/inventory.routes.js");
app.use("/api/inventory", inventoryRoutes);

const partsRoutes = require("./routes/parts.routes.js");
app.use("/api/parts", partsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Node backend 🚀");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await sequelize.sync();
    console.log("🧱 Models synchronized.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
}

startServer();
