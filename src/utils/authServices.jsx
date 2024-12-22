import axios from "axios";

const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY;
// Tạo NFTs
export const createUser = async (referenceId, email, externalWalletAddress) => {
  try {
    const response = await axios.post(
      "https://api.gameshift.dev/nx/users",
      { referenceId, email, externalWalletAddress },
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
export const userDetailGoogle = async (token) => {
  try {
    const response = await axios.get("http://localhost:3000/user/detail", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
  }
};


export const userDetail = async (userId) => {
  try {
    const response = await axios.get(
      `https://api.gameshift.dev/nx/users/${userId}/items`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
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
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error(
      "Error creating asset:",
      error.response?.data || error.message
    );
  }
};
export const changeSOLToUSDC = async (userId, quantity, destinationWallet) => {
  try {
    const response = await axios.get(
      `https://api.gameshift.dev/nx/users/${userId}/items/USDC/transfer`,
      { quantity, destinationWallet },
      {
        headers: {
          accept: "application/json",
          "x-api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating asset:",
      error.response?.data || error.message
    );
  }
};


export const getUserBySub = async (sub) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/get/user/sub",
      { sub },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching getUserBySub:", error.message);
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
  }
};
