import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
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
app.use(cors({
  origin: '*',  // Replace with your frontend's URL
  methods: 'GET,POST,DELETE,PUT',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization'  // Allowed headers
}));

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
    await mongoose.connect(process.env.MONGODB_URI
      //, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //}
    );
    console.log('✅ Kết nối MongoDB thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
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



    res.json({ token: jwtToken, user: { userId: user._id, sub, email, name, picture } });
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
    message: "Check console for Client ID and Client Secret.", CLIENT_ID, CLIENT_SECRET,
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
  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
  const items = await User.find();
  console.log("users:", items);

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

app.post('/get/user/sub', async (req, res) => {
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


app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'users deleted' });
});

app.post('/users', async (req, res) => {
  const newItem = new User(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put('/users/:id', async (req, res) => {
  const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});


const treeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  time: { type: String, required: true },
  points: { type: Number, default: 0 },
  fertilizer: { type: Boolean, default: false },
});

const Tree = mongoose.model('Tree', treeSchema);

app.get('/trees', async (req, res) => {
  const items = await Tree.find();
  console.log("Tree:", items);

  res.json(items);
});

app.post('/trees', async (req, res) => {
  const newItem = new Tree(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put('/trees/:id', async (req, res) => {
  const updatedItem = await Tree.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

const itemScheme = new mongoose.Schema({
  type: { type: String, required: true },
  time: { type: String, required: true },
  name: { type: String, default: 0 },
  price: { type: String, required: true },
  quality: { type: Number, required: true },
});

const Item = mongoose.model('Item', itemScheme);

app.get('/items', async (req, res) => {
  const items = await Item.find();
  console.log("items:", items);

  res.json(items);
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

const purchaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);


app.get('/purchase', async (req, res) => {
  const items = await Purchase.find();
  console.log("purchase:", items);

  res.json(items);
});

app.post('/purchase', async (req, res) => {
  const newItem = new Purchase(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put('/purchase/:id', async (req, res) => {
  const updatedItem = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});



// API gửi giao dịch
app.post('/api/convert-sol', authMiddleware, async (req, res) => {
  const { signature, walletAddress, solAmount } = req.body;
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const WALLET_ADDRESS_RECEIVE = "9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB";
  if (!signature || !walletAddress || !solAmount) {
    return res.status(400).json({ error: 'Invalid parameters.' });
  }
  const userSub = req.user;
  if(!userSub.userId){
    console.log(userSub);
    
    return res.status(400).json({
      success: false,
      error: 'User not found'
    });
  }
  // Tìm người dùng theo ID
  const updatedItem = await User.findOne({sub : userSub.userId});
  try {
    // Lấy thông tin giao dịch từ signature
    const transaction = await connection.getTransaction(signature);

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Xác minh người gửi
    const sender = transaction.transaction.message.accountKeys[0].toString();
    if (sender !== walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sender'
      });
    }

    // Xác minh người nhận
    const receiver = transaction.transaction.message.accountKeys[1].toString();
    if (receiver !== WALLET_ADDRESS_RECEIVE) {
      return res.status(400).json({
        success: false,
        error: 'Invalid receiver'
      });
    }

    // Xác minh số lượng SOL
    const transferredLamports = transaction.meta.postBalances[1] - transaction.meta.preBalances[1];
    const transferredSOL = transferredLamports / 1000000000;

    if (transferredSOL !== parseFloat(solAmount)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
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
      message: 'Transaction verified successfully'
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: err.message
    });

  }
});



// Tạo API để chuyển SOL từ ví người chơi sang ví chính
app.post('/api/claim-sol', authMiddleware, async (req, res) => {
  const { walletAddressNhan, points } = req.body;

  // Kiểm tra thông số đầu vào
  if (!walletAddressNhan || points <= 0) {
    console.log(walletAddressNhan, points);
    return res.status(400).json({ error: 'Invalid wallet address or points amount.' });
  }
  const userSub = req.user;
  if (!userSub.userId) {
    console.log(userSub);

    return;
  }
  // Tìm người dùng theo ID
  const updatedItem = await User.findOne({ sub: userSub.userId });

  if (!updatedItem) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Kiểm tra xem người dùng có đủ điểm không
  if (updatedItem.points < points) {
    return res.status(400).json({ error: 'Not enough points' });
  }

  // Tính số Solana nhận được từ số điểm
  const solToReceive = points / 100;

  // Giảm số điểm của người dùng
  updatedItem.points -= points;

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log("Vi nhan: ", walletAddressNhan);

    // Địa chỉ ví người chơi và ví chính (ví 2)
    const senderPublicKey = new PublicKey("9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB");
    const receiverPublicKey = new PublicKey(walletAddressNhan); // Ví chính (người nhận)

    // Lấy blockhash gần nhất
    const { blockhash } = await connection.getRecentBlockhash();

    // Tạo giao dịch
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: senderPublicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: solToReceive * 1000000000, // Chuyển đổi SOL sang lamports
      })
    );

    // Ký và gửi giao dịch

    const base58PrivateKey = '4AxXEWC73yQeoBjNoZ4sW5V5S7YU3mUs7iXo88b9AnRBpwy2s7NHzeSkG85ewF4gvojaaNWXsvQP4hkQjHKobigy';
    const secretKey = bs58.decode(base58PrivateKey); // Decode to Uint8Array

    if (secretKey.length !== 64) {
      throw new Error('Invalid secret key size');
    }

    const senderKeypair = Keypair.fromSecretKey(secretKey);

    // Gửi giao dịch
    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    console.log("Transaction signature: ", signature);

    // Lưu lại thông tin đã cập nhật (số điểm đã giảm)
    await updatedItem.save();

    // Trả về kết quả
    return res.json({
      message: 'Transaction successful',
      solToReceive: solToReceive,
      points: updatedItem.points,
    });
  } catch (err) {
    console.error("Transaction failed:", err);
    return res.status(500).json({ error: 'Transaction failed', details: err.message });
  }
});


// Lắng nghe yêu cầu
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
