// app/partituras/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  PlayCircle, 
  Search, 
  ExternalLink, 
  Loader2 
} from 'lucide-react';

interface PartituraItem {
  id: string | number;
  title: string;
  author?: string;
  instrument: string;
  level?: string;
  type?: string;
  enlace?: string;
}

// Tipo estricto para los elementos que vienen de la API (en lugar de 'any')
interface ApiPartituraData {
  id?: string | number;
  titulo?: string;
  title?: string;
  autor?: string;
  instrumento?: string;
  instrument?: string;
  enlace?: string;
}

const partiturasMock: PartituraItem[] = [
  { id: 1, title: 'Escalas Mayores', author: 'Cátedra General', instrument: 'Piano', level: 'Principiante', type: 'PDF' },
  { id: 2, title: 'Estudio No. 1', author: 'Matteo Carcassi', instrument: 'Guitarra', level: 'Intermedio', type: 'PDF' },
  { id: 3, title: 'Concierto de Aranjuez', author: 'Joaquín Rodrigo', instrument: 'Guitarra', level: 'Avanzado', type: 'Audio + PDF' },
  { id: 4, title: 'Método Suzuki Vol. 1', author: 'Shinichi Suzuki', instrument: 'Violín', level: 'Principiante', type: 'PDF' },
];

export default function PartiturasPage() {
  const [partituras, setPartituras] = useState<PartituraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchPartituras();
  }, []);

  const fetchPartituras = async () => {
    try {
      const res = await fetch('/api/partituras-links');
      if (res.ok) {
        const data = await res.json();
        const apiItems: ApiPartituraData[] = data.partituras || data || [];

        if (apiItems.length > 0) {
          const mappedApiItems: PartituraItem[] = apiItems.map((item) => ({
            id: item.id || Date.now(),
            title: item.titulo || item.title || 'Sin título',
            author: item.autor || 'Compositor / Cátedra',
            instrument: item.instrumento || item.instrument || 'General',
            enlace: item.enlace,
            type: 'ENLACE / PDF',
          }));

          setPartituras([...mappedApiItems, ...partiturasMock]);
        } else {
          setPartituras(partiturasMock);
        }
      } else {
        setPartituras(partiturasMock);
      }
    } catch {
      setPartituras(partiturasMock);
    } finally {
      setLoading(false);
    }
  };

  const partiturasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return partituras.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      item.instrument.toLowerCase().includes(q)
    );
  }, [partituras, busqueda]);

  return (
    <DashboardLayout 
      title="Biblioteca Musical" 
      subtitle="Accede a tus partituras, audios de práctica y material de estudio institucional."
    >
      <div className="space-y-8">
        
        {/* BARRA DE BÚSQUEDA Y ESTADÍSTICAS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/40">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar partitura, autor o instrumento..."
              className="bg-white/50 border-white/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="text-xs font-bold text-foreground/70 uppercase tracking-wider px-4">
            Mostrando {partiturasFiltradas.length} obras disponibles
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium text-foreground/70">Cargando partituras y repertorio...</p>
          </div>
        ) : partiturasFiltradas.length === 0 ? (
          <div className="text-center p-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/40 text-foreground/60 text-sm font-medium">
            No se encontraron partituras que coincidan con &quot;{busqueda}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partiturasFiltradas.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden group flex flex-col justify-between"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                        {item.type || 'RECURSO'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1 leading-tight">{item.title}</h3>
                    <p className="text-xs font-medium text-foreground/60 mb-1">
                      {item.author || 'Autor no especificado'}
                    </p>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-bold text-primary bg-white/40 px-2.5 py-0.5 rounded-md border border-white/50">
                        {item.instrument}
                      </span>
                      {item.level && (
                        <span className="text-xs text-foreground/60">
                          • {item.level}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {item.enlace ? (
                      <Button 
                        asChild
                        className="flex-1 rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                      >
                        <a href={item.enlace} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" /> Abrir Recurso
                        </a>
                      </Button>
                    ) : (
                      <Button className="flex-1 rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                        <Download className="w-4 h-4" /> Descargar
                      </Button>
                    )}

                    {item.type?.includes('Audio') && (
                      <Button variant="outline" size="icon" className="rounded-xl bg-white/50 border-white/60 hover:bg-white/80">
                        <PlayCircle className="w-5 h-5 text-primary" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}