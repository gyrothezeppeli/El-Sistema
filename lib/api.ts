// lib/api.ts
'use client'

// Definir tipos para las respuestas del dashboard
export interface DashboardStats {
  totalRegistros: number;
  registrosHoy: number;
  registrosSemana: number;
  registrosMes: number;
  visitantesActivos: number;
  equiposPrestados: number;
  // Agregar más campos según lo que devuelva tu API
  [key: string]: number | string | boolean | undefined; // Para campos adicionales dinámicos
}

export interface Registro {
  foto: File | string | null; // Puede ser un archivo, una URL o null
  id: string
  nombres: string
  apellidos: string
  cedula: string
  horaEntrada: string
  horaSalida: string
  motivo: string
  direccion: string
  nombrePersonaAutoriza: string
  piso: string
  comentarios: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: string
  // agregar más campos según necesites
}

export interface Invitado {
  id: string
  nombres: string
  apellidos: string
  cedula: string
  // agregar más campos según necesites
}

export interface Equipo {
  id: string
  nombre: string
  serial: string
  // agregar más campos según necesites
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Función helper para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }
    
    throw new Error(errorMessage)
  }
  
  if (response.status === 204) return null // No content
  return response.json()
}

// Headers comunes
const getHeaders = () => ({
  'Content-Type': 'application/json',
  // Puedes agregar headers de autenticación aquí si es necesario
  // 'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// REGISTROS - VISITAS
export const getRegistros = async (): Promise<Registro[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener registros:', error)
    throw error
  }
}

export const getRegistroById = async (id: string): Promise<Registro> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener registro:', error)
    throw error
  }
}

export const createRegistro = async (registroData: Omit<Registro, 'id'>): Promise<Registro> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(registroData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al crear registro:', error)
    throw error
  }
}

export const updateRegistro = async (id: string, registroData: Partial<Registro>): Promise<Registro> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(registroData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al actualizar registro:', error)
    throw error
  }
}

export const deleteRegistro = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error al eliminar registro:', error)
    throw error
  }
}

// USUARIOS
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

export const createUsuario = async (usuarioData: Omit<Usuario, 'id'>): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(usuarioData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    throw error
  }
}

// INVITADOS
export const getInvitados = async (): Promise<Invitado[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/invitados`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener invitados:', error)
    throw error
  }
}

export const createInvitado = async (invitadoData: Omit<Invitado, 'id'>): Promise<Invitado> => {
  try {
    const response = await fetch(`${API_BASE_URL}/invitados`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(invitadoData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al crear invitado:', error)
    throw error
  }
}

// EQUIPOS
export const getEquipos = async (): Promise<Equipo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    throw error
  }
}

export const createEquipo = async (equipoData: Omit<Equipo, 'id'>): Promise<Equipo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(equipoData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al crear equipo:', error)
    throw error
  }
}

// DASHBOARD - ESTADÍSTICAS
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener stats del dashboard:', error)
    throw error
  }
}

// BÚSQUEDAS Y FILTROS
export const searchRegistros = async (filters: {
  cedula?: string
  nombres?: string
  fecha?: string
}): Promise<Registro[]> => {
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const response = await fetch(`${API_BASE_URL}/registros/search?${params}`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al buscar registros:', error)
    throw error
  }
}

// Función para subir archivos (fotos)
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
      // No Content-Type header for FormData, browser sets it automatically
    })
    
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al subir archivo:', error)
    throw error
  }
}

// Función para obtener registros por fecha
export const getRegistrosByDate = async (fecha: string): Promise<Registro[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registros/fecha/${fecha}`, {
      headers: getHeaders()
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener registros por fecha:', error)
    throw error
  }
}