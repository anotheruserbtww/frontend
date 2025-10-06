import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.username, form.password, form.remember);
      nav("/correspondencia");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Credenciales inválidas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-login flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8">
        
        {/* Tarjeta Fiery Ocean - Solo visible en desktop */}
        <div className="hidden md:block fiery-ocean-card">
          <div className="fiery-ocean-bg"></div>
          
          <div className="fiery-ocean-decoration fiery-ocean-circle-1"></div>
          <div className="fiery-ocean-decoration fiery-ocean-circle-2"></div>
          <div className="fiery-ocean-wave"></div>
          <div className="fiery-ocean-accent"></div>
          
          <div className="fiery-ocean-content">
            <div className="fiery-ocean-header">
              <h1 className="fiery-ocean-title">Fiery Ocean</h1>
              <p className="fiery-ocean-subtitle">ViviGest Pro</p>
            </div>
            
            <div className="fiery-ocean-footer">
              <div className="fiery-ocean-stat">
                <div className="fiery-ocean-stat-value">34.6K</div>
                <div className="fiery-ocean-stat-label">Usuarios</div>
              </div>
              
              <div className="fiery-ocean-stat">
                <div className="fiery-ocean-stat-value">99.7%</div>
                <div className="fiery-ocean-stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="card max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{color: 'white', fontSize: '24px'}}>📬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ViviGest</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestión</p>
          </div>

          <form onSubmit={onSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="text-gray-800 font-semibold block mb-2">
                Correo electrónico
              </label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                type="email"
                placeholder="admin@demo.com"
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-gray-800 font-semibold block mb-2">
                Contraseña
              </label>
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                type="password"
                required
                className="input"
              />
            </div>

            {/* Remember Me */}
            <div className="mb-6 flex items-center gap-2">
              <input 
                name="remember" 
                type="checkbox" 
                checked={form.remember} 
                onChange={onChange} 
                className="rounded"
              />
              <label className="text-gray-800 text-sm">
                Recordarme
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ 
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              <strong>Demo:</strong> admin@demo.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;