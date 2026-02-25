import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/doctors", label: "Manage Doctors", icon: "👨‍⚕️" },
  ];

  const doctorLinks = [
    { to: "/doctor", label: "Dashboard", icon: "📊" },
    { to: "/doctor/appointments", label: "My Appointments", icon: "📅" },
  ];

  const patientLinks = [
    { to: "/patient", label: "Dashboard", icon: "📊" },
    { to: "/patient/doctors", label: "Find Doctors", icon: "🔍" },
    { to: "/patient/appointments", label: "My Appointments", icon: "📅" },
    { to: "/patient/medical-history", label: "Medical History", icon: "📋" },
  ];

  let links = [];
  if (user?.role === "admin") links = adminLinks;
  else if (user?.role === "doctor") links = doctorLinks;
  else if (user?.role === "patient") links = patientLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen pt-16">
      {" "}
      {/* Changed top-16 to top-0 and added pt-16 */}
      <nav className="mt-5 px-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded-md mb-1 ${
                isActive
                  ? "bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
