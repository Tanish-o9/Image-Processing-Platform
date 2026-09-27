function ImageCard({ title, image }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">

      <img
        src={image}
        className="w-full h-64 object-cover"
      />

      <p className="text-xs font-semibold px-3 py-2">
        {title}
      </p>

    </div>
  );
}

export default ImageCard;