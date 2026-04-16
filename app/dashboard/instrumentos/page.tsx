// app/instrumentos/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstrumentosPage() {
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const router = useRouter();

  const instrumentos = [
    {
      nombre: 'Contrabajo',
      imagen: '/images/contrabajo.png',
      imagenFinal: '/images/viola_final.png',
      descripcion: 'El contrabajo es el instrumento más grande y de sonido más grave de la familia de los instrumentos de cuerda frotada. Se utiliza en orquestas sinfónicas, jazz y otros géneros musicales.',
      rutaPartituras: '/partituras/contrabajo'
    },
    {
      nombre: 'Viola',
      imagen: '/images/viola.jpg',
      imagenFinal: '/images/viola_final.png',
      descripcion: 'La viola es un instrumento de cuerda frotada, similar en construcción al violín pero de mayor tamaño y con un sonido más grave y cálido.',
      rutaPartituras: '/partituras/viola'
    },
    {
      nombre: 'Violín 1',
      imagen: '/images/violin_1.jpg',
      imagenFinal: '/images/violin_final.png',
      descripcion: 'El violín es el instrumento más agudo de la familia de los instrumentos de cuerda frotada. El violín 1 generalmente lleva la melodía principal.',
      rutaPartituras: '/partituras/violin1'
    },
    {
      nombre: 'Violonchelo',
      imagen: '/images/violonchelo.jpg',
      imagenFinal: '/images/Violonchelo_final.png',
      descripcion: 'El violonchelo o cello es un instrumento de cuerda frotada de tesitura media-grave. Se toca apoyado entre las piernas del músico.',
      rutaPartituras: '/partituras/violonchelo'
    },
    {
      nombre: 'Violín 2',
      imagen: '/images/violin_2.jpg',
      imagenFinal: '/images/violin_final.png',
      descripcion: 'El segundo violín complementa al primer violín en la orquesta, generalmente tocando armonías y contramelodías.',
      rutaPartituras: '/partituras/violin2'
    }
  ];

  const instrumentoActual = instrumentos.find(instr => instr.nombre === selectedInstrument);

  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmNGYwIi8+PHJlY3QgeD0iMjAlIiB5PSIyMCUiIHdpZHRoPSI2MCUiIGhlaWdodD0iNjAlIiBmaWxsPSIjZThkNTVjNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NTM1MGYiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.src = fallbackSvg;
    target.classList.add('object-contain', 'p-4');
    target.classList.remove('object-cover');
  };

  const getButtonColor = (instrumentName: string) => {
    const colors = {
      'Contrabajo': 'bg-[#9A784F] hover:bg-[#795C34] text-white',
      'Viola': 'bg-[#795C34] hover:bg-[#65350F] text-white',
      'Violín 1': 'bg-[#65350F] hover:bg-[#362511] text-white',
      'Violonchelo': 'bg-[#80471C] hover:bg-[#652A0E] text-white',
      'Violín 2': 'bg-[#9A784F] hover:bg-[#795C34] text-white'
    };
    return colors[instrumentName as keyof typeof colors] || 'bg-[#795C34] hover:bg-[#65350F] text-white';
  };

  const getBorderColor = (instrumentName: string) => {
    const colors = {
      'Contrabajo': 'border-[#9A784F] hover:border-[#795C34]',
      'Viola': 'border-[#795C34] hover:border-[#65350F]',
      'Violín 1': 'border-[#65350F] hover:border-[#362511]',
      'Violonchelo': 'border-[#80471C] hover:border-[#652A0E]',
      'Violín 2': 'border-[#9A784F] hover:border-[#795C34]'
    };
    return colors[instrumentName as keyof typeof colors] || 'border-[#795C34] hover:border-[#65350F]';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4]">
      {/* Navigation Header */}
      <nav className="bg-[#362511] backdrop-blur-md border-b border-[#795C34] sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 text-white hover:bg-[#795C34] text-lg h-14 px-6 font-semibold transition-colors duration-200"
                onClick={() => router.push('/inicio')}
              >
                <ArrowLeft className="w-6 h-6" />
                Volver 
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14">
                  <Image
                    src="/images/logo.png"
                    alt="Logo EL SISTEMA"
                    fill
                    className="object-contain"
                    onError={handleImageError}
                  />
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-sm">Instrumentos</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#362511] mb-6 drop-shadow-sm">
            Nuestros Instrumentos
          </h1>
          <p className="text-xl text-[#65350F] max-w-3xl mx-auto font-medium">
            Explora cada instrumento de nuestra orquesta
          </p>
        </div>

        {/* Grid de instrumentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
          {instrumentos.slice(0, 3).map((instrumento) => (
            <div key={instrumento.nombre} className="text-center space-y-8">
              <h3 className="text-2xl font-bold text-[#362511] mb-4 drop-shadow-sm">
                {instrumento.nombre}
              </h3>
              
              <div className="relative group inline-block">
                <Button
                  variant="outline"
                  className={`w-64 h-64 rounded-3xl bg-white/90 border-4 ${getBorderColor(instrumento.nombre)} transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-4xl hover:scale-105`}
                  onClick={() => setSelectedInstrument(instrumento.nombre)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={instrumento.imagen}
                      alt={instrumento.nombre}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-300"
                      onError={handleImageError}
                    />
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Segunda fila con 2 instrumentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {instrumentos.slice(3, 5).map((instrumento) => (
            <div key={instrumento.nombre} className="text-center space-y-8">
              <h3 className="text-2xl font-bold text-[#362511] mb-4 drop-shadow-sm">
                {instrumento.nombre}
              </h3>
              
              <div className="relative group inline-block">
                <Button
                  variant="outline"
                  className={`w-64 h-64 rounded-3xl bg-white/90 border-4 ${getBorderColor(instrumento.nombre)} transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-4xl hover:scale-105`}
                  onClick={() => setSelectedInstrument(instrumento.nombre)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={instrumento.imagen}
                      alt={instrumento.nombre}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-300"
                      onError={handleImageError}
                    />
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog con botones de partituras para todos los instrumentos */}
      <Dialog open={!!selectedInstrument} onOpenChange={(open) => !open && setSelectedInstrument(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] max-h-[1000px] overflow-y-auto p-6 bg-white border-[#9A784F] shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold text-center text-[#362511] mb-3">
              {instrumentoActual?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Imagen */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden border-4 border-[#E8D5C4] bg-[#F8F4F0] shadow-xl">
                {instrumentoActual?.imagenFinal ? (
                  <Image
                    src={instrumentoActual.imagenFinal}
                    alt={`${instrumentoActual.nombre} - Vista detallada`}
                    fill
                    className="object-contain p-6"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F8F4F0]">
                    <Image
                      src={fallbackSvg}
                      alt="Imagen no disponible"
                      fill
                      className="object-contain p-8"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Descripción */}
            <div className="bg-gradient-to-br from-[#F8F4F0] to-[#E8D5C4] p-8 rounded-2xl border border-[#D4B8A4] shadow-xl">
              <h3 className="font-bold text-2xl text-[#362511] mb-6 text-center border-b-2 border-[#9A784F] pb-4">
                Descripción
              </h3>
              <p className="text-[#362511] leading-relaxed text-lg text-justify mb-6 font-medium">
                {instrumentoActual?.descripcion}
              </p>
              
              {/* Botón de partituras integrado en la descripción */}
              {instrumentoActual && (
                <div className="text-center mt-6 pt-6 border-t border-[#D4B8A4]">
                  <Button
                    onClick={() => router.push(instrumentoActual.rutaPartituras)}
                    className={`${getButtonColor(instrumentoActual.nombre)} px-8 py-3 text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 font-bold shadow-lg`}
                  >
                    <Music className="w-5 h-5" />
                    Ver Partituras de {instrumentoActual.nombre}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción en el footer del dialog */}
          <div className="flex justify-between items-center pt-6 border-t border-[#E8D5C4] mt-8">
            {/* Botón de partituras (alternativa en footer) */}
            {instrumentoActual && (
              <Button
                onClick={() => router.push(instrumentoActual.rutaPartituras)}
                variant="outline"
                className={`flex items-center gap-2 border-2 font-bold ${getBorderColor(instrumentoActual.nombre)} text-[#362511] hover:text-white ${getButtonColor(instrumentoActual.nombre).replace('text-white', '')}`}
              >
                <Music className="w-4 h-4" />
                Partituras
              </Button>
            )}
            
            {/* Botón para cerrar */}
            <Button
              onClick={() => setSelectedInstrument(null)}
              className="bg-[#795C34] hover:bg-[#65350F] text-white px-8 py-3 text-lg font-semibold shadow-lg transition-colors duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}