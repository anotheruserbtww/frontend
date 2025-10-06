import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { correspondenciaService } from '../../services/correspondenciaService';
import type { CorrespondenciaFormData, TipoCorrespondencia, Unidad } from '../../services/correspondenciaService';

const CorrespondenciaForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tipos, setTipos] = useState<TipoCorrespondencia[]>([]);
    const [unidades, setUnidades] = useState<Unidad[]>([]);

    const [formData, setFormData] = useState<CorrespondenciaFormData>({
        idUnidad: '',
        idTipoCorrespondencia: 0,
        remitente: '',
        observacion: ''
    });

    // Cargar tipos y unidades al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [tiposData, unidadesData] = await Promise.all([
                    correspondenciaService.getTipos(),
                    correspondenciaService.getUnidades()
                ]);

                setTipos(tiposData);
                setUnidades(unidadesData);

                if (tiposData.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        idTipoCorrespondencia: tiposData[0].idTipoCorrespondencia
                    }));
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
                alert('Error al cargar los datos necesarios');
            }
        };

        cargarDatos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idUnidad || formData.idUnidad === '' || !formData.remitente.trim()) {
            alert('Por favor selecciona una unidad y completa el remitente');
            return;
        }

        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (!guidRegex.test(formData.idUnidad)) {
            alert('Por favor selecciona una unidad válida');
            return;
        }

        setLoading(true);
        try {
            await correspondenciaService.crear(formData);
            alert('✅ Correspondencia registrada exitosamente!');
            navigate('/correspondencia');
        } catch (error: any) {
            console.error('❌ Error creando correspondencia:', error);
            if (error.response?.data) {
                alert(error.response.data.message || 'Error al registrar correspondencia');
            } else if (error.code === 'ERR_NETWORK') {
                alert('Error de conexión con el servidor');
            } else {
                alert('Error inesperado al registrar correspondencia');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idTipoCorrespondencia' ? parseInt(value) : value
        }));
    };

    return (
        <div className="correspondencia-form-container">
            <div className="form-wrapper">
                {/* Header */}
                <div className="form-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <div className="logo">
                                <span>📬</span>
                            </div>
                            <div className="title-section">
                                <h1>Registrar Correspondencia</h1>
                                <p>Complete los datos del nuevo registro</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/correspondencia')}
                            className="back-button"
                        >
                            <span>←</span>
                            Volver a la Lista
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="correspondencia-form">
                    {/* Encabezado del formulario */}
                    <div className="form-title-section">
                        <h2>
                            <div className="title-icon">📋</div>
                            Información de la Correspondencia
                        </h2>
                    </div>

                    <div className="form-content">
                        {/* Grid de campos */}
                        <div className="form-grid">
                            {/* Unidad */}
                            <div className="form-field">
                                <label className="field-label">
                                    <div className="field-icon">🏢</div>
                                    Unidad Destino *
                                </label>
                                <select
                                    name="idUnidad"
                                    value={formData.idUnidad}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Selecciona una unidad</option>
                                    {unidades.map((unidad) => (
                                        <option key={unidad.idUnidad} value={unidad.idUnidad}>
                                            {unidad.codigoCompleto}
                                        </option>
                                    ))}
                                </select>
                                {unidades.length === 0 && (
                                    <p className="error-message">
                                        ⚠️ No hay unidades disponibles
                                    </p>
                                )}
                            </div>

                            {/* Tipo de Correspondencia */}
                            <div className="form-field">
                                <label className="field-label">
                                    <div className="field-icon">📦</div>
                                    Tipo de Correspondencia *
                                </label>
                                <select
                                    name="idTipoCorrespondencia"
                                    value={formData.idTipoCorrespondencia}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    {tipos.map((tipo) => (
                                        <option key={tipo.idTipoCorrespondencia} value={tipo.idTipoCorrespondencia}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Remitente */}
                            <div className="form-field full-width">
                                <label className="field-label">
                                    <div className="field-icon">👤</div>
                                    Remitente *
                                </label>
                                <input
                                    type="text"
                                    name="remitente"
                                    value={formData.remitente}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Servientrega, DHL, Familiar, Empresa..."
                                    className="form-input"
                                />
                            </div>

                            {/* Observaciones */}
                            <div className="form-field full-width">
                                <label className="field-label">
                                    <div className="field-icon">📝</div>
                                    Observaciones
                                </label>
                                <textarea
                                    name="observacion"
                                    value={formData.observacion}
                                    onChange={handleChange}
                                    placeholder="Descripción del paquete, instrucciones especiales, detalles adicionales..."
                                    rows={4}
                                    className="form-textarea"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="button-group">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`submit-button ${loading ? 'loading' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">✅</span>
                                        Registrar Correspondencia
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/correspondencia')}
                                className="cancel-button"
                            >
                                <span className="button-icon">❌</span>
                                Cancelar
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="form-footer">
                        <p>💡 Todos los campos marcados con * son obligatorios</p>
                    </div>
                </form>

                {/* Información del sistema */}
                <div className="debug-info">
                    <h3>🔍 Información del Sistema</h3>
                    <div className="debug-content">
                        <p>Unidades cargadas: {unidades.length}</p>
                        <p>Tipos cargados: {tipos.length}</p>
                        <p>ID Unidad seleccionada: {formData.idUnidad || 'Ninguna'}</p>
                        <p>Estado: {loading ? 'Registrando...' : 'Listo'}</p>
                    </div>
                </div>
            </div>

            <style>{`
                .correspondencia-form-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .form-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .form-header {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 30px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    border: 1px solid #dbeafe;
                }

                .header-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .logo-section {
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
                    color: #6b7280;
                    margin: 4px 0 0 0;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    color: #374151;
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: 1px solid #d1d5db;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .back-button:hover {
                    border-color: #3b82f6;
                    background: #f8fafc;
                }

                .correspondencia-form {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    border: 1px solid #dbeafe;
                    overflow: hidden;
                    margin-bottom: 24px;
                }

                .form-title-section {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    padding: 20px;
                }

                .form-title-section h2 {
                    color: white;
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .title-icon {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px;
                    border-radius: 8px;
                }

                .form-content {
                    padding: 32px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                }

                @media (min-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    align-items: start;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                }

                .form-field {
                    margin-bottom: 20px;
                }

                .full-width {
                    grid-column: 1 / -1;
                }

                .field-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #374151;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .field-icon {
                    background: #dbeafe;
                    padding: 4px 6px;
                    border-radius: 6px;
                    font-size: 12px;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    width: 100%;
                    border: 2px solid #e5e7eb;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    background: white;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 24px;
                }

                @media (min-width: 480px) {
                    .button-group {
                        flex-direction: row;
                    }
                }

                .submit-button,
                .cancel-button {
                    flex: 1;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    border: none;
                }

                .submit-button {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                }

                .submit-button:hover:not(.loading) {
                    background: linear-gradient(135deg, #2563eb, #7c3aed);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }

                .submit-button.loading {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .cancel-button {
                    background: white;
                    color: #374151;
                    border: 2px solid #d1d5db;
                }

                .cancel-button:hover {
                    border-color: #ef4444;
                    background: #fef2f2;
                    color: #dc2626;
                }

                .button-icon {
                    font-size: 16px;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .form-footer {
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    padding: 16px;
                    text-align: center;
                }

                .form-footer p {
                    color: #6b7280;
                    font-size: 12px;
                    margin: 0;
                }

                .debug-info {
                    background: #fefce8;
                    border: 1px solid #fef08a;
                    padding: 16px;
                    border-radius: 12px;
                }

                .debug-info h3 {
                    color: #92400e;
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                }

                .debug-content {
                    color: #92400e;
                    font-size: 12px;
                }

                .debug-content p {
                    margin: 2px 0;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CorrespondenciaForm;