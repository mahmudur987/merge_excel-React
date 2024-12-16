import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className="bg-fuchsia-500">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default MainLayout;
