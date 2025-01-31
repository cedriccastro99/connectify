import { GridLoader } from 'react-spinners'; // Optional: You can use any loader you prefer

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100 fixed top-0 left-0 z-50">
      <GridLoader size={20} color="#3498db" />
    </div>
  );
};

export default Loading;