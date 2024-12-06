import { useNavigate } from "react-router-dom";

const UserActivityView = () => {
  const navigate = useNavigate()
  const activities = [
    {
      id: 1,
      description: 'Blue origin attacked id#2342 and won 500 points',
      timestamp: '4 min ago',
    },
    { id: 2, description: 'Jack.eth spin and won nothing', timestamp: '4 min ago' },
    { id: 3, description: 'Id #1224 consumed 1 Koi fish', timestamp: '4 min ago' },
    { id: 4, description: 'Sing attacked id#1223 and lost 81 points', timestamp: '4 min ago' },
    {
      id: 5,
      description: 'Blue origin attacked id#2342 and won 500 points',
      timestamp: '4 min ago',
    },
    { id: 6, description: 'Jack.eth spin and won nothing', timestamp: '4 min ago' },
    { id: 7, description: 'Id #1224 consumed 1 Koi fish', timestamp: '4 min ago' },
    { id: 8, description: 'Sing attacked id#1223 and lost 81 points', timestamp: '4 min ago' },
  ];

  return (
    <div className="bg-background-green p-4 rounded-md shadow-md h-full pt-3">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-bold mt-3 text-black">Activities</h2>
        <button onClick={() => navigate('/game-playing/activities/referandearn')} className="bg-white px-4 py-2 mt-4 rounded-md hover:bg-green-600 transition-colors duration-200 text-green-900">
          All Activities
        </button>
      </div>

      {/* Hiển thị dữ liệu */}
      <div className="space-y-2 px-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white p-3 rounded-lg flex justify-between items-start shadow-sm"
          >
            <p className="text-xs text-gray-700 break-words max-w-[70%]">{activity.description}</p>
            <p className="text-xs text-gray-500 whitespace-nowrap">{activity.timestamp}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {/* Số trang đầu */}
        <button className="w-8 h-8 flex items-center justify-center bg-white text-green-700 rounded-full shadow hover:bg-green-600 hover:text-white transition-colors">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-white text-green-700 rounded-full shadow hover:bg-green-600 hover:text-white transition-colors">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-white text-green-700 rounded-full shadow hover:bg-green-600 hover:text-white transition-colors">
          3
        </button>

        {/* Dấu ... */}
        <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>

        {/* Số trang cuối */}
        <button className="w-8 h-8 flex items-center justify-center bg-white text-green-700 rounded-full shadow hover:bg-green-600 hover:text-white transition-colors">
          99
        </button>
      </div>

    </div>
  );
};

export default UserActivityView;
