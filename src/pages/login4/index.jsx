import { createAsset, uploadToIPFS } from '@/utils/authServices';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const trees = [
  {
    id: 1,
    name: 'Tree A',
    description: 'A strong and resilient tree.',
    image: '/assets/images/image 17.png',
  },
  {
    id: 2,
    name: 'Tree B',
    description: 'A fast-growing, vibrant tree.',
    image: '/assets/images/tree-2.png',
  },
  {
    id: 3,
    name: 'Tree C',
    description: 'A tree with lush leaves and deep roots.',
    image: '/assets/images/tree-3.png',
  },
];

const Mint = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const [file, setFile] = useState(null)
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game-playing');
  };

  const getImageBlob = async (imagePath) => {
    const response = await fetch(imagePath); // Tải file từ public folder
    const blob = await response.blob(); // Chuyển file thành Blob
    return blob;
  };

  const handleCreateAsset = async () => {
    if (!selectedTree) {
      alert('Vui lòng chọn một cây trước khi mint!');
      return;
    }
  
    try {
      // Lấy Blob từ đường dẫn ảnh
      const imageBlob = await getImageBlob(selectedTree.image);
  
      // Tải ảnh lên IPFS
      const imageUrl = await uploadToIPFS(imageBlob); // uploadToIPFS cần hỗ trợ Blob
      console.log('Image URL:', imageUrl);
  
      // Tạo tài sản với GameShift
      const response = await createAsset(selectedTree.name, selectedTree.description, imageUrl);
      console.log(response);
      
      alert('Tài sản đã được tạo thành công!');
    } catch (error) {
      console.error('Error:', error.message);
      alert('Có lỗi xảy ra khi tạo tài sản!');
    }
  };
  

  return (
    <div className="flex flex-col items-center bg-green-200 h-full w-full justify-center">
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
              src={tree.image}
              alt={tree.name}
              className="w-40 h-40 mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800">{tree.name}</h3>
            <p className="text-sm text-gray-600 text-center">{tree.description}</p>
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
      <input type="file" name="file" id="file" onChange={(e) => setFile(e.target.files[0])}/>
    </div>
  );
};

export default Mint;
``