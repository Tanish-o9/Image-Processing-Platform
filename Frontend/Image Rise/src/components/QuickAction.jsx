import { Link } from "react-router-dom";

function QuickAction({ title, description, icon, link }) {
  return (
    <Link
      to={link}
      className="bg-white border border-gray-100 rounded-lg p-4 text-center hover:shadow-sm"
    >

      <div className="w-9 h-9 mx-auto bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-xs font-semibold mt-3">
        {title}
      </h3>

      <p className="text-[9px] text-gray-500 mt-1">
        {description}
      </p>

    </Link>
  );
}

export default QuickAction;