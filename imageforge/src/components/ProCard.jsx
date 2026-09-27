import { Link } from "react-router-dom";

function ProCard() {
  return (
    <div className="m-3 p-4 bg-purple-200 rounded-lg">

      <p className="text-xs font-bold text-purple-700">
        Pro Plan
      </p>

      <p className="text-[10px] text-gray-600 mt-1">
        Unlock more features
        <br />
        and higher limits.
      </p>

      <Link
        to="/dashboard/upgrade"
        className="inline-block mt-3 bg-purple-600 text-white text-[10px] px-4 py-2 rounded-md"
      >
        Upgrade
      </Link>

    </div>
  );
}

export default ProCard;