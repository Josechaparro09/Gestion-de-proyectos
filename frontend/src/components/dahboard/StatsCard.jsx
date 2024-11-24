export const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
      <div className={`rounded-lg shadow-sm p-5 bg-white border-l-4 ${color}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };