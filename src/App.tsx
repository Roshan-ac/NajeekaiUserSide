import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";
import Home from "./components/home";
import Navbar from "./components/Navbar";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import FreelancerDashboard from "./components/dashboard/FreelancerDashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import routes from "tempo-routes";

function App() {
  const user = getUser();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-background">
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
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <>
                  <Navbar />
                  <Login />
                </>
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <>
                  <Navbar />
                  <Signup />
                </>
              )
            }
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? (
                user?.role === "client" ? (
                  <ClientDashboard />
                ) : (
                  <FreelancerDashboard />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
