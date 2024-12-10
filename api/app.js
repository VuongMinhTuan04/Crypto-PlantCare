const express = require('express');
const app = express();

// Cấu hình port
const PORT = process.env.PORT || 3000;

// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến cơ bản
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
