const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const client = new OAuth2Client(CLIENT_ID);

app.use(cors());
app.use(bodyParser.json());

// Middleware xác thực token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, CLIENT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào `req` để dùng trong route
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/test", async (req, res) => {
  console.log("Client ID:", CLIENT_ID);
  console.log("Client Secret:", CLIENT_SECRET);

  res.send({
    message: "Check console for Client ID and Client Secret.",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });
});

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    const jwtToken = jwt.sign(
      { userId: sub, email, name, picture },
      CLIENT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: jwtToken, user: { sub, email, name, picture } });
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token");
  }
});

// Route lấy user detail
app.get("/user/detail", authMiddleware, (req, res) => {
  const user = req.user;

  res.json({
    message: "User detail fetched successfully",
    user: {
      userId: user.userId,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
