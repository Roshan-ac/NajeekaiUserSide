import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";
import Home from "./components/home";
import Navbar from "./components/Navbar";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import FreelancerDashboard from "./components/dashboard/FreelancerDashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import RequestService from "./components/dashboard/RequestService";
import NotFound from "./components/NotFound";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const user = getUser();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ThemeProvider defaultTheme="light">
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
              path="/dashboard/*"
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

            {/* Request Service Route */}
            <Route
              path="/request-service"
              element={
                isAuthenticated() ? (
                  user?.role === "client" ? (
                    <RequestService />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
