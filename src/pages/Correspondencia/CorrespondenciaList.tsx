import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { correspondenciaService } from '../../services/correspondenciaService';
import type { Correspondencia } from '../../services/correspondenciaService';

const CorrespondenciaList: React.FC = () => {
  const navigate = useNavigate();
  const [correspondencias, setCorrespondencias] = useState<Correspondencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  const cargarCorrespondencias = async () => {
    try {
      setLoading(true);
      const data = await correspondenciaService.getCorrespondencias(filtroEstado);
      setCorrespondencias(data);
    } catch (error) {
      console.error('Error cargando correspondencias:', error);
      alert('Error al cargar las correspondencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCorrespondencias();
  }, [filtroEstado]);

  const handleNotificar = async (id: string) => {
    if (window.confirm('¿Notificar al residente?')) {
      try {
        await correspondenciaService.notificar(id);
        alert('Residente notificado exitosamente');
        cargarCorrespondencias();
      } catch (error) {
        alert('Error al notificar');
      }
    }
  };

  const handleEntregar = async (id: string) => {
    const entregadoA = prompt('¿Nombre de quien retira?');
    if (entregadoA) {
      try {
        await correspondenciaService.entregar(id, entregadoA);
        alert('Correspondencia marcada como entregada');
        cargarCorrespondencias();
      } catch (error) {
        alert('Error al entregar');
      }
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Eliminar esta correspondencia?')) {
      try {
        await correspondenciaService.eliminar(id);
        alert('Correspondencia eliminada');
        cargarCorrespondencias();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'estado-pendiente';
      case 'Notificado': return 'estado-notificado';
      case 'Entregado': return 'estado-entregado';
      default: return 'estado-default';
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando correspondencias...</p>
    </div>
  );

  return (
    <div className="correspondencia-list-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <div className="logo">
                <span>📬</span>
              </div>
              <div>
                <h1>Gestión de Correspondencia</h1>
                <p>Administra y controla toda la correspondencia del edificio</p>
              </div>
            </div>
            <button 
              className="nuevo-btn"
              onClick={() => navigate('/correspondencia/nueva')}
            >
              <span className="btn-icon">+</span>
              Nueva Correspondencia
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-section">
          <div className="filtro-group">
            <label>Filtrar por estado:</label>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Notificado">Notificado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <div className="stats">
            <span className="stat-item">Total: {correspondencias.length}</span>
          </div>
        </div>

        {/* Lista */}
        <div className="correspondencia-grid">
          {correspondencias.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No hay correspondencia registrada</h3>
              <p>Comienza registrando la primera correspondencia</p>
              <button 
                onClick={() => navigate('/correspondencia/nueva')}
                className="nuevo-btn primary"
              >
                Registrar primera correspondencia
              </button>
            </div>
          ) : (
            correspondencias.map((corresp) => (
              <div key={corresp.idCorrespondencia} className="correspondencia-card">
                <div className="card-header">
                  <div className="unidad-info">
                    <h3>🏢 {corresp.torreNombre} - {corresp.unidadCodigo}</h3>
                    <span className={`estado-badge ${getEstadoColor(corresp.estado)}`}>
                      {corresp.estado}
                    </span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">📦 Tipo:</span>
                      <span className="info-value">{corresp.tipoCorrespondencia}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">👤 Remitente:</span>
                      <span className="info-value">{corresp.remitente}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📅 Fecha:</span>
                      <span className="info-value">
                        {new Date(corresp.fechaRecepcion).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">👥 Registrado por:</span>
                      <span className="info-value">{corresp.usuarioRegistro}</span>
                    </div>
                  </div>

                  {corresp.observacion && (
                    <div className="observaciones">
                      <span className="info-label">📝 Observaciones:</span>
                      <p>{corresp.observacion}</p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="card-actions">
                  {corresp.estado === 'Pendiente' && (
                    <button 
                      onClick={() => handleNotificar(corresp.idCorrespondencia)}
                      className="action-btn notificar-btn"
                    >
                      <span className="btn-icon">📢</span>
                      Notificar
                    </button>
                  )}
                  
                  {corresp.estado === 'Notificado' && (
                    <button 
                      onClick={() => handleEntregar(corresp.idCorrespondencia)}
                      className="action-btn entregar-btn"
                    >
                      <span className="btn-icon">✅</span>
                      Entregar
                    </button>
                  )}

                  <button 
                    onClick={() => handleEliminar(corresp.idCorrespondencia)}
                    className="action-btn eliminar-btn"
                  >
                    <span className="btn-icon">🗑️</span>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .correspondencia-list-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .page-header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .header-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .logo span {
          color: white;
          font-size: 24px;
        }

        .title-section h1 {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #1e40af, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .title-section p {
          color: #64748b;
          margin: 4px 0 0 0;
          font-size: 14px;
        }

        .nuevo-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .nuevo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-icon {
          font-size: 16px;
        }

        /* Filtros */
        .filtros-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        @media (min-width: 640px) {
          .filtros-section {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .filtro-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filtro-group label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .filtro-select {
          border: 2px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.3s ease;
        }

        .filtro-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        /* Grid de correspondencias */
        .correspondencia-grid {
          display: grid;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .correspondencia-grid {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }
        }

        /* Card */
        .correspondencia-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .correspondencia-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          margin-bottom: 16px;
        }

        .unidad-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .unidad-info h3 {
          margin: 0;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
        }

        /* Estados */
        .estado-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          white-space: nowrap;
        }

        .estado-pendiente {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .estado-notificado {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .estado-entregado {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .estado-default {
          background: #6b7280;
        }

        /* Card Content */
        .card-content {
          margin-bottom: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        @media (min-width: 480px) {
          .info-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .info-value {
          font-size: 14px;
          color: #1e293b;
          font-weight: 600;
        }

        .observaciones {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .observaciones p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.4;
        }

        /* Botones de acción */
        .card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 100px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .notificar-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .entregar-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .eliminar-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          grid-column: 1 / -1;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #1e293b;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .empty-state p {
          color: #64748b;
          margin: 0 0 20px 0;
        }

        .nuevo-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CorrespondenciaList;