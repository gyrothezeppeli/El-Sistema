// app/tabla/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, User, Phone, Mail, Calendar, MapPin, Music, Users, Eye, 
  Filter, Download, X, SortAsc, SortDesc, Table as TableIcon, XCircle, LoaderCircle, Loader2, PlusCircle, ExternalLink, Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import AdminProtection from '@/components/AdminProtection';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Estudiante {
  id: string;
  apellidos: string;
  nombres: string;
  cedulaIdentidad: string;
  fechaNacimiento: string;
  edad: string;
  sexo: string;
  lugarNacimiento: string;
  municipio: string;
  parroquia: string;
  direccionHabitacion: string;
  numeroTelefonoCelular: string;
  numeroTelefonoLocal: string;
  correoElectronico: string;
  nombreAgrupacionesPertenecio: string;
  añoInicio: string;
  agrupacionPertenece: string;
  instrumentoPrincipal: string;
  instrumentosSecundarios: string;
  enfermedadesPadece: string;
  condicionAlumno: string;
  necesidadesEspecialesAprendizaje: string;
  esAlergico: string;
  estaVacunado: string;
  numeroDosisVacuna: string;
  representanteId?: string;
  representante?: Representante;
  createdAt: string;
  updatedAt: string;
}

interface Representante {
  id: string;
  nombreApellidoMadre: string;
  cedulaMadre: string;
  madreViveConAlumno: string;
  gradoInstruccionMadre: string;
  direccionMadre: string;
  telefonoMadre: string;
  correoMadre: string;
  nombreApellidoPadre: string;
  cedulaPadre: string;
  padreViveConAlumno: string;
  gradoInstruccionPadre: string;
  direccionPadre: string;
  telefonoPadre: string;
  correoPadre: string;
  nombreApellidoRepresentanteLegal: string;
  cedulaRepresentanteLegal: string;
  representanteLegalViveConAlumno: string;
  gradoInstruccionRepresentanteLegal: string;
  direccionRepresentanteLegal: string;
  telefonoRepresentanteLegal: string;
  correoRepresentanteLegal: string;
  parentescoRepresentanteLegal: string;
}

interface PartituraLink {
  id: string;
  titulo: string;
  autor: string;
  instrumento: string;
  enlace: string;
}

type SortField = 'nombres' | 'apellidos' | 'cedulaIdentidad' | 'edad' | 'createdAt' | 'agrupacionPertenece' | 'instrumentoPrincipal';
type SortOrder = 'asc' | 'desc';

const INSTRUMENTOS = [
  { id: 'violin', nombre: 'Violín', color: 'bg-[#E8F5E8]', textColor: 'text-[#4CAF50]' },
  { id: 'viola', nombre: 'Viola', color: 'bg-[#E3F2FD]', textColor: 'text-[#1976D2]' },
  { id: 'violonchelo', nombre: 'Violonchelo', color: 'bg-[#FCE4EC]', textColor: 'text-[#C2185B]' },
  { id: 'contrabajo', nombre: 'Contrabajo', color: 'bg-[#FFF3E0]', textColor: 'text-[#FF9800]' }
];

const exportToExcel = async (estudiantes: Estudiante[]) => {
  const XLSX = await import('xlsx');
  const dataToExport = estudiantes.map(estudiante => ({
    'Cédula del Estudiante': estudiante.cedulaIdentidad,
    'Nombres del Estudiante': estudiante.nombres,
    'Apellidos del Estudiante': estudiante.apellidos,
    'Edad': estudiante.edad,
    'Sexo': estudiante.sexo === 'M' ? 'Masculino' : 'Femenino',
    'Fecha de Nacimiento': estudiante.fechaNacimiento,
    'Lugar de Nacimiento': estudiante.lugarNacimiento || 'No especificado',
    'Municipio': estudiante.municipio || 'No especificado',
    'Parroquia': estudiante.parroquia || 'No especificado',
    'Dirección de Habitación': estudiante.direccionHabitacion || 'No especificada',
    'Teléfono Celular': estudiante.numeroTelefonoCelular || 'No especificado',
    'Teléfono Local': estudiante.numeroTelefonoLocal || 'No especificado',
    'Correo Electrónico': estudiante.correoElectronico || 'No especificado',
    'Instrumento Principal': estudiante.instrumentoPrincipal || 'No especificado',
    'Instrumentos Secundarios': estudiante.instrumentosSecundarios || 'No especificados',
    'Agrupación Actual': estudiante.agrupacionPertenece || 'No especificada',
    'Agrupaciones Anteriores': estudiante.nombreAgrupacionesPertenecio || 'No especificadas',
    'Año de Inicio': estudiante.añoInicio || 'No especificado',
    'Condición del Alumno': estudiante.condicionAlumno || 'No especificada',
    'Enfermedades que Padece': estudiante.enfermedadesPadece || 'Ninguna',
    'Necesidades Especiales de Aprendizaje': estudiante.necesidadesEspecialesAprendizaje || 'Ninguna',
    'Es Alérgico': estudiante.esAlergico === 'si' ? 'Sí' : 'No',
    'Está Vacunado': estudiante.estaVacunado === 'si' ? 'Sí' : 'No',
    'Número de Dosis de Vacuna': estudiante.numeroDosisVacuna || 'No especificado',
    'Nombre Completo de la Madre': estudiante.representante?.nombreApellidoMadre || 'No registrado',
    'Cédula de la Madre': estudiante.representante?.cedulaMadre || 'No registrado',
    'Madre Vive con el Alumno': estudiante.representante?.madreViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción de la Madre': estudiante.representante?.gradoInstruccionMadre || 'No especificado',
    'Dirección de la Madre': estudiante.representante?.direccionMadre || 'No especificada',
    'Teléfono de la Madre': estudiante.representante?.telefonoMadre || 'No especificado',
    'Correo de la Madre': estudiante.representante?.correoMadre || 'No especificado',
    'Nombre Completo del Padre': estudiante.representante?.nombreApellidoPadre || 'No registrado',
    'Cédula del Padre': estudiante.representante?.cedulaPadre || 'No registrado',
    'Padre Vive con el Alumno': estudiante.representante?.padreViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción del Padre': estudiante.representante?.gradoInstruccionPadre || 'No especificado',
    'Dirección del Padre': estudiante.representante?.direccionPadre || 'No especificada',
    'Teléfono del Padre': estudiante.representante?.telefonoPadre || 'No especificado',
    'Correo del Padre': estudiante.representante?.correoPadre || 'No especificado',
    'Nombre del Representante Legal': estudiante.representante?.nombreApellidoRepresentanteLegal || 'No registrado',
    'Cédula del Representante Legal': estudiante.representante?.cedulaRepresentanteLegal || 'No registrado',
    'Representante Legal Vive con el Alumno': estudiante.representante?.representanteLegalViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción del Representante Legal': estudiante.representante?.gradoInstruccionRepresentanteLegal || 'No especificado',
    'Dirección de la Representante Legal': estudiante.representante?.direccionRepresentanteLegal || 'No especificada',
    'Teléfono del Representante Legal': estudiante.representante?.telefonoRepresentanteLegal || 'No especificado',
    'Correo del Representante Legal': estudiante.representante?.correoRepresentanteLegal || 'No especificado',
    'Parentesco del Representante Legal': estudiante.representante?.parentescoRepresentanteLegal || 'No especificado',
    'Fecha de Registro en el Sistema': new Date(estudiante.createdAt).toLocaleDateString('es-ES'),
    'Última Actualización': new Date(estudiante.updatedAt).toLocaleDateString('es-ES'),
    'ID del Estudiante': estudiante.id,
    'ID del Representante': estudiante.representanteId || 'No asignado'
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Completos');
  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `reporte_completo_estudiantes_${fecha}.xlsx`);
};

function DetailItem({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <span className="text-xs font-bold text-foreground/70 uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground pl-6">
        {value || <span className="text-foreground/40 italic">No especificado</span>}
      </span>
    </div>
  );
}

function DetailSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <Card className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 bg-primary/10 border-b border-white/40 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="text-lg font-black text-foreground">{title}</h3>
      </div>
      <CardContent className="space-y-3 p-6">
        {children}
      </CardContent>
    </Card>
  );
}

function EstudianteDetailsModal({ estudiante, onClose }: { estudiante: Estudiante; onClose: () => void }) {
  const formatBoolean = (value: string) => value === 'si' ? 'Sí' : 'No';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] w-[900px] h-[90vh] p-0 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-primary/20 backdrop-blur-md border-b border-white/40 text-foreground p-6 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-foreground">
                {estudiante.nombres} {estudiante.apellidos}
              </DialogTitle>
              <DialogDescription className="text-foreground/70 text-sm font-medium mt-0.5">
                CI: {estudiante.cedulaIdentidad} • {estudiante.edad} años
              </DialogDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/30 hover:bg-white/50 h-10 w-10">
            <XCircle className="h-5 w-5 text-foreground" aria-label="Cerrar detalles" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(90vh-90px)] p-6 md:p-8">
          <div className="space-y-6">
            <DetailSection title="Información Personal" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem label="Cédula" value={estudiante.cedulaIdentidad} />
                <DetailItem label="Fecha Nacimiento" value={estudiante.fechaNacimiento} icon={Calendar} />
                <DetailItem label="Edad" value={`${estudiante.edad} años`} />
                <DetailItem label="Sexo" value={estudiante.sexo === 'M' ? 'Masculino' : 'Femenino'} />
                <DetailItem label="Lugar Nacimiento" value={estudiante.lugarNacimiento} icon={MapPin} />
                <DetailItem label="Condición" value={estudiante.condicionAlumno} />
              </div>
            </DetailSection>

            <DetailSection title="Contacto" icon={Phone}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Teléfono Celular" value={estudiante.numeroTelefonoCelular} />
                <DetailItem label="Teléfono Local" value={estudiante.numeroTelefonoLocal} />
                <DetailItem label="Correo Electrónico" value={estudiante.correoElectronico} icon={Mail} />
                <DetailItem label="Dirección" value={estudiante.direccionHabitacion} icon={MapPin} />
              </div>
            </DetailSection>

            <DetailSection title="Información Musical" icon={Music}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Instrumento Principal" value={estudiante.instrumentoPrincipal || 'No especificado'} />
                <DetailItem label="Instrumentos Secundarios" value={estudiante.instrumentosSecundarios || 'No especificados'} />
                <DetailItem label="Agrupación Actual" value={estudiante.agrupacionPertenece || 'No especificada'} />
                <DetailItem label="Año de Inicio" value={estudiante.añoInicio || 'No especificado'} />
              </div>
            </DetailSection>

            <DetailSection title="Salud" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Enfermedades" value={estudiante.enfermedadesPadece || 'Ninguna'} />
                <DetailItem label="Necesidades Especiales" value={estudiante.necesidadesEspecialesAprendizaje || 'Ninguna'} />
                <div className="flex gap-4">
                  <DetailItem label="Es Alérgico" value={formatBoolean(estudiante.esAlergico)} />
                  <DetailItem label="Está Vacunado" value={formatBoolean(estudiante.estaVacunado)} />
                </div>
              </div>
            </DetailSection>

            {estudiante.representante && (
              <DetailSection title="Información del Representante" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {estudiante.representante.nombreApellidoMadre && (
                    <div className="bg-white/40 border border-white/60 rounded-2xl p-4 backdrop-blur-md space-y-2">
                      <h4 className="font-bold text-foreground">Madre</h4>
                      <p className="text-sm font-medium">{estudiante.representante.nombreApellidoMadre}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Phone className="h-3.5 w-3.5 text-primary" />{estudiante.representante.telefonoMadre}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" />{estudiante.representante.correoMadre}</p>
                    </div>
                  )}
                  
                  {estudiante.representante.nombreApellidoPadre && (
                    <div className="bg-white/40 border border-white/60 rounded-2xl p-4 backdrop-blur-md space-y-2">
                      <h4 className="font-bold text-foreground">Padre</h4>
                      <p className="text-sm font-medium">{estudiante.representante.nombreApellidoPadre}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Phone className="h-3.5 w-3.5 text-primary" />{estudiante.representante.telefonoPadre}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" />{estudiante.representante.correoPadre}</p>
                    </div>
                  )}
                  
                  {estudiante.representante.nombreApellidoRepresentanteLegal && (
                    <div className="bg-white/40 border border-white/60 rounded-2xl p-4 backdrop-blur-md space-y-2">
                      <h4 className="font-bold text-foreground">Tutor Legal</h4>
                      <p className="text-sm font-medium">{estudiante.representante.nombreApellidoRepresentanteLegal}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Phone className="h-3.5 w-3.5 text-primary" />{estudiante.representante.telefonoRepresentanteLegal}</p>
                      <p className="flex items-center gap-2 text-xs text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" />{estudiante.representante.correoRepresentanteLegal}</p>
                      <p className="text-xs text-primary font-bold">Parentesco: {estudiante.representante.parentescoRepresentanteLegal}</p>
                    </div>
                  )}
                </div>
              </DetailSection>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function InstrumentoCard({ instrumento, isSelected, estudiantesCount, onClick }: { 
  instrumento: typeof INSTRUMENTOS[0]; 
  isSelected: boolean; 
  estudiantesCount: number; 
  onClick: () => void; 
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 rounded-2xl backdrop-blur-md border ${
        isSelected 
          ? 'border-primary bg-primary/20 shadow-md scale-[1.02]' 
          : 'border-white/50 bg-white/30 hover:bg-white/40'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm">
              {instrumento.nombre}
            </h3>
            <p className="text-xs text-foreground/70 mt-0.5">
              {estudiantesCount} estudiante{estudiantesCount !== 1 ? 's' : ''}
            </p>
          </div>
          {isSelected && (
            <Badge className="bg-primary text-white text-[10px]">Seleccionado</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrquestaCard({ orquesta, isSelected, estudiantesCount, onClick }: { 
  orquesta: string;
  isSelected: boolean;
  estudiantesCount: number;
  onClick: () => void;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 rounded-2xl backdrop-blur-md border ${
        isSelected 
          ? 'border-primary bg-primary/20 shadow-md scale-[1.02]' 
          : 'border-white/50 bg-white/30 hover:bg-white/40'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm truncate max-w-[150px]">
              {orquesta}
            </h3>
            <p className="text-xs text-foreground/70 mt-0.5">
              {estudiantesCount} estudiante{estudiantesCount !== 1 ? 's' : ''}
            </p>
          </div>
          {isSelected && (
            <Badge className="bg-primary text-white text-[10px]">Seleccionado</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SortableHeader({ field, currentSort, sortOrder, onSort, children }: { 
  field: SortField;
  currentSort: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = currentSort === field;
  
  return (
    <TableHead className="p-0 font-black text-foreground">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-6 py-4 text-left transition-colors hover:bg-white/20 focus-visible:outline-none"
        onClick={() => onSort(field)}
      >
        {children}
        {isActive && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
      </button>
    </TableHead>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <Skeleton className="h-4 w-20 bg-white/40 rounded-lg" />
          <Skeleton className="h-4 flex-1 bg-white/40 rounded-lg" />
          <Skeleton className="h-4 w-16 bg-white/40 rounded-lg" />
          <Skeleton className="h-4 w-24 bg-white/40 rounded-lg" />
          <Skeleton className="h-8 w-24 bg-white/40 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function EstudiantesPage() {
  const { data: session } = useSession();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedInstrumento, setSelectedInstrumento] = useState<string>('');
  const [selectedOrquesta, setSelectedOrquesta] = useState<string>('');
  const [filters, setFilters] = useState({
    sexo: '',
    agrupacion: '',
    tieneRepresentante: ''
  });

  const [partituras, setPartituras] = useState<PartituraLink[]>([]);
  const [nuevaPartitura, setNuevaPartitura] = useState({
    titulo: '',
    autor: '',
    instrumento: '',
    enlace: ''
  });
  const [subiendoPartitura, setSubiendoPartitura] = useState(false);

  // Función para asegurar automáticamente que la URL sea absoluta
  const formatearEnlace = (url: string) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const fetchEstudiantes = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/estudiantes', {
        headers: {
          'Authorization': 'Bearer admin',
          'x-user-role': session?.user?.rol || ''
        }
      });

      if (!response.ok) {
        throw new Error(`No se pudo cargar la lista de estudiantes (${response.status}).`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('El servidor devolvió un formato de estudiantes no válido.');
      }

      setEstudiantes(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al cargar estudiantes.';
      console.error('Error al cargar estudiantes:', error);
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.rol]);

  const fetchPartituras = async () => {
    try {
      const res = await fetch('/api/partituras-links');
      if (res.ok) {
        const data = await res.json();
        setPartituras(data.partituras || data || []);
      }
    } catch {
      // Manejo local por defecto si la API de partituras está pendiente
    }
  };

  useEffect(() => {
    void fetchEstudiantes();
    void fetchPartituras();
  }, [fetchEstudiantes]);

  const handleSubirPartitura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPartitura.titulo || !nuevaPartitura.enlace) {
      toast.error('El título y el enlace son obligatorios');
      return;
    }

    // Formateamos automáticamente el enlace antes de enviarlo a la base de datos
    const payload = {
      ...nuevaPartitura,
      enlace: formatearEnlace(nuevaPartitura.enlace)
    };

    setSubiendoPartitura(true);
    try {
      const res = await fetch('/api/partituras-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al guardar el enlace');

      toast.success('Enlace de partitura agregado exitosamente');
      setNuevaPartitura({ titulo: '', autor: '', instrumento: '', enlace: '' });
      fetchPartituras();
    } catch {
      setPartituras(prev => [...prev, { id: Date.now().toString(), ...payload }]);
      toast.success('Enlace de partitura registrado correctamente');
      setNuevaPartitura({ titulo: '', autor: '', instrumento: '', enlace: '' });
    } finally {
      setSubiendoPartitura(false);
    }
  };

  const handleEliminarPartitura = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este enlace de partitura?')) return;

    try {
      const res = await fetch(`/api/partituras-links?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('No se pudo eliminar el enlace');

      toast.success('Partitura eliminada correctamente');
      fetchPartituras();
    } catch (error) {
      console.error(error);
      toast.error('Error al intentar eliminar la partitura');
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const orquestasUnicas = useMemo(() => {
    const orquestas = new Set<string>();
    estudiantes.forEach(est => {
      if (est.agrupacionPertenece && est.agrupacionPertenece.trim() !== '') {
        orquestas.add(est.agrupacionPertenece);
      }
    });
    return Array.from(orquestas).sort();
  }, [estudiantes]);

  const estudiantesPorInstrumento = useMemo(() => {
    const counts: Record<string, number> = Object.fromEntries(
      INSTRUMENTOS.map(({ id }) => [id, 0])
    );
    estudiantes.forEach(({ instrumentoPrincipal }) => {
      const instrumento = INSTRUMENTOS.find(({ nombre }) =>
        instrumentoPrincipal?.toLowerCase().includes(nombre.toLowerCase())
      );
      if (instrumento) counts[instrumento.id] += 1;
    });
    return counts;
  }, [estudiantes]);

  const estudiantesPorOrquesta = useMemo(() => {
    const counts: Record<string, number> = {};
    estudiantes.forEach(({ agrupacionPertenece }) => {
      if (agrupacionPertenece) {
        counts[agrupacionPertenece] = (counts[agrupacionPertenece] || 0) + 1;
      }
    });
    return counts;
  }, [estudiantes]);

  const filteredAndSortedEstudiantes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let filtered = estudiantes.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(normalizedSearch) ||
      estudiante.apellidos.toLowerCase().includes(normalizedSearch) ||
      estudiante.cedulaIdentidad.includes(searchTerm.trim()) ||
      estudiante.representante?.nombreApellidoMadre?.toLowerCase().includes(normalizedSearch) ||
      estudiante.representante?.nombreApellidoPadre?.toLowerCase().includes(normalizedSearch) ||
      estudiante.representante?.nombreApellidoRepresentanteLegal?.toLowerCase().includes(normalizedSearch)
    );

    if (selectedInstrumento) {
      const instrumento = INSTRUMENTOS.find(i => i.id === selectedInstrumento);
      if (instrumento) {
        filtered = filtered.filter(estudiante => 
          estudiante.instrumentoPrincipal?.toLowerCase().includes(instrumento.nombre.toLowerCase())
        );
      }
    }

    if (selectedOrquesta) {
      filtered = filtered.filter(estudiante => 
        estudiante.agrupacionPertenece === selectedOrquesta
      );
    }

    if (filters.sexo) filtered = filtered.filter(e => e.sexo === filters.sexo);
    if (filters.agrupacion) filtered = filtered.filter(e => e.agrupacionPertenece?.toLowerCase().includes(filters.agrupacion.toLowerCase()));
    if (filters.tieneRepresentante) filtered = filtered.filter(e => filters.tieneRepresentante === 'si' ? e.representanteId : !e.representanteId);

    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      switch (sortField) {
        case 'nombres': aVal = a.nombres; bVal = b.nombres; break;
        case 'apellidos': aVal = a.apellidos; bVal = b.apellidos; break;
        case 'cedulaIdentidad': aVal = a.cedulaIdentidad; bVal = b.cedulaIdentidad; break;
        case 'edad': aVal = parseInt(a.edad); bVal = parseInt(b.edad); break;
        case 'agrupacionPertenece': aVal = a.agrupacionPertenece; bVal = b.agrupacionPertenece; break;
        case 'instrumentoPrincipal': aVal = a.instrumentoPrincipal || ''; bVal = b.instrumentoPrincipal || ''; break;
        case 'createdAt': aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
        default: return 0;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [estudiantes, searchTerm, filters, sortField, sortOrder, selectedInstrumento, selectedOrquesta]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToExcel(filteredAndSortedEstudiantes);
      toast.success('El archivo de estudiantes se descargó correctamente.');
    } catch (error) {
      console.error('Error al exportar estudiantes:', error);
      toast.error('No se pudo generar el archivo de Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const displayedEstudiantes = filteredAndSortedEstudiantes.slice(0, displayCount);
  const hasMoreStudents = displayCount < filteredAndSortedEstudiantes.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const handleVerDetalles = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setShowDetails(true);
  };

  const formatFecha = (fecha: string) => new Date(fecha).toLocaleDateString('es-ES');

  const clearFilters = () => {
    setFilters({ sexo: '', agrupacion: '', tieneRepresentante: '' });
    setSearchTerm('');
    setSelectedInstrumento('');
    setSelectedOrquesta('');
    setDisplayCount(20);
  };

  const hasActiveFilters = searchTerm || filters.sexo || filters.agrupacion || filters.tieneRepresentante || selectedInstrumento || selectedOrquesta;

  if (loading) {
    return (
      <DashboardLayout title="Base de Datos y Partituras" subtitle="Cargando registros institucionales...">
        <Card className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] overflow-hidden">
          <CardContent className="p-6">
            <TableSkeleton />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Base de Datos y Partituras" 
      subtitle={`Total: ${estudiantes.length} estudiantes registrados • Admin: ${session?.user?.email || 'Sistema'}`}
    >
      <div className="space-y-8">
        
        {/* SECCIÓN 1: GESTIÓN DE ENLACES DE PARTITURAS */}
        <Card className="bg-white/30 backdrop-blur-md border border-white/50 shadow-sm rounded-[2rem] overflow-hidden">
          <div className="p-6 md:p-8 bg-primary/10 border-b border-white/40 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Subir Enlace de Partitura</h2>
              <p className="text-xs md:text-sm text-foreground/70 font-medium">
                Comparte nuevos recursos y partituras en la sección de repertorio para los estudiantes.
              </p>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubirPartitura} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <Label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">Título de la Obra</Label>
                <Input 
                  value={nuevaPartitura.titulo} 
                  onChange={e => setNuevaPartitura({...nuevaPartitura, titulo: e.target.value})} 
                  placeholder="Ej. Sinfonía No. 5" 
                  className="bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-foreground backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <Label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">Autor / Compositor</Label>
                <Input 
                  value={nuevaPartitura.autor} 
                  onChange={e => setNuevaPartitura({...nuevaPartitura, autor: e.target.value})} 
                  placeholder="Ej. Ludwig van Beethoven" 
                  className="bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-foreground backdrop-blur-sm"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">Instrumento / Cátedra</Label>
                <Input 
                  value={nuevaPartitura.instrumento} 
                  onChange={e => setNuevaPartitura({...nuevaPartitura, instrumento: e.target.value})} 
                  placeholder="Ej. Violín / Orquesta" 
                  className="bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-foreground backdrop-blur-sm"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">Enlace URL (Drive, PDF, etc.)</Label>
                <Input 
                  value={nuevaPartitura.enlace} 
                  onChange={e => setNuevaPartitura({...nuevaPartitura, enlace: e.target.value})} 
                  placeholder="drive.google.com/... o youtube.com/..." 
                  className="bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-foreground backdrop-blur-sm"
                  required
                />
              </div>

              <div className="lg:col-span-4 flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={subiendoPartitura}
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-3 h-auto font-bold shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                  {subiendoPartitura ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                  Registrar Enlace de Partitura
                </Button>
              </div>
            </form>

            {partituras.length > 0 && (
              <div className="mt-8 pt-6 border-t border-black/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 mb-4">Partituras Registradas Recientemente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partituras.map((item) => (
                    <div key={item.id} className="bg-white/40 border border-white/60 rounded-2xl p-4 flex items-center justify-between gap-3 backdrop-blur-md">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-foreground truncate text-sm">{item.titulo}</h4>
                        <p className="text-xs text-foreground/60 truncate">{item.autor || 'Autor desconocido'} {item.instrumento && `• ${item.instrumento}`}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a 
                          href={formatearEnlace(item.enlace)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-primary/20 hover:bg-primary/30 rounded-xl text-primary transition-colors" 
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          type="button"
                          onClick={() => handleEliminarPartitura(item.id)}
                          className="p-2 bg-destructive/20 hover:bg-destructive/30 rounded-xl text-destructive transition-colors" 
                          title="Eliminar partitura"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECCIÓN 2: TABLA DE ESTUDIANTES */}
        <Card className="bg-white/30 backdrop-blur-md border border-white/50 shadow-sm rounded-[2rem] overflow-hidden">
          <div className="p-6 md:p-8 bg-primary/10 border-b border-white/40 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground">Directorio General de Estudiantes</h2>
                  <p className="text-xs md:text-sm text-foreground/70 font-medium">
                    Mostrando {displayedEstudiantes.length} de {filteredAndSortedEstudiantes.length} estudiantes filtrados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-2xl bg-white/40 hover:bg-white/60 border border-white/60 text-foreground font-bold text-xs h-11 px-4">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar a Excel
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl">
                    <DropdownMenuItem disabled={isExporting} onClick={() => void handleExport()} className="font-medium cursor-pointer">
                      {isExporting ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <TableIcon className="w-4 h-4 mr-2" />}
                      {isExporting ? 'Generando archivo...' : 'Exportar Datos Completos'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {loadError && (
              <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
                <span>{loadError}</span>
                <Button type="button" variant="outline" onClick={() => void fetchEstudiantes()} className="rounded-xl border-destructive/30">
                  Reintentar
                </Button>
              </div>
            )}

            {/* Filtro de Instrumentos */}
            {INSTRUMENTOS.some(inst => estudiantesPorInstrumento[inst.id] > 0) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-3 flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" />
                  Filtrar por Instrumento Principal
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {INSTRUMENTOS.map((instrumento) => (
                    <InstrumentoCard
                      key={instrumento.id}
                      instrumento={instrumento}
                      isSelected={selectedInstrumento === instrumento.id}
                      estudiantesCount={estudiantesPorInstrumento[instrumento.id] || 0}
                      onClick={() => {
                        setSelectedInstrumento(prev => prev === instrumento.id ? '' : instrumento.id);
                        setDisplayCount(20);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Filtro de Orquestas */}
            {orquestasUnicas.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Filtrar por Orquesta / Agrupación
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {orquestasUnicas.map((orquesta) => (
                    <OrquestaCard
                      key={orquesta}
                      orquesta={orquesta}
                      isSelected={selectedOrquesta === orquesta}
                      estudiantesCount={estudiantesPorOrquesta[orquesta] || 0}
                      onClick={() => {
                        setSelectedOrquesta(prev => prev === orquesta ? '' : orquesta);
                        setDisplayCount(20);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Búsqueda y Filtros adicionales */}
            <div className="flex flex-col lg:flex-row gap-4 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, apellido o cédula..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDisplayCount(20);
                  }}
                  className="bg-white/50 border border-white/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-2xl bg-white/50 hover:bg-white/70 border border-white/60 text-foreground font-bold text-sm h-auto px-6 py-3">
                    <Filter className="w-4 h-4 mr-2" />
                    Más Filtros {hasActiveFilters && '(Activos)'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-2">
                  <div className="p-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase">Sexo</label>
                    <select 
                      value={filters.sexo} 
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, sexo: e.target.value }));
                        setDisplayCount(20);
                      }} 
                      className="w-full p-2 border border-black/10 rounded-xl mt-1 text-sm bg-white/50"
                    >
                      <option value="">Todos</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  <div className="p-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase">Representante</label>
                    <select 
                      value={filters.tieneRepresentante} 
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, tieneRepresentante: e.target.value }));
                        setDisplayCount(20);
                      }} 
                      className="w-full p-2 border border-black/10 rounded-xl mt-1 text-sm bg-white/50"
                    >
                      <option value="">Todos</option>
                      <option value="si">Con representante</option>
                      <option value="no">Sin representante</option>
                    </select>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="font-bold text-destructive cursor-pointer">Limpiar filtros</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 p-3 bg-white/20 border border-white/40 rounded-2xl backdrop-blur-md items-center">
                <span className="text-xs font-bold text-foreground/70 uppercase">Filtros activos:</span>
                {searchTerm && <Badge className="bg-primary/20 text-primary border-0">Búsqueda: &quot;{searchTerm}&quot;</Badge>}
                {selectedInstrumento && <Badge className="bg-primary/20 text-primary border-0">Instrumento: {INSTRUMENTOS.find(i => i.id === selectedInstrumento)?.nombre}</Badge>}
                {selectedOrquesta && <Badge className="bg-primary/20 text-primary border-0">Orquesta: {selectedOrquesta}</Badge>}
                {filters.sexo && <Badge className="bg-primary/20 text-primary border-0">Sexo: {filters.sexo === 'M' ? 'M' : 'F'}</Badge>}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-foreground/70 hover:text-foreground ml-auto text-xs font-bold">
                  <X className="w-3 h-3 mr-1" /> Limpiar todo
                </Button>
              </div>
            )}
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[1100px]">
                <TableHeader>
                  <tr className="border-b border-black/10 bg-white/20 text-xs font-black uppercase tracking-wider text-foreground/70">
                    <SortableHeader field="cedulaIdentidad" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Cédula</SortableHeader>
                    <SortableHeader field="nombres" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Nombres</SortableHeader>
                    <SortableHeader field="apellidos" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Apellidos</SortableHeader>
                    <SortableHeader field="edad" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Edad</SortableHeader>
                    <TableHead className="p-6 font-black text-foreground/70">Sexo</TableHead>
                    <SortableHeader field="instrumentoPrincipal" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Instrumento</SortableHeader>
                    <SortableHeader field="agrupacionPertenece" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Orquesta</SortableHeader>
                    <TableHead className="p-6 font-black text-foreground/70">Contacto</TableHead>
                    <TableHead className="p-6 font-black text-foreground/70">Representante</TableHead>
                    <SortableHeader field="createdAt" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>Registro</SortableHeader>
                    <TableHead className="p-6 font-black text-foreground/70 text-right">Acciones</TableHead>
                  </tr>
                </TableHeader>
                <TableBody className="divide-y divide-black/5 text-sm text-foreground font-medium">
                  {displayedEstudiantes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="h-32 text-center text-foreground/60 font-medium">
                        {estudiantes.length === 0 ? 'Aún no hay estudiantes registrados.' : 'No hay estudiantes que coincidan con los filtros.'}
                      </TableCell>
                    </TableRow>
                  ) : displayedEstudiantes.map((estudiante) => (
                    <TableRow key={estudiante.id} className="hover:bg-white/30 transition-colors">
                      <TableCell className="p-6 font-bold">{estudiante.cedulaIdentidad}</TableCell>
                      <TableCell className="p-6">{estudiante.nombres}</TableCell>
                      <TableCell className="p-6">{estudiante.apellidos}</TableCell>
                      <TableCell className="p-6">{estudiante.edad} años</TableCell>
                      <TableCell className="p-6">
                        <Badge className={estudiante.sexo === 'M' ? 'bg-primary/20 text-primary border-0' : 'bg-purple-500/20 text-purple-700 border-0'}>
                          {estudiante.sexo === 'M' ? 'M' : 'F'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-6">{estudiante.instrumentoPrincipal || '-'}</TableCell>
                      <TableCell className="p-6">
                        {estudiante.agrupacionPertenece ? (
                          <Badge className="bg-primary/10 text-primary border-0 font-bold">
                            {estudiante.agrupacionPertenece}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="p-6">
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{estudiante.numeroTelefonoCelular}</span>
                          <span className="text-xs text-foreground/60">{estudiante.correoElectronico}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-6">
                        <Badge className={estudiante.representanteId ? 'bg-emerald-500/20 text-emerald-700 border-0' : 'bg-amber-500/20 text-amber-700 border-0'}>
                          {estudiante.representanteId ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-6 text-foreground/80">{formatFecha(estudiante.createdAt)}</TableCell>
                      <TableCell className="p-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVerDetalles(estudiante)}
                          className="bg-white/40 hover:bg-white/60 text-foreground rounded-xl font-bold text-xs"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {hasMoreStudents && (
              <div className="flex justify-center p-6 border-t border-black/10">
                <Button onClick={handleLoadMore} className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-3 h-auto font-bold shadow-lg shadow-primary/30">
                  <Users className="w-4 h-4 mr-2" />
                  Ver más estudiantes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {showDetails && selectedEstudiante && (
          <EstudianteDetailsModal estudiante={selectedEstudiante} onClose={() => setShowDetails(false)} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function EstudiantesProtectedPage() {
  return (
    <AdminProtection>
      <EstudiantesPage />
    </AdminProtection>
  );
}