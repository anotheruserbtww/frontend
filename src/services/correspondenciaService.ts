// src/services/correspondenciaService.ts
import axios from 'axios';
import { storage } from '../api/axios'; // Importa el storage de tu axios config

const API_BASE_URL = 'http://localhost:5170/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token automáticamente - USANDO TU STORAGE
api.interceptors.request.use((config) => {
  const token = storage.get(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token agregado a la request:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No hay token disponible');
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚨 Error 401 - Redirigiendo al login');
      // Usa tu método de logout del AuthContext si es posible
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Interfaces
export interface Correspondencia {
  idCorrespondencia: string;
  unidadCodigo: string;
  torreNombre: string;
  tipoCorrespondencia: string;
  remitente: string;
  fechaRecepcion: string;
  estado: string;
  observacion: string;
  usuarioRegistro: string;
}

export interface CorrespondenciaFormData {
  idUnidad: string; 
  idTipoCorrespondencia: number;
  remitente: string;
  observacion: string;
}

export interface TipoCorrespondencia {
  idTipoCorrespondencia: number;
  nombre: string;
}

export interface Unidad {
  idUnidad: string;
  codigoCompleto: string;
}

export interface EntregaData {
  entregadoA: string;
}
export const correspondenciaService = {
  getCorrespondencias: async (estado?: string): Promise<Correspondencia[]> => {
    const params = estado ? { estado } : {};
    const response = await api.get('/correspondencia', { params });
    return response.data;
  },

  getTipos: async (): Promise<TipoCorrespondencia[]> => {
    const response = await api.get('/correspondencia/tipos');
    return response.data;
  },

  getUnidades: async (): Promise<Unidad[]> => {
    const response = await api.get('/correspondencia/unidades');
    return response.data;
  },

  crear: async (data: CorrespondenciaFormData) => {
    const response = await api.post('/correspondencia', data);
    return response.data;
  },

  notificar: async (id: string) => {
    const response = await api.put(`/correspondencia/${id}/notificar`);
    return response.data;
  },

  entregar: async (id: string, entregadoA: string) => {
    const data: EntregaData = { entregadoA };
    const response = await api.put(`/correspondencia/${id}/entregar`, data);
    return response.data;
  },

  eliminar: async (id: string) => {
    const response = await api.delete(`/correspondencia/${id}`);
    return response.data;
  }
};