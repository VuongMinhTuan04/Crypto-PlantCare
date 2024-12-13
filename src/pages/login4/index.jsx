import Loading from "@/components/loading";
import {
  createGameItems,
  loadCollections,
  uploadToIPFS,
} from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Dữ liệu mới của trees

const trees = [
  {
    id: 1,
    collectionId: "9a3e53b0-e3f3-4e01-8538-788d5b886c81",
    description: "A strong and resilient tree.",
    imageUrl: "/assets/images/image 17.png",
    name: "Tree A",
    attributes: [
      {
        traitType: "Strength",
        value: "High",
      },
    ],
  },
  {
    id: 2,
    collectionId: "9a3e53b0-e3f3-4e01-8538-788d5b886c81",
    description: "A fast-growing, vibrant tree.",
    imageUrl: "/assets/images/tree-2.png",
    name: "Tree B",
    attributes: [
      {
        traitType: "Growth",
        value: "Fast",
      },
    ],
  },
  {
    id: 3,
    collectionId: "9a3e53b0-e3f3-4e01-8538-788d5b886c81",
    description: "A tree with lush leaves and deep roots.",
    imageUrl: "/assets/images/tree-3.png",
    name: "Tree C",
    attributes: [
      {
        traitType: "Roots",
        value: "Deep",
      },
    ],
  },
];

const Mint = () => {
  const [googleId, setGoogleId] = useState("");
  const [selectedTree, setSelectedTree] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      const current = JSON.parse(localStorage.getItem("tokenGoogle"));
      if (current === null || undefined) {
        return;
      }
      console.log(current.user.sub);

      const dataUser = current.user.sub;
      setGoogleId(dataUser);
    };
    data();
    collections();
  });

  const collections = async () => {
    try {
      const response = await loadCollections();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getImageBlob = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return blob;
  };

  const handleCreateAsset = async () => {
    if (!selectedTree) {
      alert("Vui lòng chọn một cây trước khi mint!");
      return;
    }

    try {
      // Tải Blob từ đường dẫn ảnh
      const imageBlob = await getImageBlob(selectedTree.imageUrl);

      // Tải ảnh lên IPFS
      const newImageUrl = await uploadToIPFS(imageBlob);
      console.log("Uploaded Image URL:", newImageUrl);

      // Tạo dữ liệu gửi đến API
      const details = {
        collectionId: "10bcd746-ac42-4076-9e45-f684d6ae7f5b",
        description: "A fast-growing, vibrant tree.",
        imageUrl:
          "https://lime-calm-cobra-390.mypinata.cloud/ipfs/QmaWYgvw1c2MA3iP8HcvtHAVEtsnfUtDNUZy4bvHPyAsm8",
        name: "EMilky Way Tree",
        attributes: [
          {
            traitType: "attribute-name",
            value: "attribute-value",
          },
        ],
      };

      // Gửi dữ liệu đến API createGameItems
      const response = await createGameItems(details, googleId);
      console.log("API Response:", response);
      
      alert("Tài sản đã được tạo thành công!");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Có lỗi xảy ra khi tạo tài sản!");
    }
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập quá trình tải
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 giây

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-center bg-background-green h-full w-full justify-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mint</h1>
      <p className="text-gray-600 text-sm text-center mb-4">
        Approve and mint your first tree!
      </p>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="w-80 h-80 mb-6"
        onSlideChange={(swiper) => setSelectedTree(trees[swiper.activeIndex])}
      >
        {trees.map((tree) => (
          <SwiperSlide key={tree.id} className="flex flex-col items-center">
            <img
              src={tree.imageUrl}
              alt={tree.name}
              className="w-40 h-40 mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800">{tree.name}</h3>
            <p className="text-sm text-gray-600 text-center">
              {tree.description}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Approve Button */}
      <button
        onClick={handleCreateAsset}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-full w-72"
      >
        APPROVE
      </button>
    </div>
  );
};

export default Mint;
