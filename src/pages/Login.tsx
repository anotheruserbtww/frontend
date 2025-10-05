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
      nav("/Dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Credenciales inválidas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "64px auto", fontFamily: "system-ui, sans-serif" }}>
      <h2>Ingresar</h2>
      <form onSubmit={onSubmit}>
        <label>
          Usuario (correo)
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            type="email"
            placeholder="admin@demo.com"
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
          />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
          />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input name="remember" type="checkbox" checked={form.remember} onChange={onChange} />
          Recordarme (usa localStorage)
        </label>

        {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, cursor: "pointer" }}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
