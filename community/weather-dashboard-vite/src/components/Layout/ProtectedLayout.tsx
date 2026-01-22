import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <Outlet />
    </div>
  );
}
