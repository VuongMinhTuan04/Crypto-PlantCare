import axios from "axios";

const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY;
const API_URL_BE = "http://localhost:3000";
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
    const response = await axios.get(`${API_URL_BE}/user/detail`, {
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
      }
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
export const getUserByToken = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL_BE}/usersbytoken`,
      { token },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error
  }
};

export const converSolToPoints = async (
  signature,
  walletAddress,
  solAmount,
  token
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/convert-sol",
      { signature, walletAddress, solAmount },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching converSolToPoints:", error.message);
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
  }
};

export const converPointsToSol = async (walletAddressNhan, points, token) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/claim-sol",
      { walletAddressNhan, points },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching converPointsToSol:", error.message);
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
  }
};
export const getAllItems = async () => {
  try {
    const response = await axios.get(
      `${API_URL_BE}/items`,

      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching getAllItems:", error.message);
    return {
      error: true,
      message: error.response?.data || "Unknown error occurred",
    };
  }
};

export const getAllPurchaseByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL_BE}/purchase/${userId}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getUserTreeByUser = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL_BE}/api/user-trees-by-token`,
      { token },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const saveUserTree = async (details) => {
  try {
    const response = await axios.post(`${API_URL_BE}/api/user-trees`, details, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const setTimeCountDown = async (token, watering) => {
  try {
    const response = await axios.post(
      `${API_URL_BE}/api/user-trees/watering`,
      { token, watering },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getAllTrees = async () => {
  try {
    const response = await axios.get(`${API_URL_BE}/trees`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getTreeByUser = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL_BE}/api/trees-by-user/${userId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
