import express from 'express';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl, Keypair } from '@solana/web3.js';
import cors from 'cors';
import bs58 from 'bs58';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken';

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

// Kết nối MongoDB
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
      const newUser = new User({sub, email, picture, name});
      await newUser.save(newUser);
      console.log("Tao user moi thanh cong");

    } else {
      console.log("Tim thay user tren dtb: ", user);
    }


    res.json({ token: jwtToken, user: { sub, email, name, picture } });
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token");
  }
});

app.get("/test", async (req, res) => {
  console.log("Client ID:", CLIENT_ID);
  console.log("Client Secret:", CLIENT_SECRET);

  // Gửi phản hồi về client
  res.send({
    message: "Check console for Client ID and Client Secret.",CLIENT_ID,CLIENT_SECRET,
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





// Tạo API để chuyển SOL từ ví người chơi sang ví chính
app.post('/api/convert-sol', async (req, res) => {
  const { walletAddress, solToTransfer, walletAddressNhan } = req.body;




  // Kiểm tra thông số đầu vào
  if (!walletAddress || !walletAddressNhan || solToTransfer <= 0) {
    return res.status(400).json({ error: 'Invalid wallet address or SOL amount.' });
  }

  // Tìm người dùng theo ID
  const updatedItem = await User.findById("6762c4b5e4c8687341c1e94e");

  if (!updatedItem) {
    return res.status(404).json({ error: 'User not found' });
  }


  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Địa chỉ ví người chơi và ví chính (ví 2)
    const senderPublicKey = new PublicKey(walletAddress); // Địa chỉ ví người chơi
    const receiverPublicKey = new PublicKey(walletAddressNhan); // Ví chính

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
        lamports: solToTransfer * 1000000000, // Chuyển đổi SOL sang lamports
      })
    );

    // Giả sử ví người dùng đã ký và gửi giao dịch, thực tế bạn sẽ cần xử lý từ ví người dùng
    // Tại backend, bạn chỉ tạo và gửi giao dịch tới Solana

    // Sau khi giao dịch thành công, tính toán điểm nhận được
    const receivedPoints = solToTransfer * 100; // 1 SOL = 100 điểm

    updatedItem.points += receivedPoints;
    await updatedItem.save();
    // Trả về kết quả
    return res.json({
      message: 'Transaction successful',
      receivedPoints: receivedPoints,
      solToTransfer: solToTransfer,
      totalPoints: updatedItem.points,
    });
  } catch (err) {
    console.error("Transaction failed:", err);
    return res.status(500).json({ error: 'Transaction failed', details: err.message });
  }
});


// Tạo API để chuyển SOL từ ví người chơi sang ví chính
app.post('/api/claim-sol', async (req, res) => {
  const { walletAddressNhan, points } = req.body;

  // Kiểm tra thông số đầu vào
  if (!walletAddressNhan || points <= 0) {
    console.log(walletAddressNhan, points);
    return res.status(400).json({ error: 'Invalid wallet address or points amount.' });
  }

  // Tìm người dùng theo ID
  const updatedItem = await User.findById("6762c4b5e4c8687341c1e94e");

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
