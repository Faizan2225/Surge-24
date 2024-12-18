import SearchComponent from "../components/Layout/Search";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-semibold">Orders Today</h2>
            <p className="text-2xl font-bold">45</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-md">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#12345</td>
                <td>John Doe</td>
                <td>Paid</td>
                <td>2024-12-17</td>
              </tr>
              <tr>
                <td>#12346</td>
                <td>Jane Smith</td>
                <td>Pending</td>
                <td>2024-12-16</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
