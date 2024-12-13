import axios from "axios";

const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY;
// Tạo NFTs
export const createUser = async (referenceId, email) => {
  try {
    const response = await axios.post(
      "https://api.gameshift.dev/nx/users",
      { referenceId, email },
      {
        headers: {
          accept: "application/json",
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const userDetail = async (userId) => {
  try {
    const response = await axios.get(
      `https://api.gameshift.dev/nx/users/${userId}/items`,
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyNzU1YTIyYy0wZDVhLTQyMjQtODdjNC03Zjk0N2JiNWZmZGUiLCJzdWIiOiI0ZjcwNTFhMi1mNjI3LTRmMTEtYmYyZC0wNzM0YjBlYmNhYTEiLCJpYXQiOjE3MzM3NjAzMTF9.j5lD9TPLsFpTGkS5Qhv5WJNn4TPNDsEiFsu3kEl2hLE",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error
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

export const createGameItems = async (details, destinationUserReferenceId) => {
  try {
    const response = axios.post(
      "https://api.gameshift.dev/nx/unique-assets",
      { details, destinationUserReferenceId },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
export const loadCollections = async () => {
  try {
    const response = await axios.get(`https://api.gameshift.dev/nx/items`, {
      headers: {
        accept: "application/json",
        "x-api-key": API_KEY, // Thay YOUR_API_KEY bằng API Key của bạn
      },
    });
  } catch (error) {
    console.error(
      "Error creating asset:",
      error.response?.data || error.message
    );
  }
};
