import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import PrivatePage from "./pages/PrivatePage";

const Unauthorized = () => <h3 style={{ textAlign: "center", marginTop: 40 }}>No autorizado</h3>;

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute /* role="Administrador" (si quieres forzar rol) */>
              <PrivatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
