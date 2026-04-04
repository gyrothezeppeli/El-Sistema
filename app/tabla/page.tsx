// app/tabla/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Search, User, Phone, Mail, Calendar, MapPin, Music, Users, Eye, 
  Filter, Download, X, SortAsc, SortDesc, Home, FileText, Table as TableIcon, Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import AdminProtection from '@/components/AdminProtection';
import { useSession } from 'next-auth/react';

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

type SortField = 'nombres' | 'apellidos' | 'cedulaIdentidad' | 'edad' | 'createdAt' | 'agrupacionPertenece' | 'instrumentoPrincipal';
type SortOrder = 'asc' | 'desc';

const INSTRUMENTOS = [
  { id: 'violin', nombre: 'Violín', color: 'bg-[#E8F5E8]', textColor: 'text-[#4CAF50]' },
  { id: 'viola', nombre: 'Viola', color: 'bg-[#E3F2FD]', textColor: 'text-[#1976D2]' },
  { id: 'violonchelo', nombre: 'Violonchelo', color: 'bg-[#FCE4EC]', textColor: 'text-[#C2185B]' },
  { id: 'contrabajo', nombre: 'Contrabajo', color: 'bg-[#FFF3E0]', textColor: 'text-[#FF9800]' }
];

const exportToExcel = (estudiantes: Estudiante[]) => {
  const dataToExport = estudiantes.map(estudiante => ({
    // ========== DATOS DEL ESTUDIANTE ==========
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
    
    // ========== DATOS MUSICALES ==========
    'Instrumento Principal': estudiante.instrumentoPrincipal || 'No especificado',
    'Instrumentos Secundarios': estudiante.instrumentosSecundarios || 'No especificados',
    'Agrupación Actual': estudiante.agrupacionPertenece || 'No especificada',
    'Agrupaciones Anteriores': estudiante.nombreAgrupacionesPertenecio || 'No especificadas',
    'Año de Inicio': estudiante.añoInicio || 'No especificado',
    
    // ========== DATOS ACADÉMICOS ==========
    'Condición del Alumno': estudiante.condicionAlumno || 'No especificada',
    
    // ========== DATOS DE SALUD ==========
    'Enfermedades que Padece': estudiante.enfermedadesPadece || 'Ninguna',
    'Necesidades Especiales de Aprendizaje': estudiante.necesidadesEspecialesAprendizaje || 'Ninguna',
    'Es Alérgico': estudiante.esAlergico === 'si' ? 'Sí' : 'No',
    'Está Vacunado': estudiante.estaVacunado === 'si' ? 'Sí' : 'No',
    'Número de Dosis de Vacuna': estudiante.numeroDosisVacuna || 'No especificado',
    
    // ========== DATOS DE LA MADRE ==========
    'Nombre Completo de la Madre': estudiante.representante?.nombreApellidoMadre || 'No registrado',
    'Cédula de la Madre': estudiante.representante?.cedulaMadre || 'No registrado',
    'Madre Vive con el Alumno': estudiante.representante?.madreViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción de la Madre': estudiante.representante?.gradoInstruccionMadre || 'No especificado',
    'Dirección de la Madre': estudiante.representante?.direccionMadre || 'No especificada',
    'Teléfono de la Madre': estudiante.representante?.telefonoMadre || 'No especificado',
    'Correo de la Madre': estudiante.representante?.correoMadre || 'No especificado',
    
    // ========== DATOS DEL PADRE ==========
    'Nombre Completo del Padre': estudiante.representante?.nombreApellidoPadre || 'No registrado',
    'Cédula del Padre': estudiante.representante?.cedulaPadre || 'No registrado',
    'Padre Vive con el Alumno': estudiante.representante?.padreViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción del Padre': estudiante.representante?.gradoInstruccionPadre || 'No especificado',
    'Dirección del Padre': estudiante.representante?.direccionPadre || 'No especificada',
    'Teléfono del Padre': estudiante.representante?.telefonoPadre || 'No especificado',
    'Correo del Padre': estudiante.representante?.correoPadre || 'No especificado',
    
    // ========== DATOS DEL REPRESENTANTE LEGAL ==========
    'Nombre del Representante Legal': estudiante.representante?.nombreApellidoRepresentanteLegal || 'No registrado',
    'Cédula del Representante Legal': estudiante.representante?.cedulaRepresentanteLegal || 'No registrado',
    'Representante Legal Vive con el Alumno': estudiante.representante?.representanteLegalViveConAlumno === 'si' ? 'Sí' : 'No',
    'Grado de Instrucción del Representante Legal': estudiante.representante?.gradoInstruccionRepresentanteLegal || 'No especificado',
    'Dirección del Representante Legal': estudiante.representante?.direccionRepresentanteLegal || 'No especificada',
    'Teléfono del Representante Legal': estudiante.representante?.telefonoRepresentanteLegal || 'No especificado',
    'Correo del Representante Legal': estudiante.representante?.correoRepresentanteLegal || 'No especificado',
    'Parentesco del Representante Legal': estudiante.representante?.parentescoRepresentanteLegal || 'No especificado',
    
    // ========== DATOS DEL SISTEMA ==========
    'Fecha de Registro en el Sistema': new Date(estudiante.createdAt).toLocaleDateString('es-ES'),
    'Última Actualización': new Date(estudiante.updatedAt).toLocaleDateString('es-ES'),
    'ID del Estudiante': estudiante.id,
    'ID del Representante': estudiante.representanteId || 'No asignado'
  }));

  // Crear worksheet con todos los datos
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Ajustar ancho de columnas para mejor visualización
  const colWidths = [
    { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 8 }, { wch: 12 },
    { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
    { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 30 },
    { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 25 }, { wch: 25 },
    { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 },
    { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
    { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 25 },
    { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 20 },
    { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
    { wch: 20 }, { wch: 20 }, { wch: 30 }
  ];
  worksheet['!cols'] = colWidths;

  // Crear workbook y guardar archivo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Completos');
  
  // Generar nombre de archivo con fecha
  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `reporte_completo_estudiantes_${fecha}.xlsx`);
};

function DetailItem({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col space-y-2 p-3 rounded-lg bg-gradient-to-r from-[#F5F1EB] to-[#F8F4EF] border border-[#E8D5C4]">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-[#9A784F]" />}
        <span className="text-xs font-semibold text-[#795C34] uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-medium text-[#362511] pl-6">
        {value || <span className="text-[#795C34] italic">No especificado</span>}
      </span>
    </div>
  );
}

function DetailSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <Card className="bg-gradient-to-br from-white to-[#FBF8F5] border border-[#E8D5C4]">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#F5F1EB] to-[#F8F4EF] border-b border-[#E8D5C4]">
        <CardTitle className="text-lg flex items-center gap-2 text-[#362511]">
          {Icon && <Icon className="w-5 h-5 text-[#9A784F]" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {children}
      </CardContent>
    </Card>
  );
}

function EstudianteDetailsModal({ estudiante, onClose }: { estudiante: Estudiante; onClose: () => void }) {
  const formatBoolean = (value: string) => value === 'si' ? 'Sí' : 'No';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[70vw] w-[80vw] h-[90vh] p-0 bg-white border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#795C34] to-[#65350F] text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {estudiante.nombres} {estudiante.apellidos}
                </DialogTitle>
                <DialogDescription className="text-[#F5F1EB] mt-1">
                  CI: {estudiante.cedulaIdentidad} • {estudiante.edad} años
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
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
              <>
                <Separator />
                <DetailSection title="Información del Representante" icon={Users}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {estudiante.representante.nombreApellidoMadre && (
                      <Card className="bg-white border-l-4 border-l-[#9A784F]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Madre</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm font-medium">{estudiante.representante.nombreApellidoMadre}</p>
                          <p className="text-sm">📞 {estudiante.representante.telefonoMadre}</p>
                          <p className="text-sm">📧 {estudiante.representante.correoMadre}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {estudiante.representante.nombreApellidoPadre && (
                      <Card className="bg-white border-l-4 border-l-[#65350F]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Padre</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm font-medium">{estudiante.representante.nombreApellidoPadre}</p>
                          <p className="text-sm">📞 {estudiante.representante.telefonoPadre}</p>
                          <p className="text-sm">📧 {estudiante.representante.correoPadre}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {estudiante.representante.nombreApellidoRepresentanteLegal && (
                      <Card className="bg-white border-l-4 border-l-[#795C34]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Tutor Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm font-medium">{estudiante.representante.nombreApellidoRepresentanteLegal}</p>
                          <p className="text-sm">📞 {estudiante.representante.telefonoRepresentanteLegal}</p>
                          <p className="text-sm">📧 {estudiante.representante.correoRepresentanteLegal}</p>
                          <p className="text-sm text-[#795C34]">Parentesco: {estudiante.representante.parentescoRepresentanteLegal}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </DetailSection>
              </>
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
      className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
        isSelected 
          ? 'border-[#9A784F] bg-gradient-to-br from-[#F5F1EB] to-[#E8D5C4] scale-105' 
          : 'border-[#E8D5C4] bg-white hover:border-[#D4B8A4]'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${isSelected ? 'text-[#362511]' : 'text-[#795C34]'}`}>
              {instrumento.nombre}
            </h3>
            <p className="text-sm text-[#65350F]">
              {estudiantesCount} estudiante{estudiantesCount !== 1 ? 's' : ''}
            </p>
          </div>
          {isSelected && (
            <Badge className="bg-[#9A784F] text-white">Seleccionado</Badge>
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
    <TableHead 
      className="font-bold text-[#362511] py-4 cursor-pointer hover:bg-[#F5F1EB] transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {isActive && (
          sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
        )}
      </div>
    </TableHead>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

function EstudiantesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedInstrumento, setSelectedInstrumento] = useState<string>('');
  const [filters, setFilters] = useState({
    sexo: '',
    agrupacion: '',
    tieneRepresentante: ''
  });

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch('/api/estudiantes', {
        headers: {
          'Authorization': 'Bearer admin',
          'x-user-role': session?.user?.rol || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 20);
      setLoadingMore(false);
    }, 500);
  };

  const estudiantesPorInstrumento = useMemo(() => {
    const counts: { [key: string]: number } = {};
    INSTRUMENTOS.forEach(instrumento => {
      counts[instrumento.id] = estudiantes.filter(estudiante => 
        estudiante.instrumentoPrincipal?.toLowerCase().includes(instrumento.nombre.toLowerCase())
      ).length;
    });
    return counts;
  }, [estudiantes]);

  const filteredAndSortedEstudiantes = useMemo(() => {
    let filtered = estudiantes.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.cedulaIdentidad.includes(searchTerm)
    );

    if (selectedInstrumento) {
      const instrumento = INSTRUMENTOS.find(i => i.id === selectedInstrumento);
      if (instrumento) {
        filtered = filtered.filter(estudiante => 
          estudiante.instrumentoPrincipal?.toLowerCase().includes(instrumento.nombre.toLowerCase())
        );
      }
    }

    if (filters.sexo) filtered = filtered.filter(e => e.sexo === filters.sexo);
    if (filters.agrupacion) filtered = filtered.filter(e => e.agrupacionPertenece.toLowerCase().includes(filters.agrupacion.toLowerCase()));
    if (filters.tieneRepresentante) filtered = filtered.filter(e => filters.tieneRepresentante === 'si' ? e.representanteId : !e.representanteId);

    filtered.sort((a, b) => {
      let aVal, bVal;
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
  }, [estudiantes, searchTerm, filters, sortField, sortOrder, selectedInstrumento]);

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
    setDisplayCount(20);
  };

  const hasActiveFilters = searchTerm || filters.sexo || filters.agrupacion || filters.tieneRepresentante || selectedInstrumento;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF8F5] via-[#F5F1EB] to-[#F8F4EF] py-8">
        <div className="container mx-auto px-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-[#E8D5C4]">
            <CardHeader className="bg-gradient-to-r from-[#795C34] to-[#65350F] text-white rounded-t-lg">
              <Skeleton className="h-8 w-64 bg-white/20" />
            </CardHeader>
            <CardContent className="p-6">
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF8F5] via-[#F5F1EB] to-[#F8F4EF] py-8">
      <div className="container mx-auto px-6 space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-[#E8D5C4] shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#795C34] to-[#65350F] text-white rounded-t-lg pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  Lista de Estudiantes
                </CardTitle>
                <CardDescription className="text-[#F5F1EB] mt-2">
                  Total: {estudiantes.length} estudiantes registrados
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                Admin: {session?.user?.email}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Button onClick={() => router.push('/inicio')} className="bg-[#795C34] hover:bg-[#65350F] text-white">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#E8D5C4] text-[#795C34]">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar a Excel
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportToExcel(filteredAndSortedEstudiantes)}>
                    <TableIcon className="w-4 h-4 mr-2" />
                    Exportar Datos Completos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A784F] w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, apellido o cédula..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDisplayCount(20);
                  }}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#E8D5C4] text-[#795C34]">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros {hasActiveFilters && '(Activos)'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="p-2">
                    <label className="text-xs font-medium">Sexo</label>
                    <select 
                      value={filters.sexo} 
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, sexo: e.target.value }));
                        setDisplayCount(20);
                      }} 
                      className="w-full p-2 border rounded mt-1"
                    >
                      <option value="">Todos</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  <div className="p-2">
                    <label className="text-xs font-medium">Representante</label>
                    <select 
                      value={filters.tieneRepresentante} 
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, tieneRepresentante: e.target.value }));
                        setDisplayCount(20);
                      }} 
                      className="w-full p-2 border rounded mt-1"
                    >
                      <option value="">Todos</option>
                      <option value="si">Con representante</option>
                      <option value="no">Sin representante</option>
                    </select>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>Limpiar filtros</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#FFE8D6] border border-[#FFB38A] rounded-lg">
                <span className="text-sm text-[#795C34] font-medium">Filtros activos:</span>
                {searchTerm && (
                  <Badge variant="outline" className="bg-white text-[#795C34]">
                    Búsqueda: &quot;{searchTerm}&quot;
                  </Badge>
                )}
                {selectedInstrumento && (
                  <Badge variant="outline" className="bg-white text-[#795C34]">
                    Instrumento: {INSTRUMENTOS.find(i => i.id === selectedInstrumento)?.nombre}
                  </Badge>
                )}
                {filters.sexo && (
                  <Badge variant="outline" className="bg-white text-[#795C34]">
                    Sexo: {filters.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </Badge>
                )}
                {filters.tieneRepresentante && (
                  <Badge variant="outline" className="bg-white text-[#795C34]">
                    Representante: {filters.tieneRepresentante === 'si' ? 'Con' : 'Sin'}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#795C34] ml-auto">
                  <X className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            )}

            <div className="rounded-lg border border-[#E8D5C4] bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#F5F1EB] to-[#F8F4EF]">
                    <SortableHeader field="cedulaIdentidad" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Cédula
                    </SortableHeader>
                    <SortableHeader field="nombres" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Nombres
                    </SortableHeader>
                    <SortableHeader field="apellidos" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Apellidos
                    </SortableHeader>
                    <SortableHeader field="edad" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Edad
                    </SortableHeader>
                    <TableHead>Sexo</TableHead>
                    <SortableHeader field="instrumentoPrincipal" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Instrumento
                    </SortableHeader>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Representante</TableHead>
                    <SortableHeader field="createdAt" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort}>
                      Registro
                    </SortableHeader>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEstudiantes.map((estudiante) => (
                    <TableRow key={estudiante.id} className="hover:bg-[#F5F1EB]/30">
                      <TableCell className="font-medium">{estudiante.cedulaIdentidad}</TableCell>
                      <TableCell>{estudiante.nombres}</TableCell>
                      <TableCell>{estudiante.apellidos}</TableCell>
                      <TableCell>{estudiante.edad} años</TableCell>
                      <TableCell>
                        <Badge variant={estudiante.sexo === 'M' ? 'default' : 'secondary'}>
                          {estudiante.sexo === 'M' ? 'M' : 'F'}
                        </Badge>
                      </TableCell>
                      <TableCell>{estudiante.instrumentoPrincipal || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{estudiante.numeroTelefonoCelular}</span>
                          <span className="text-xs text-[#795C34]">{estudiante.correoElectronico}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={estudiante.representanteId ? 'default' : 'outline'}>
                          {estudiante.representanteId ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFecha(estudiante.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleVerDetalles(estudiante)}>
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
              <div className="flex justify-center mt-6">
                <Button onClick={handleLoadMore} disabled={loadingMore} className="bg-[#9A784F] hover:bg-[#795C34] text-white">
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                  {loadingMore ? 'Cargando...' : 'Ver más estudiantes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {showDetails && selectedEstudiante && (
          <EstudianteDetailsModal estudiante={selectedEstudiante} onClose={() => setShowDetails(false)} />
        )}
      </div>
    </div>
  );
}

// Exportar la versión protegida
export default function EstudiantesProtectedPage() {
  return (
    <AdminProtection>
      <EstudiantesPage />
    </AdminProtection>
  );
}