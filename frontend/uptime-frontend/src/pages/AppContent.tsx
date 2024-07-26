import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./navbar";
import SignUp from './SignUp';
import SignIn from './SignIn';
import FreeDashboard from './FreeDashboard';  // Import FreeDashboard
import { FaArrowLeft } from 'react-icons/fa';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import HeroSection from "./main";
import NewScreenComponent from "@/components/NewScreenComponent";
import { AuthProvider } from "@/AuthContext";
import ProtectedRoute from "@/ProtectedRoutes";
import PaidDashboard from "./PaidDashboard";

function AppContent() {
  const location = useLocation();

  // Define the routes where the navbar should be hidden
  const hideNavbarRoutes = ["/signup", "/signin", "/freeDashboard"];

  return (
    <AuthProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative min-h-screen">
     

        {/* Display Back to Home Page link on specific routes */}
        {hideNavbarRoutes.includes(location.pathname) && (
          <div className="absolute top-0 left-0 p-4">
            <Link
              to="/"
              className="flex items-center text-white text-sm hover:text-gray-400"
            >
              <FaArrowLeft className="mr-1" />
              Back to Home Page
            </Link>
          </div>
        )}

        {/* Main content routes */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<HeroSection />} /> {/* Add this route */}
            <Route path="/new-screen" element={<ProtectedRoute><NewScreenComponent /></ProtectedRoute>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/freeDashboard" element={<FreeDashboard />} />
            <Route
            path="/pa"
            element={
              <ProtectedRoute>
                <PaidDashboard />
              </ProtectedRoute>
            }
          />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default AppContent;
