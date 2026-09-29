function ImageCard({ title }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">

      <div className="h-24 bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 flex items-center justify-center">
        <span className="text-3xl">
          🖼️
        </span>
      </div>

      <p className="text-xs font-semibold px-3 py-2">
        {title}
      </p>

    </div>
  );
}

export default ImageCard;