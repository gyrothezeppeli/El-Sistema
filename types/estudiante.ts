// types/estudiante.ts
export interface Estudiante {
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
  nombreColegio: string;
  gradoCursa: string;
  enfermedadesPadece: string;
  condicionAlumno: string;
  necesidadesEspecialesAprendizaje: string;
  esAlergico: string; // Cambiado de boolean a string
  estaVacunado: string; // Cambiado de boolean a string
  numeroDosisVacuna: string;
  representanteId?: string;
  representante?: Representante;
  createdAt: string;
  updatedAt: string;
}

export interface Representante {
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
  estudiantes: Estudiante[];
  createdAt: string;
  updatedAt: string;
}