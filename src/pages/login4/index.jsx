import Loading from "@/components/loading";
import { getAllTrees, saveUserTree, userDetailGoogle } from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Dữ liệu mới của trees



const Mint = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false)
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
            console.log(resp.user);
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        };
        loadUserData();
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadTree = async () => {
      try {
        const resp = await getAllTrees();
        
        const newTrees = resp.map((tree) => ({
          ...tree, 
          point: "10",
          level: "1",
          watering: false
        }))
        if (newTrees.length > 0) {
          setSelectedTree(newTrees[0]);
        }
        setTree(newTrees);
        console.log(newTrees);
      } catch (error) {
        console.log(error);
      }
    };
    loadTree();
  }, []);

  // const collections = async () => {
  //   try {
  //     const response = await loadCollections();
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getImageBlob = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return blob;
  };

  // const handleCreateAsset = async () => {
  //   if (!selectedTree) {
  //     alert("Vui lòng chọn một cây trước khi mint!");
  //     return;
  //   }

  //   try {
  //     // Tải Blob từ đường dẫn ảnh
  //     const imageBlob = await getImageBlob(selectedTree.imageUrl);

  //     // Tải ảnh lên IPFS
  //     const newImageUrl = await uploadToIPFS(imageBlob);
  //     console.log("Uploaded Image URL:", newImageUrl);

  //     // Tạo dữ liệu gửi đến API
  //     const details = {
  //       collectionId: selectedTree.collectionId,
  //       description: selectedTree.description,
  //       imageUrl: newImageUrl,
  //       name: selectedTree.name,
  //       attributes: selectedTree.attributes,
  //     };

  //     // Gửi dữ liệu đến API createGameItems
  //     const response = await createGameItems(details, user.userId);
  //     console.log("API Response:", response);

  //     alert("Tài sản đã được tạo thành công!");
  //     navigate("/game-login/solana/deposite/mint");
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     alert("Có lỗi xảy ra khi tạo tài sản!");
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true)
    const details = {
      userId: user.userId,
      treeId: selectedTree._id,
      point: selectedTree.point,
      level: selectedTree.level,
      watering: selectedTree.watering
    };
    try {
      await saveUserTree(details)
      navigate('/game-playing')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    console.log(details);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập quá trình tải
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 giây

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

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
        onSlideChange={(swiper) => setSelectedTree(tree[swiper.activeIndex])}
      >
        {tree.map((tree) => (
          <SwiperSlide key={tree._id} className="flex flex-col items-center">
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
        onClick={handleSubmit}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-full w-72"
      >
        APPROVE
      </button>
    </div>
  );
};

export default Mint;
