'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, User, Music, School, Heart, Users, Search, Loader2 } from 'lucide-react';
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
      { nombre: "Alto Orinoco", parroquias: ["Alto Orinoco", "Huachamacare", "Marawaka", "Mavaka", "Sierra Parima"] },
      { nombre: "Atabapo", parroquias: ["Atabapo", "Caname", "Ucata"] },
      { nombre: "Atures", parroquias: ["Atures", "Fernando Girón Tovar", "Luis Alberto Gómez", "Páez"] },
      { nombre: "Autana", parroquias: ["Autana", "Isla Ratón", "Munduapo", "Samariapo"] },
      { nombre: "Manapiare", parroquias: ["Manapiare", "Bajo Ventuari", "Alto Ventuari"] },
      { nombre: "Maroa", parroquias: ["Maroa", "Víctorino"] },
      { nombre: "Río Negro", parroquias: ["Río Negro", "Solano", "Cocuy"] }
    ]
  },
  {
    nombre: "Anzoátegui",
    municipios: [
      { nombre: "Anaco", parroquias: ["Anaco", "San Joaquín"] },
      { nombre: "Aragua", parroquias: ["Aragua", "Cachipo"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Bergantín", "Caigua", "El Carmen", "El Pilar", "Naricual"] },
      { nombre: "Bruzual", parroquias: ["Bruzual", "Clarines", "Guanape", "Sabana de Uchire"] },
      { nombre: "Cajigal", parroquias: ["Cajigal", "Onoto", "San Pablo"] },
      { nombre: "Carvajal", parroquias: ["Carvajal", "Valle de Guanape"] },
      { nombre: "Diego Bautista Urbaneja", parroquias: ["Diego Bautista Urbaneja", "Lechería", "El Morro"] },
      { nombre: "Freites", parroquias: ["Freites", "Cantaura", "Libertador", "Santa Rosa"] },
      { nombre: "Guanipa", parroquias: ["Guanipa", "El Tigre"] },
      { nombre: "Guanta", parroquias: ["Guanta", "Chorrerón"] },
      { nombre: "Independencia", parroquias: ["Independencia", "Soledad"] },
      { nombre: "Libertad", parroquias: ["Libertad", "San Mateo"] },
      { nombre: "McGregor", parroquias: ["McGregor", "El Chaparro"] },
      { nombre: "Miranda", parroquias: ["Miranda", "Boca de Uchire"] },
      { nombre: "Monagas", parroquias: ["Monagas", "Mapire"] },
      { nombre: "Peñalver", parroquias: ["Peñalver", "Puerto Píritu", "San Miguel"] },
      { nombre: "Píritu", parroquias: ["Píritu", "San Francisco"] },
      { nombre: "San Juan de Capistrano", parroquias: ["San Juan de Capistrano", "Boca de Chávez"] },
      { nombre: "Santa Ana", parroquias: ["Santa Ana", "Pueblo Nuevo"] },
      { nombre: "Simón Rodríguez", parroquias: ["Simón Rodríguez", "El Tigre"] },
      { nombre: "Sotillo", parroquias: ["Sotillo", "Puerto La Cruz", "Pozuelos"] }
    ]
  },
  {
    nombre: "Apure",
    municipios: [
      { nombre: "Achaguas", parroquias: ["Achaguas", "Apurito", "El Yagual", "Guachara"] },
      { nombre: "Biruaca", parroquias: ["Biruaca"] },
      { nombre: "Muñoz", parroquias: ["Muñoz", "Bruzual", "Mantecal", "Quintero", "Rincón Hondo", "San Vicente"] },
      { nombre: "Páez", parroquias: ["Páez", "Aramendi", "El Amparo", "San Juan de Payara"] },
      { nombre: "Pedro Camejo", parroquias: ["Pedro Camejo", "Codazzi", "Cunaviche"] },
      { nombre: "Rómulo Gallegos", parroquias: ["Rómulo Gallegos", "Elorza"] },
      { nombre: "San Fernando", parroquias: ["San Fernando", "El Recreo", "Peñalver", "San Rafael de Atamaica"] }
    ]
  },
  {
    nombre: "Aragua",
    municipios: [
      { nombre: "Bolívar", parroquias: ["Bolívar"] },
      { nombre: "Camatagua", parroquias: ["Camatagua", "Carmen de Cura"] },
      { nombre: "Francisco Linares Alcántara", parroquias: ["Francisco Linares Alcántara", "Francisco de Miranda", "Monseñor Feliciano González"] },
      { nombre: "Girardot", parroquias: ["Girardot", "Choroní", "Las Delicias", "Madre María de San José", "Pedro José Ovalles", "Joaquín Crespo", "José Casanova Godoy", "Andrés Eloy Blanco", "Los Tacariguas"] },
      { nombre: "José Ángel Lamas", parroquias: ["José Ángel Lamas"] },
      { nombre: "José Félix Ribas", parroquias: ["José Félix Ribas", "Castor Nieves Ríos", "Las Guacamayas", "Palo Negro"] },
      { nombre: "José Rafael Revenga", parroquias: ["José Rafael Revenga"] },
      { nombre: "Libertador", parroquias: ["Libertador"] },
      { nombre: "Mario Briceño Iragorry", parroquias: ["Mario Briceño Iragorry", "Caña de Azúcar"] },
      { nombre: "Ocumare de la Costa de Oro", parroquias: ["Ocumare de la Costa de Oro"] },
      { nombre: "San Casimiro", parroquias: ["San Casimiro", "Güiripa", "Ollas de Caramacate", "Valle Morín"] },
      { nombre: "San Sebastián", parroquias: ["San Sebastián"] },
      { nombre: "Santiago Mariño", parroquias: ["Santiago Mariño", "Arévalo Aponte", "Chuao", "Samán de Güere", "Alfredo Pacheco Miranda"] },
      { nombre: "Santos Michelena", parroquias: ["Santos Michelena", "Tiara"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Cagua", "Bella Vista"] },
      { nombre: "Tovar", parroquias: ["Tovar"] },
      { nombre: "Urdaneta", parroquias: ["Urdaneta", "Las Peñitas", "San Francisco de Cara", "Taguay"] },
      { nombre: "Zamora", parroquias: ["Zamora", "Magdaleno", "San Francisco de Asís", "Valles de Tucutunemo"] }
    ]
  },
  {
    nombre: "Barinas",
    municipios: [
      { nombre: "Alberto Arvelo Torrealba", parroquias: ["Alberto Arvelo Torrealba", "Rodríguez Domínguez"] },
      { nombre: "Andrés Eloy Blanco", parroquias: ["Andrés Eloy Blanco", "Puerto Vivas"] },
      { nombre: "Antonio José de Sucre", parroquias: ["Antonio José de Sucre", "El Socorro", "Ticoporo"] },
      { nombre: "Arismendi", parroquias: ["Arismendi", "Guadarrama", "La Unión"] },
      { nombre: "Barinas", parroquias: ["Barinas", "Alfredo Arvelo Larriva", "San Silvestre", "Santa Inés", "Santa Lucía", "Torunos", "El Carmen"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Barinitas", "Altamira", "Calderas"] },
      { nombre: "Cruz Paredes", parroquias: ["Cruz Paredes", "Barrancas", "El Socorro"] },
      { nombre: "Ezequiel Zamora", parroquias: ["Ezequiel Zamora", "Pedro Briceño Méndez", "Ramón Ignacio Méndez", "José Ignacio del Pumar"] },
      { nombre: "Obispos", parroquias: ["Obispos", "Guasimitos", "El Real"] },
      { nombre: "Pedraza", parroquias: ["Pedraza", "Ciudad Bolivia", "Ignacio Briceño", "José Félix Ribas"] },
      { nombre: "Rojas", parroquias: ["Rojas", "Libertad", "Dolores"] },
      { nombre: "Sosa", parroquias: ["Sosa", "Ciudad de Nutrias", "El Regalo", "Puerto de Nutrias"] }
    ]
  },
  {
    nombre: "Bolívar",
    municipios: [
      { nombre: "Caroní", parroquias: ["Caroní", "Cachamay", "Chirica", "Dalla Costa", "Once de Abril", "Simón Bolívar", "Unare", "Universidad", "Vista al Sol", "Pozo Verde", "Yocoima"] },
      { nombre: "Cedeño", parroquias: ["Cedeño", "Altagracia", "Ascensión Farreras", "Guaniamo", "La Urbana", "Pijiguaos"] },
      { nombre: "El Callao", parroquias: ["El Callao"] },
      { nombre: "Gran Sabana", parroquias: ["Gran Sabana", "Ikabarú"] },
      { nombre: "Heres", parroquias: ["Heres", "Agua Salada", "Catedral", "José Antonio Páez", "La Sabanita", "Marhuanta", "Vista Hermosa", "Orinoco", "Zea"] },
      { nombre: "Padre Pedro Chien", parroquias: ["Padre Pedro Chien", "El Palmar"] },
      { nombre: "Piar", parroquias: ["Piar", "Andrés Eloy Blanco", "Pedro Cova"] },
      { nombre: "Raúl Leoni", parroquias: ["Raúl Leoni", "Barceloneta", "San Francisco", "Santa Bárbara"] },
      { nombre: "Roscio", parroquias: ["Roscio", "Salóm"] },
      { nombre: "Sifontes", parroquias: ["Sifontes", "Dalla Costa", "San Isidro"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Aripao", "Guarataro", "Las Majadas", "Moitaco"] }
    ]
  },
  {
    nombre: "Carabobo",
    municipios: [
      { nombre: "Bejuma", parroquias: ["Bejuma", "Canoabo", "Simón Bolívar"] },
      { nombre: "Carlos Arvelo", parroquias: ["Carlos Arvelo", "Güigüe", "Belén", "Tacarigua"] },
      { nombre: "Diego Ibarra", parroquias: ["Diego Ibarra", "Aguas Calientes", "Mariara"] },
      { nombre: "Guacara", parroquias: ["Guacara", "Ciudad Alianza", "Guacara", "Yagua"] },
      { nombre: "Juan José Mora", parroquias: ["Juan José Mora", "Morón", "Urama"] },
      { nombre: "Libertador", parroquias: ["Libertador", "Tocuyito", "Independencia"] },
      { nombre: "Los Guayos", parroquias: ["Los Guayos"] },
      { nombre: "Miranda", parroquias: ["Miranda", "Miranda"] },
      { nombre: "Montalbán", parroquias: ["Montalbán"] },
      { nombre: "Naguanagua", parroquias: ["Naguanagua"] },
      { nombre: "Puerto Cabello", parroquias: ["Puerto Cabello", "Borburata", "Democracia", "Fraternidad", "Goaigoaza", "Juan José Flores", "Patanemo", "Unión"] },
      { nombre: "San Diego", parroquias: ["San Diego"] },
      { nombre: "San Joaquín", parroquias: ["San Joaquín"] },
      { nombre: "Valencia", parroquias: ["Valencia", "Candelaria", "Catedral", "El Socorro", "Miguel Peña", "Rafael Urdaneta", "San Blas", "San José", "Santa Rosa", "Negro Primero"] }
    ]
  },
  {
    nombre: "Cojedes",
    municipios: [
      { nombre: "Anzoátegui", parroquias: ["Anzoátegui", "Cojedes"] },
      { nombre: "Falcón", parroquias: ["Falcón", "Tinaquillo"] },
      { nombre: "Girardot", parroquias: ["Girardot", "El Baúl"] },
      { nombre: "Lima Blanco", parroquias: ["Lima Blanco", "Macapo"] },
      { nombre: "Pao de San Juan Bautista", parroquias: ["Pao de San Juan Bautista"] },
      { nombre: "Ricaurte", parroquias: ["Ricaurte", "El Amparo", "Libertad de Cojedes"] },
      { nombre: "Rómulo Gallegos", parroquias: ["Rómulo Gallegos"] },
      { nombre: "San Carlos", parroquias: ["San Carlos", "Juan Ángel Bravo", "Manuel Manrique"] },
      { nombre: "Tinaco", parroquias: ["Tinaco"] }
    ]
  },
  {
    nombre: "Delta Amacuro",
    municipios: [
      { nombre: "Antonio Díaz", parroquias: ["Antonio Díaz", "Curiapo", "Almirante Luis Brión", "Francisco Aniceto Lugo", "Manuel Renaud", "Padre Barral", "Santos de Abelgas"] },
      { nombre: "Casacoima", parroquias: ["Casacoima", "Juan Bautista Arismendi", "Manuel Piar", "Rómulo Gallegos"] },
      { nombre: "Pedernales", parroquias: ["Pedernales", "Luis Beltrán Prieto Figueroa"] },
      { nombre: "Tucupita", parroquias: ["Tucupita", "San Rafael", "José Vidal Marcano", "Juan Millán", "Leonardo Ruíz Pineda", "Mariscal Antonio José de Sucre", "Monseñor Argimiro García", "Virgen del Valle"] }
    ]
  },
  {
    nombre: "Distrito Capital",
    municipios: [
      { nombre: "Libertador", parroquias: ["23 de Enero", "Altagracia", "Antímano", "Caricuao", "Catedral", "Coche", "El Junquito", "El Paraíso", "El Recreo", "El Valle", "La Candelaria", "La Pastora", "La Vega", "Macarao", "San Agustín", "San Bernardino", "San José", "San Juan", "San Pedro", "Santa Rosalía", "Santa Teresa", "Sucre"] }
    ]
  },
  {
    nombre: "Falcón",
    municipios: [
      { nombre: "Acosta", parroquias: ["Acosta", "Capadare", "La Pastora", "Libertador", "San Juan de los Cayos"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Aracua", "La Peña", "San Luis"] },
      { nombre: "Buchivacoa", parroquias: ["Buchivacoa", "Bariro", "Borojó", "Capatárida", "Guajiro", "Seque", "Zazárida"] },
      { nombre: "Cacique Manaure", parroquias: ["Cacique Manaure"] },
      { nombre: "Carirubana", parroquias: ["Carirubana", "Norte", "Punta Cardón"] },
      { nombre: "Colina", parroquias: ["Colina", "Acurigua", "Guaibacoa", "Las Calderas", "Macoruca"] },
      { nombre: "Dabajuro", parroquias: ["Dabajuro"] },
      { nombre: "Democracia", parroquias: ["Democracia", "Agua Clara", "Avaria", "Pedregal", "Piedra Grande", "Purureche"] },
      { nombre: "Falcón", parroquias: ["Falcón", "Adaure", "Adícora", "Baraived", "Buena Vista", "Jadacaquiva", "El Vínculo", "El Hato", "Moruy", "Pueblo Nuevo"] },
      { nombre: "Federación", parroquias: ["Federación", "Agua Larga", "Churuguara", "El Paují", "Independencia", "Mapararí"] },
      { nombre: "Jacura", parroquias: ["Jacura", "Agua Linda", "Araurima"] },
      { nombre: "Los Taques", parroquias: ["Los Taques", "Judibana"] },
      { nombre: "Mauroa", parroquias: ["Mauroa", "Mene de Mauroa", "San Félix", "Casigua"] },
      { nombre: "Miranda", parroquias: ["Miranda", "Guzmán Guillermo", "Mitare", "Río Seco", "Sabaneta", "San Antonio", "San Gabriel", "Santa Ana"] },
      { nombre: "Monseñor Iturriza", parroquias: ["Monseñor Iturriza", "Boca de Tocuyo", "Chichiriviche", "Tocuyo de la Costa"] },
      { nombre: "Palmasola", parroquias: ["Palmasola"] },
      { nombre: "Petit", parroquias: ["Petit", "Cabure", "Colina", "Curimagua"] },
      { nombre: "Píritu", parroquias: ["Píritu", "Píritu"] },
      { nombre: "San Francisco", parroquias: ["San Francisco"] },
      { nombre: "Silva", parroquias: ["Silva", "Tucacas", "Boca de Aroa"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Sucre", "Pecaya"] },
      { nombre: "Tocópero", parroquias: ["Tocópero"] },
      { nombre: "Unión", parroquias: ["Unión", "El Charal", "Las Vegas del Tuy"] },
      { nombre: "Urumaco", parroquias: ["Urumaco", "Bruzual"] },
      { nombre: "Zamora", parroquias: ["Zamora", "Puerto Cumarebo", "La Ciénaga", "La Soledad", "Pueblo Cumarebo", "Zazárida"] }
    ]
  },
  {
    nombre: "Guárico",
    municipios: [
      { nombre: "Camaguán", parroquias: ["Camaguán", "Puerto Miranda", "Uverito"] },
      { nombre: "Chaguaramas", parroquias: ["Chaguaramas"] },
      { nombre: "El Socorro", parroquias: ["El Socorro"] },
      { nombre: "Francisco de Miranda", parroquias: ["Francisco de Miranda", "Calabozo", "El Calvario", "El Rastro"] },
      { nombre: "José Félix Ribas", parroquias: ["José Félix Ribas", "Tucupido", "San Rafael de Laya"] },
      { nombre: "José Tadeo Monagas", parroquias: ["José Tadeo Monagas", "Altagracia de Orituco", "Lezama", "Libertad de Orituco", "Paso Real de Macaira", "San Francisco de Macaira"] },
      { nombre: "Juan Germán Roscio", parroquias: ["Juan Germán Roscio", "San Juan de los Morros", "Cantagallo", "Parapara"] },
      { nombre: "Julián Mellado", parroquias: ["Julián Mellado", "El Sombrero", "Sosa"] },
      { nombre: "Las Mercedes", parroquias: ["Las Mercedes", "Cabruta", "Santa Rita de Manapire"] },
      { nombre: "Leonardo Infante", parroquias: ["Leonardo Infante", "Valle de la Pascua", "Espino"] },
      { nombre: "Ortiz", parroquias: ["Ortiz", "San José de Tiznados", "San Francisco de Tiznados", "San Lorenzo de Tiznados"] },
      { nombre: "Pedro Zaraza", parroquias: ["Pedro Zaraza", "Zaraza", "San José de Unare"] },
      { nombre: "San Gerónimo de Guayabal", parroquias: ["San Gerónimo de Guayabal", "Cazorla"] },
      { nombre: "San José de Guaribe", parroquias: ["San José de Guaribe"] },
      { nombre: "Santa María de Ipire", parroquias: ["Santa María de Ipire", "Altamira"] }
    ]
  },
  {
    nombre: "Lara",
    municipios: [
      { nombre: "Andrés Eloy Blanco", parroquias: ["Andrés Eloy Blanco", "Quebrada Honda de Guache", "Pio Tamayo", "Yacambú"] },
      { nombre: "Crespo", parroquias: ["Crespo", "Duaca", "Freitez", "José María Blanco"] },
      { nombre: "Iribarren", parroquias: ["Iribarren", "Aguedo Felipe Alvarado", "Buena Vista", "Catedral", "Concepción", "El Cují", "Juan de Villegas", "Santa Rosa", "Tamaca", "Unión"] },
      { nombre: "Jiménez", parroquias: ["Jiménez", "Juan Bautista Rodríguez", "Cuara", "Diego de Lozada", "Paraíso de San José", "San Miguel", "Tintorero", "José Bernardo Dorante", "Coronel Mariano Peraza"] },
      { nombre: "Morán", parroquias: ["Morán", "Bolívar", "Anzoátegui", "Guárico", "Hilario Luna y Luna", "Humocaro Alto", "Humocaro Bajo", "La Candelaria", "Moroturo", "San Francisco"] },
      { nombre: "Palavecino", parroquias: ["Palavecino", "Cabudare", "José Gregorio Bastidas", "Agua Viva"] },
      { nombre: "Simón Planas", parroquias: ["Simón Planas", "Buría", "Gustavo Vega", "Sarare"] },
      { nombre: "Torres", parroquias: ["Torres", "Altagracia", "Antonio Díaz", "Camacaro", "Castañeda", "Cecilio Zubillaga", "Chiquinquirá", "El Blanco", "Espinoza de los Monteros", "Heriberto Arroyo", "La Miel", "La Pastora", "Montaña Verde", "Monte Carmelo", "Río Claro", "San Francisco", "San Pedro", "Trinidad Samuel"] },
      { nombre: "Urdaneta", parroquias: ["Urdaneta", "Siquisique", "Moroturo", "San Miguel", "Xaguas"] }
    ]
  },
  {
    nombre: "Mérida",
    municipios: [
      { nombre: "Alberto Adriani", parroquias: ["Alberto Adriani", "Gabriel Picón González", "Héctor Amable Mora", "José Nucete Sardi", "Pulido Méndez", "La Hechicera"] },
      { nombre: "Andrés Bello", parroquias: ["Andrés Bello", "La Azulita"] },
      { nombre: "Antonio Pinto Salinas", parroquias: ["Antonio Pinto Salinas", "Mesa Bolívar", "Mesa de Las Palmas"] },
      { nombre: "Aricagua", parroquias: ["Aricagua", "San Antonio"] },
      { nombre: "Arzobispo Chacón", parroquias: ["Arzobispo Chacón", "Canaguá", "Capurí", "Chacantá", "El Molino", "Guaimaral", "Mucutuy", "Mucuchachí"] },
      { nombre: "Campo Elías", parroquias: ["Campo Elías", "Ejido", "Fernández Peña", "Montalbán", "Matriz", "San José", "Jají"] },
      { nombre: "Caracciolo Parra Olmedo", parroquias: ["Caracciolo Parra Olmedo", "Tucaní"] },
      { nombre: "Cardenal Quintero", parroquias: ["Cardenal Quintero", "Santo Domingo", "Las Piedras"] },
      { nombre: "Guaraque", parroquias: ["Guaraque", "Mesa de Quintero", "Río Negro"] },
      { nombre: "Julio César Salas", parroquias: ["Julio César Salas", "Arapuey", "Palmira"] },
      { nombre: "Justo Briceño", parroquias: ["Justo Briceño", "Torondoy", "San Cristóbal de Torondoy"] },
      { nombre: "Libertador", parroquias: ["Libertador", "Antonio Spinetti Dini", "Arias", "Caracciolo Parra Pérez", "Domingo Peña", "El Llano", "Gonzalo Picón Febres", "Jacinto Plaza", "Juan Rodríguez Suárez", "Lasso de la Vega", "Mariano Picón Salas", "Milla", "Osuna Rodríguez", "Sagrario", "El Morro"] },
      { nombre: "Miranda", parroquias: ["Miranda", "Andrés Eloy Blanco", "La Venta", "Piñango", "Timotes"] },
      { nombre: "Obispo Ramos de Lora", parroquias: ["Obispo Ramos de Lora", "Eloy Paredes", "San Rafael de Alcázar", "Santa Elena de Arenales"] },
      { nombre: "Padre Noguera", parroquias: ["Padre Noguera", "Santa María de Caparo"] },
      { nombre: "Pueblo Llano", parroquias: ["Pueblo Llano"] },
      { nombre: "Rangel", parroquias: ["Rangel", "Cacute", "La Toma", "Mucurubá", "Mucuchíes", "San Rafael", "Santa Cruz de Mora"] },
      { nombre: "Rivas Dávila", parroquias: ["Rivas Dávila", "Bailadores", "Gerónimo Maldonado"] },
      { nombre: "Santos Marquina", parroquias: ["Santos Marquina", "Tabay"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Chiguará", "Estánques", "Lagunillas", "La Trampa", "Pueblo Nuevo del Sur", "San Juan"] },
      { nombre: "Tovar", parroquias: ["Tovar", "El Amparo", "El Llano", "San Francisco", "Tovar"] },
      { nombre: "Tulio Febres Cordero", parroquias: ["Tulio Febres Cordero", "Independencia", "Mucuchíes", "Palmarito", "Santa Cruz de Mora"] },
      { nombre: "Zea", parroquias: ["Zea", "Caño El Tigre"] }
    ]
  },
  {
    nombre: "Miranda",
    municipios: [
      { nombre: "Acevedo", parroquias: ["Acevedo", "Caucagua", "Aragüita", "Arévalo González", "Capaya", "El Café", "Marizapa", "Panaquire", "Ribas"] },
      { nombre: "Andrés Bello", parroquias: ["Andrés Bello", "San José de Barlovento"] },
      { nombre: "Baruta", parroquias: ["Baruta", "El Cafetal", "Las Minas de Baruta"] },
      { nombre: "Brión", parroquias: ["Brión", "Higuerote", "Curiepe", "Tacarigua"] },
      { nombre: "Buroz", parroquias: ["Buroz", "Mamporal"] },
      { nombre: "Carrizal", parroquias: ["Carrizal"] },
      { nombre: "Chacao", parroquias: ["Chacao"] },
      { nombre: "Cristóbal Rojas", parroquias: ["Cristóbal Rojas", "Charallave", "Las Brisas"] },
      { nombre: "El Hatillo", parroquias: ["El Hatillo"] },
      { nombre: "Guaicaipuro", parroquias: ["Guaicaipuro", "Los Teques", "Altagracia de la Montaña", "Cecilio Acosta", "El Jarillo", "Paracotos", "San Pedro", "Tácata"] },
      { nombre: "Independencia", parroquias: ["Independencia", "Santa Teresa del Tuy", "El Cartanal"] },
      { nombre: "Lander", parroquias: ["Lander", "Ocumare del Tuy", "La Democracia", "Santa Bárbara"] },
      { nombre: "Los Salias", parroquias: ["Los Salias", "San Antonio de los Altos"] },
      { nombre: "Páez", parroquias: ["Páez", "Río Chico", "El Guapo", "Tacarigua de la Laguna", "Paparo", "San Fernando del Guapo"] },
      { nombre: "Paz Castillo", parroquias: ["Paz Castillo", "Santa Lucía"] },
      { nombre: "Pedro Gual", parroquias: ["Pedro Gual", "Cúpira", "Machurucuto"] },
      { nombre: "Plaza", parroquias: ["Plaza", "Guarenas"] },
      { nombre: "Simón Bolívar", parroquias: ["Simón Bolívar", "San Francisco de Yare", "San Antonio de Yare"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Petare", "Caucagüita", "Fila de Mariches", "La Dolorita", "Leoncio Martínez"] },
      { nombre: "Urdaneta", parroquias: ["Urdaneta", "Cúa", "Nueva Cúa"] },
      { nombre: "Zamora", parroquias: ["Zamora", "Guatire", "Bolívar"] }
    ]
  },
  {
    nombre: "Monagas",
    municipios: [
      { nombre: "Acosta", parroquias: ["Acosta", "San Antonio", "San Francisco"] },
      { nombre: "Aguasay", parroquias: ["Aguasay"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Caripito"] },
      { nombre: "Caripe", parroquias: ["Caripe", "El Guácharo", "La Guanota", "Sabana de Piedra", "San Agustín", "Tereseño"] },
      { nombre: "Cedeño", parroquias: ["Cedeño", "Areo", "San Félix", "Viento Fresco"] },
      { nombre: "Ezequiel Zamora", parroquias: ["Ezequiel Zamora", "El Tejero", "Punta de Mata"] },
      { nombre: "Libertador", parroquias: ["Libertador", "Chaguaramas", "Las Alhuacas", "Tabasca", "Temblador"] },
      { nombre: "Maturín", parroquias: ["Maturín", "Alto de los Godos", "Boquerón", "El Corozo", "El Furrial", "Jusepín", "La Pica", "San Simón", "Santa Bárbara", "El Furrial", "Las Cocuizas"] },
      { nombre: "Piar", parroquias: ["Piar", "Aragua", "Chaguaramal", "El Pinto", "Guanaguana", "La Toscana", "Taguaya"] },
      { nombre: "Punceres", parroquias: ["Punceres", "Cachipo", "Quiriquire"] },
      { nombre: "Santa Bárbara", parroquias: ["Santa Bárbara"] },
      { nombre: "Sotillo", parroquias: ["Sotillo", "Barrancas", "Los Barrancos"] },
      { nombre: "Uracoa", parroquias: ["Uracoa"] }
    ]
  },
  {
    nombre: "Nueva Esparta",
    municipios: [
      { nombre: "Antolín del Campo", parroquias: ["Antolín del Campo"] },
      { nombre: "Arismendi", parroquias: ["Arismendi", "La Asunción"] },
      { nombre: "García", parroquias: ["García", "El Valle del Espíritu Santo"] },
      { nombre: "Gómez", parroquias: ["Gómez", "Santa Ana", "Punta de Piedras"] },
      { nombre: "Maneiro", parroquias: ["Maneiro", "Pampatar"] },
      { nombre: "Marcano", parroquias: ["Marcano", "Juan Griego"] },
      { nombre: "Mariño", parroquias: ["Mariño", "Porlamar"] },
      { nombre: "Península de Macanao", parroquias: ["Península de Macanao", "Boca de Río", "San Francisco"] },
      { nombre: "Tubores", parroquias: ["Tubores", "Punta de Piedras", "Los Barales"] },
      { nombre: "Villalba", parroquias: ["Villalba", "San Pedro de Coche"] },
      { nombre: "Díaz", parroquias: ["Díaz", "San Juan Bautista"] }
    ]
  },
  {
    nombre: "Portuguesa",
    municipios: [
      { nombre: "Agua Blanca", parroquias: ["Agua Blanca"] },
      { nombre: "Araure", parroquias: ["Araure", "Río Acarigua"] },
      { nombre: "Esteller", parroquias: ["Esteller", "Píritu"] },
      { nombre: "Guanare", parroquias: ["Guanare", "Córdoba", "San José de la Montaña", "San Juan de Guanaguanare", "Virgen de la Coromoto"] },
      { nombre: "Guanarito", parroquias: ["Guanarito", "Trinidad de la Capilla", "Divina Pastora"] },
      { nombre: "Monseñor José Vicente de Unda", parroquias: ["Monseñor José Vicente de Unda", "Peña Blanca"] },
      { nombre: "Ospino", parroquias: ["Ospino", "Aparición", "La Estación"] },
      { nombre: "Páez", parroquias: ["Páez", "Acarigua", "Payara", "Pimpinela", "Ramón Peraza"] },
      { nombre: "Papelón", parroquias: ["Papelón", "Caño Delgadito"] },
      { nombre: "San Genaro de Boconoíto", parroquias: ["San Genaro de Boconoíto", "Antolín Tovar", "Boconoíto"] },
      { nombre: "San Rafael de Onoto", parroquias: ["San Rafael de Onoto", "Santa Fé", "Thermo Morles"] },
      { nombre: "Santa Rosalía", parroquias: ["Santa Rosalía", "Florida", "El Playón"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Biscucuy", "Concepción", "San José de Saguaz", "San Rafael de Palo Alzado", "Uvencio Antonio Velásquez", "Villa Rosa"] },
      { nombre: "Turen", parroquias: ["Turen", "Villa Bruzual", "Canelones", "Santa Cruz"] }
    ]
  },
  {
    nombre: "Sucre",
    municipios: [
      { nombre: "Andrés Eloy Blanco", parroquias: ["Andrés Eloy Blanco", "Mariño"] },
      { nombre: "Andrés Mata", parroquias: ["Andrés Mata", "San José de Aerocuar", "Tavera Acosta"] },
      { nombre: "Arismendi", parroquias: ["Arismendi", "Río Caribe", "Antonio José de Sucre", "El Morro de Puerto Santo", "Puerto Santo", "San Juan de las Galdonas"] },
      { nombre: "Benítez", parroquias: ["Benítez", "El Pilar", "El Rincón", "General Francisco Antonio Váquez", "Guaraúnos", "Tunapuicito", "Unión"] },
      { nombre: "Bermúdez", parroquias: ["Bermúdez", "Carúpano", "Santa Catalina", "Santa Rosa", "Santa Teresa"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Marigüitar"] },
      { nombre: "Cajigal", parroquias: ["Cajigal", "Yaguaraparo", "El Paujil", "Libertad"] },
      { nombre: "Cruz Salmerón Acosta", parroquias: ["Cruz Salmerón Acosta", "Araya", "Chacopata", "Manicuare"] },
      { nombre: "Libertador", parroquias: ["Libertador", "Tunapuy"] },
      { nombre: "Mariño", parroquias: ["Mariño", "Irapa", "Campo Claro", "Maraval", "San Antonio de Irapa", "Soro"] },
      { nombre: "Mejía", parroquias: ["Mejía"] },
      { nombre: "Montes", parroquias: ["Montes", "Cumanacoa", "Arenas", "Aricagua", "Cocollar", "San Fernando", "San Lorenzo"] },
      { nombre: "Ribero", parroquias: ["Ribero", "Cariaco", "Catuaro", "Rendón", "Santa Cruz", "Santa María"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Cumaná", "Altagracia", "Ayacucho", "Santa Inés", "Valentín Valiente"] },
      { nombre: "Valdez", parroquias: ["Valdez", "Güiria", "Bideau", "Cristóbal Colón", "Punta de Piedras"] }
    ]
  },
  {
    nombre: "Táchira",
    municipios: [
      { nombre: "Andrés Bello", parroquias: ["Andrés Bello", "Cordero"] },
      { nombre: "Antonio Rómulo Costa", parroquias: ["Antonio Rómulo Costa", "Las Mesas"] },
      { nombre: "Ayacucho", parroquias: ["Ayacucho", "Colón", "Rivas Berti", "San Pedro del Río"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "San Antonio del Táchira"] },
      { nombre: "Cárdenas", parroquias: ["Cárdenas", "Táriba", "Emilio Constantino Guerrero", "Francisco de Miranda", "La Concordia", "San José de Bolívar"] },
      { nombre: "Córdoba", parroquias: ["Córdoba", "Santa Ana del Táchira"] },
      { nombre: "Fernández Feo", parroquias: ["Fernández Feo", "San Rafael del Piñal", "Alberto Adriani", "Santo Domingo"] },
      { nombre: "Francisco de Miranda", parroquias: ["Francisco de Miranda", "San José de Bolívar"] },
      { nombre: "García de Hevia", parroquias: ["García de Hevia", "La Fría", "Boca de Grita", "José Antonio Páez"] },
      { nombre: "Guásimos", parroquias: ["Guásimos", "Palmira"] },
      { nombre: "Independencia", parroquias: ["Independencia", "Capacho Nuevo", "Juan Germán Roscio", "Román Cárdenas"] },
      { nombre: "Jáuregui", parroquias: ["Jáuregui", "La Grita", "Emilio Constantino Guerrero", "Monseñor Miguel Antonio Salas"] },
      { nombre: "José María Vargas", parroquias: ["José María Vargas", "El Cobre"] },
      { nombre: "Junín", parroquias: ["Junín", "Rubio", "Bramón", "La Petrólea", "Quinimarí"] },
      { nombre: "Libertad", parroquias: ["Libertad", "Capacho Viejo", "Cipriano Castro", "Manuel Felipe Rugeles"] },
      { nombre: "Libertador", parroquias: ["Libertador", "Abejales", "Doradas", "Emeterio Ochoa", "San Joaquín de Navay"] },
      { nombre: "Lobatera", parroquias: ["Lobatera", "Lobatera", "Constitución"] },
      { nombre: "Michelena", parroquias: ["Michelena"] },
      { nombre: "Panamericano", parroquias: ["Panamericano", "Coloncito", "La Palmita"] },
      { nombre: "Pedro María Ureña", parroquias: ["Pedro María Ureña", "Ureña", "Nueva Arcadia"] },
      { nombre: "Rafael Urdaneta", parroquias: ["Rafael Urdaneta", "Delicias", "Pecaya"] },
      { nombre: "Samuel Darío Maldonado", parroquias: ["Samuel Darío Maldonado", "La Tendida", "San Isidro"] },
      { nombre: "San Cristóbal", parroquias: ["San Cristóbal", "La Concordia", "Pedro María Morantes", "San Juan Bautista", "San Sebastián"] },
      { nombre: "San Judas Tadeo", parroquias: ["San Judas Tadeo", "Umuquena"] },
      { nombre: "Seboruco", parroquias: ["Seboruco"] },
      { nombre: "Simón Rodríguez", parroquias: ["Simón Rodríguez", "San Simón"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Queniquea", "San Pablo", "Santo Domingo"] },
      { nombre: "Torbes", parroquias: ["Torbes", "San Josecito"] },
      { nombre: "Urdaneta", parroquias: ["Urdaneta", "Delicias", "Pecaya"] }
    ]
  },
  {
    nombre: "Trujillo",
    municipios: [
      { nombre: "Andrés Bello", parroquias: ["Andrés Bello", "Santa Isabel"] },
      { nombre: "Boconó", parroquias: ["Boconó", "El Carmen", "Mosquey", "Ayacucho", "Burbusay", "General Ribas", "Guaramacal", "Vega de Guaramacal", "Monseñor Jáuregui", "Rafael Rangel", "San Miguel", "San José"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Sabana Grande"] },
      { nombre: "Candelaria", parroquias: ["Candelaria", "Chejendé", "Carache", "La Mesa de Esnujaque", "Trujillo", "Niquitao"] },
      { nombre: "Carache", parroquias: ["Carache", "La Concepción", "Carvajal", "Cuicas", "Panamericana"] },
      { nombre: "Escuque", parroquias: ["Escuque", "La Unión", "Sabana Libre"] },
      { nombre: "José Felipe Márquez Cañizalez", parroquias: ["José Felipe Márquez Cañizalez", "El Paradero", "San Lázaro"] },
      { nombre: "Juan Vicente Campo Elías", parroquias: ["Juan Vicente Campo Elías", "Campo Elías"] },
      { nombre: "La Ceiba", parroquias: ["La Ceiba", "Santa Apolonia", "El Progreso", "La Ceiba", "Tres de Febrero"] },
      { nombre: "Miranda", parroquias: ["Miranda", "El Dividive", "Agua Santa", "Agua Caliente", "El Cenizo", "Valerita"] },
      { nombre: "Monte Carmelo", parroquias: ["Monte Carmelo", "Buena Vista", "Santa María del Horcón"] },
      { nombre: "Motatán", parroquias: ["Motatán", "El Baño", "Jalisco"] },
      { nombre: "Pampán", parroquias: ["Pampán", "Flor de Patria", "La Paz", "Santa Ana"] },
      { nombre: "Pampanito", parroquias: ["Pampanito", "La Concepción", "Pampanito"] },
      { nombre: "Rafael Rangel", parroquias: ["Rafael Rangel", "Betijoque", "El Cedro", "La Pueblita", "Las Piedras", "Los Cedros", "José Gregorio Hernández"] },
      { nombre: "San Rafael de Carvajal", parroquias: ["San Rafael de Carvajal", "Carvajal", "Campo Alegre", "Antonio Nicolás Briceño", "José Leonardo Suárez"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Sabana de Mendoza", "Junín", "Valmore Rodríguez", "El Paraíso"] },
      { nombre: "Trujillo", parroquias: ["Trujillo", "Andrés Linares", "Chiquinquirá", "Cristóbal Mendoza", "Cruz Carrillo", "Matriz", "Monseñor Carrillo", "Tres Esquinas"] },
      { nombre: "Urdaneta", parroquias: ["Urdaneta", "La Quebrada", "Carrillo", "Cabimbú", "Jajó"] },
      { nombre: "Valera", parroquias: ["Valera", "Juan Ignacio Montilla", "La Beatriz", "La Puerta", "Mendoza del Valle del Momboy", "Mercedes Díaz", "San Luis"] }
    ]
  },
  {
    nombre: "Vargas",
    municipios: [
      { nombre: "Vargas", parroquias: ["Caraballeda", "Carayaca", "Carlos Soublette", "Caruao", "Catia La Mar", "El Junko", "La Guaira", "Macuto", "Maiquetía", "Naiguatá", "Urimare"] }
    ]
  },
  {
    nombre: "Yaracuy",
    municipios: [
      { nombre: "Arístides Bastidas", parroquias: ["Arístides Bastidas", "San Pablo"] },
      { nombre: "Bolívar", parroquias: ["Bolívar", "Aroa"] },
      { nombre: "Bruzual", parroquias: ["Bruzual", "Chivacoa", "Campo Elías"] },
      { nombre: "Cocorote", parroquias: ["Cocorote"] },
      { nombre: "Independencia", parroquias: ["Independencia", "Independencia"] },
      { nombre: "José Antonio Páez", parroquias: ["José Antonio Páez", "Sabana de Parra"] },
      { nombre: "La Trinidad", parroquias: ["La Trinidad", "Boraure"] },
      { nombre: "Manuel Monge", parroquias: ["Manuel Monge", "Yumare"] },
      { nombre: "Nirgua", parroquias: ["Nirgua", "Salom", "Temerla"] },
      { nombre: "Peña", parroquias: ["Peña", "Yaritagua", "San Andrés"] },
      { nombre: "San Felipe", parroquias: ["San Felipe", "Albarico", "San Javier", "Urachiche"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Guama"] },
      { nombre: "Urachiche", parroquias: ["Urachiche"] },
      { nombre: "Veroes", parroquias: ["Veroes", "El Guayabo", "Farriar"] }
    ]
  },
  {
    nombre: "Zulia",
    municipios: [
      { nombre: "Almirante Padilla", parroquias: ["Almirante Padilla", "Isla de Toas", "Monte Carmelo"] },
      { nombre: "Baralt", parroquias: ["Baralt", "San Timoteo", "General Urdaneta", "Libertador", "Marcelino Briceño", "Pueblo Nuevo", "Manuel Guanipa Matos"] },
      { nombre: "Cabimas", parroquias: ["Cabimas", "Ambrosio", "Carmen Herrera", "La Rosa", "Germán Ríos Linares", "San Benito", "Rómulo Betancourt", "Jorge Hernández", "Punta Gorda"] },
      { nombre: "Catatumbo", parroquias: ["Catatumbo", "Encontrados", "Udón Pérez"] },
      { nombre: "Colón", parroquias: ["Colón", "San Carlos del Zulia", "Moralito", "Santa Bárbara", "Santa Cruz del Zulia", "Urribarrí"] },
      { nombre: "Francisco Javier Pulgar", parroquias: ["Francisco Javier Pulgar", "Carlos Quevedo", "Francisco Javier Pulgar", "Simón Rodríguez"] },
      { nombre: "Jesús Enrique Lossada", parroquias: ["Jesús Enrique Lossada", "La Concepción", "San José", "Mariano Parra León", "José Ramón Yépez"] },
      { nombre: "Jesús María Semprún", parroquias: ["Jesús María Semprún", "Bari", "Casigua El Cubo"] },
      { nombre: "La Cañada de Urdaneta", parroquias: ["La Cañada de Urdaneta", "Concepción", "Andrés Bello", "Antonio Borjas Romero", "José Centeno", "Chiquinquirá", "El Carmelo", "Potreritos"] },
      { nombre: "Lagunillas", parroquias: ["Lagunillas", "Alonso de Ojeda", "Campo Rojo", "Venezuela", "El Danto", "Libertad"] },
      { nombre: "Machiques de Perijá", parroquias: ["Machiques de Perijá", "Bartolomé de las Casas", "Libertad", "Río Negro", "San José de Perijá"] },
      { nombre: "Mara", parroquias: ["Mara", "San Rafael", "La Sierrita", "Las Parcelas", "Luis de Vicente", "Monseñor Marcos Sergio Godoy", "Ricaurte", "Tamare"] },
      { nombre: "Maracaibo", parroquias: ["Maracaibo", "Antonio Borjas Romero", "Bolívar", "Cacique Mara", "Caracciolo Parra Pérez", "Cecilio Acosta", "Cristo de Aranza", "Coquivacoa", "Chiquinquirá", "Francisco Eugenio Bustamante", "Idelfonso Vásquez", "Juana de Ávila", "Luis Hurtado Higuera", "Manuel Dagnino", "Olegario Villalobos", "Raúl Leoni", "Santa Lucía", "San Isidro", "Venancio Pulgar"] },
      { nombre: "Miranda", parroquias: ["Miranda", "Altagracia", "Ana María Campos", "Faría", "San Antonio", "San José"] },
      { nombre: "Páez", parroquias: ["Páez", "Sinamaica", "Alta Guajira", "Elías Sánchez Rubio", "Guajira"] },
      { nombre: "Rosario de Perijá", parroquias: ["Rosario de Perijá", "El Rosario", "Donaldo García", "Sixto Zambrano"] },
      { nombre: "San Francisco", parroquias: ["San Francisco", "Domitila Flores", "El Bajo", "Francisco Ochoa", "Los Cortijos", "Marcial Hernández", "San Francisco"] },
      { nombre: "Santa Rita", parroquias: ["Santa Rita", "El Mene", "José Cenobio Urribarrí", "Pedro Lucas Urribarrí"] },
      { nombre: "Simón Bolívar", parroquias: ["Simón Bolívar", "Manuel Manrique", "Rafael María Baralt"] },
      { nombre: "Sucre", parroquias: ["Sucre", "Bobures", "Gibraltar", "Heras", "Monseñor Arturo Álvarez", "Rómulo Gallegos", "La Ceiba", "El Batey"] },
      { nombre: "Valmore Rodríguez", parroquias: ["Valmore Rodríguez", "Bachaquero", "La Victoria", "Rafael Urdaneta"] }
    ]
  }
];

// ============================================
// TIPOS PARA EL FORMULARIO
// ============================================

interface FormData {
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
  nombreAgrupacionesPertenecio: string;
  nucleo: string;
  añoInicio: string;
  agrupacionPertenece: string;
  instrumentoPrincipal: string;
  instrumentosSecundarios: string;
  nombreColegio: string;
  gradoCursa: string;
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
  representanteId?: string;
}

// ============================================
// COMPONENTES PERSONALIZADOS
// ============================================

// Componente de carga
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] py-8 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9A784F] mx-auto mb-4" />
        <p className="text-[#362511]">Cargando formulario...</p>
      </div>
    </div>
  );
}

// Componente principal
export default function RegistroPage() {
  const [mounted, setMounted] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función para calcular edad
  const calcularEdad = useCallback((fechaNacimiento: string): string => {
    if (!fechaNacimiento) return '';
    try {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      if (isNaN(nacimiento.getTime())) return '';
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth();
      const dia = hoy.getDate();
      if (mes < nacimiento.getMonth() || (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
        edad--;
      }
      return edad.toString();
    } catch {
      return '';
    }
  }, []);

  // Efecto para actualizar edad
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const nuevaEdad = calcularEdad(formData.fechaNacimiento);
      if (nuevaEdad !== formData.edad) {
        setFormData(prev => ({ ...prev, edad: nuevaEdad }));
      }
    }
  }, [formData.fechaNacimiento, calcularEdad]);

  // Efectos para dependencias
  useEffect(() => {
    if (formData.lugarNacimiento) {
      setFormData(prev => ({ ...prev, municipio: '', parroquia: '' }));
    }
  }, [formData.lugarNacimiento]);

  useEffect(() => {
    if (formData.municipio) {
      setFormData(prev => ({ ...prev, parroquia: '' }));
    }
  }, [formData.municipio]);

  // Validaciones
  const validarSoloLetras = (valor: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
  const validarSoloNumeros = (valor: string) => /^\d+$/.test(valor);
  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarCedula = (cedula: string) => cedula.length >= 7 && cedula.length <= 8 && validarSoloNumeros(cedula);
  const validarTelefono = (telefono: string) => telefono.length >= 10 && validarSoloNumeros(telefono);
  const validarFechaNacimiento = (fecha: string) => {
    if (!fecha) return false;
    try {
      const fechaNac = new Date(fecha);
      const hoy = new Date();
      if (isNaN(fechaNac.getTime())) return false;
      if (fechaNac > hoy) return false;
      return true;
    } catch {
      return false;
    }
  };
  const validarAñoInicio = (año: string) => {
    const añoNum = parseInt(año, 10);
    const añoActual = new Date().getFullYear();
    return añoNum >= 1990 && añoNum <= añoActual;
  };

  const handleChange = (field: keyof FormData, value: string) => {
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
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
        return;
      case 'instrumentoPrincipal':
        if (instrumentosSecundariosSeleccionados.includes(value)) {
          const nuevosSecundarios = instrumentosSecundariosSeleccionados.filter(instr => instr !== value);
          setInstrumentosSecundariosSeleccionados(nuevosSecundarios);
          setFormData(prev => ({ ...prev, instrumentosSecundarios: nuevosSecundarios.join(', ') }));
        }
        break;
    }

    const newData = { ...formData, [field]: processedValue };
    
    if (field === 'condicionAlumno' && processedValue === 'no') newData.especifiqueCondicion = '';
    if (field === 'necesidadesEspecialesAprendizaje' && processedValue === 'no') newData.especifiqueNecesidades = '';
    if (field === 'esAlergico' && processedValue === 'no') newData.especifiqueAlergia = '';
    if (field === 'estaVacunado' && processedValue === 'no') newData.numeroDosisVacuna = '';
    
    setFormData(newData);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleEnfermedadChange = (enfermedad: string, checked: boolean) => {
    const nuevasEnfermedades = checked
      ? [...enfermedadesSeleccionadas, enfermedad]
      : enfermedadesSeleccionadas.filter(e => e !== enfermedad);
    
    setEnfermedadesSeleccionadas(nuevasEnfermedades);
    const enfermedadesTexto = [...nuevasEnfermedades, ...(formData.otrasEnfermedades ? ['otras'] : [])].join(', ');
    setFormData(prev => ({ ...prev, enfermedadesPadece: enfermedadesTexto }));
  };

  const handleInstrumentoSecundarioChange = (instrumento: string, checked: boolean) => {
    if (instrumento === formData.instrumentoPrincipal) return;
    const nuevosInstrumentos = checked
      ? [...instrumentosSecundariosSeleccionados, instrumento]
      : instrumentosSecundariosSeleccionados.filter(i => i !== instrumento);
    setInstrumentosSecundariosSeleccionados(nuevosInstrumentos);
    setFormData(prev => ({ ...prev, instrumentosSecundarios: nuevosInstrumentos.join(', ') }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) newErrors.nombres = 'Los nombres son obligatorios';
    else if (!validarSoloLetras(formData.nombres)) newErrors.nombres = 'Los nombres solo pueden contener letras y espacios';
    else if (formData.nombres.trim().length < 2) newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    else if (!validarSoloLetras(formData.apellidos)) newErrors.apellidos = 'Los apellidos solo pueden contener letras y espacios';
    else if (formData.apellidos.trim().length < 2) newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    
    if (!formData.cedulaIdentidad.trim()) newErrors.cedulaIdentidad = 'La cédula es obligatoria';
    else if (!validarCedula(formData.cedulaIdentidad)) newErrors.cedulaIdentidad = 'La cédula debe tener entre 7 y 8 dígitos';
    
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    else if (!validarFechaNacimiento(formData.fechaNacimiento)) newErrors.fechaNacimiento = 'La fecha de nacimiento no es válida (no puede ser futura)';
    
    if (!formData.sexo) newErrors.sexo = 'El sexo es obligatorio';
    if (!formData.lugarNacimiento) newErrors.lugarNacimiento = 'El lugar de nacimiento es obligatorio';
    
    if (!formData.municipio) newErrors.municipio = 'El municipio es obligatorio';
    else if (!validarSoloLetras(formData.municipio)) newErrors.municipio = 'El municipio solo puede contener letras y espacios';
    else if (formData.municipio.trim().length < 3) newErrors.municipio = 'El municipio debe tener al menos 3 caracteres';
    
    if (!formData.parroquia) newErrors.parroquia = 'La parroquia es obligatoria';
    else if (formData.parroquia.trim().length < 3) newErrors.parroquia = 'La parroquia debe tener al menos 3 caracteres';
    
    if (!formData.direccionHabitacion.trim()) newErrors.direccionHabitacion = 'La dirección es obligatoria';
    else if (formData.direccionHabitacion.trim().length < 10) newErrors.direccionHabitacion = 'La dirección debe tener al menos 10 caracteres';
    
    if (!formData.numeroTelefonoCelular.trim()) newErrors.numeroTelefonoCelular = 'El teléfono celular es obligatorio';
    else if (!validarTelefono(formData.numeroTelefonoCelular)) newErrors.numeroTelefonoCelular = 'El teléfono debe tener al menos 10 dígitos';
    
    if (formData.numeroTelefonoLocal.trim() && !validarSoloNumeros(formData.numeroTelefonoLocal)) {
      newErrors.numeroTelefonoLocal = 'El teléfono local debe contener solo números';
    } else if (formData.numeroTelefonoLocal.trim() && formData.numeroTelefonoLocal.length < 10) {
      newErrors.numeroTelefonoLocal = 'El teléfono local debe tener al menos 10 dígitos';
    }
    
    if (!formData.correoElectronico.trim()) newErrors.correoElectronico = 'El correo electrónico es obligatorio';
    else if (!validarEmail(formData.correoElectronico)) newErrors.correoElectronico = 'El formato del correo electrónico no es válido';
    
    if (!formData.nucleo) newErrors.nucleo = 'El núcleo es obligatorio';
    if (!formData.añoInicio) newErrors.añoInicio = 'El año de inicio es obligatorio';
    else if (!validarAñoInicio(formData.añoInicio)) newErrors.añoInicio = 'El año debe estar entre 1990 y el año actual';
    
    if (!formData.agrupacionPertenece) newErrors.agrupacionPertenece = 'La orquesta actual es obligatoria';
    
    if (!formData.condicionAlumno) newErrors.condicionAlumno = 'Este campo es obligatorio';
    if (!formData.necesidadesEspecialesAprendizaje) newErrors.necesidadesEspecialesAprendizaje = 'Este campo es obligatorio';
    if (!formData.esAlergico) newErrors.esAlergico = 'Este campo es obligatorio';
    if (!formData.estaVacunado) newErrors.estaVacunado = 'Este campo es obligatorio';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        const datosParaEnviar = {
          ...formData,
          instrumentoPrincipal: formData.instrumentoPrincipal || "",
          instrumentosSecundarios: instrumentosSecundariosSeleccionados.join(', ') || "",
          enfermedadesPadece: [...enfermedadesSeleccionadas, ...(formData.otrasEnfermedades ? [`otras: ${formData.otrasEnfermedades}`] : [])].join(', '),
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosParaEnviar),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Error en el servidor');
        }

        let estudianteId: string | undefined;
        if (responseData.estudiante?.id) estudianteId = responseData.estudiante.id;
        else if (responseData.id) estudianteId = responseData.id;

        if (!estudianteId) throw new Error('La respuesta del servidor no contiene el ID del estudiante');

        localStorage.setItem('ultimoEstudianteId', estudianteId);
        alert('✅ Registro de estudiante completado exitosamente. Ahora complete los datos de los representantes.');
        router.push(`/inscripcion_representantes?estudianteId=${estudianteId}`);
        
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Hubo un error al procesar el registro');
      }
    } else {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setIsSubmitting(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (currentYear - i).toString());

  const agrupacionesMusicales = [
    "Iniciación Musical", "Coro Infantil", "Coro Juvenil Eduardo Plaza", "Coro Adulto",
    "Programa Educación Especial (P.E.E)", "Orquesta Afrovenzolana Infantil",
    "Orquesta Afrovenezolana Regional Otilio Galíndez", "Orquesta Alma Llanera Infantil",
    "Orquesta Alma Llanera Regional Cristóbal Jiménez", "Orquesta Sinfónica Beethoven",
    "Orquesta Sinfónica Infantil", "Orquesta Sinfónica Regional Juvenil Juan Bautista Plaza",
    "Danza", "Piano", "Orquesta Latino Caribeña"
  ];

  const gradosEscolares = [
    "1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado",
    "1er Año", "2do Año", "3er Año", "4to Año", "5to Año"
  ];

  const instrumentosMusicales = ["Violín", "Viola", "Violonchelo", "Contrabajo"];

  const nucleosLista = [
    "Baruta", "BCV", "Cantv-Ccs", "Caricuao", "Carmelitas", 
    "Centro académico regional 23 de enero", "Centro académico regional La Rinconada", 
    "Centro académico regional Los Chorros", "Centro académico regional Montalbán", 
    "Centro académico regional San Agustín", "Centro de formación coral inocente Carreño", 
    "Chacao libertador", "Chapellín", "CICPC", "Ciudad caribia", "Colonia Tovar", 
    "Comandancia G.N", "Convenio Vicepresidencia", "Corpoelec", "Cultura Chacao", 
    "el Hatillo", "Entidad de atención Dr. José Gregorio Hernández", "Fuerte Tiuna", 
    "Galipán", "gran Colombia", "junín", "junco", "la Carlota", "la Ceiba", "la Hoyada", 
    "la pastora", "La Vega", "lince", "los rosales", "Miraflores", "petare", 
    "quebrada Honda", "quinta Marilina", "Ruiz Pineda", "Santa Cruz del este", 
    "Santa Rosa", "Sarría", "seniat", "Soublette chacao", "TSJ", "universidad Santa Rosa"
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const nucleosFiltrados = nucleosLista.filter(nucleo =>
    nucleo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/inicio">
            <Button variant="ghost" className="flex items-center gap-2 text-[#362511] hover:bg-[#795C34] hover:text-white">
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
              <div className="w-12 h-12 rounded-full bg-[#9A784F] text-white flex items-center justify-center font-bold shadow-lg">1</div>
              <span className="text-sm mt-2 font-bold text-[#362511]">Estudiante</span>
            </div>
            <div className="w-32 h-1 bg-[#9A784F] mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#D4B8A4] text-[#795C34] flex items-center justify-center font-bold">2</div>
              <span className="text-sm mt-2 text-[#795C34] font-medium">Representantes</span>
            </div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-[#E8D5C4]">
          <CardHeader className="bg-gradient-to-r from-[#9A784F] to-[#795C34] text-white relative">
            <div className="absolute top-0 left-10 right-10 h-1 bg-[#E8D5C4] rounded-full"></div>
            <div className="flex items-center gap-6">
              <div className="bg-white/15 p-3 rounded-full"><User className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-semibold">Registro de Estudiantes</CardTitle>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">1/2</span>
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
                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Nombres <span className="text-red-500">*</span></Label>
                    <Input value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} placeholder="Ingrese los nombres" className={errors.nombres ? 'border-red-500' : ''} />
                    {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Apellidos <span className="text-red-500">*</span></Label>
                    <Input value={formData.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} placeholder="Ingrese los apellidos" className={errors.apellidos ? 'border-red-500' : ''} />
                    {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Cédula de Identidad <span className="text-red-500">*</span></Label>
                    <Input value={formData.cedulaIdentidad} onChange={(e) => handleChange('cedulaIdentidad', e.target.value)} placeholder="Ej: 12345678" maxLength={8} className={errors.cedulaIdentidad ? 'border-red-500' : ''} />
                    {errors.cedulaIdentidad && <p className="text-red-500 text-sm mt-1">{errors.cedulaIdentidad}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Fecha de Nacimiento <span className="text-red-500">*</span></Label>
                    <Input type="date" value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} className={errors.fechaNacimiento ? 'border-red-500' : ''} />
                    {errors.fechaNacimiento && <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Edad</Label>
                    <Input value={formData.edad} readOnly placeholder="Se calcula automáticamente" className="bg-[#F8F4F0]" />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Sexo <span className="text-red-500">*</span></Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleChange('sexo', value)}>
                      <SelectTrigger className={errors.sexo ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione su sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && <p className="text-red-500 text-sm mt-1">{errors.sexo}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-bold text-[#362511]">Lugar de Nacimiento (Estado) <span className="text-red-500">*</span></Label>
                  <Select value={formData.lugarNacimiento} onValueChange={(value) => handleChange('lugarNacimiento', value)}>
                    <SelectTrigger className={errors.lugarNacimiento ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENEZUELA_DATA.map((estado) => (
                        <SelectItem key={estado.nombre} value={estado.nombre}>{estado.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lugarNacimiento && <p className="text-red-500 text-sm mt-1">{errors.lugarNacimiento}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Municipio <span className="text-red-500">*</span></Label>
                    <Select value={formData.municipio} onValueChange={(value) => handleChange('municipio', value)} disabled={!formData.lugarNacimiento}>
                      <SelectTrigger className={errors.municipio ? 'border-red-500' : ''}>
                        <SelectValue placeholder={!formData.lugarNacimiento ? "Primero seleccione un estado" : "Seleccione el municipio"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.lugarNacimiento && VENEZUELA_DATA.find(e => e.nombre === formData.lugarNacimiento)?.municipios.map((m) => (
                          <SelectItem key={m.nombre} value={m.nombre}>{m.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Parroquia <span className="text-red-500">*</span></Label>
                    <Select value={formData.parroquia} onValueChange={(value) => handleChange('parroquia', value)} disabled={!formData.municipio}>
                      <SelectTrigger className={errors.parroquia ? 'border-red-500' : ''}>
                        <SelectValue placeholder={!formData.municipio ? "Primero seleccione un municipio" : "Seleccione la parroquia"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.municipio && VENEZUELA_DATA.find(e => e.nombre === formData.lugarNacimiento)
                          ?.municipios.find(m => m.nombre === formData.municipio)?.parroquias.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.parroquia && <p className="text-red-500 text-sm mt-1">{errors.parroquia}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-bold text-[#362511]">Dirección de Habitación <span className="text-red-500">*</span></Label>
                  <Input value={formData.direccionHabitacion} onChange={(e) => handleChange('direccionHabitacion', e.target.value)} placeholder="Ingrese su dirección completa" className={errors.direccionHabitacion ? 'border-red-500' : ''} />
                  {errors.direccionHabitacion && <p className="text-red-500 text-sm mt-1">{errors.direccionHabitacion}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Teléfono Celular <span className="text-red-500">*</span></Label>
                    <Input value={formData.numeroTelefonoCelular} onChange={(e) => handleChange('numeroTelefonoCelular', e.target.value)} placeholder="Ej: 04121234567" maxLength={11} className={errors.numeroTelefonoCelular ? 'border-red-500' : ''} />
                    {errors.numeroTelefonoCelular && <p className="text-red-500 text-sm mt-1">{errors.numeroTelefonoCelular}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Teléfono Local (Opcional)</Label>
                    <Input value={formData.numeroTelefonoLocal} onChange={(e) => handleChange('numeroTelefonoLocal', e.target.value)} placeholder="Ej: 02121234567" maxLength={11} className={errors.numeroTelefonoLocal ? 'border-red-500' : ''} />
                    {errors.numeroTelefonoLocal && <p className="text-red-500 text-sm mt-1">{errors.numeroTelefonoLocal}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Correo Electrónico <span className="text-red-500">*</span></Label>
                    <Input type="email" value={formData.correoElectronico} onChange={(e) => handleChange('correoElectronico', e.target.value)} placeholder="ejemplo@correo.com" className={errors.correoElectronico ? 'border-red-500' : ''} />
                    {errors.correoElectronico && <p className="text-red-500 text-sm mt-1">{errors.correoElectronico}</p>}
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
                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Núcleo <span className="text-red-500">*</span></Label>
                    <Select value={formData.nucleo} onValueChange={(value) => handleChange('nucleo', value)}>
                      <SelectTrigger className={errors.nucleo ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione el núcleo" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Buscar núcleo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8" />
                          </div>
                        </div>
                        {nucleosFiltrados.map((nucleo) => (
                          <SelectItem key={nucleo} value={nucleo}>{nucleo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.nucleo && <p className="text-red-500 text-sm mt-1">{errors.nucleo}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Año en que Inició <span className="text-red-500">*</span></Label>
                    <Select value={formData.añoInicio} onValueChange={(value) => handleChange('añoInicio', value)}>
                      <SelectTrigger className={errors.añoInicio ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione el año" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.añoInicio && <p className="text-red-500 text-sm mt-1">{errors.añoInicio}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Orquesta Actual <span className="text-red-500">*</span></Label>
                    <Select value={formData.agrupacionPertenece} onValueChange={(value) => handleChange('agrupacionPertenece', value)}>
                      <SelectTrigger className={errors.agrupacionPertenece ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione la orquesta" />
                      </SelectTrigger>
                      <SelectContent>
                        {agrupacionesMusicales.map((agrupacion) => (
                          <SelectItem key={agrupacion} value={agrupacion}>{agrupacion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.agrupacionPertenece && <p className="text-red-500 text-sm mt-1">{errors.agrupacionPertenece}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Instrumento Principal (Opcional)</Label>
                    <Select value={formData.instrumentoPrincipal} onValueChange={(value) => handleChange('instrumentoPrincipal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el instrumento" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrumentosMusicales.map((instrumento) => (
                          <SelectItem key={instrumento} value={instrumento}>{instrumento}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-sm font-bold text-[#362511] mb-3 block">Instrumentos Secundarios (Opcional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {instrumentosMusicales.map((instrumento) => (
                      <div key={instrumento} className="flex items-center space-x-2">
                        <Checkbox
                          checked={instrumentosSecundariosSeleccionados.includes(instrumento)}
                          onCheckedChange={(checked) => handleInstrumentoSecundarioChange(instrumento, !!checked)}
                          disabled={instrumento === formData.instrumentoPrincipal}
                        />
                        <Label className={`text-sm ${instrumento === formData.instrumentoPrincipal ? 'text-gray-400' : 'text-[#362511]'}`}>
                          {instrumento} {instrumento === formData.instrumentoPrincipal && ' (Principal)'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-bold text-[#362511]">Agrupaciones a las que ha pertenecido anteriormente</Label>
                  <Input value={formData.nombreAgrupacionesPertenecio} onChange={(e) => handleChange('nombreAgrupacionesPertenecio', e.target.value)} placeholder="Ej: Orquesta Infantil, Coro, Ensemble de Cuerdas" />
                </div>
              </div>

              {/* Sección 3: Información Académica */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <School className="w-5 h-5 text-[#65350F]" />
                  Información Académica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Nombre del Colegio (Opcional)</Label>
                    <Input value={formData.nombreColegio} onChange={(e) => handleChange('nombreColegio', e.target.value)} placeholder="Ingrese el nombre del colegio" />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-[#362511]">Grado que Cursa (Opcional)</Label>
                    <Select value={formData.gradoCursa} onValueChange={(value) => handleChange('gradoCursa', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el grado (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradosEscolares.map((grado) => (
                          <SelectItem key={grado} value={grado}>{grado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Sección 4: Información de Salud */}
              <div>
                <h3 className="text-lg font-bold text-[#362511] mb-4 flex items-center gap-2 border-b-2 border-[#E8D5C4] pb-2">
                  <Heart className="w-5 h-5 text-[#80471C]" />
                  Información de Salud
                </h3>

                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] mb-3 block">¿Padece alguna enfermedad?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["asma", "alergia", "diabetes", "reumatismo", "otros"].map((enf) => (
                      <div key={enf} className="flex items-center space-x-2">
                        <Checkbox checked={enfermedadesSeleccionadas.includes(enf)} onCheckedChange={(checked) => handleEnfermedadChange(enf, !!checked)} />
                        <Label className="capitalize">{enf}</Label>
                      </div>
                    ))}
                  </div>

                  {enfermedadesSeleccionadas.includes('otros') && (
                    <div className="mt-3">
                      <Label>Especifique otras enfermedades</Label>
                      <Input value={formData.otrasEnfermedades} onChange={(e) => handleChange('otrasEnfermedades', e.target.value)} placeholder="Especifique las otras enfermedades" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] block mb-3">¿El alumno posee alguna condición especial? <span className="text-red-500">*</span></Label>
                  <Select value={formData.condicionAlumno} onValueChange={(value) => handleChange('condicionAlumno', value)}>
                    <SelectTrigger className={errors.condicionAlumno ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condicionAlumno && <p className="text-red-500 text-sm mt-1">{errors.condicionAlumno}</p>}

                  {formData.condicionAlumno === 'si' && (
                    <div className="mt-3">
                      <Label>Especifique la condición <span className="text-red-500">*</span></Label>
                      <Input value={formData.especifiqueCondicion} onChange={(e) => handleChange('especifiqueCondicion', e.target.value)} placeholder="Describa la condición especial" className={errors.especifiqueCondicion ? 'border-red-500' : ''} />
                      {errors.especifiqueCondicion && <p className="text-red-500 text-sm mt-1">{errors.especifiqueCondicion}</p>}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] block mb-3">¿El alumno tiene necesidades especiales de aprendizaje? <span className="text-red-500">*</span></Label>
                  <Select value={formData.necesidadesEspecialesAprendizaje} onValueChange={(value) => handleChange('necesidadesEspecialesAprendizaje', value)}>
                    <SelectTrigger className={errors.necesidadesEspecialesAprendizaje ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.necesidadesEspecialesAprendizaje && <p className="text-red-500 text-sm mt-1">{errors.necesidadesEspecialesAprendizaje}</p>}

                  {formData.necesidadesEspecialesAprendizaje === 'si' && (
                    <div className="mt-3">
                      <Label>Especifique las necesidades especiales <span className="text-red-500">*</span></Label>
                      <Input value={formData.especifiqueNecesidades} onChange={(e) => handleChange('especifiqueNecesidades', e.target.value)} placeholder="Describa las necesidades especiales de aprendizaje" className={errors.especifiqueNecesidades ? 'border-red-500' : ''} />
                      {errors.especifiqueNecesidades && <p className="text-red-500 text-sm mt-1">{errors.especifiqueNecesidades}</p>}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] block mb-3">¿El alumno es alérgico a algún medicamento? <span className="text-red-500">*</span></Label>
                  <Select value={formData.esAlergico} onValueChange={(value) => handleChange('esAlergico', value)}>
                    <SelectTrigger className={errors.esAlergico ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.esAlergico && <p className="text-red-500 text-sm mt-1">{errors.esAlergico}</p>}

                  {formData.esAlergico === 'si' && (
                    <div className="mt-3">
                      <Label>Especifique a qué medicamentos es alérgico <span className="text-red-500">*</span></Label>
                      <Input value={formData.especifiqueAlergia} onChange={(e) => handleChange('especifiqueAlergia', e.target.value)} placeholder="Liste los medicamentos" className={errors.especifiqueAlergia ? 'border-red-500' : ''} />
                      {errors.especifiqueAlergia && <p className="text-red-500 text-sm mt-1">{errors.especifiqueAlergia}</p>}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-bold text-[#362511] block mb-3">¿El alumno está vacunado contra el COVID-19? <span className="text-red-500">*</span></Label>
                  <Select value={formData.estaVacunado} onValueChange={(value) => handleChange('estaVacunado', value)}>
                    <SelectTrigger className={errors.estaVacunado ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estaVacunado && <p className="text-red-500 text-sm mt-1">{errors.estaVacunado}</p>}

                  {formData.estaVacunado === 'si' && (
                    <div className="mt-3">
                      <Label>Número de dosis <span className="text-red-500">*</span></Label>
                      <Select value={formData.numeroDosisVacuna} onValueChange={(value) => handleChange('numeroDosisVacuna', value)}>
                        <SelectTrigger className={errors.numeroDosisVacuna ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccione el número de dosis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 dosis</SelectItem>
                          <SelectItem value="2">2 dosis</SelectItem>
                          <SelectItem value="3">3 dosis</SelectItem>
                          <SelectItem value="4">4 dosis</SelectItem>
                          <SelectItem value="mas">Más de 4 dosis</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.numeroDosisVacuna && <p className="text-red-500 text-sm mt-1">{errors.numeroDosisVacuna}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-[#9A784F] hover:bg-[#795C34] text-white font-bold" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Procesando...</> : <><Save className="w-4 h-4 mr-2" /> Continuar con Representantes</>}
                </Button>
                <Link href="/inicio" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-[#E8D5C4] text-[#362511] hover:bg-[#F8F4F0] font-bold" size="lg" disabled={isSubmitting}>Cancelar</Button>
                </Link>
              </div>

              <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#9A784F] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#362511]">Próximo paso: Registro de Representantes</h4>
                    <p className="text-[#65350F] text-sm mt-1">Después de completar este formulario, continuará con el registro de los datos de los representantes.</p>
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