const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find user
    const user = await userService.find(username);
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // DEBUG: Log to see what fields the user has
    console.log("User object:", user.username);
    console.log("Password from request:", password);
    console.log("PasswordHash from DB:", user.password);

    // Check if passwordHash exists
    if (!user.password) {
      console.error("User found but passwordHash is missing!");
      return res.json({
        success: false,
        message: "Account configuration error",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    console.log("Generating jwt for user: ", user.id);
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        // username: user.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Send token to frontend
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Middleware to verify JWT
const authenticateToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    // console.log("Token: ", token);

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // VERIFICATION AND DECODING OF TOKEN
    const decoded = jwt.verify(token, JWT_SECRET);

    // EXTRACTING USER IS IN DECODED TOKEN
    const userId = decoded.id;
    // console.log("DecodedID: ", userId);

    // USING DECODED ID FOR FINDING USER
    const user = await userService.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    // console.log("User: ", user);

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        pins: user.pins,
        it_stocks: user.it_stocks,
        materials: user.materials,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid Token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token Expired" });
    }
    console.error("Token Verification Error: ", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  login,
  authenticateToken,
};
