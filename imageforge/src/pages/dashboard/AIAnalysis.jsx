function AIAnalysis() {
  return (
    <div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-300 to-indigo-300 rounded-lg p-5">

        <h1 className="text-xl font-bold">
          Discover Powerful AI Tools
        </h1>

        <p className="text-xs text-gray-700">
          Explore different AI features and unlock the full potential
          <br />
          of your images.
        </p>

        <input
          type="text"
          placeholder="Search tools, features, or keywords..."
          className="mt-4 w-full max-w-md bg-white rounded-lg px-4 py-2 text-xs outline-none"
        />

      </div>


      {/* AI Tools */}
      <section className="mt-6">

        <h2 className="text-xl font-bold mb-4">
          ← AI Tools
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <ToolCard
            icon="✦"
            title="Smart Enhancement"
            description="Enhance quality, sharpen details."
          />

          <ToolCard
            icon="◎"
            title="Object Detection"
            description="Detect and label objects in your image."
          />

          <ToolCard
            icon="▧"
            title="Background Removal"
            description="Remove backgrounds automatically."
          />

          <ToolCard
            icon="▤"
            title="Image Enhancement"
            description="Improve quality and clarity."
          />

        </div>

      </section>


      {/* Categories */}
      <section className="mt-7">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            Explore by Category
          </h2>

          <button className="text-xs text-purple-600">
            View All Categories →
          </button>

        </div>


        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">

          <Category name="Nature" image="/images/nature2.png" />
          <Category name="Birds" image="/images/birds.png"/>
          <Category name="Leaves" image="/images/leaves.png"/>
          <Category name="Ducks" image="/images/ducks.png"/>
          <Category name="Portrait" image="/images/portrait2.png"/>
          <Category name="Animals" image="/images/animals.png"/>
          <Category name="Sunset" image="/images/sunset.png"/>

        </div>

      </section>


      {/* Trending */}
      <section className="mt-7">

        <h2 className="text-xl font-bold mb-4">
          Trending Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <TrendingCard
            title="AI Image Enhancement"
            description="Bring out the best in your images"
            image="/images/AIimageEnhancement.png"
          />

          <TrendingCard
            title="Background Removal"
            description="Remove backgrounds in seconds"
            image="/images/backgroundRemoval.png"
          />

          <TrendingCard
            title="AI Analysis"
            description="Get detailed insights about your images"
            image="/images/AIanalysis.png"
          />

        </div>

      </section>

    </div>
  );
}


/* Small Tool Card */
function ToolCard({ icon, title, description }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4">

      <div className="flex justify-between">

        <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded flex items-center justify-center">
          {icon}
        </div>

        <span>→</span>

      </div>

      <h3 className="text-xs font-semibold mt-3">
        {title}
      </h3>

      <p className="text-[9px] text-gray-500 mt-1">
        {description}
      </p>

    </div>
  );
}


/* Category */
function Category({ name, image }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">

      <img
        src={image}
        alt={name}
        className="h-15 w-full object-cover rounded mb-2"
      />

      <p className="text-[10px] font-semibold">
        {name}
      </p>

    </div>
  );
}


/* Trending */
function TrendingCard({ title, description, image }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">

      <img
        src={image}
        alt={title}
        className="h-28 w-full object-cover"
      />

      <div className="p-3">

        <h3 className="text-xs font-semibold">
          {title}
        </h3>

        <p className="text-[9px] text-gray-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}

export default AIAnalysis;