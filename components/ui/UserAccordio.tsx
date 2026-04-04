"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, ChevronDown } from "lucide-react";

export default function UserAccordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="user">
        <Card 
          className="cursor-pointer transition-all duration-300"
          // CAMBIA EL COLOR DE FONDO DE LA TARJETA AQUÍ:
          style={{ backgroundColor: isExpanded ? 'hsl(var(--secondary))' : 'white' }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <CardContent className="p-20">
            <AccordionTrigger className="flex flex-col items-center justify-center p-2 hover:no-underline">
              <div className="flex flex-col items-center">
                <User 
                  className="mb-4" 
                  // CAMBIA EL COLOR Y TAMAÑO DEL ICONO AQUÍ:
                  style={{ color: 'hsl(var(--primary))', fontSize: '3rem', height: '3rem', width: '3rem' }} 
                />
                <h3 className="text-xl font-semibold mb-2">Usuarios</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gestión de usuarios y perfiles
                </p>
                <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-center">
              <div className="space-y-2">
                <p>Total de usuarios: 128</p>
                <p>Administradores: 5</p>
                <p>Invitados: 123</p>
                {/* AÑADE MÁS INFORMACIÓN AQUÍ */}
              </div>
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}