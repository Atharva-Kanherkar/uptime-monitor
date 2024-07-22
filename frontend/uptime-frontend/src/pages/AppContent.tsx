import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./navbar";
import SignUp from './SignUp';
import SignIn from './SignIn';
import FreeDashboard from './FreeDashboard';  // Import FreeDashboard
import { FaArrowLeft } from 'react-icons/fa';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import HeroSection from "./main";

function AppContent() {
  const location = useLocation();

  // Define the routes where the navbar should be hidden
  const hideNavbarRoutes = ["/signup", "/signin", "/freeDashboard"];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="mt-2">
        {!hideNavbarRoutes.includes(location.pathname) ? (
          <Navbar />
        ) : (
          location.pathname === "/freeDashboard" && (
            <div className="flex justify-start p-4">
              <Link
                to="/"
                className="flex items-center text-white text-sm hover:text-gray-400 mt-2 ml-2"
              >
                <FaArrowLeft className="mr-1" />
                Back to Home Page
              </Link>
            </div>
          )
        )}
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/freeDashboard" element={<FreeDashboard />} /> {/* Add this route */}
          {/* Add other routes here */}
        </Routes>
      </div>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <div>
          <HeroSection />
        </div>
      )}
    </ThemeProvider>
  );
}

export default AppContent;
