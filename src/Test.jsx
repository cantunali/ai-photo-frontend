const Test = () => {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Bu yazı görünüyorsa Tailwind çalışıyor demektir.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500 p-4 text-white rounded">Kutu 1</div>
          <div className="bg-green-500 p-4 text-white rounded">Kutu 2</div>
          <div className="bg-blue-500 p-4 text-white rounded">Kutu 3</div>
        </div>
      </div>
    </div>
  );
};

export default Test;