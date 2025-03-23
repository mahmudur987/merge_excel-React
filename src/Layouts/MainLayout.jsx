import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className="bg-white">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default MainLayout;
