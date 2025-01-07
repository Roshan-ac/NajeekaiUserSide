import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import Home from "./components/home";
import Navbar from "./components/Navbar";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Messages from "./components/dashboard/Messages";
import Notifications from "./components/dashboard/Notifications";
import Profile from "./components/dashboard/Profile";
import Search from "./components/dashboard/Search";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-background">
        {/* Public Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Navbar />
                <Signup />
              </>
            }
          />

          {/* Protected Dashboard Routes - No Navbar */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? (
                <ClientDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/search"
            element={
              isAuthenticated() ? <Search /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              isAuthenticated() ? (
                <Messages />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              isAuthenticated() ? (
                <Notifications />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
