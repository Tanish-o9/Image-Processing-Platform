import { useEffect, useState } from "react";
import { BACKEND_URL, getToken } from "../../api";

function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory();
  }, []);


  const getHistory = async () => {

    try {

      const response =
        await fetch(
          `${BACKEND_URL}/api/history/gethistory`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load history"
        );
      }

      // Different backend implementations
      // may return data.history or data.images.
      const items =
        data.data?.history ||
        data.data?.images ||
        [];

      setHistory(items);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            History
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your uploaded and processed images.
          </p>
        </div>

      </div>


      {loading && (
        <p className="text-sm mt-8">
          Loading history...
        </p>
      )}


      {error && (
        <p className="text-red-500 text-sm mt-8">
          {error}
        </p>
      )}


      {!loading && !error && history.length === 0 && (
        <div className="bg-white border rounded-xl p-10 mt-6 text-center">

          <p className="text-gray-500">
            No image history found.
          </p>

        </div>
      )}


      {history.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">

          {history.map((item) => {

            const image =
              item.secureUrl ||
              item.cloudinaryUrl ||
              item.url;

            return (
              <div
                key={item._id}
                className="bg-white border rounded-xl overflow-hidden"
              >

                {image && (
                  <img
                    src={image}
                    alt={item.originalName}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-3">

                  <p className="text-sm font-semibold truncate">
                    {item.originalName}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.status || "uploaded"}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default History;