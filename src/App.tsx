import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CorrespondenciaList from './pages/Correspondencia/CorrespondenciaList';
import CorrespondenciaForm from './pages/Correspondencia/CorrespondenciaForm';


const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de prueba */}
      
        
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta principal - Dashboard */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Rutas de Correspondencia */}
        <Route path="/correspondencia" element={<ProtectedRoute><CorrespondenciaList /></ProtectedRoute>} />
        <Route path="/correspondencia/nueva" element={<ProtectedRoute><CorrespondenciaForm /></ProtectedRoute>} />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;