import Sidebar from "../components/admin/Sidebar";

export default function AdminDashboard() {
  const admin = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin.name || "Admin"}
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your portfolio content from here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="Projects"
            value="0"
          />

          <DashboardCard
            title="Skills"
            value="0"
          />

          <DashboardCard
            title="Achievements"
            value="0"
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Portfolio CMS
          </h2>

          <p className="mt-2 text-gray-500">
            Use the sidebar to manage your portfolio
            information.
          </p>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}