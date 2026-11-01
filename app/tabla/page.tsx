'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PartituraLink {
  id: string;
  titulo: string;
  autor?: string | null;
  instrumento?: string | null;
  enlace: string;
  createdAt: string;
}

export default function TablaPartiturasPage() {
  const [partituras, setPartituras] = useState<PartituraLink[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const [nuevaPartitura, setNuevaPartitura] = useState({
    titulo: '',
    autor: '',
    instrumento: '',
    enlace: '',
  });

  // Función para obtener las partituras desde la API
  const fetchPartituras = async () => {
    try {
      const res = await fetch('/api/partituras-links');
      const data = await res.json();
      if (res.ok) {
        setPartituras(data.partituras || []);
      }
    } catch (error) {
      console.error('Error al cargar partituras:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPartituras();
  }, []);

  // Función para asegurar que el enlace sea absoluto (evita rutas relativas como /youtube.com)
  const formatearEnlace = (url: string) => {
    if (!url) return '#';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Manejar el envío del formulario para guardar en la base de datos
  const handleSubirPartitura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPartitura.titulo || !nuevaPartitura.enlace) {
      toast.error('El título y el enlace son obligatorios');
      return;
    }

    setSubiendo(true);
    try {
      const res = await fetch('/api/partituras-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaPartitura),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el enlace');
      }

      toast.success('¡Partitura guardada exitosamente!');
      setNuevaPartitura({ titulo: '', autor: '', instrumento: '', enlace: '' });
      fetchPartituras();
    } catch (error: any) {
      console.error('Error detallado:', error);
      toast.error(error.message || 'No se pudo guardar la partitura');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Gestión de Partituras</h1>

      {/* Formulario de Registro */}
      <form onSubmit={handleSubirPartitura} className="bg-slate-800 p-6 rounded-xl space-y-4 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white">Registrar Nuevo Enlace de Partitura</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Título *</label>
            <input
              type="text"
              value={nuevaPartitura.titulo}
              onChange={(e) => setNuevaPartitura({ ...nuevaPartitura, titulo: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ej. Nocturno Op. 9 No. 2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Autor / Compositor</label>
            <input
              type="text"
              value={nuevaPartitura.autor}
              onChange={(e) => setNuevaPartitura({ ...nuevaPartitura, autor: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ej. Frédéric Chopin"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Instrumento</label>
            <input
              type="text"
              value={nuevaPartitura.instrumento}
              onChange={(e) => setNuevaPartitura({ ...nuevaPartitura, instrumento: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ej. Piano"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Enlace (URL) *</label>
            <input
              type="text"
              value={nuevaPartitura.enlace}
              onChange={(e) => setNuevaPartitura({ ...nuevaPartitura, enlace: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ej. youtube.com/... o drive.google.com/..."
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={subiendo}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded transition-colors disabled:opacity-50"
        >
          {subiendo ? 'Guardando...' : 'Registrar Enlace'}
        </button>
      </form>

      {/* Tabla de Resultados */}
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Partituras Registradas</h2>
        </div>
        {cargando ? (
          <p className="p-6 text-slate-400">Cargando partituras...</p>
        ) : partituras.length === 0 ? (
          <p className="p-6 text-slate-400">No hay partituras registradas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4">Título</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4">Instrumento</th>
                  <th className="p-4">Enlace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-200">
                {partituras.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium">{item.titulo}</td>
                    <td className="p-4 text-slate-400">{item.autor || 'N/D'}</td>
                    <td className="p-4 text-slate-400">{item.instrumento || 'N/D'}</td>
                    <td className="p-4">
                      <a
                        href={formatearEnlace(item.enlace)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Abrir Enlace ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}