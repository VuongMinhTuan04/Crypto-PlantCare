import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bodyParser from "body-parser";
import bs58 from "bs58";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
dotenv.config();
// import Chance from 'chance';
// const chance = new Chance();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const client = new OAuth2Client(CLIENT_ID);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Replace with your frontend's URL
    methods: "GET,POST,DELETE,PUT", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

// Middleware xác thực token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //console.log(authHeader);

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

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
      //, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //}
    );
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// login google
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

    const user = await User.findOne({ sub: sub });
    if (!user) {
      const newUser = new User({ sub, email, picture, name });
      await newUser.save(newUser);
      console.log("Tao user moi thanh cong");
    } else {
      console.log("Tim thay user tren dtb: ", user);
    }

    res.json({
      token: jwtToken,
      user: { userId: user._id, sub, email, name, picture },
    });
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token");
  }
});

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

app.get("/test", async (req, res) => {
  console.log("Client ID:", CLIENT_ID);
  console.log("Client Secret:", CLIENT_SECRET);

  // Gửi phản hồi về client
  res.send({
    message: "Check console for Client ID and Client Secret.",
    CLIENT_ID,
    CLIENT_SECRET,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });
});

// Tạo Schema cho User
const userSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  points: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

app.get("/users", async (req, res) => {
  const items = await User.find();
  //console.log("users:", items);

  res.json(items);
});

// app.post('/items', async (req, res) => {
//   // Tạo tên ngẫu nhiên
//   const name = chance.name();

//   // Tạo email ngẫu nhiên
//   const email = chance.email();

//   // Điểm mặc định là 1000
//   const points = 1000;

//   // Tạo đối tượng người dùng và lưu vào cơ sở dữ liệu
//   const newItem = new User({
//     name: name,
//     email: email,
//     points: points
//   });

//   await newItem.save();
//   res.json(newItem);
// });

app.post("/get/user/sub", async (req, res) => {
  const { sub } = req.body; // Lấy sub từ body

  if (!sub) {
    return res.status(400).json({ message: "Sub is required" });
  }

  try {
    const user = await User.findOne({ sub });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/get/user", authMiddleware, async (req, res) => {
  const userSub = req.user;
  //console.log(userSub);

  if (!userSub.userId) {
    return res.status(400).json({ message: "Sub trong" });
  }

  try {
    const user = await User.findOne({ sub: userSub.userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "users deleted" });
});

app.post("/users", async (req, res) => {
  const newItem = new User(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put("/users/:id", async (req, res) => {
  const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

const treeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  points: { type: String, required: true },
  status: { type: Boolean, required: true },
});

const Tree = mongoose.model("Tree", treeSchema);

app.get("/trees", async (req, res) => {
  const items = await Tree.find();
  //console.log("Tree:", items);

  res.json(items);
});

app.post("/trees", async (req, res) => {
  const newItem = new Tree(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put("/trees/:id", async (req, res) => {
  const updatedItem = await Tree.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

const itemScheme = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, default: 0 },
  icon_img: { type: String, required: true },
  price: { type: String, required: true },
  exp: { type: String, required: true },
});

const Item = mongoose.model("Item", itemScheme);

app.get("/items", async (req, res) => {
  const items = await Item.find();
  //console.log("items:", items);

  res.json(items);
});

app.post("/items", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put("/items/:id", async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

const purchaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  use_quantity: { type: Number, require: true },
  purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

app.get("/purchase", async (req, res) => {
  const items = await Purchase.find();
  //console.log("purchase:", items);
  res.json(items);
});

app.post("/purchase", async (req, res) => {
  const filter = { itemId: req.body.itemId }; // Điều kiện tìm kiếm
  const update = req.body; // Dữ liệu mới
  const options = { new: true, upsert: true }; // `upsert` sẽ tạo mới nếu không tìm thấy

  const updatedItem = await Purchase.findOneAndUpdate(filter, update, options);
  res.json(updatedItem);
});

app.post("/purchase/add", authMiddleware, async (req, res) => {
  try {
    const { itemId, quantity } = req.body; // Tạo bản ghi mới từ dữ liệu trong req.body

    const userSub = req.user;

    if (!userSub.userId) {


      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    if (quantity <= 0) {


      return res.status(400).json({
        success: false,
        error: "Quanlity > 0",
      });
    }

    const ItemById = await Item.findOne({ _id: itemId });
    if (!ItemById) {
      return res.status(400).json({
        success: false,
        error: "Item not found",
      });
    }

    const UserById = await User.findOne({ sub: userSub.userId });
    if (!UserById) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    //const userId = userSub.userId;
    // itemId da co

    const { name, price } = ItemById;
    const totalPrice = parseInt(ItemById.price) * parseInt(quantity);

    // Kiểm tra điểm của user
    if (UserById.points < totalPrice) {
      return res.status(400).json({
        success: false,
        error: "Not enough points to purchase.",
      });
    }


    const newPurchase = new Purchase({
      userId: userSub.userId,
      itemId: itemId,
      itemName: name,
      quantity: quantity,
      price: price,
      totalPrice: totalPrice,
      use_quantity: 0,
    });
    // Lưu vào cơ sở dữ liệu
    const savedPurchase = await newPurchase.save();
    // Trừ điểm của user
    UserById.points -= totalPrice;
    await UserById.save();
    // Trả về kết quả
    res.status(200).json(savedPurchase);

  } catch (error) {
    console.error("Error in /purchase/new API:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


app.get("/purchase/userId", authMiddleware, async (req, res) => {
  const userSub = req.user;

  if (!userSub.userId) {


    return res.status(400).json({
      success: false,
      error: "User not found",
    });
  }
  console.log("user: ", userSub);
  // Lấy danh sách purchase theo userId
  const purchases = await Purchase.find({ userId: userSub.userId });
  if (purchases.length === 0) {
    return res.status(404).json({
      success: false,
      error: "No purchases found for this user.",
    });
  }
  try {
    // Tính tổng số lượng item đã mua và đã sử dụng cho từng loại item
    const summary = purchases.reduce((acc, purchase) => {
      const { itemId, itemName, quantity, use_quantity } = purchase;

      if (!acc[itemId]) {
        acc[itemId] = {
          itemId,
          itemName,
          totalPurchased: 0,
          totalUsed: 0,
        };
      }

      acc[itemId].totalPurchased += quantity;
      acc[itemId].totalUsed += use_quantity;

      return acc;
    }, {});

    // Chuyển đối tượng tổng hợp thành mảng
    const summaryArray = Object.values(summary);
    return res.json({
      success: true,
      summary: summaryArray,
    });

  } catch (error) {
    console.error("Error fetching purchases:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching purchases", error: error.message });
  }
});

// API gửi giao dịch
app.post("/api/convert-sol", authMiddleware, async (req, res) => {
  const { signature, walletAddress, solAmount } = req.body;
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const WALLET_ADDRESS_RECEIVE = "9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB";
  if (!signature || !walletAddress || !solAmount) {
    return res.status(400).json({ error: "Invalid parameters." });
  }
  const userSub = req.user;
  if (!userSub.userId) {


    return res.status(400).json({
      success: false,
      error: "User not found",
    });
  }
  // Tìm người dùng theo ID
  const updatedItem = await User.findOne({ sub: userSub.userId });
  try {
    // Lấy thông tin giao dịch từ signature
    const transaction = await connection.getTransaction(signature);

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: "Transaction not found",
      });
    }

    // Xác minh người gửi
    const sender = transaction.transaction.message.accountKeys[0].toString();
    if (sender !== walletAddress) {
      return res.status(400).json({
        success: false,
        error: "Invalid sender",
      });
    }

    // Xác minh người nhận
    const receiver = transaction.transaction.message.accountKeys[1].toString();
    if (receiver !== WALLET_ADDRESS_RECEIVE) {
      return res.status(400).json({
        success: false,
        error: "Invalid receiver",
      });
    }

    // Xác minh số lượng SOL
    const transferredLamports =
      transaction.meta.postBalances[1] - transaction.meta.preBalances[1];
    const transferredSOL = transferredLamports / 1000000000;

    if (transferredSOL !== parseFloat(solAmount)) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount",
      });
    }

    // Tính points (1 SOL = 100 points)
    const points = transferredSOL * 100;

    // TODO: Lưu points vào database cho user
    updatedItem.points += points;
    await updatedItem.save();

    return res.json({
      success: true,
      sol: transferredSOL,
      points: points,
      total: updatedItem.points,
      message: "Transaction verified successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message,
    });
  }
});

app.post("/api/claim-sol", authMiddleware, async (req, res) => {
  const { walletAddressNhan, points } = req.body;

  // Kiểm tra thông số đầu vào
  if (!walletAddressNhan || points <= 0) {
    //console.log(walletAddressNhan, points);
    return res
      .status(400)
      .json({ error: "Invalid wallet address or points amount." });
  }
  const userSub = req.user;
  if (!userSub.userId) {
    //console.log(userSub);
    return res.status(400).json({ error: "User authentication failed." });
  }

  // Tìm người dùng theo ID
  const updatedItem = await User.findOne({ sub: userSub.userId });

  if (!updatedItem) {
    return res.status(404).json({ error: "User not found" });
  }

  // Kiểm tra xem người dùng có đủ điểm không
  if (updatedItem.points < points) {
    return res.status(400).json({ error: "Not enough points" });
  }

  // Tính số Solana nhận được từ số điểm
  const solToReceive = points / 100;

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Địa chỉ ví người chơi và ví chính (ví 2)
    const senderPublicKey = new PublicKey(
      "9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB"
    );
    const receiverPublicKey = new PublicKey(walletAddressNhan);

    // Kiểm tra số dư của ví gửi
    const balance = await connection.getBalance(senderPublicKey);
    const lamportsToSend = solToReceive * 1000000000;

    if (balance < lamportsToSend) {
      console.error("Insufficient balance in sender wallet");
      return res.status(500).json({ error: "System is busy. Please try again later." });
    }

    // Giảm số điểm của người dùng
    updatedItem.points -= points;

    // Tạo giao dịch
    const { blockhash } = await connection.getRecentBlockhash();
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: senderPublicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: lamportsToSend,
      })
    );

    // Ký và gửi giao dịch
    const base58PrivateKey =
      "4AxXEWC73yQeoBjNoZ4sW5V5S7YU3mUs7iXo88b9AnRBpwy2s7NHzeSkG85ewF4gvojaaNWXsvQP4hkQjHKobigy";
    const secretKey = bs58.decode(base58PrivateKey);

    if (secretKey.length !== 64) {
      throw new Error("Invalid secret key size");
    }

    const senderKeypair = Keypair.fromSecretKey(secretKey);
    const signature = await connection.sendTransaction(transaction, [
      senderKeypair,
    ]);

    //console.log("Transaction signature: ", signature);

    // Lưu lại thông tin đã cập nhật
    await updatedItem.save();

    // Trả về kết quả
    return res.json({
      message: "Transaction successful",
      solToReceive: solToReceive,
      points: updatedItem.points,
    });
  } catch (err) {
    console.error("Transaction failed:", err);
    return res
      .status(500)
      .json({ error: "Transaction failed", details: err.message });
  }
});


// Lắng nghe yêu cầu
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
