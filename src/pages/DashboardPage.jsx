import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/DashBoard/SideBar";

export const DashboardPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111B21]">
      <Sidebar />
      <main className="flex-1 p-2 sm:p-4 md:p-6 md:ml-0 ml-16">
        <div className="bg-[#222E35] rounded-lg shadow-lg p-2 sm:p-4 md:p-6 min-h-[calc(100vh-3rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};