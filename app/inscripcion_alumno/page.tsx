'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, User, Phone, Mail, Music, School, Heart, Users, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

// ============================================
// TIPOS Y DATOS DE VENEZUELA
// ============================================

interface Municipio {
  nombre: string;
  parroquias: string[];
}

interface Estado {
  nombre: string;
  municipios: Municipio[];
}

// Datos completos de Venezuela (Estados, Municipios y Parroquias)
const VENEZUELA_DATA: Estado[] = [
  {
    nombre: "Amazonas",
    municipios: [
      {
        nombre: "Alto Orinoco",
        parroquias: ["Alto Orinoco", "Huachamacare", "Marawaka", "Mavaka", "Sierra Parima"]
      },
      {
        nombre: "Atabapo",
        parroquias: ["Atabapo", "Caname", "Ucata"]
      },
      {
        nombre: "Atures",
        parroquias: ["Atures", "Fernando Girón Tovar", "Luis Alberto Gómez", "Páez"]
      },
      {
        nombre: "Autana",
        parroquias: ["Autana", "Isla Ratón", "Munduapo", "Samariapo"]
      },
      {
        nombre: "Manapiare",
        parroquias: ["Manapiare", "Bajo Ventuari", "Alto Ventuari"]
      },
      {
        nombre: "Maroa",
        parroquias: ["Maroa", "Víctorino"]
      },
      {
        nombre: "Río Negro",
        parroquias: ["Río Negro", "Solano", "Cocuy"]
      }
    ]
  },
  {
    nombre: "Anzoátegui",
    municipios: [
      {
        nombre: "Anaco",
        parroquias: ["Anaco", "San Joaquín"]
      },
      {
        nombre: "Aragua",
        parroquias: ["Aragua", "Cachipo"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Bergantín", "Caigua", "El Carmen", "El Pilar", "Naricual"]
      },
      {
        nombre: "Bruzual",
        parroquias: ["Bruzual", "Clarines", "Guanape", "Sabana de Uchire"]
      },
      {
        nombre: "Cajigal",
        parroquias: ["Cajigal", "Onoto", "San Pablo"]
      },
      {
        nombre: "Carvajal",
        parroquias: ["Carvajal", "Valle de Guanape"]
      },
      {
        nombre: "Diego Bautista Urbaneja",
        parroquias: ["Diego Bautista Urbaneja", "Lechería", "El Morro"]
      },
      {
        nombre: "Freites",
        parroquias: ["Freites", "Cantaura", "Libertador", "Santa Rosa"]
      },
      {
        nombre: "Guanipa",
        parroquias: ["Guanipa", "El Tigre"]
      },
      {
        nombre: "Guanta",
        parroquias: ["Guanta", "Chorrerón"]
      },
      {
        nombre: "Independencia",
        parroquias: ["Independencia", "Soledad"]
      },
      {
        nombre: "Libertad",
        parroquias: ["Libertad", "San Mateo"]
      },
      {
        nombre: "McGregor",
        parroquias: ["McGregor", "El Chaparro"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "Boca de Uchire"]
      },
      {
        nombre: "Monagas",
        parroquias: ["Monagas", "Mapire"]
      },
      {
        nombre: "Peñalver",
        parroquias: ["Peñalver", "Puerto Píritu", "San Miguel"]
      },
      {
        nombre: "Píritu",
        parroquias: ["Píritu", "San Francisco"]
      },
      {
        nombre: "San Juan de Capistrano",
        parroquias: ["San Juan de Capistrano", "Boca de Chávez"]
      },
      {
        nombre: "Santa Ana",
        parroquias: ["Santa Ana", "Pueblo Nuevo"]
      },
      {
        nombre: "Simón Rodríguez",
        parroquias: ["Simón Rodríguez", "El Tigre"]
      },
      {
        nombre: "Sotillo",
        parroquias: ["Sotillo", "Puerto La Cruz", "Pozuelos"]
      }
    ]
  },
  {
    nombre: "Apure",
    municipios: [
      {
        nombre: "Achaguas",
        parroquias: ["Achaguas", "Apurito", "El Yagual", "Guachara"]
      },
      {
        nombre: "Biruaca",
        parroquias: ["Biruaca"]
      },
      {
        nombre: "Muñoz",
        parroquias: ["Muñoz", "Bruzual", "Mantecal", "Quintero", "Rincón Hondo", "San Vicente"]
      },
      {
        nombre: "Páez",
        parroquias: ["Páez", "Aramendi", "El Amparo", "San Juan de Payara"]
      },
      {
        nombre: "Pedro Camejo",
        parroquias: ["Pedro Camejo", "Codazzi", "Cunaviche"]
      },
      {
        nombre: "Rómulo Gallegos",
        parroquias: ["Rómulo Gallegos", "Elorza"]
      },
      {
        nombre: "San Fernando",
        parroquias: ["San Fernando", "El Recreo", "Peñalver", "San Rafael de Atamaica"]
      }
    ]
  },
  {
    nombre: "Aragua",
    municipios: [
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar"]
      },
      {
        nombre: "Camatagua",
        parroquias: ["Camatagua", "Carmen de Cura"]
      },
      {
        nombre: "Francisco Linares Alcántara",
        parroquias: ["Francisco Linares Alcántara", "Francisco de Miranda", "Monseñor Feliciano González"]
      },
      {
        nombre: "Girardot",
        parroquias: ["Girardot", "Choroní", "Las Delicias", "Madre María de San José", "Pedro José Ovalles", "Joaquín Crespo", "José Casanova Godoy", "Andrés Eloy Blanco", "Los Tacariguas"]
      },
      {
        nombre: "José Ángel Lamas",
        parroquias: ["José Ángel Lamas"]
      },
      {
        nombre: "José Félix Ribas",
        parroquias: ["José Félix Ribas", "Castor Nieves Ríos", "Las Guacamayas", "Palo Negro"]
      },
      {
        nombre: "José Rafael Revenga",
        parroquias: ["José Rafael Revenga"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador"]
      },
      {
        nombre: "Mario Briceño Iragorry",
        parroquias: ["Mario Briceño Iragorry", "Caña de Azúcar"]
      },
      {
        nombre: "Ocumare de la Costa de Oro",
        parroquias: ["Ocumare de la Costa de Oro"]
      },
      {
        nombre: "San Casimiro",
        parroquias: ["San Casimiro", "Güiripa", "Ollas de Caramacate", "Valle Morín"]
      },
      {
        nombre: "San Sebastián",
        parroquias: ["San Sebastián"]
      },
      {
        nombre: "Santiago Mariño",
        parroquias: ["Santiago Mariño", "Arévalo Aponte", "Chuao", "Samán de Güere", "Alfredo Pacheco Miranda"]
      },
      {
        nombre: "Santos Michelena",
        parroquias: ["Santos Michelena", "Tiara"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Cagua", "Bella Vista"]
      },
      {
        nombre: "Tovar",
        parroquias: ["Tovar"]
      },
      {
        nombre: "Urdaneta",
        parroquias: ["Urdaneta", "Las Peñitas", "San Francisco de Cara", "Taguay"]
      },
      {
        nombre: "Zamora",
        parroquias: ["Zamora", "Magdaleno", "San Francisco de Asís", "Valles de Tucutunemo"]
      }
    ]
  },
  {
    nombre: "Barinas",
    municipios: [
      {
        nombre: "Alberto Arvelo Torrealba",
        parroquias: ["Alberto Arvelo Torrealba", "Rodríguez Domínguez"]
      },
      {
        nombre: "Andrés Eloy Blanco",
        parroquias: ["Andrés Eloy Blanco", "Puerto Vivas"]
      },
      {
        nombre: "Antonio José de Sucre",
        parroquias: ["Antonio José de Sucre", "El Socorro", "Ticoporo"]
      },
      {
        nombre: "Arismendi",
        parroquias: ["Arismendi", "Guadarrama", "La Unión"]
      },
      {
        nombre: "Barinas",
        parroquias: ["Barinas", "Alfredo Arvelo Larriva", "San Silvestre", "Santa Inés", "Santa Lucía", "Torunos", "El Carmen"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Barinitas", "Altamira", "Calderas"]
      },
      {
        nombre: "Cruz Paredes",
        parroquias: ["Cruz Paredes", "Barrancas", "El Socorro"]
      },
      {
        nombre: "Ezequiel Zamora",
        parroquias: ["Ezequiel Zamora", "Pedro Briceño Méndez", "Ramón Ignacio Méndez", "José Ignacio del Pumar"]
      },
      {
        nombre: "Obispos",
        parroquias: ["Obispos", "Guasimitos", "El Real"]
      },
      {
        nombre: "Pedraza",
        parroquias: ["Pedraza", "Ciudad Bolivia", "Ignacio Briceño", "José Félix Ribas"]
      },
      {
        nombre: "Rojas",
        parroquias: ["Rojas", "Libertad", "Dolores"]
      },
      {
        nombre: "Sosa",
        parroquias: ["Sosa", "Ciudad de Nutrias", "El Regalo", "Puerto de Nutrias"]
      }
    ]
  },
  {
    nombre: "Bolívar",
    municipios: [
      {
        nombre: "Caroní",
        parroquias: ["Caroní", "Cachamay", "Chirica", "Dalla Costa", "Once de Abril", "Simón Bolívar", "Unare", "Universidad", "Vista al Sol", "Pozo Verde", "Yocoima"]
      },
      {
        nombre: "Cedeño",
        parroquias: ["Cedeño", "Altagracia", "Ascensión Farreras", "Guaniamo", "La Urbana", "Pijiguaos"]
      },
      {
        nombre: "El Callao",
        parroquias: ["El Callao"]
      },
      {
        nombre: "Gran Sabana",
        parroquias: ["Gran Sabana", "Ikabarú"]
      },
      {
        nombre: "Heres",
        parroquias: ["Heres", "Agua Salada", "Catedral", "José Antonio Páez", "La Sabanita", "Marhuanta", "Vista Hermosa", "Orinoco", "Zea"]
      },
      {
        nombre: "Padre Pedro Chien",
        parroquias: ["Padre Pedro Chien", "El Palmar"]
      },
      {
        nombre: "Piar",
        parroquias: ["Piar", "Andrés Eloy Blanco", "Pedro Cova"]
      },
      {
        nombre: "Raúl Leoni",
        parroquias: ["Raúl Leoni", "Barceloneta", "San Francisco", "Santa Bárbara"]
      },
      {
        nombre: "Roscio",
        parroquias: ["Roscio", "Salóm"]
      },
      {
        nombre: "Sifontes",
        parroquias: ["Sifontes", "Dalla Costa", "San Isidro"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Aripao", "Guarataro", "Las Majadas", "Moitaco"]
      }
    ]
  },
  {
    nombre: "Carabobo",
    municipios: [
      {
        nombre: "Bejuma",
        parroquias: ["Bejuma", "Canoabo", "Simón Bolívar"]
      },
      {
        nombre: "Carlos Arvelo",
        parroquias: ["Carlos Arvelo", "Güigüe", "Belén", "Tacarigua"]
      },
      {
        nombre: "Diego Ibarra",
        parroquias: ["Diego Ibarra", "Aguas Calientes", "Mariara"]
      },
      {
        nombre: "Guacara",
        parroquias: ["Guacara", "Ciudad Alianza", "Guacara", "Yagua"]
      },
      {
        nombre: "Juan José Mora",
        parroquias: ["Juan José Mora", "Morón", "Urama"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador", "Tocuyito", "Independencia"]
      },
      {
        nombre: "Los Guayos",
        parroquias: ["Los Guayos"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "Miranda"]
      },
      {
        nombre: "Montalbán",
        parroquias: ["Montalbán"]
      },
      {
        nombre: "Naguanagua",
        parroquias: ["Naguanagua"]
      },
      {
        nombre: "Puerto Cabello",
        parroquias: ["Puerto Cabello", "Borburata", "Democracia", "Fraternidad", "Goaigoaza", "Juan José Flores", "Patanemo", "Unión"]
      },
      {
        nombre: "San Diego",
        parroquias: ["San Diego"]
      },
      {
        nombre: "San Joaquín",
        parroquias: ["San Joaquín"]
      },
      {
        nombre: "Valencia",
        parroquias: ["Valencia", "Candelaria", "Catedral", "El Socorro", "Miguel Peña", "Rafael Urdaneta", "San Blas", "San José", "Santa Rosa", "Negro Primero"]
      }
    ]
  },
  {
    nombre: "Cojedes",
    municipios: [
      {
        nombre: "Anzoátegui",
        parroquias: ["Anzoátegui", "Cojedes"]
      },
      {
        nombre: "Falcón",
        parroquias: ["Falcón", "Tinaquillo"]
      },
      {
        nombre: "Girardot",
        parroquias: ["Girardot", "El Baúl"]
      },
      {
        nombre: "Lima Blanco",
        parroquias: ["Lima Blanco", "Macapo"]
      },
      {
        nombre: "Pao de San Juan Bautista",
        parroquias: ["Pao de San Juan Bautista"]
      },
      {
        nombre: "Ricaurte",
        parroquias: ["Ricaurte", "El Amparo", "Libertad de Cojedes"]
      },
      {
        nombre: "Rómulo Gallegos",
        parroquias: ["Rómulo Gallegos"]
      },
      {
        nombre: "San Carlos",
        parroquias: ["San Carlos", "Juan Ángel Bravo", "Manuel Manrique"]
      },
      {
        nombre: "Tinaco",
        parroquias: ["Tinaco"]
      }
    ]
  },
  {
    nombre: "Delta Amacuro",
    municipios: [
      {
        nombre: "Antonio Díaz",
        parroquias: ["Antonio Díaz", "Curiapo", "Almirante Luis Brión", "Francisco Aniceto Lugo", "Manuel Renaud", "Padre Barral", "Santos de Abelgas"]
      },
      {
        nombre: "Casacoima",
        parroquias: ["Casacoima", "Juan Bautista Arismendi", "Manuel Piar", "Rómulo Gallegos"]
      },
      {
        nombre: "Pedernales",
        parroquias: ["Pedernales", "Luis Beltrán Prieto Figueroa"]
      },
      {
        nombre: "Tucupita",
        parroquias: ["Tucupita", "San Rafael", "José Vidal Marcano", "Juan Millán", "Leonardo Ruíz Pineda", "Mariscal Antonio José de Sucre", "Monseñor Argimiro García", "Virgen del Valle"]
      }
    ]
  },
  {
    nombre: "Distrito Capital",
    municipios: [
      {
        nombre: "Libertador",
        parroquias: ["23 de Enero", "Altagracia", "Antímano", "Caricuao", "Catedral", "Coche", "El Junquito", "El Paraíso", "El Recreo", "El Valle", "La Candelaria", "La Pastora", "La Vega", "Macarao", "San Agustín", "San Bernardino", "San José", "San Juan", "San Pedro", "Santa Rosalía", "Santa Teresa", "Sucre"]
      }
    ]
  },
  {
    nombre: "Falcón",
    municipios: [
      {
        nombre: "Acosta",
        parroquias: ["Acosta", "Capadare", "La Pastora", "Libertador", "San Juan de los Cayos"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Aracua", "La Peña", "San Luis"]
      },
      {
        nombre: "Buchivacoa",
        parroquias: ["Buchivacoa", "Bariro", "Borojó", "Capatárida", "Guajiro", "Seque", "Zazárida"]
      },
      {
        nombre: "Cacique Manaure",
        parroquias: ["Cacique Manaure"]
      },
      {
        nombre: "Carirubana",
        parroquias: ["Carirubana", "Norte", "Punta Cardón"]
      },
      {
        nombre: "Colina",
        parroquias: ["Colina", "Acurigua", "Guaibacoa", "Las Calderas", "Macoruca"]
      },
      {
        nombre: "Dabajuro",
        parroquias: ["Dabajuro"]
      },
      {
        nombre: "Democracia",
        parroquias: ["Democracia", "Agua Clara", "Avaria", "Pedregal", "Piedra Grande", "Purureche"]
      },
      {
        nombre: "Falcón",
        parroquias: ["Falcón", "Adaure", "Adícora", "Baraived", "Buena Vista", "Jadacaquiva", "El Vínculo", "El Hato", "Moruy", "Pueblo Nuevo"]
      },
      {
        nombre: "Federación",
        parroquias: ["Federación", "Agua Larga", "Churuguara", "El Paují", "Independencia", "Mapararí"]
      },
      {
        nombre: "Jacura",
        parroquias: ["Jacura", "Agua Linda", "Araurima"]
      },
      {
        nombre: "Los Taques",
        parroquias: ["Los Taques", "Judibana"]
      },
      {
        nombre: "Mauroa",
        parroquias: ["Mauroa", "Mene de Mauroa", "San Félix", "Casigua"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "Guzmán Guillermo", "Mitare", "Río Seco", "Sabaneta", "San Antonio", "San Gabriel", "Santa Ana"]
      },
      {
        nombre: "Monseñor Iturriza",
        parroquias: ["Monseñor Iturriza", "Boca de Tocuyo", "Chichiriviche", "Tocuyo de la Costa"]
      },
      {
        nombre: "Palmasola",
        parroquias: ["Palmasola"]
      },
      {
        nombre: "Petit",
        parroquias: ["Petit", "Cabure", "Colina", "Curimagua"]
      },
      {
        nombre: "Píritu",
        parroquias: ["Píritu", "Píritu"]
      },
      {
        nombre: "San Francisco",
        parroquias: ["San Francisco"]
      },
      {
        nombre: "Silva",
        parroquias: ["Silva", "Tucacas", "Boca de Aroa"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Sucre", "Pecaya"]
      },
      {
        nombre: "Tocópero",
        parroquias: ["Tocópero"]
      },
      {
        nombre: "Unión",
        parroquias: ["Unión", "El Charal", "Las Vegas del Tuy"]
      },
      {
        nombre: "Urumaco",
        parroquias: ["Urumaco", "Bruzual"]
      },
      {
        nombre: "Zamora",
        parroquias: ["Zamora", "Puerto Cumarebo", "La Ciénaga", "La Soledad", "Pueblo Cumarebo", "Zazárida"]
      }
    ]
  },
  {
    nombre: "Guárico",
    municipios: [
      {
        nombre: "Camaguán",
        parroquias: ["Camaguán", "Puerto Miranda", "Uverito"]
      },
      {
        nombre: "Chaguaramas",
        parroquias: ["Chaguaramas"]
      },
      {
        nombre: "El Socorro",
        parroquias: ["El Socorro"]
      },
      {
        nombre: "Francisco de Miranda",
        parroquias: ["Francisco de Miranda", "Calabozo", "El Calvario", "El Rastro"]
      },
      {
        nombre: "José Félix Ribas",
        parroquias: ["José Félix Ribas", "Tucupido", "San Rafael de Laya"]
      },
      {
        nombre: "José Tadeo Monagas",
        parroquias: ["José Tadeo Monagas", "Altagracia de Orituco", "Lezama", "Libertad de Orituco", "Paso Real de Macaira", "San Francisco de Macaira"]
      },
      {
        nombre: "Juan Germán Roscio",
        parroquias: ["Juan Germán Roscio", "San Juan de los Morros", "Cantagallo", "Parapara"]
      },
      {
        nombre: "Julián Mellado",
        parroquias: ["Julián Mellado", "El Sombrero", "Sosa"]
      },
      {
        nombre: "Las Mercedes",
        parroquias: ["Las Mercedes", "Cabruta", "Santa Rita de Manapire"]
      },
      {
        nombre: "Leonardo Infante",
        parroquias: ["Leonardo Infante", "Valle de la Pascua", "Espino"]
      },
      {
        nombre: "Ortiz",
        parroquias: ["Ortiz", "San José de Tiznados", "San Francisco de Tiznados", "San Lorenzo de Tiznados"]
      },
      {
        nombre: "Pedro Zaraza",
        parroquias: ["Pedro Zaraza", "Zaraza", "San José de Unare"]
      },
      {
        nombre: "San Gerónimo de Guayabal",
        parroquias: ["San Gerónimo de Guayabal", "Cazorla"]
      },
      {
        nombre: "San José de Guaribe",
        parroquias: ["San José de Guaribe"]
      },
      {
        nombre: "Santa María de Ipire",
        parroquias: ["Santa María de Ipire", "Altamira"]
      }
    ]
  },
  {
    nombre: "Lara",
    municipios: [
      {
        nombre: "Andrés Eloy Blanco",
        parroquias: ["Andrés Eloy Blanco", "Quebrada Honda de Guache", "Pio Tamayo", "Yacambú"]
      },
      {
        nombre: "Crespo",
        parroquias: ["Crespo", "Duaca", "Freitez", "José María Blanco"]
      },
      {
        nombre: "Iribarren",
        parroquias: ["Iribarren", "Aguedo Felipe Alvarado", "Buena Vista", "Catedral", "Concepción", "El Cují", "Juan de Villegas", "Santa Rosa", "Tamaca", "Unión"]
      },
      {
        nombre: "Jiménez",
        parroquias: ["Jiménez", "Juan Bautista Rodríguez", "Cuara", "Diego de Lozada", "Paraíso de San José", "San Miguel", "Tintorero", "José Bernardo Dorante", "Coronel Mariano Peraza"]
      },
      {
        nombre: "Morán",
        parroquias: ["Morán", "Bolívar", "Anzoátegui", "Guárico", "Hilario Luna y Luna", "Humocaro Alto", "Humocaro Bajo", "La Candelaria", "Moroturo", "San Francisco"]
      },
      {
        nombre: "Palavecino",
        parroquias: ["Palavecino", "Cabudare", "José Gregorio Bastidas", "Agua Viva"]
      },
      {
        nombre: "Simón Planas",
        parroquias: ["Simón Planas", "Buría", "Gustavo Vega", "Sarare"]
      },
      {
        nombre: "Torres",
        parroquias: ["Torres", "Altagracia", "Antonio Díaz", "Camacaro", "Castañeda", "Cecilio Zubillaga", "Chiquinquirá", "El Blanco", "Espinoza de los Monteros", "Heriberto Arroyo", "La Miel", "La Pastora", "Montaña Verde", "Monte Carmelo", "Río Claro", "San Francisco", "San Pedro", "Trinidad Samuel"]
      },
      {
        nombre: "Urdaneta",
        parroquias: ["Urdaneta", "Siquisique", "Moroturo", "San Miguel", "Xaguas"]
      }
    ]
  },
  {
    nombre: "Mérida",
    municipios: [
      {
        nombre: "Alberto Adriani",
        parroquias: ["Alberto Adriani", "Gabriel Picón González", "Héctor Amable Mora", "José Nucete Sardi", "Pulido Méndez", "La Hechicera"]
      },
      {
        nombre: "Andrés Bello",
        parroquias: ["Andrés Bello", "La Azulita"]
      },
      {
        nombre: "Antonio Pinto Salinas",
        parroquias: ["Antonio Pinto Salinas", "Mesa Bolívar", "Mesa de Las Palmas"]
      },
      {
        nombre: "Aricagua",
        parroquias: ["Aricagua", "San Antonio"]
      },
      {
        nombre: "Arzobispo Chacón",
        parroquias: ["Arzobispo Chacón", "Canaguá", "Capurí", "Chacantá", "El Molino", "Guaimaral", "Mucutuy", "Mucuchachí"]
      },
      {
        nombre: "Campo Elías",
        parroquias: ["Campo Elías", "Ejido", "Fernández Peña", "Montalbán", "Matriz", "San José", "Jají"]
      },
      {
        nombre: "Caracciolo Parra Olmedo",
        parroquias: ["Caracciolo Parra Olmedo", "Tucaní"]
      },
      {
        nombre: "Cardenal Quintero",
        parroquias: ["Cardenal Quintero", "Santo Domingo", "Las Piedras"]
      },
      {
        nombre: "Guaraque",
        parroquias: ["Guaraque", "Mesa de Quintero", "Río Negro"]
      },
      {
        nombre: "Julio César Salas",
        parroquias: ["Julio César Salas", "Arapuey", "Palmira"]
      },
      {
        nombre: "Justo Briceño",
        parroquias: ["Justo Briceño", "Torondoy", "San Cristóbal de Torondoy"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador", "Antonio Spinetti Dini", "Arias", "Caracciolo Parra Pérez", "Domingo Peña", "El Llano", "Gonzalo Picón Febres", "Jacinto Plaza", "Juan Rodríguez Suárez", "Lasso de la Vega", "Mariano Picón Salas", "Milla", "Osuna Rodríguez", "Sagrario", "El Morro"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "Andrés Eloy Blanco", "La Venta", "Piñango", "Timotes"]
      },
      {
        nombre: "Obispo Ramos de Lora",
        parroquias: ["Obispo Ramos de Lora", "Eloy Paredes", "San Rafael de Alcázar", "Santa Elena de Arenales"]
      },
      {
        nombre: "Padre Noguera",
        parroquias: ["Padre Noguera", "Santa María de Caparo"]
      },
      {
        nombre: "Pueblo Llano",
        parroquias: ["Pueblo Llano"]
      },
      {
        nombre: "Rangel",
        parroquias: ["Rangel", "Cacute", "La Toma", "Mucurubá", "Mucuchíes", "San Rafael", "Santa Cruz de Mora"]
      },
      {
        nombre: "Rivas Dávila",
        parroquias: ["Rivas Dávila", "Bailadores", "Gerónimo Maldonado"]
      },
      {
        nombre: "Santos Marquina",
        parroquias: ["Santos Marquina", "Tabay"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Chiguará", "Estánques", "Lagunillas", "La Trampa", "Pueblo Nuevo del Sur", "San Juan"]
      },
      {
        nombre: "Tovar",
        parroquias: ["Tovar", "El Amparo", "El Llano", "San Francisco", "Tovar"]
      },
      {
        nombre: "Tulio Febres Cordero",
        parroquias: ["Tulio Febres Cordero", "Independencia", "Mucuchíes", "Palmarito", "Santa Cruz de Mora"]
      },
      {
        nombre: "Zea",
        parroquias: ["Zea", "Caño El Tigre"]
      }
    ]
  },
  {
    nombre: "Miranda",
    municipios: [
      {
        nombre: "Acevedo",
        parroquias: ["Acevedo", "Caucagua", "Aragüita", "Arévalo González", "Capaya", "El Café", "Marizapa", "Panaquire", "Ribas"]
      },
      {
        nombre: "Andrés Bello",
        parroquias: ["Andrés Bello", "San José de Barlovento"]
      },
      {
        nombre: "Baruta",
        parroquias: ["Baruta", "El Cafetal", "Las Minas de Baruta"]
      },
      {
        nombre: "Brión",
        parroquias: ["Brión", "Higuerote", "Curiepe", "Tacarigua"]
      },
      {
        nombre: "Buroz",
        parroquias: ["Buroz", "Mamporal"]
      },
      {
        nombre: "Carrizal",
        parroquias: ["Carrizal"]
      },
      {
        nombre: "Chacao",
        parroquias: ["Chacao"]
      },
      {
        nombre: "Cristóbal Rojas",
        parroquias: ["Cristóbal Rojas", "Charallave", "Las Brisas"]
      },
      {
        nombre: "El Hatillo",
        parroquias: ["El Hatillo"]
      },
      {
        nombre: "Guaicaipuro",
        parroquias: ["Guaicaipuro", "Los Teques", "Altagracia de la Montaña", "Cecilio Acosta", "El Jarillo", "Paracotos", "San Pedro", "Tácata"]
      },
      {
        nombre: "Independencia",
        parroquias: ["Independencia", "Santa Teresa del Tuy", "El Cartanal"]
      },
      {
        nombre: "Lander",
        parroquias: ["Lander", "Ocumare del Tuy", "La Democracia", "Santa Bárbara"]
      },
      {
        nombre: "Los Salias",
        parroquias: ["Los Salias", "San Antonio de los Altos"]
      },
      {
        nombre: "Páez",
        parroquias: ["Páez", "Río Chico", "El Guapo", "Tacarigua de la Laguna", "Paparo", "San Fernando del Guapo"]
      },
      {
        nombre: "Paz Castillo",
        parroquias: ["Paz Castillo", "Santa Lucía"]
      },
      {
        nombre: "Pedro Gual",
        parroquias: ["Pedro Gual", "Cúpira", "Machurucuto"]
      },
      {
        nombre: "Plaza",
        parroquias: ["Plaza", "Guarenas"]
      },
      {
        nombre: "Simón Bolívar",
        parroquias: ["Simón Bolívar", "San Francisco de Yare", "San Antonio de Yare"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Petare", "Caucagüita", "Fila de Mariches", "La Dolorita", "Leoncio Martínez"]
      },
      {
        nombre: "Urdaneta",
        parroquias: ["Urdaneta", "Cúa", "Nueva Cúa"]
      },
      {
        nombre: "Zamora",
        parroquias: ["Zamora", "Guatire", "Bolívar"]
      }
    ]
  },
  {
    nombre: "Monagas",
    municipios: [
      {
        nombre: "Acosta",
        parroquias: ["Acosta", "San Antonio", "San Francisco"]
      },
      {
        nombre: "Aguasay",
        parroquias: ["Aguasay"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Caripito"]
      },
      {
        nombre: "Caripe",
        parroquias: ["Caripe", "El Guácharo", "La Guanota", "Sabana de Piedra", "San Agustín", "Tereseño"]
      },
      {
        nombre: "Cedeño",
        parroquias: ["Cedeño", "Areo", "San Félix", "Viento Fresco"]
      },
      {
        nombre: "Ezequiel Zamora",
        parroquias: ["Ezequiel Zamora", "El Tejero", "Punta de Mata"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador", "Chaguaramas", "Las Alhuacas", "Tabasca", "Temblador"]
      },
      {
        nombre: "Maturín",
        parroquias: ["Maturín", "Alto de los Godos", "Boquerón", "El Corozo", "El Furrial", "Jusepín", "La Pica", "San Simón", "Santa Bárbara", "El Furrial", "Las Cocuizas"]
      },
      {
        nombre: "Piar",
        parroquias: ["Piar", "Aragua", "Chaguaramal", "El Pinto", "Guanaguana", "La Toscana", "Taguaya"]
      },
      {
        nombre: "Punceres",
        parroquias: ["Punceres", "Cachipo", "Quiriquire"]
      },
      {
        nombre: "Santa Bárbara",
        parroquias: ["Santa Bárbara"]
      },
      {
        nombre: "Sotillo",
        parroquias: ["Sotillo", "Barrancas", "Los Barrancos"]
      },
      {
        nombre: "Uracoa",
        parroquias: ["Uracoa"]
      }
    ]
  },
  {
    nombre: "Nueva Esparta",
    municipios: [
      {
        nombre: "Antolín del Campo",
        parroquias: ["Antolín del Campo"]
      },
      {
        nombre: "Arismendi",
        parroquias: ["Arismendi", "La Asunción"]
      },
      {
        nombre: "García",
        parroquias: ["García", "El Valle del Espíritu Santo"]
      },
      {
        nombre: "Gómez",
        parroquias: ["Gómez", "Santa Ana", "Punta de Piedras"]
      },
      {
        nombre: "Maneiro",
        parroquias: ["Maneiro", "Pampatar"]
      },
      {
        nombre: "Marcano",
        parroquias: ["Marcano", "Juan Griego"]
      },
      {
        nombre: "Mariño",
        parroquias: ["Mariño", "Porlamar"]
      },
      {
        nombre: "Península de Macanao",
        parroquias: ["Península de Macanao", "Boca de Río", "San Francisco"]
      },
      {
        nombre: "Tubores",
        parroquias: ["Tubores", "Punta de Piedras", "Los Barales"]
      },
      {
        nombre: "Villalba",
        parroquias: ["Villalba", "San Pedro de Coche"]
      },
      {
        nombre: "Díaz",
        parroquias: ["Díaz", "San Juan Bautista"]
      }
    ]
  },
  {
    nombre: "Portuguesa",
    municipios: [
      {
        nombre: "Agua Blanca",
        parroquias: ["Agua Blanca"]
      },
      {
        nombre: "Araure",
        parroquias: ["Araure", "Río Acarigua"]
      },
      {
        nombre: "Esteller",
        parroquias: ["Esteller", "Píritu"]
      },
      {
        nombre: "Guanare",
        parroquias: ["Guanare", "Córdoba", "San José de la Montaña", "San Juan de Guanaguanare", "Virgen de la Coromoto"]
      },
      {
        nombre: "Guanarito",
        parroquias: ["Guanarito", "Trinidad de la Capilla", "Divina Pastora"]
      },
      {
        nombre: "Monseñor José Vicente de Unda",
        parroquias: ["Monseñor José Vicente de Unda", "Peña Blanca"]
      },
      {
        nombre: "Ospino",
        parroquias: ["Ospino", "Aparición", "La Estación"]
      },
      {
        nombre: "Páez",
        parroquias: ["Páez", "Acarigua", "Payara", "Pimpinela", "Ramón Peraza"]
      },
      {
        nombre: "Papelón",
        parroquias: ["Papelón", "Caño Delgadito"]
      },
      {
        nombre: "San Genaro de Boconoíto",
        parroquias: ["San Genaro de Boconoíto", "Antolín Tovar", "Boconoíto"]
      },
      {
        nombre: "San Rafael de Onoto",
        parroquias: ["San Rafael de Onoto", "Santa Fé", "Thermo Morles"]
      },
      {
        nombre: "Santa Rosalía",
        parroquias: ["Santa Rosalía", "Florida", "El Playón"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Biscucuy", "Concepción", "San José de Saguaz", "San Rafael de Palo Alzado", "Uvencio Antonio Velásquez", "Villa Rosa"]
      },
      {
        nombre: "Turen",
        parroquias: ["Turen", "Villa Bruzual", "Canelones", "Santa Cruz"]
      }
    ]
  },
  {
    nombre: "Sucre",
    municipios: [
      {
        nombre: "Andrés Eloy Blanco",
        parroquias: ["Andrés Eloy Blanco", "Mariño"]
      },
      {
        nombre: "Andrés Mata",
        parroquias: ["Andrés Mata", "San José de Aerocuar", "Tavera Acosta"]
      },
      {
        nombre: "Arismendi",
        parroquias: ["Arismendi", "Río Caribe", "Antonio José de Sucre", "El Morro de Puerto Santo", "Puerto Santo", "San Juan de las Galdonas"]
      },
      {
        nombre: "Benítez",
        parroquias: ["Benítez", "El Pilar", "El Rincón", "General Francisco Antonio Váquez", "Guaraúnos", "Tunapuicito", "Unión"]
      },
      {
        nombre: "Bermúdez",
        parroquias: ["Bermúdez", "Carúpano", "Santa Catalina", "Santa Rosa", "Santa Teresa"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Marigüitar"]
      },
      {
        nombre: "Cajigal",
        parroquias: ["Cajigal", "Yaguaraparo", "El Paujil", "Libertad"]
      },
      {
        nombre: "Cruz Salmerón Acosta",
        parroquias: ["Cruz Salmerón Acosta", "Araya", "Chacopata", "Manicuare"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador", "Tunapuy"]
      },
      {
        nombre: "Mariño",
        parroquias: ["Mariño", "Irapa", "Campo Claro", "Maraval", "San Antonio de Irapa", "Soro"]
      },
      {
        nombre: "Mejía",
        parroquias: ["Mejía"]
      },
      {
        nombre: "Montes",
        parroquias: ["Montes", "Cumanacoa", "Arenas", "Aricagua", "Cocollar", "San Fernando", "San Lorenzo"]
      },
      {
        nombre: "Ribero",
        parroquias: ["Ribero", "Cariaco", "Catuaro", "Rendón", "Santa Cruz", "Santa María"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Cumaná", "Altagracia", "Ayacucho", "Santa Inés", "Valentín Valiente"]
      },
      {
        nombre: "Valdez",
        parroquias: ["Valdez", "Güiria", "Bideau", "Cristóbal Colón", "Punta de Piedras"]
      }
    ]
  },
  {
    nombre: "Táchira",
    municipios: [
      {
        nombre: "Andrés Bello",
        parroquias: ["Andrés Bello", "Cordero"]
      },
      {
        nombre: "Antonio Rómulo Costa",
        parroquias: ["Antonio Rómulo Costa", "Las Mesas"]
      },
      {
        nombre: "Ayacucho",
        parroquias: ["Ayacucho", "Colón", "Rivas Berti", "San Pedro del Río"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "San Antonio del Táchira"]
      },
      {
        nombre: "Cárdenas",
        parroquias: ["Cárdenas", "Táriba", "Emilio Constantino Guerrero", "Francisco de Miranda", "La Concordia", "San José de Bolívar"]
      },
      {
        nombre: "Córdoba",
        parroquias: ["Córdoba", "Santa Ana del Táchira"]
      },
      {
        nombre: "Fernández Feo",
        parroquias: ["Fernández Feo", "San Rafael del Piñal", "Alberto Adriani", "Santo Domingo"]
      },
      {
        nombre: "Francisco de Miranda",
        parroquias: ["Francisco de Miranda", "San José de Bolívar"]
      },
      {
        nombre: "García de Hevia",
        parroquias: ["García de Hevia", "La Fría", "Boca de Grita", "José Antonio Páez"]
      },
      {
        nombre: "Guásimos",
        parroquias: ["Guásimos", "Palmira"]
      },
      {
        nombre: "Independencia",
        parroquias: ["Independencia", "Capacho Nuevo", "Juan Germán Roscio", "Román Cárdenas"]
      },
      {
        nombre: "Jáuregui",
        parroquias: ["Jáuregui", "La Grita", "Emilio Constantino Guerrero", "Monseñor Miguel Antonio Salas"]
      },
      {
        nombre: "José María Vargas",
        parroquias: ["José María Vargas", "El Cobre"]
      },
      {
        nombre: "Junín",
        parroquias: ["Junín", "Rubio", "Bramón", "La Petrólea", "Quinimarí"]
      },
      {
        nombre: "Libertad",
        parroquias: ["Libertad", "Capacho Viejo", "Cipriano Castro", "Manuel Felipe Rugeles"]
      },
      {
        nombre: "Libertador",
        parroquias: ["Libertador", "Abejales", "Doradas", "Emeterio Ochoa", "San Joaquín de Navay"]
      },
      {
        nombre: "Lobatera",
        parroquias: ["Lobatera", "Lobatera", "Constitución"]
      },
      {
        nombre: "Michelena",
        parroquias: ["Michelena"]
      },
      {
        nombre: "Panamericano",
        parroquias: ["Panamericano", "Coloncito", "La Palmita"]
      },
      {
        nombre: "Pedro María Ureña",
        parroquias: ["Pedro María Ureña", "Ureña", "Nueva Arcadia"]
      },
      {
        nombre: "Rafael Urdaneta",
        parroquias: ["Rafael Urdaneta", "Delicias", "Pecaya"]
      },
      {
        nombre: "Samuel Darío Maldonado",
        parroquias: ["Samuel Darío Maldonado", "La Tendida", "San Isidro"]
      },
      {
        nombre: "San Cristóbal",
        parroquias: ["San Cristóbal", "La Concordia", "Pedro María Morantes", "San Juan Bautista", "San Sebastián"]
      },
      {
        nombre: "San Judas Tadeo",
        parroquias: ["San Judas Tadeo", "Umuquena"]
      },
      {
        nombre: "Seboruco",
        parroquias: ["Seboruco"]
      },
      {
        nombre: "Simón Rodríguez",
        parroquias: ["Simón Rodríguez", "San Simón"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Queniquea", "San Pablo", "Santo Domingo"]
      },
      {
        nombre: "Torbes",
        parroquias: ["Torbes", "San Josecito"]
      },
      {
        nombre: "Urdaneta",
        parroquias: ["Urdaneta", "Delicias", "Pecaya"]
      }
    ]
  },
  {
    nombre: "Trujillo",
    municipios: [
      {
        nombre: "Andrés Bello",
        parroquias: ["Andrés Bello", "Santa Isabel"]
      },
      {
        nombre: "Boconó",
        parroquias: ["Boconó", "El Carmen", "Mosquey", "Ayacucho", "Burbusay", "General Ribas", "Guaramacal", "Vega de Guaramacal", "Monseñor Jáuregui", "Rafael Rangel", "San Miguel", "San José"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Sabana Grande"]
      },
      {
        nombre: "Candelaria",
        parroquias: ["Candelaria", "Chejendé", "Carache", "La Mesa de Esnujaque", "Trujillo", "Niquitao"]
      },
      {
        nombre: "Carache",
        parroquias: ["Carache", "La Concepción", "Carvajal", "Cuicas", "Panamericana"]
      },
      {
        nombre: "Escuque",
        parroquias: ["Escuque", "La Unión", "Sabana Libre"]
      },
      {
        nombre: "José Felipe Márquez Cañizalez",
        parroquias: ["José Felipe Márquez Cañizalez", "El Paradero", "San Lázaro"]
      },
      {
        nombre: "Juan Vicente Campo Elías",
        parroquias: ["Juan Vicente Campo Elías", "Campo Elías"]
      },
      {
        nombre: "La Ceiba",
        parroquias: ["La Ceiba", "Santa Apolonia", "El Progreso", "La Ceiba", "Tres de Febrero"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "El Dividive", "Agua Santa", "Agua Caliente", "El Cenizo", "Valerita"]
      },
      {
        nombre: "Monte Carmelo",
        parroquias: ["Monte Carmelo", "Buena Vista", "Santa María del Horcón"]
      },
      {
        nombre: "Motatán",
        parroquias: ["Motatán", "El Baño", "Jalisco"]
      },
      {
        nombre: "Pampán",
        parroquias: ["Pampán", "Flor de Patria", "La Paz", "Santa Ana"]
      },
      {
        nombre: "Pampanito",
        parroquias: ["Pampanito", "La Concepción", "Pampanito"]
      },
      {
        nombre: "Rafael Rangel",
        parroquias: ["Rafael Rangel", "Betijoque", "El Cedro", "La Pueblita", "Las Piedras", "Los Cedros", "José Gregorio Hernández"]
      },
      {
        nombre: "San Rafael de Carvajal",
        parroquias: ["San Rafael de Carvajal", "Carvajal", "Campo Alegre", "Antonio Nicolás Briceño", "José Leonardo Suárez"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Sabana de Mendoza", "Junín", "Valmore Rodríguez", "El Paraíso"]
      },
      {
        nombre: "Trujillo",
        parroquias: ["Trujillo", "Andrés Linares", "Chiquinquirá", "Cristóbal Mendoza", "Cruz Carrillo", "Matriz", "Monseñor Carrillo", "Tres Esquinas"]
      },
      {
        nombre: "Urdaneta",
        parroquias: ["Urdaneta", "La Quebrada", "Carrillo", "Cabimbú", "Jajó"]
      },
      {
        nombre: "Valera",
        parroquias: ["Valera", "Juan Ignacio Montilla", "La Beatriz", "La Puerta", "Mendoza del Valle del Momboy", "Mercedes Díaz", "San Luis"]
      }
    ]
  },
  {
    nombre: "Vargas",
    municipios: [
      {
        nombre: "Vargas",
        parroquias: ["Caraballeda", "Carayaca", "Carlos Soublette", "Caruao", "Catia La Mar", "El Junko", "La Guaira", "Macuto", "Maiquetía", "Naiguatá", "Urimare"]
      }
    ]
  },
  {
    nombre: "Yaracuy",
    municipios: [
      {
        nombre: "Arístides Bastidas",
        parroquias: ["Arístides Bastidas", "San Pablo"]
      },
      {
        nombre: "Bolívar",
        parroquias: ["Bolívar", "Aroa"]
      },
      {
        nombre: "Bruzual",
        parroquias: ["Bruzual", "Chivacoa", "Campo Elías"]
      },
      {
        nombre: "Cocorote",
        parroquias: ["Cocorote"]
      },
      {
        nombre: "Independencia",
        parroquias: ["Independencia", "Independencia"]
      },
      {
        nombre: "José Antonio Páez",
        parroquias: ["José Antonio Páez", "Sabana de Parra"]
      },
      {
        nombre: "La Trinidad",
        parroquias: ["La Trinidad", "Boraure"]
      },
      {
        nombre: "Manuel Monge",
        parroquias: ["Manuel Monge", "Yumare"]
      },
      {
        nombre: "Nirgua",
        parroquias: ["Nirgua", "Salom", "Temerla"]
      },
      {
        nombre: "Peña",
        parroquias: ["Peña", "Yaritagua", "San Andrés"]
      },
      {
        nombre: "San Felipe",
        parroquias: ["San Felipe", "Albarico", "San Javier", "Urachiche"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Guama"]
      },
      {
        nombre: "Urachiche",
        parroquias: ["Urachiche"]
      },
      {
        nombre: "Veroes",
        parroquias: ["Veroes", "El Guayabo", "Farriar"]
      }
    ]
  },
  {
    nombre: "Zulia",
    municipios: [
      {
        nombre: "Almirante Padilla",
        parroquias: ["Almirante Padilla", "Isla de Toas", "Monte Carmelo"]
      },
      {
        nombre: "Baralt",
        parroquias: ["Baralt", "San Timoteo", "General Urdaneta", "Libertador", "Marcelino Briceño", "Pueblo Nuevo", "Manuel Guanipa Matos"]
      },
      {
        nombre: "Cabimas",
        parroquias: ["Cabimas", "Ambrosio", "Carmen Herrera", "La Rosa", "Germán Ríos Linares", "San Benito", "Rómulo Betancourt", "Jorge Hernández", "Punta Gorda"]
      },
      {
        nombre: "Catatumbo",
        parroquias: ["Catatumbo", "Encontrados", "Udón Pérez"]
      },
      {
        nombre: "Colón",
        parroquias: ["Colón", "San Carlos del Zulia", "Moralito", "Santa Bárbara", "Santa Cruz del Zulia", "Urribarrí"]
      },
      {
        nombre: "Francisco Javier Pulgar",
        parroquias: ["Francisco Javier Pulgar", "Carlos Quevedo", "Francisco Javier Pulgar", "Simón Rodríguez"]
      },
      {
        nombre: "Jesús Enrique Lossada",
        parroquias: ["Jesús Enrique Lossada", "La Concepción", "San José", "Mariano Parra León", "José Ramón Yépez"]
      },
      {
        nombre: "Jesús María Semprún",
        parroquias: ["Jesús María Semprún", "Bari", "Casigua El Cubo"]
      },
      {
        nombre: "La Cañada de Urdaneta",
        parroquias: ["La Cañada de Urdaneta", "Concepción", "Andrés Bello", "Antonio Borjas Romero", "José Centeno", "Chiquinquirá", "El Carmelo", "Potreritos"]
      },
      {
        nombre: "Lagunillas",
        parroquias: ["Lagunillas", "Alonso de Ojeda", "Campo Rojo", "Venezuela", "El Danto", "Libertad"]
      },
      {
        nombre: "Machiques de Perijá",
        parroquias: ["Machiques de Perijá", "Bartolomé de las Casas", "Libertad", "Río Negro", "San José de Perijá"]
      },
      {
        nombre: "Mara",
        parroquias: ["Mara", "San Rafael", "La Sierrita", "Las Parcelas", "Luis de Vicente", "Monseñor Marcos Sergio Godoy", "Ricaurte", "Tamare"]
      },
      {
        nombre: "Maracaibo",
        parroquias: ["Maracaibo", "Antonio Borjas Romero", "Bolívar", "Cacique Mara", "Caracciolo Parra Pérez", "Cecilio Acosta", "Cristo de Aranza", "Coquivacoa", "Chiquinquirá", "Francisco Eugenio Bustamante", "Idelfonso Vásquez", "Juana de Ávila", "Luis Hurtado Higuera", "Manuel Dagnino", "Olegario Villalobos", "Raúl Leoni", "Santa Lucía", "San Isidro", "Venancio Pulgar"]
      },
      {
        nombre: "Miranda",
        parroquias: ["Miranda", "Altagracia", "Ana María Campos", "Faría", "San Antonio", "San José"]
      },
      {
        nombre: "Páez",
        parroquias: ["Páez", "Sinamaica", "Alta Guajira", "Elías Sánchez Rubio", "Guajira"]
      },
      {
        nombre: "Rosario de Perijá",
        parroquias: ["Rosario de Perijá", "El Rosario", "Donaldo García", "Sixto Zambrano"]
      },
      {
        nombre: "San Francisco",
        parroquias: ["San Francisco", "Domitila Flores", "El Bajo", "Francisco Ochoa", "Los Cortijos", "Marcial Hernández", "San Francisco"]
      },
      {
        nombre: "Santa Rita",
        parroquias: ["Santa Rita", "El Mene", "José Cenobio Urribarrí", "Pedro Lucas Urribarrí"]
      },
      {
        nombre: "Simón Bolívar",
        parroquias: ["Simón Bolívar", "Manuel Manrique", "Rafael María Baralt"]
      },
      {
        nombre: "Sucre",
        parroquias: ["Sucre", "Bobures", "Gibraltar", "Heras", "Monseñor Arturo Álvarez", "Rómulo Gallegos", "La Ceiba", "El Batey"]
      },
      {
        nombre: "Valmore Rodríguez",
        parroquias: ["Valmore Rodríguez", "Bachaquero", "La Victoria", "Rafael Urdaneta"]
      }
    ]
  }
];

// ============================================
// TIPOS PARA EL FORMULARIO
// ============================================

interface FormData {
  // Información personal
  nombres: string;
  apellidos: string;
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
  
  // Información musical
  nombreAgrupacionesPertenecio: string;
  nucleo: string;
  añoInicio: string;
  agrupacionPertenece: string;
  instrumentoPrincipal: string;
  instrumentosSecundarios: string;
  
  // Información académica
  nombreColegio: string;
  gradoCursa: string;

  // Información de salud
  enfermedadesPadece: string;
  otrasEnfermedades: string;
  condicionAlumno: string;
  especifiqueCondicion: string;
  necesidadesEspecialesAprendizaje: string;
  especifiqueNecesidades: string;
  esAlergico: string;
  especifiqueAlergia: string;
  estaVacunado: string;
  numeroDosisVacuna: string;

  // Representante (se asignará después)
  representanteId?: string;
}

// ============================================
// COMPONENTES PERSONALIZADOS
// ============================================

// Componente para el select de núcleos con buscador
function NucleoSelect({ 
  value, 
  onValueChange, 
  error 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  error?: string;
}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nucleos: string[] = [
    "Baruta", "BCV", "Cantv-Ccs", "Caricuao", "Carmelitas", 
    "Centro académico regional 23 de enero", "Centro académico regional La Rinconada", 
    "Centro académico regional La Rinconada (escuela venezolana de planificación)", 
    "Centro académico regional Los Chorros", "Centro académico regional Montalbán", 
    "Centro académico regional San Agustín", "Centro de formación coral inocente Carreño", 
    "Chacao libertador", "Chapellín", "CICPC", "Ciudad caribia", "Colonia Tovar", 
    "Comandancia G.N", "Convenio Vicepresidencia", "Corpoelec", "Cultura Chacao", 
    "Chacao U.E.N el libertador (Cultura Chacao)", "Chacao U.E.N el libertador (Carlos Soublette)", 
    "el Hatillo", "Entidad de atención Dr. José Gregorio Hernández", "Fuerte Tiuna", 
    "Galipán", "gran Colombia", "junín", "junco", "la Carlota", "la Ceiba", "la Hoyada", 
    "la pastora", "La Vega", "lince", "los rosales", "Miraflores", "penitenciario ciudad Caracas el cementerio", 
    "penitenciario coche", "petare", "quebrada Honda", "quinta Marilina", "Ruiz Pineda", 
    "Santa Cruz del este", "Santa Rosa", "Sarría", "seniat", "Soublette chacao", "TSJ", 
    "universidad Santa Rosa"
  ];

  const nucleosFiltrados = useMemo<string[]>(() => {
    if (!searchTerm) return nucleos;
    return nucleos.filter((nucleo: string) =>
      nucleo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, nucleos]);

  return (
    <div className="space-y-2">
      <Label htmlFor="nucleo" className="text-sm font-bold text-[#362511]">
        Núcleo <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onValueChange} onOpenChange={setIsOpen}>
        <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Seleccione el núcleo" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E8D5C4] max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-[#E8D5C4] z-10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#A67C52] w-4 h-4" />
              <Input
                placeholder="Buscar núcleo..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 h-8 text-sm border-[#E8D5C4] focus:border-[#9A784F]"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="px-3 py-1 text-xs text-[#8B6B4D] bg-[#F8F4EF] border-b border-[#E8D5C4]">
            {nucleosFiltrados.length} de {nucleos.length} núcleos
          </div>

          {nucleosFiltrados.length > 0 ? (
            nucleosFiltrados.map((nucleo: string) => (
              <SelectItem key={nucleo} value={nucleo} className="text-sm">
                {nucleo}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-[#8B6B4D] text-center">
              No se encontraron núcleos
            </div>
          )}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

// Componente para el select de Estado
function EstadoSelect({ 
  value, 
  onValueChange, 
  error 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="lugarNacimiento" className="text-sm font-bold text-[#362511]">
        Lugar de Nacimiento (Estado) <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Seleccione el estado" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E8D5C4] max-h-60 overflow-y-auto">
          {VENEZUELA_DATA.map((estado: Estado) => (
            <SelectItem key={estado.nombre} value={estado.nombre}>
              {estado.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

// Componente para el select de Municipio
function MunicipioSelect({ 
  estadoSeleccionado,
  value, 
  onValueChange, 
  error,
  disabled
}: { 
  estadoSeleccionado: string;
  value: string; 
  onValueChange: (value: string) => void; 
  error?: string;
  disabled: boolean;
}) {
  const municipios = useMemo<string[]>(() => {
    if (!estadoSeleccionado) return [];
    const estado = VENEZUELA_DATA.find((e: Estado) => e.nombre === estadoSeleccionado);
    return estado ? estado.municipios.map((m: Municipio) => m.nombre) : [];
  }, [estadoSeleccionado]);

  return (
    <div className="space-y-2">
      <Label htmlFor="municipio" className="text-sm font-bold text-[#362511]">
        Municipio <span className="text-red-500">*</span>
      </Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled || !estadoSeleccionado}
      >
        <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${error ? 'border-red-500' : ''} ${disabled || !estadoSeleccionado ? 'opacity-50' : ''}`}>
          <SelectValue placeholder={!estadoSeleccionado ? "Primero seleccione un estado" : "Seleccione el municipio"} />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E8D5C4] max-h-60 overflow-y-auto">
          {municipios.map((municipio: string) => (
            <SelectItem key={municipio} value={municipio}>
              {municipio}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

// Componente para el select de Parroquia
function ParroquiaSelect({ 
  estadoSeleccionado,
  municipioSeleccionado,
  value, 
  onValueChange, 
  error,
  disabled
}: { 
  estadoSeleccionado: string;
  municipioSeleccionado: string;
  value: string; 
  onValueChange: (value: string) => void; 
  error?: string;
  disabled: boolean;
}) {
  const parroquias = useMemo<string[]>(() => {
    if (!estadoSeleccionado || !municipioSeleccionado) return [];
    const estado = VENEZUELA_DATA.find((e: Estado) => e.nombre === estadoSeleccionado);
    if (!estado) return [];
    const municipio = estado.municipios.find((m: Municipio) => m.nombre === municipioSeleccionado);
    return municipio ? municipio.parroquias : [];
  }, [estadoSeleccionado, municipioSeleccionado]);

  return (
    <div className="space-y-2">
      <Label htmlFor="parroquia" className="text-sm font-bold text-[#362511]">
        Parroquia <span className="text-red-500">*</span>
      </Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled || !municipioSeleccionado}
      >
        <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${error ? 'border-red-500' : ''} ${disabled || !municipioSeleccionado ? 'opacity-50' : ''}`}>
          <SelectValue placeholder={!municipioSeleccionado ? "Primero seleccione un municipio" : "Seleccione la parroquia"} />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E8D5C4] max-h-60 overflow-y-auto">
          {parroquias.map((parroquia: string) => (
            <SelectItem key={parroquia} value={parroquia}>
              {parroquia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

// *** LISTA ACTUALIZADA DE AGRUPACIONES (ORQUESTA ACTUAL) ***
const agrupacionesMusicales: string[] = [
  "Iniciación Musical",
  "Coro Infantil",
  "Coro Juvenil Eduardo Plaza",
  "Coro Adulto",
  "Programa Educación Especial (P.E.E)",
  "Orquesta Afrovenezolana Infantil",
  "Orquesta Afrovenezolana Regional Otilio Galíndez",
  "Orquesta Alma Llanera Infantil",
  "Orquesta Alma Llanera Regional Cristóbal Jiménez",
  "Orquesta Sinfónica Beethoven",
  "Orquesta Sinfónica Infantil",
  "Orquesta Sinfónica Regional Juvenil Juan Bautista Plaza",
  "Danza",
  "Piano",
  "Orquesta Latino Caribeña"
];

const gradosEscolares: string[] = [
  "1er Grado",
  "2do Grado",
  "3er Grado",
  "4to Grado",
  "5to Grado",
  "6to Grado",
  "1er Año",
  "2do Año",
  "3er Año",
  "4to Año",
  "5to Año"
];

const instrumentosMusicales: string[] = [
  "Violín",
  "Viola", 
  "Violonchelo",
  "Contrabajo"
];

// Función auxiliar para manejar localStorage de forma segura
const guardarEnLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (error: unknown) {
    console.error('Error guardando en localStorage:', error instanceof Error ? error.message : 'Error desconocido');
  }
};

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombres: '',
    apellidos: '',
    cedulaIdentidad: '',
    fechaNacimiento: '',
    edad: '',
    sexo: '',
    lugarNacimiento: '',
    municipio: '',
    parroquia: '',
    direccionHabitacion: '',
    numeroTelefonoCelular: '',
    numeroTelefonoLocal: '',
    correoElectronico: '',
    nombreAgrupacionesPertenecio: '',
    nucleo: '',
    añoInicio: '',
    agrupacionPertenece: '',
    instrumentoPrincipal: '',
    instrumentosSecundarios: '',
    nombreColegio: '',
    gradoCursa: '',
    enfermedadesPadece: '',
    otrasEnfermedades: '',
    condicionAlumno: '',
    especifiqueCondicion: '',
    necesidadesEspecialesAprendizaje: '',
    especifiqueNecesidades: '',
    esAlergico: '',
    especifiqueAlergia: '',
    estaVacunado: '',
    numeroDosisVacuna: ''
  });

  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas] = useState<string[]>([]);
  const [instrumentosSecundariosSeleccionados, setInstrumentosSecundariosSeleccionados] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Efecto para resetear municipio y parroquia cuando cambia el estado
  useEffect(() => {
    if (formData.lugarNacimiento) {
      setFormData(prev => ({
        ...prev,
        municipio: '',
        parroquia: ''
      }));
    }
  }, [formData.lugarNacimiento]);

  // Efecto para resetear parroquia cuando cambia el municipio
  useEffect(() => {
    if (formData.municipio) {
      setFormData(prev => ({
        ...prev,
        parroquia: ''
      }));
    }
  }, [formData.municipio]);

  // Validaciones específicas
  const validarSoloLetras = (valor: string): boolean => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
  };

  const validarSoloNumeros = (valor: string): boolean => {
    return /^\d+$/.test(valor);
  };

  const validarEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarCedula = (cedula: string): boolean => {
    return cedula.length >= 7 && cedula.length <= 8 && validarSoloNumeros(cedula);
  };

  const validarTelefono = (telefono: string): boolean => {
    return telefono.length >= 10 && validarSoloNumeros(telefono);
  };

  // *** VALIDACIÓN DE FECHA MODIFICADA: SIN LÍMITE DE EDAD ***
  const validarFechaNacimiento = (fecha: string): boolean => {
    if (!fecha) return false;
    
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    
    // Solo validar que la fecha no sea futura
    if (fechaNac > hoy) return false;
    
    // Ya no hay límite de edad mínimo ni máximo
    return true;
  };

  const validarAñoInicio = (año: string): boolean => {
    const añoNum = parseInt(año, 10);
    const añoActual = new Date().getFullYear();
    return añoNum >= 1990 && añoNum <= añoActual;
  };

  const calcularEdad = useCallback((fechaNacimiento: string): string => {
    if (!fechaNacimiento) return '';
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    
    const mes = hoy.getMonth();
    const dia = hoy.getDate();
    
    if (mes < nacimiento.getMonth() || 
        (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
      edad--;
    }
    
    return edad.toString();
  }, []);

  const handleChange = (field: keyof FormData, value: string): void => {
    let processedValue = value;
    
    switch (field) {
      case 'nombres':
      case 'apellidos':
        processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        break;
        
      case 'cedulaIdentidad':
        processedValue = value.replace(/[^\d]/g, '').slice(0, 8);
        break;
        
      case 'numeroTelefonoCelular':
      case 'numeroTelefonoLocal':
        processedValue = value.replace(/[^\d]/g, '');
        break;
        
      case 'correoElectronico':
        processedValue = value.toLowerCase();
        break;
        
      case 'fechaNacimiento':
        if (value) {
          const newData = { ...formData, [field]: value, edad: calcularEdad(value) };
          setFormData(newData);
          
          if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
          }
          if (errors.edad) {
            setErrors(prev => ({ ...prev, edad: '' }));
          }
          return;
        }
        break;

      case 'instrumentoPrincipal':
        if (instrumentosSecundariosSeleccionados.includes(value)) {
          const nuevosSecundarios = instrumentosSecundariosSeleccionados.filter((instr: string) => instr !== value);
          setInstrumentosSecundariosSeleccionados(nuevosSecundarios);
          setFormData(prev => ({ 
            ...prev, 
            instrumentosSecundarios: nuevosSecundarios.join(', ') 
          }));
        }
        break;
    }

    const newData = { ...formData, [field]: processedValue };
    
    if (field === 'condicionAlumno' && processedValue === 'no') {
      newData.especifiqueCondicion = '';
    }
    if (field === 'necesidadesEspecialesAprendizaje' && processedValue === 'no') {
      newData.especifiqueNecesidades = '';
    }
    if (field === 'esAlergico' && processedValue === 'no') {
      newData.especifiqueAlergia = '';
    }
    if (field === 'estaVacunado' && processedValue === 'no') {
      newData.numeroDosisVacuna = '';
    }
    
    setFormData(newData);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEnfermedadChange = (enfermedad: string, checked: boolean): void => {
    const nuevasEnfermedades = checked
      ? [...enfermedadesSeleccionadas, enfermedad]
      : enfermedadesSeleccionadas.filter((e: string) => e !== enfermedad);
    
    setEnfermedadesSeleccionadas(nuevasEnfermedades);
    
    const enfermedadesTexto = [
      ...nuevasEnfermedades,
      ...(formData.otrasEnfermedades ? ['otras'] : [])
    ].join(', ');
    
    setFormData(prev => ({ 
      ...prev, 
      enfermedadesPadece: enfermedadesTexto 
    }));
  };

  const handleInstrumentoSecundarioChange = (instrumento: string, checked: boolean): void => {
    if (instrumento === formData.instrumentoPrincipal) {
      return;
    }

    const nuevosInstrumentos = checked
      ? [...instrumentosSecundariosSeleccionados, instrumento]
      : instrumentosSecundariosSeleccionados.filter((i: string) => i !== instrumento);
    
    setInstrumentosSecundariosSeleccionados(nuevosInstrumentos);
    
    setFormData(prev => ({ 
      ...prev, 
      instrumentosSecundarios: nuevosInstrumentos.join(', ') 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    } else if (!validarSoloLetras(formData.nombres)) {
      newErrors.nombres = 'Los nombres solo pueden contener letras y espacios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    } else if (!validarSoloLetras(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos solo pueden contener letras y espacios';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }
    
    if (!formData.cedulaIdentidad.trim()) {
      newErrors.cedulaIdentidad = 'La cédula es obligatoria';
    } else if (!validarCedula(formData.cedulaIdentidad)) {
      newErrors.cedulaIdentidad = 'La cédula debe tener entre 7 y 8 dígitos';
    }
    
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (!validarFechaNacimiento(formData.fechaNacimiento)) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento no es válida (no puede ser futura)';
    }
    
    if (!formData.sexo) {
      newErrors.sexo = 'El sexo es obligatorio';
    }
    
    if (!formData.lugarNacimiento) {
      newErrors.lugarNacimiento = 'El lugar de nacimiento es obligatorio';
    }
    
    if (!formData.municipio) {
      newErrors.municipio = 'El municipio es obligatorio';
    } else if (!validarSoloLetras(formData.municipio)) {
      newErrors.municipio = 'El municipio solo puede contener letras y espacios';
    } else if (formData.municipio.trim().length < 3) {
      newErrors.municipio = 'El municipio debe tener al menos 3 caracteres';
    }
    
    if (!formData.parroquia) {
      newErrors.parroquia = 'La parroquia es obligatoria';
    } else if (formData.parroquia.trim().length < 3) {
      newErrors.parroquia = 'La parroquia debe tener al menos 3 caracteres';
    }
    
    if (!formData.direccionHabitacion.trim()) {
      newErrors.direccionHabitacion = 'La dirección es obligatoria';
    } else if (formData.direccionHabitacion.trim().length < 10) {
      newErrors.direccionHabitacion = 'La dirección debe tener al menos 10 caracteres';
    }
    
    if (!formData.numeroTelefonoCelular.trim()) {
      newErrors.numeroTelefonoCelular = 'El teléfono celular es obligatorio';
    } else if (!validarTelefono(formData.numeroTelefonoCelular)) {
      newErrors.numeroTelefonoCelular = 'El teléfono debe tener al menos 10 dígitos';
    }
    
    if (formData.numeroTelefonoLocal.trim() && !validarSoloNumeros(formData.numeroTelefonoLocal)) {
      newErrors.numeroTelefonoLocal = 'El teléfono local debe contener solo números';
    } else if (formData.numeroTelefonoLocal.trim() && formData.numeroTelefonoLocal.length < 10) {
      newErrors.numeroTelefonoLocal = 'El teléfono local debe tener al menos 10 dígitos';
    }
    
    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = 'El correo electrónico es obligatorio';
    } else if (!validarEmail(formData.correoElectronico)) {
      newErrors.correoElectronico = 'El formato del correo electrónico no es válido';
    }
    
    if (!formData.nucleo) {
      newErrors.nucleo = 'El núcleo es obligatorio';
    }
    
    if (!formData.añoInicio) {
      newErrors.añoInicio = 'El año de inicio es obligatorio';
    } else if (!validarAñoInicio(formData.añoInicio)) {
      newErrors.añoInicio = 'El año debe estar entre 1990 y el año actual';
    }
    
    if (!formData.agrupacionPertenece) {
      newErrors.agrupacionPertenece = 'La orquesta actual es obligatoria';
    }

    // *** INSTRUMENTO PRINCIPAL ES OPCIONAL - Eliminada la validación ***
    // if (!formData.instrumentoPrincipal) {
    //   newErrors.instrumentoPrincipal = 'El instrumento principal es obligatorio';
    // }
    
    // *** NOMBRE DEL COLEGIO ES OPCIONAL - Eliminada la validación ***
    // if (!formData.nombreColegio.trim()) {
    //   newErrors.nombreColegio = 'El nombre del colegio es obligatorio';
    // } else if (formData.nombreColegio.trim().length < 3) {
    //   newErrors.nombreColegio = 'El nombre del colegio debe tener al menos 3 caracteres';
    // }
    
    // *** GRADO QUE CURSA ES OPCIONAL - Eliminada la validación ***
    // if (!formData.gradoCursa) {
    //   newErrors.gradoCursa = 'El grado actual es obligatorio';
    // }
    
    if (!formData.condicionAlumno) {
      newErrors.condicionAlumno = 'Este campo es obligatorio';
    }
    
    if (!formData.necesidadesEspecialesAprendizaje) {
      newErrors.necesidadesEspecialesAprendizaje = 'Este campo es obligatorio';
    }
    
    if (!formData.esAlergico) {
      newErrors.esAlergico = 'Este campo es obligatorio';
    }
    
    if (!formData.estaVacunado) {
      newErrors.estaVacunado = 'Este campo es obligatorio';
    }

    if (formData.condicionAlumno === 'si' && !formData.especifiqueCondicion.trim()) {
      newErrors.especifiqueCondicion = 'Por favor especifique la condición';
    } else if (formData.condicionAlumno === 'si' && formData.especifiqueCondicion.trim().length < 5) {
      newErrors.especifiqueCondicion = 'La descripción debe tener al menos 5 caracteres';
    }
    
    if (formData.necesidadesEspecialesAprendizaje === 'si' && !formData.especifiqueNecesidades.trim()) {
      newErrors.especifiqueNecesidades = 'Por favor especifique las necesidades especiales';
    } else if (formData.necesidadesEspecialesAprendizaje === 'si' && formData.especifiqueNecesidades.trim().length < 5) {
      newErrors.especifiqueNecesidades = 'La descripción debe tener al menos 5 caracteres';
    }
    
    if (formData.esAlergico === 'si' && !formData.especifiqueAlergia.trim()) {
      newErrors.especifiqueAlergia = 'Por favor especifique a qué medicamentos es alérgico';
    } else if (formData.esAlergico === 'si' && formData.especifiqueAlergia.trim().length < 3) {
      newErrors.especifiqueAlergia = 'La descripción debe tener al menos 3 caracteres';
    }
    
    if (formData.estaVacunado === 'si' && !formData.numeroDosisVacuna) {
      newErrors.numeroDosisVacuna = 'Por favor especifique el número de dosis';
    }

    if (enfermedadesSeleccionadas.includes('otros') && !formData.otrasEnfermedades.trim()) {
      newErrors.otrasEnfermedades = 'Por favor especifique las otras enfermedades';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('🔐 Iniciando envío del formulario...');
    
    if (validateForm()) {
      try {
        const datosParaEnviar = {
          ...formData,
          instrumentoPrincipal: formData.instrumentoPrincipal || "",
          instrumentosSecundarios: instrumentosSecundariosSeleccionados.join(', ') || "",
          enfermedadesPadece: [
            ...enfermedadesSeleccionadas,
            ...(formData.otrasEnfermedades ? [`otras: ${formData.otrasEnfermedades}`] : [])
          ].join(', '),
          numeroTelefonoLocal: formData.numeroTelefonoLocal || "",
          nombreAgrupacionesPertenecio: formData.nombreAgrupacionesPertenecio || "",
          otrasEnfermedades: formData.otrasEnfermedades || "",
          especifiqueCondicion: formData.especifiqueCondicion || "",
          especifiqueNecesidades: formData.especifiqueNecesidades || "",
          especifiqueAlergia: formData.especifiqueAlergia || "",
          numeroDosisVacuna: formData.numeroDosisVacuna || "",
          sexo: formData.sexo,
          nombreColegio: formData.nombreColegio || "",
          gradoCursa: formData.gradoCursa || ""
        };

        const response = await fetch('/api/estudiantes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosParaEnviar),
        });

        const responseData: unknown = await response.json();

        if (!response.ok) {
          let errorMessage = 'Error en el servidor';
          if (responseData && typeof responseData === 'object' && 'error' in responseData) {
            errorMessage = (responseData as { error: string }).error;
          }
          throw new Error(errorMessage);
        }

        let estudianteId: string | undefined;

        if (responseData && typeof responseData === 'object') {
          if ('estudiante' in responseData && 
              responseData.estudiante && 
              typeof responseData.estudiante === 'object' &&
              'id' in responseData.estudiante) {
            estudianteId = (responseData.estudiante as { id: string }).id;
          } else if ('id' in responseData) {
            estudianteId = (responseData as { id: string }).id;
          }
        }

        if (!estudianteId) {
          throw new Error('La respuesta del servidor no contiene el ID del estudiante');
        }

        guardarEnLocalStorage('ultimoEstudianteId', estudianteId);
        
        alert('✅ Registro de estudiante completado exitosamente. Ahora complete los datos de los representantes.');
        
        router.push(`/inscripcion_representantes?estudianteId=${estudianteId}`);
        
      } catch (error: unknown) {
        console.error('❌ Error al procesar el formulario:', error);
        
        let errorMessage = 'Hubo un error al procesar el registro.';
        
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch')) {
            errorMessage = '❌ Error de conexión: No se pudo conectar al servidor. Verifique su conexión a internet.';
          } else if (error.message.includes('403')) {
            errorMessage = '❌ Error de acceso: No tiene permisos para realizar esta acción.';
          } else if (error.message.includes('400')) {
            errorMessage = '❌ Error en los datos: ' + error.message;
          } else if (error.message.includes('500')) {
            errorMessage = '❌ Error del servidor: Problema interno. Contacte al administrador.';
          } else if (error.message.includes('cédula')) {
            errorMessage = '❌ Error: ' + error.message;
          } else {
            errorMessage = '❌ ' + error.message;
          }
        }
        
        alert(errorMessage);
      }
    } else {
      console.log('❌ El formulario tiene errores:', errors);
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    setIsSubmitting(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i: number) => 
    (currentYear - i).toString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/inicio">
            <Button variant="ghost" className="flex items-center gap-2 text-[#362511] hover:bg-[#795C34] hover:text-white transition-colors duration-200">
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-[#362511] text-center drop-shadow-sm">
            Sistema de Inscripción
          </h1>
          
          <div className="w-24"></div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#9A784F] text-white flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <span className="text-sm mt-2 font-bold text-[#362511]">Estudiante</span>
            </div>
            <div className="w-32 h-1 bg-[#9A784F] mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#D4B8A4] text-[#795C34] flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm mt-2 text-[#795C34] font-medium">Representantes</span>
            </div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-[#E8D5C4]">
        <CardHeader className="bg-gradient-to-r from-[#9A784F] to-[#795C34] text-white relative">
  {/* Borde superior decorativo */}
  <div className="absolute top-0 left-10 right-10 h-1 bg-[#E8D5C4] rounded-full"></div>
  
  <div className="flex items-center gap-6">
    <div className="bg-white/15 p-3 rounded-full">
      <User className="w-6 h-6" />
    </div>
    
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Registro de Estudiantes
        </CardTitle>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          1/2
        </span>
      </div>
      
      <CardDescription className="text-[#F8F4F0] text-sm mt-1 opacity-90">
        Complete los datos del estudiante. Después registrará a los representantes.
      </CardDescription>
    </div>
  </div>
</CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sección 1: Información Personal */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <User className="w-5 h-5 text-[#9A784F]" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombres */}
                  <div className="space-y-2">
                    <Label htmlFor="nombres" className="text-sm font-bold text-[#362511]">
                      Nombres <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombres"
                      value={formData.nombres}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nombres', e.target.value)}
                      placeholder="Ingrese los nombres"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.nombres ? 'border-red-500' : ''}`}
                    />
                    {errors.nombres && (
                      <p className="text-red-500 text-sm font-medium">{errors.nombres}</p>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-sm font-bold text-[#362511]">
                      Apellidos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('apellidos', e.target.value)}
                      placeholder="Ingrese los apellidos"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.apellidos ? 'border-red-500' : ''}`}
                    />
                    {errors.apellidos && (
                      <p className="text-red-500 text-sm font-medium">{errors.apellidos}</p>
                    )}
                  </div>

                  {/* Cédula */}
                  <div className="space-y-2">
                    <Label htmlFor="cedulaIdentidad" className="text-sm font-bold text-[#362511]">
                      Cédula de Identidad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cedulaIdentidad"
                      value={formData.cedulaIdentidad}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cedulaIdentidad', e.target.value)}
                      placeholder="Ej: 12345678"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.cedulaIdentidad ? 'border-red-500' : ''}`}
                      maxLength={8}
                    />
                    {errors.cedulaIdentidad && (
                      <p className="text-red-500 text-sm font-medium">{errors.cedulaIdentidad}</p>
                    )}
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento" className="text-sm font-bold text-[#362511]">
                      Fecha de Nacimiento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fechaNacimiento', e.target.value)}
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
                    />
                    {errors.fechaNacimiento && (
                      <p className="text-red-500 text-sm font-medium">{errors.fechaNacimiento}</p>
                    )}
                  </div>

                  {/* Edad (calculada automáticamente) */}
                  <div className="space-y-2">
                    <Label htmlFor="edad" className="text-sm font-bold text-[#362511]">
                      Edad
                    </Label>
                    <Input
                      id="edad"
                      value={formData.edad}
                      readOnly
                      placeholder="Se calcula automáticamente"
                      className="bg-[#F8F4F0] border-[#E8D5C4] text-[#362511]"
                    />
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="sexo" className="text-sm font-bold text-[#362511]">
                      Sexo <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.sexo} onValueChange={(value: string) => handleChange('sexo', value)}>
                      <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.sexo ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Seleccione su sexo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E8D5C4]">
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && (
                      <p className="text-red-500 text-sm font-medium">{errors.sexo}</p>
                    )}
                  </div>
                </div>

                {/* Estado - NUEVO */}
                <div className="mt-4">
                  <EstadoSelect
                    value={formData.lugarNacimiento}
                    onValueChange={(value: string) => handleChange('lugarNacimiento', value)}
                    error={errors.lugarNacimiento}
                  />
                </div>

                {/* Municipio y Parroquia - NUEVOS CON DEPENDENCIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <MunicipioSelect
                    estadoSeleccionado={formData.lugarNacimiento}
                    value={formData.municipio}
                    onValueChange={(value: string) => handleChange('municipio', value)}
                    error={errors.municipio}
                    disabled={!formData.lugarNacimiento}
                  />

                  <ParroquiaSelect
                    estadoSeleccionado={formData.lugarNacimiento}
                    municipioSeleccionado={formData.municipio}
                    value={formData.parroquia}
                    onValueChange={(value: string) => handleChange('parroquia', value)}
                    error={errors.parroquia}
                    disabled={!formData.municipio}
                  />
                </div>

                {/* Dirección */}
                <div className="mt-4 space-y-2">
                  <Label htmlFor="direccionHabitacion" className="text-sm font-bold text-[#362511]">
                    Dirección de Habitación <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="direccionHabitacion"
                    value={formData.direccionHabitacion}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('direccionHabitacion', e.target.value)}
                    placeholder="Ingrese su dirección completa"
                    className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.direccionHabitacion ? 'border-red-500' : ''}`}
                  />
                  {errors.direccionHabitacion && (
                    <p className="text-red-500 text-sm font-medium">{errors.direccionHabitacion}</p>
                  )}
                </div>

                {/* Teléfonos y Correo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroTelefonoCelular" className="text-sm font-bold text-[#362511]">
                      Teléfono Celular <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="numeroTelefonoCelular"
                      value={formData.numeroTelefonoCelular}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroTelefonoCelular', e.target.value)}
                      placeholder="Ej: 04121234567"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.numeroTelefonoCelular ? 'border-red-500' : ''}`}
                      maxLength={11}
                    />
                    {errors.numeroTelefonoCelular && (
                      <p className="text-red-500 text-sm font-medium">{errors.numeroTelefonoCelular}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroTelefonoLocal" className="text-sm font-bold text-[#362511]">
                      Teléfono Local (Opcional)
                    </Label>
                    <Input
                      id="numeroTelefonoLocal"
                      value={formData.numeroTelefonoLocal}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroTelefonoLocal', e.target.value)}
                      placeholder="Ej: 02121234567"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.numeroTelefonoLocal ? 'border-red-500' : ''}`}
                      maxLength={11}
                    />
                    {errors.numeroTelefonoLocal && (
                      <p className="text-red-500 text-sm font-medium">{errors.numeroTelefonoLocal}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correoElectronico" className="text-sm font-bold text-[#362511]">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="correoElectronico"
                      type="email"
                      value={formData.correoElectronico}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('correoElectronico', e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.correoElectronico ? 'border-red-500' : ''}`}
                    />
                    {errors.correoElectronico && (
                      <p className="text-red-500 text-sm font-medium">{errors.correoElectronico}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 2: Información Musical */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <Music className="w-5 h-5 text-[#795C34]" />
                  Información Musical
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NucleoSelect
                    value={formData.nucleo}
                    onValueChange={(value: string) => handleChange('nucleo', value)}
                    error={errors.nucleo}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="añoInicio" className="text-sm font-bold text-[#362511]">
                      Año en que Inició <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.añoInicio} onValueChange={(value: string) => handleChange('añoInicio', value)}>
                      <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.añoInicio ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Seleccione el año" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E8D5C4]">
                        {years.map((year: string) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.añoInicio && (
                      <p className="text-red-500 text-sm font-medium">{errors.añoInicio}</p>
                    )}
                  </div>

                  {/* *** CAMBIO PRINCIPAL: Orquesta Actual *** */}
                  <div className="space-y-2">
                    <Label htmlFor="agrupacionPertenece" className="text-sm font-bold text-[#362511]">
                      Orquesta Actual <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.agrupacionPertenece} onValueChange={(value: string) => handleChange('agrupacionPertenece', value)}>
                      <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.agrupacionPertenece ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Seleccione la orquesta" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E8D5C4]">
                        {agrupacionesMusicales.map((agrupacion: string) => (
                          <SelectItem key={agrupacion} value={agrupacion}>
                            {agrupacion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.agrupacionPertenece && (
                      <p className="text-red-500 text-sm font-medium">{errors.agrupacionPertenece}</p>
                    )}
                  </div>

                  {/* *** INSTRUMENTO PRINCIPAL AHORA ES OPCIONAL - Eliminado el asterisco *** */}
                  <div className="space-y-2">
                    <Label htmlFor="instrumentoPrincipal" className="text-sm font-bold text-[#362511]">
                      Instrumento Principal (Opcional)
                    </Label>
                    <Select value={formData.instrumentoPrincipal} onValueChange={(value: string) => handleChange('instrumentoPrincipal', value)}>
                      <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.instrumentoPrincipal ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Seleccione el instrumento" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E8D5C4]">
                        <SelectItem value="">Ninguno</SelectItem>
                        {instrumentosMusicales.map((instrumento: string) => (
                          <SelectItem key={instrumento} value={instrumento}>
                            {instrumento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.instrumentoPrincipal && (
                      <p className="text-red-500 text-sm font-medium">{errors.instrumentoPrincipal}</p>
                    )}
                  </div>
                </div>

                {/* Instrumentos Secundarios */}
                <div className="mt-6">
                  <Label className="text-sm font-bold text-[#362511] mb-3 block">
                    Instrumentos Secundarios (Opcional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {instrumentosMusicales.map((instrumento: string) => (
                      <div key={instrumento} className="flex items-center space-x-2">
                        <Checkbox
                          id={`secundario-${instrumento}`}
                          checked={instrumentosSecundariosSeleccionados.includes(instrumento)}
                          onCheckedChange={(checked: boolean) => 
                            handleInstrumentoSecundarioChange(instrumento, checked)
                          }
                          disabled={instrumento === formData.instrumentoPrincipal}
                          className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                        />
                        <Label 
                          htmlFor={`secundario-${instrumento}`} 
                          className={`text-sm font-medium ${
                            instrumento === formData.instrumentoPrincipal 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-[#362511]'
                          }`}
                        >
                          {instrumento}
                          {instrumento === formData.instrumentoPrincipal && ' (Principal)'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agrupaciones Anteriores */}
                <div className="mt-4 space-y-2">
                  <Label htmlFor="nombreAgrupacionesPertenecio" className="text-sm font-bold text-[#362511]">
                    Agrupaciones a las que ha pertenecido anteriormente
                  </Label>
                  <Input
                    id="nombreAgrupacionesPertenecio"
                    value={formData.nombreAgrupacionesPertenecio}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nombreAgrupacionesPertenecio', e.target.value)}
                    placeholder="Ej: Orquesta Infantil, Coro, Ensemble de Cuerdas"
                    className="border-[#E8D5C4] focus:border-[#9A784F]"
                  />
                </div>
              </div>

              {/* Sección 3: Información Académica */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <School className="w-5 h-5 text-[#65350F]" />
                  Información Académica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* *** NOMBRE DEL COLEGIO AHORA ES OPCIONAL - Eliminado el asterisco *** */}
                  <div className="space-y-2">
                    <Label htmlFor="nombreColegio" className="text-sm font-bold text-[#362511]">
                      Nombre del Colegio (Opcional)
                    </Label>
                    <Input
                      id="nombreColegio"
                      value={formData.nombreColegio}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nombreColegio', e.target.value)}
                      placeholder="Ingrese el nombre del colegio"
                      className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.nombreColegio ? 'border-red-500' : ''}`}
                    />
                    {errors.nombreColegio && (
                      <p className="text-red-500 text-sm font-medium">{errors.nombreColegio}</p>
                    )}
                  </div>

                  {/* *** GRADO QUE CURSA AHORA ES OPCIONAL - Eliminado el asterisco *** */}
                  <div className="space-y-2">
                    <Label htmlFor="gradoCursa" className="text-sm font-bold text-[#362511]">
                      Grado que Cursa (Opcional)
                    </Label>
                    <Select value={formData.gradoCursa} onValueChange={(value: string) => handleChange('gradoCursa', value)}>
                      <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.gradoCursa ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Seleccione el grado (opcional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E8D5C4]">
                        <SelectItem value="">Ninguno</SelectItem>
                        {gradosEscolares.map((grado: string) => (
                          <SelectItem key={grado} value={grado}>
                            {grado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gradoCursa && (
                      <p className="text-red-500 text-sm font-medium">{errors.gradoCursa}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 4: Información de Salud */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <Heart className="w-5 h-5 text-[#80471C]" />
                  Información de Salud
                </h3>

                {/* Padece alguna enfermedad */}
                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] mb-3 block">
                    ¿Padece alguna enfermedad?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asma"
                        checked={enfermedadesSeleccionadas.includes('asma')}
                        onCheckedChange={(checked: boolean) => 
                          handleEnfermedadChange('asma', checked)
                        }
                        className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                      />
                      <Label htmlFor="asma" className="text-sm text-[#362511] font-medium">Asma</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alergia"
                        checked={enfermedadesSeleccionadas.includes('alergia')}
                        onCheckedChange={(checked: boolean) => 
                          handleEnfermedadChange('alergia', checked)
                        }
                        className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                      />
                      <Label htmlFor="alergia" className="text-sm text-[#362511] font-medium">Alergia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="diabetes"
                        checked={enfermedadesSeleccionadas.includes('diabetes')}
                        onCheckedChange={(checked: boolean) => 
                          handleEnfermedadChange('diabetes', checked)
                        }
                        className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                      />
                      <Label htmlFor="diabetes" className="text-sm text-[#362511] font-medium">Diabetes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reumatismo"
                        checked={enfermedadesSeleccionadas.includes('reumatismo')}
                        onCheckedChange={(checked: boolean) => 
                          handleEnfermedadChange('reumatismo', checked)
                        }
                        className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                      />
                      <Label htmlFor="reumatismo" className="text-sm text-[#362511] font-medium">Reumatismo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="otros"
                        checked={enfermedadesSeleccionadas.includes('otros')}
                        onCheckedChange={(checked: boolean) => 
                          handleEnfermedadChange('otros', checked)
                        }
                        className="border-[#E8D5C4] data-[state=checked]:bg-[#9A784F]"
                      />
                      <Label htmlFor="otros" className="text-sm text-[#362511] font-medium">Otros</Label>
                    </div>
                  </div>

                  {enfermedadesSeleccionadas.includes('otros') && (
                    <div className="mt-3">
                      <Label htmlFor="otrasEnfermedades" className="text-sm font-bold text-[#362511]">
                        Especifique otras enfermedades
                      </Label>
                      <Input
                        id="otrasEnfermedades"
                        value={formData.otrasEnfermedades}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('otrasEnfermedades', e.target.value)}
                        placeholder="Especifique las otras enfermedades"
                        className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.otrasEnfermedades ? 'border-red-500' : ''}`}
                      />
                      {errors.otrasEnfermedades && (
                        <p className="text-red-500 text-sm font-medium mt-1">{errors.otrasEnfermedades}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Condición especial */}
                <div className="mb-6">
                  <Label htmlFor="condicionAlumno" className="text-sm font-bold text-[#362511] block mb-3">
                    ¿El alumno posee alguna condición especial? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.condicionAlumno} onValueChange={(value: string) => handleChange('condicionAlumno', value)}>
                    <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.condicionAlumno ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E8D5C4]">
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                    {errors.condicionAlumno && (
                      <p className="text-red-500 text-sm font-medium mt-1">{errors.condicionAlumno}</p>
                    )}

                  {formData.condicionAlumno === 'si' && (
                    <div className="mt-3">
                      <Label htmlFor="especifiqueCondicion" className="text-sm font-bold text-[#362511]">
                        Especifique la condición <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="especifiqueCondicion"
                        value={formData.especifiqueCondicion}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('especifiqueCondicion', e.target.value)}
                        placeholder="Describa la condición especial"
                        className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.especifiqueCondicion ? 'border-red-500' : ''}`}
                      />
                      {errors.especifiqueCondicion && (
                        <p className="text-red-500 text-sm font-medium mt-1">{errors.especifiqueCondicion}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Necesidades especiales de aprendizaje */}
                <div className="mb-6">
                  <Label htmlFor="necesidadesEspecialesAprendizaje" className="text-sm font-bold text-[#362511] block mb-3">
                    ¿El alumno tiene necesidades especiales de aprendizaje? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.necesidadesEspecialesAprendizaje} onValueChange={(value: string) => handleChange('necesidadesEspecialesAprendizaje', value)}>
                    <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.necesidadesEspecialesAprendizaje ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E8D5C4]">
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.necesidadesEspecialesAprendizaje && (
                    <p className="text-red-500 text-sm font-medium mt-1">{errors.necesidadesEspecialesAprendizaje}</p>
                  )}

                  {formData.necesidadesEspecialesAprendizaje === 'si' && (
                    <div className="mt-3">
                      <Label htmlFor="especifiqueNecesidades" className="text-sm font-bold text-[#362511]">
                        Especifique las necesidades especiales <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="especifiqueNecesidades"
                        value={formData.especifiqueNecesidades}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('especifiqueNecesidades', e.target.value)}
                        placeholder="Describa las necesidades especiales de aprendizaje"
                        className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.especifiqueNecesidades ? 'border-red-500' : ''}`}
                      />
                      {errors.especifiqueNecesidades && (
                        <p className="text-red-500 text-sm font-medium mt-1">{errors.especifiqueNecesidades}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Alergia a medicamentos */}
                <div className="mb-6">
                  <Label htmlFor="esAlergico" className="text-sm font-bold text-[#362511] block mb-3">
                    ¿El alumno es alérgico a algún medicamento? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.esAlergico} onValueChange={(value: string) => handleChange('esAlergico', value)}>
                    <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.esAlergico ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E8D5C4]">
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.esAlergico && (
                    <p className="text-red-500 text-sm font-medium mt-1">{errors.esAlergico}</p>
                  )}

                  {formData.esAlergico === 'si' && (
                    <div className="mt-3">
                      <Label htmlFor="especifiqueAlergia" className="text-sm font-bold text-[#362511]">
                        Especifique a qué medicamentos es alérgico <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="especifiqueAlergia"
                        value={formData.especifiqueAlergia}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('especifiqueAlergia', e.target.value)}
                        placeholder="Liste los medicamentos a los que es alérgico"
                        className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.especifiqueAlergia ? 'border-red-500' : ''}`}
                      />
                      {errors.especifiqueAlergia && (
                        <p className="text-red-500 text-sm font-medium mt-1">{errors.especifiqueAlergia}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Vacunación COVID */}
                <div className="mb-6">
                  <Label htmlFor="estaVacunado" className="text-sm font-bold text-[#362511] block mb-3">
                    ¿El alumno está vacunado contra el COVID-19? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.estaVacunado} onValueChange={(value: string) => handleChange('estaVacunado', value)}>
                    <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.estaVacunado ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E8D5C4]">
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estaVacunado && (
                    <p className="text-red-500 text-sm font-medium mt-1">{errors.estaVacunado}</p>
                  )}

                  {formData.estaVacunado === 'si' && (
                    <div className="mt-3">
                      <Label htmlFor="numeroDosisVacuna" className="text-sm font-bold text-[#362511]">
                        Número de dosis <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.numeroDosisVacuna} onValueChange={(value: string) => handleChange('numeroDosisVacuna', value)}>
                        <SelectTrigger className={`border-[#E8D5C4] focus:border-[#9A784F] ${errors.numeroDosisVacuna ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Seleccione el número de dosis" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8D5C4]">
                          <SelectItem value="1">1 dosis</SelectItem>
                          <SelectItem value="2">2 dosis</SelectItem>
                          <SelectItem value="3">3 dosis</SelectItem>
                          <SelectItem value="4">4 dosis</SelectItem>
                          <SelectItem value="mas">Más de 4 dosis</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.numeroDosisVacuna && (
                        <p className="text-red-500 text-sm font-medium mt-1">{errors.numeroDosisVacuna}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-[#9A784F] hover:bg-[#795C34] text-white flex-1 font-bold transition-colors duration-200 shadow-lg"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Continuar con Representantes
                    </>
                  )}
                </Button>
                
                <Link href="/inicio" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#E8D5C4] text-[#362511] hover:bg-[#F8F4F0] font-bold transition-colors duration-200"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>

              {/* Información del siguiente paso */}
              <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#9A784F] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#362511]">Próximo paso: Registro de Representantes</h4>
                    <p className="text-[#65350F] text-sm mt-1 font-medium">
                      Después de completar este formulario, continuará con el registro de los datos de los representantes (madre, padre o tutor legal).
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}