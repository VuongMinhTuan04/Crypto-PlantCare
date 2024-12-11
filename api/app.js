const express = require("express");
const mongoose = require("mongoose");
const userDetail = require("./model/User.js");

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://tvugiang:ZhvVpnvcQPNPfZ63@cluster0.ym9jx.mongodb.net/Crypto-PlantCare";

// Middleware
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Kết nối MongoDB thành công");
})
.catch((error) => {
  console.error("Lỗi kết nối MongoDB:", error);
});

// Route lấy người dùng
app.get("/", async (req, res) => {
  try {
    let users = await userDetail.find();
    res.json(users);
  } catch (error) {
    console.error("Lỗi truy vấn người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});