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

app.get("/test", async (req, res) => {
  console.log("Client ID:", CLIENT_ID);
  console.log("Client Secret:", CLIENT_SECRET);

  // Gửi phản hồi về client
  res.send({
    message: "Check console for Client ID and Client Secret.",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });
});

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Xác thực token của Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Tạo token JWT (nếu cần)
    const jwtToken = jwt.sign(
      { userId: sub, email, name, picture },
      CLIENT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: jwtToken, user: {sub, email, name, picture } });
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
