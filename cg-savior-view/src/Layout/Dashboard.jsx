import { FaHome, FaSearch, FaUsers, FaPlusCircle } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import AnimatedLogo from "../components/AnimatedLogo/AnimatedLogo";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import useAdmin from "../hooks/useAdmin";
import useFaculty from "../hooks/useFaculty";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
   const { user, loading: authLoading } = useAuth();
  const [isAdmin, adminLoading] = useAdmin();
  const [isFaculty, facultyLoading] = useFaculty();

   // Show loading until authentication and both roles are determined
  if (authLoading || adminLoading || facultyLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Checking access...
      </div>
    );
  }

  // If no user (not authenticated), don't render dashboard
  if (!user) {
    return null; // or redirect to login
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-800 hover:text-blue-400"
    }`;

  const renderSidebarLinks = () => {
    if (isAdmin) {
      return (
        <>
          <li>
            <NavLink to="/dashboard" end className={navClass}>
              <FaHome />
              Admin Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/addcourse" className={navClass}>
              ➕ Add Course
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/users" className={navClass}>
              <FaUsers />
              All Users
            </NavLink>
          </li>
        </>
      );
    } else if (isFaculty) {
      return (
        <>
          <li>
            <NavLink to="/dashboard" end className={navClass}>
              <FaHome />
              Faculty Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/addclassroom" className={navClass}>
              ➕ Create classroom
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myclasses" className={navClass}>
              📘 My Classrooms
            </NavLink>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <NavLink to="/dashboard" end className={navClass}>
              <FaHome />
              User Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/bookmarks" className={navClass}>
              📌 My Bookmarks
            </NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 backdrop-blur-lg bg-black/30 border-r border-gray-700 flex flex-col">
        <div className="flex my-8 ml-10">
          <AnimatedLogo />
          <ThemeToggle />
        </div>

        <ul className="menu flex-1 px-4 space-y-1">
          {renderSidebarLinks()}

          <div className="divider before:bg-gray-700 after:bg-gray-700"></div>

          {/* Common links for all roles */}
          <li>
            <NavLink to="/" className={navClass}>
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/courses" className={navClass}>
              <FaSearch /> Courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/addresource" className={navClass}>
              <FaPlusCircle /> Add Resources
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/contact" className={navClass}>
              ✉️ Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/dates" className={navClass}>
              🗓️ Academic Dates
            </NavLink>
          </li>
        </ul>

        <div className="text-center text-xs p-4 text-gray-500">
          © {new Date().getFullYear()} CG Savior
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;