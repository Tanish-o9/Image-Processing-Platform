import ImageCard from "../../components/ImageCard";
import QuickAction from "../../components/QuickAction";

function Home() {
  return (
    <div>

      {/* Greeting */}
      <div className="mb-5">

        <h1 className="text-2xl font-bold">
          Good Morning, Navya
        </h1>

        <p className="text-xs text-gray-500">
          Explore, edit and analyze your images with the power of AI
        </p>

      </div>


      {/* AI Analysis + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* AI Analysis */}
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-5 text-white">

          <p className="text-xs font-semibold">
            ✨ AI Image Analysis
          </p>

          <p className="text-[10px] mt-1">
            Detect objects, get insights
            <br />
            and analyze images with AI.
          </p>

          <button className="bg-white text-purple-600 text-[10px] px-4 py-2 rounded-md mt-4">
            Try Now
          </button>

        </div>


        {/* Recent Projects */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">

          <div className="flex justify-between items-center">

            <h2 className="text-sm font-bold">
              Recent Projects
            </h2>

            <button className="text-[10px] text-purple-600">
              View All →
            </button>

          </div>


          <div className="mt-4 space-y-3">

            <div className="flex gap-3 items-center">

              <div className="w-12 h-10 bg-green-300 rounded"></div>

              <div>
                <p className="text-xs font-semibold">
                  Nature Stock
                </p>
                <p className="text-[9px] text-gray-400">
                  Edited 2h ago
                </p>
              </div>

            </div>


            <div className="flex gap-3 items-center">

              <div className="w-12 h-10 bg-orange-300 rounded"></div>

              <div>
                <p className="text-xs font-semibold">
                  Sunset View
                </p>
                <p className="text-[9px] text-gray-400">
                  Edited 5h ago
                </p>
              </div>

            </div>


            <div className="flex gap-3 items-center">

              <div className="w-12 h-10 bg-pink-300 rounded"></div>

              <div>
                <p className="text-xs font-semibold">
                  Royalty Flower
                </p>
                <p className="text-[9px] text-gray-400">
                  Edited 8h ago
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Quick Actions */}
      <section className="mt-6">

        <h2 className="text-sm font-bold mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <QuickAction
            icon="↑"
            title="Upload Image"
            description="Start processing"
            link="/dashboard/upload"
          />

          <QuickAction
            icon="✦"
            title="Edit Image"
            description="Enhance & modify"
            link="/dashboard/edit"
          />

          <QuickAction
            icon="▧"
            title="AI Analysis"
            description="View past work"
            link="/dashboard/ai-analysis"
          />

          <QuickAction
            icon="◷"
            title="History"
            description="Manage your work"
            link="/dashboard/history"
          />

        </div>

      </section>


      {/* Recent Images */}
      <section className="mt-6">

        <h2 className="text-sm font-bold mb-3">
          Recent Images
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <ImageCard title="Parrot" />
          <ImageCard title="Mountain" />
          <ImageCard title="Eye" />
          <ImageCard title="Portrait" />
          <ImageCard title="Nature" />

        </div>

      </section>

    </div>
  );
}

export default Home;