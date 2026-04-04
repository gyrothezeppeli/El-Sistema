-- CreateTable
CREATE TABLE "estudiantes" (
    "id" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "cedulaIdentidad" TEXT NOT NULL,
    "fechaNacimiento" TEXT NOT NULL,
    "edad" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "lugarNacimiento" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "parroquia" TEXT NOT NULL,
    "direccionHabitacion" TEXT NOT NULL,
    "numeroTelefonoCelular" TEXT NOT NULL,
    "numeroTelefonoLocal" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "nombreAgrupacionesPertenecio" TEXT NOT NULL,
    "añoInicio" TEXT NOT NULL,
    "agrupacionPertenece" TEXT NOT NULL,
    "nucleo" TEXT,
    "instrumentoPrincipal" TEXT,
    "instrumentosSecundarios" TEXT,
    "nombreColegio" TEXT NOT NULL,
    "gradoCursa" TEXT NOT NULL,
    "enfermedadesPadece" TEXT NOT NULL,
    "otrasEnfermedades" TEXT,
    "condicionAlumno" TEXT NOT NULL,
    "especifiqueCondicion" TEXT,
    "necesidadesEspecialesAprendizaje" TEXT NOT NULL,
    "especifiqueNecesidades" TEXT,
    "esAlergico" TEXT NOT NULL,
    "especifiqueAlergia" TEXT,
    "estaVacunado" TEXT NOT NULL,
    "numeroDosisVacuna" TEXT NOT NULL,
    "representanteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrumento_estudiante" (
    "id" TEXT NOT NULL,
    "instrumento" TEXT NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "estudianteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrumento_estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representantes" (
    "id" TEXT NOT NULL,
    "nombreApellidoMadre" TEXT NOT NULL,
    "cedulaMadre" TEXT NOT NULL,
    "madreViveConAlumno" TEXT NOT NULL,
    "gradoInstruccionMadre" TEXT NOT NULL,
    "direccionMadre" TEXT NOT NULL,
    "telefonoMadre" TEXT NOT NULL,
    "correoMadre" TEXT NOT NULL,
    "nombreApellidoPadre" TEXT NOT NULL,
    "cedulaPadre" TEXT NOT NULL,
    "padreViveConAlumno" TEXT NOT NULL,
    "gradoInstruccionPadre" TEXT NOT NULL,
    "direccionPadre" TEXT NOT NULL,
    "telefonoPadre" TEXT NOT NULL,
    "correoPadre" TEXT NOT NULL,
    "nombreApellidoRepresentanteLegal" TEXT NOT NULL,
    "cedulaRepresentanteLegal" TEXT NOT NULL,
    "representanteLegalViveConAlumno" TEXT NOT NULL,
    "gradoInstruccionRepresentanteLegal" TEXT NOT NULL,
    "direccionRepresentanteLegal" TEXT NOT NULL,
    "telefonoRepresentanteLegal" TEXT NOT NULL,
    "correoRepresentanteLegal" TEXT NOT NULL,
    "parentescoRepresentanteLegal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "representantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_cedulaIdentidad_key" ON "estudiantes"("cedulaIdentidad");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cedula_key" ON "usuarios"("cedula");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_representanteId_fkey" FOREIGN KEY ("representanteId") REFERENCES "representantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrumento_estudiante" ADD CONSTRAINT "instrumento_estudiante_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
