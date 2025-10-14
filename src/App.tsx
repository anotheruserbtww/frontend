import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./pages/Login";

// Layouts
import AdminLayout from "./components/layouts/AdminLayout";
import GuardaLayout from "./components/layouts/GuardaLayout";

// Páginas de Admin
import Dashboard from "./pages/admin/Dashboard";
import CorrespondenciaList from './pages/admin/correspondencia/CorrespondenciaList'; // ← Aquí está
import CorrespondenciaForm from './pages/admin/correspondencia/CorrespondenciaForm'; // ← Aquí está
import Residentes from "./pages/admin/Residente";
import Unidades from "./pages/admin/Unidades";
import Reportes from "./pages/admin/Reportes";

// Páginas de Guarda
import DashboardGuarda from "./pages/guarda/DashboardGuarda";
import CorrespondenciaPendiente from "./pages/guarda/CorrespondenciaPendiente";
import RegistroCorrespondencia from "./pages/guarda/RegistroCorrespondencia";
import ControlVisitantes from "./pages/guarda/ControlVisitantes";

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas de ADMIN */}
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="correspondencia" element={<CorrespondenciaList />} />
          <Route path="correspondencia/nueva" element={<CorrespondenciaForm />} />
          <Route path="correspondencia/editar/:id" element={<CorrespondenciaForm />} />
          <Route path="residentes" element={<Residentes />} />
          <Route path="unidades" element={<Unidades />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rutas de GUARDA */}
        <Route 
          path="/guarda/*" 
          element={
            <PrivateRoute>
              <GuardaLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardGuarda />} />
          <Route path="correspondencia" element={<CorrespondenciaPendiente />} />
          <Route path="correspondencia/registrar" element={<RegistroCorrespondencia />} />
          <Route path="visitantes" element={<ControlVisitantes />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rutas legacy - Redirigir a admin */}
        <Route 
          path="/correspondencia" 
          element={
            <PrivateRoute>
              <Navigate to="/admin/correspondencia" replace />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/correspondencia/nueva" 
          element={
            <PrivateRoute>
              <Navigate to="/admin/correspondencia/nueva" replace />
            </PrivateRoute>
          } 
        />

        {/* Ruta por defecto - Redirige al admin dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/admin/dashboard" replace />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta por defecto para no autenticados */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;