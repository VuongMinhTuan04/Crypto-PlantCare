import Loading from "@/components/loading";
import {
  createGameItems,
  loadCollections,
  uploadToIPFS,
  userDetailGoogle,
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
    collectionId: "d658c2f3-f749-48e3-a28d-d433aa868f05",
    description: "A majestic, towering tree that symbolizes strength and longevity",
    imageUrl: "/assets/tree-1.png",
    name: "Green Giant Tree",
    attributes: [
      {
        traitType: "Strength",
        value: "High",
      },
    ],
  },
  {
    id: 2,
    collectionId: "607a2ecd-d9d8-4cde-bafa-9ab55e5f5022",
    description: "Golden Giant Tree brings prosperity and unique rewards",
    imageUrl: "/assets/tree-3.png",
    name: "Golden Giant Tree",
    attributes: [
      {
        traitType: "Growth",
        value: "Fast",
      },
    ],
  },
  {
    id: 3,
    collectionId: "bdbd6c61-cb21-4937-b744-671d30185651",
    description: "Regal appearance and magical aura",
    imageUrl: "/assets/tree-2.png",
    name: "Purple Giant Tree",
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
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  useEffect(() => {
    // Kiểm tra và xử lý token Google
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (tokenGoogle) {
      try {
        const parsedToken = JSON.parse(tokenGoogle);
        setToken(parsedToken);
        const loadUserData = async () => {
          try {
            const resp = await userDetailGoogle(parsedToken);
            setUser(resp.user);
            console.log(resp.user)
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        };
        loadUserData();
        collections()
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

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
        collectionId: selectedTree.collectionId,
        description: selectedTree.description,
        imageUrl: newImageUrl,
        name: selectedTree.name,
        attributes: selectedTree.attributes,
      };

      // Gửi dữ liệu đến API createGameItems
      const response = await createGameItems(details, user.userId);
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
