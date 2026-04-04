// app/inicio/page.tsx
'use client'

import Header from '@/components/Header'

export default function InicioPage() {
  const partituras = [
    {
      id: 1,
      titulo: "Te Deum-Prelude",
      enlace: "https://drive.google.com/file/d/1SasSgRfHk2Lc9cXM1K0ggGVbLXKvGaAW/view?usp=drive_link",
    },
    {
      id: 2,
      titulo: "Venezuela",
      enlace: "https://drive.google.com/file/d/1tMJ1tbjHRJ0ZJ5qXW9m8WlofvNrjvwO6/view?usp=drive_link",
    },
    {
      id: 3,
      titulo: "#",
      enlace: "#",
    },
    {
      id: 4,
      titulo: "#",
      enlace: "#",
    },
    {
      id: 5,
      titulo: "#",
      enlace: "#",
    },
    {
      id: 6,
      titulo: "#",
      enlace: "#",
    },
    {
      id: 7,
      titulo: "#",
      enlace: "#",
    }
  ]

  const ejerciciosViola = [
    {
      id: 1,
      titulo: "Escalas Básicas Viola",
      enlace: "https://youtu.be/3SjvhT5k6J0?si=PHXLKBeh--hOTfmT",
    },
    {
      id: 2,
      titulo: "Arpegios Posiciones",
      enlace: "https://youtu.be/C9ot1zyBuQw?si=IioQTfD3hENHZ8on",
    },
    {
      id: 3,
      titulo: "Técnica de Arco Viola",
      enlace: "#",
    },
    {
      id: 4,
      titulo: "Ejercicios Ritmo Viola",
      enlace: "#",
    },
    {
      id: 5,
      titulo: "Posiciones Avanzadas",
      enlace: "#",
    },
    {
      id: 6,
      titulo: "Estudios Kreutzer",
      enlace: "#",
    },
    {
      id: 7,
      titulo: "Ejercicios Digitación",
      enlace: "#",
    },
    {
      id: 8,
      titulo: "Técnica Vibrato",
      enlace: "#",
    },
    {
      id: 9,
      titulo: "Estudios Campagnoli",
      enlace: "#",
    },
    {
      id: 10,
      titulo: "Ejercicios Dobles Cuerdas",
      enlace: "#",
    }
  ]

  const handleImageClick = (enlace: string) => {
    if (enlace !== '#') {
      window.open(enlace, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Sección de Partituras */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#362511] mb-4 drop-shadow-sm">
            Biblioteca de Partituras
          </h1>
          <p className="text-xl text-[#65350F] max-w-2xl mx-auto font-medium">
            Partituras disponibles para instrumentos de cuerda
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16">
          {partituras.map((partitura) => (
            <div 
              key={partitura.id}
              className={`cursor-pointer group ${partitura.enlace === '#' ? 'opacity-60' : 'hover:scale-105'}`}
              onClick={() => handleImageClick(partitura.enlace)}
            >
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                partitura.enlace === '#' 
                  ? 'border-[#D4B8A4]' 
                  : 'border-[#9A784F] group-hover:border-[#65350F] group-hover:shadow-xl'
              } transition-all duration-300 h-full flex flex-col`}>
                <div className="aspect-square bg-gradient-to-br from-[#F8F4F0] to-[#E8D5C4] flex items-center justify-center p-4 flex-1">
                  <div className="text-center w-full">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      partitura.enlace === '#' 
                        ? 'bg-[#D4B8A4]' 
                        : 'bg-[#9A784F] group-hover:bg-[#65350F]'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 px-2 line-clamp-2 leading-tight ${
                      partitura.enlace === '#' ? 'text-[#795C34]' : 'text-[#362511]'
                    }`}>
                      {partitura.titulo}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-[#F8F4F0] to-[#E8D5C4] border-t border-[#D4B8A4]">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                      partitura.enlace === '#' ? 'text-[#795C34]' : 'text-[#65350F]'
                    }`}>
                      {partitura.enlace === '#' ? '🔜 Próximamente' : '✅ Disponible'}
                    </span>
                    <span className="text-xs font-semibold text-[#9A784F]">PDF</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Ejercicios de Viola */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#362511] mb-4 drop-shadow-sm">
            Ejercicios de Viola
          </h1>
          <p className="text-xl text-[#65350F] max-w-2xl mx-auto font-medium">
            Material de estudio y ejercicios técnicos específicos para viola
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {ejerciciosViola.map((ejercicio) => (
            <div 
              key={ejercicio.id}
              className={`cursor-pointer group ${ejercicio.enlace === '#' ? 'opacity-60' : 'hover:scale-105'}`}
              onClick={() => handleImageClick(ejercicio.enlace)}
            >
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                ejercicio.enlace === '#' 
                  ? 'border-[#D4B8A4]' 
                  : 'border-[#795C34] group-hover:border-[#65350F] group-hover:shadow-xl'
              } transition-all duration-300 h-full flex flex-col`}>
                <div className="aspect-square bg-gradient-to-br from-[#F8F4F0] to-[#E8D5C4] flex items-center justify-center p-4 flex-1">
                  <div className="text-center w-full">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      ejercicio.enlace === '#' 
                        ? 'bg-[#D4B8A4]' 
                        : 'bg-[#795C34] group-hover:bg-[#65350F]'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 px-2 line-clamp-2 leading-tight ${
                      ejercicio.enlace === '#' ? 'text-[#795C34]' : 'text-[#362511]'
                    }`}>
                      {ejercicio.titulo}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-[#F8F4F0] to-[#E8D5C4] border-t border-[#D4B8A4]">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                      ejercicio.enlace === '#' ? 'text-[#795C34]' : 'text-[#65350F]'
                    }`}>
                      {ejercicio.enlace === '#' ? '🔜 Próximamente' : '✅ Disponible'}
                    </span>
                    <span className="text-xs font-semibold text-[#795C34]">PDF</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional unificada */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#E8D5C4] shadow-lg">
            <h2 className="text-2xl font-bold text-[#362511] mb-6 text-center">
              Recursos de Aprendizaje
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div className="p-4">
                <div className="w-16 h-16 bg-[#9A784F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#65350F] mb-3 text-lg">Partituras Musicales</h3>
                <p className="text-sm text-[#362511] font-medium">
                  Colección completa de partituras para orquesta y ensambles de cuerdas
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-16 h-16 bg-[#795C34] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#65350F] mb-3 text-lg">Ejercicios Viola</h3>
                <p className="text-sm text-[#362511] font-medium">
                  Material especializado de práctica y estudios técnicos para violistas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}