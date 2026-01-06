// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./database/index.js");
const app = express();

dotenv.config();
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

const corsOptions = {
  origin: [process.env.FRONTEND_URL], // allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you need cookies or auth headers
};

// Middleware to parse JSON
app.use(express.json(corsOptions));
app.use(cors());

// API ROUTES
app.use("/api/uploads", express.static("uploads"));

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

// Sync database before starting server
sequelize
  .sync({
    alter: true,
    // alter: false,
  })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await sequelize.sync(); // sync models
    console.log("🧱 Models synchronized.");

    app.listen(PORT,HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
}

startServer();
