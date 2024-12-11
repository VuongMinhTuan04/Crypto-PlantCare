import axios from "axios";

// Tạo NFTs
export const createAsset = async (referenceId, email) => {
  try {
    const response = await axios.post(
      "https://api.gameshift.dev/nx/users",
      { referenceId, email },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyNzU1YTIyYy0wZDVhLTQyMjQtODdjNC03Zjk0N2JiNWZmZGUiLCJzdWIiOiI0ZjcwNTFhMi1mNjI3LTRmMTEtYmYyZC0wNzM0YjBlYmNhYTEiLCJpYXQiOjE3MzM3NjAzMTF9.j5lD9TPLsFpTGkS5Qhv5WJNn4TPNDsEiFsu3kEl2hLE`, // Thay YOUR_API_KEY bằng API Key của bạn
          "Content-Type": "application/json",
        },
      }
    );
    console.log("User created:", response.data);
  } catch (error) {
    console.error(
      "Error creating asset:",
      error.response?.data || error.message
    );
  }
};

export const userDetail = async (userId) => {
  try {
    const response = await axios.get(
        `https://api.gameshift.dev/nx/users/${userId}/items`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyNzU1YTIyYy0wZDVhLTQyMjQtODdjNC03Zjk0N2JiNWZmZGUiLCJzdWIiOiI0ZjcwNTFhMi1mNjI3LTRmMTEtYmYyZC0wNzM0YjBlYmNhYTEiLCJpYXQiOjE3MzM3NjAzMTF9.j5lD9TPLsFpTGkS5Qhv5WJNn4TPNDsEiFsu3kEl2hLE`, // Thay YOUR_API_KEY bằng API Key của bạn
        },
      }
    );
    console.log("User created:", response.data);
  } catch (error) {
    console.error(
      "Error creating asset:",
      error.response?.data || error.message
    );
  }
};
// Đăng ảnh lên Pinata
export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: "cefc0cccca2659beea88",
        pinata_secret_api_key:
          "835ec09a4bc5ff3f2592454762c764e04797832b75ea11b98fd979d8a64fbb60",
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};
