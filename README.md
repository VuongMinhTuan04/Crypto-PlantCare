# Crypto PlantCare

**Crypto PlantCare** là một dự án game web3 chăm sóc cây trồng, trong đó người chơi có thể chăm sóc cây, thu hoạch quả, và nhận được NFTs cũng như token dưới dạng SOL. Mục tiêu của dự án là tạo ra một nền tảng tương tác cho người chơi trong thế giới ảo, nơi họ có thể trồng cây, chăm sóc và thu hoạch cây của mình để nhận phần thưởng dưới dạng tài sản số.

## Các tính năng chính:
- Chăm sóc cây, tưới nước và thu hoạch quả.
- Nhận NFTs và token SOL khi cây ra quả.
- Giao diện người dùng đẹp, dễ sử dụng, được xây dựng bằng ReactJS.
- Backend xử lý logic game và quản lý tài sản số được xây dựng bằng ExpressJS.

## Công nghệ sử dụng:
- **Frontend:** ReactJS (Với các công cụ như React Router, Axios, và Web3.js)
- **Backend:** ExpressJS
- **Blockchain:** SOL (Solana)
- **Database:** MongoDB (hoặc một dịch vụ cơ sở dữ liệu tương tự)

## Cấu trúc dự án:

Crypto-PlantCare/ ├── client/ 
# ReactJS frontend 
│ ├── public/ # Các tệp công khai (HTML, hình ảnh...) 
│ ├── src/ # Mã nguồn ReactJS 
│ ├── package.json # Các phụ thuộc của frontend 
│ └── .env # Cấu hình môi trường cho ReactJS 
├── api/ # ExpressJS backend 
│ ├── controllers/ # Các controller xử lý request 
│ ├── models/ # Các mô hình dữ liệu (Ví dụ: cây, người chơi) 
│ ├── routes/ # Các route API 
│ ├── server.js # Điểm vào cho ExpressJS 
│ └── .env # Cấu hình môi trường cho ExpressJS 
├── package.json # Các phụ thuộc của cả frontend và backend 
└── README.md # Tài liệu dự án

## Cài đặt và chạy dự án

### 1. Cài đặt phụ thuộc:

#### Cài đặt frontend (ReactJS):
1. Di chuyển vào thư mục `client`:
   cd frontend
2. Cài đặt các phụ thuộc:
   npm install
#### Cài đặt backend (ExpressJS):
1. Di chuyển vào thư mục api
   cd api
2. Cài đặt các phụ thuộc:
   npm install

### 2. Chạy dự án

#### 1. Chạy frontend (ReactJS)
1. Di chuyển vào thư mục frontend
   cd frontend
2. Chạy dự án
   npm run dev
#### 2. Chạy Express.js
1. Di chuyển vào thư mục api
   cd api
2. Chạy dự án
   npm start


### Cách hoạt động của dự án:
Frontend (ReactJS): Người chơi sẽ truy cập vào giao diện trò chơi, nơi họ có thể trồng cây, chăm sóc cây và thu hoạch quả.
Backend (ExpressJS): Backend xử lý tất cả các yêu cầu từ frontend, bao gồm quản lý trạng thái cây, người chơi và phần thưởng từ blockchain.
Blockchain: Khi cây ra quả, người chơi có thể nhận token SOL và NFTs tương ứng qua giao thức Solana.

