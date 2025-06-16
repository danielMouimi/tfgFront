import { useEffect, useState } from "react";
import { auth } from "./firebase";
export function Acciones() {

    useEffect(() => {
 const destinos = [
      { nombre: "Madrid", descripcion: "Ciudad capital de España, famosa por su cultura y gastronomía.",fotos:[], pais: "España" },
      { nombre: "Barcelona", descripcion: "Ciudad costera conocida por su arquitectura modernista y playas.",fotos:[], pais: "España" },
      { nombre: "París", descripcion: "La ciudad del amor, hogar de la Torre Eiffel y el Louvre.",fotos:[], pais: "Francia" },
      { nombre: "Roma", descripcion: "Ciudad eterna con una rica historia y monumentos como el Coliseo.",fotos:[], pais: "Italia" },
      { nombre: "Londres", descripcion: "Capital de Inglaterra, famosa por el Big Ben y el Palacio de Buckingham.",fotos:[], pais: "Reino Unido" },
      { nombre: "Nueva York", descripcion: "La Gran Manzana, conocida por Times Square y la Estatua de la Libertad.",fotos:[], pais: "Estados Unidos" },
      { nombre: "Tokio", descripcion: "Capital de Japón, mezcla de tradición y modernidad.",fotos:[], pais: "Japón" },
      { nombre: "Sídney", descripcion: "Ciudad australiana famosa por la Ópera de Sídney y sus playas.",fotos:[], pais: "Australia" },
      { nombre: "Buenos Aires", descripcion: "Capital de Argentina, conocida por el tango y su vibrante vida nocturna.",fotos:[], pais: "Argentina" },
      { nombre: "Ciudad de México", descripcion: "Capital de México, rica en historia y cultura.",fotos:[], pais: "México" },
      { nombre: "El Cairo", descripcion: "Ciudad egipcia famosa por las pirámides y la Esfinge.",fotos:[], pais: "Egipto" },
      { nombre: "Bangkok", descripcion: "Capital de Tailandia, conocida por sus templos y vida nocturna.",fotos:[], pais: "Tailandia" },
      { nombre: "Dubái", descripcion: "Ciudad de los Emiratos Árabes Unidos, famosa por su lujo y arquitectura moderna.",fotos:[], pais: "Emiratos Árabes Unidos" },
      { nombre: "Moscú", descripcion: "Capital de Rusia, hogar del Kremlin y la Plaza Roja.",fotos:[], pais: "Rusia" },
      { nombre: "Pekín", descripcion: "Capital de China, conocida por la Ciudad Prohibida y la Gran Muralla.",fotos:[], pais: "China" },
      { nombre: "Río de Janeiro", descripcion: "Ciudad brasileña famosa por el Cristo Redentor y sus carnavales.",fotos:[], pais: "Brasil" },
      { nombre: "Cape Town", descripcion: "Ciudad sudafricana conocida por su belleza natural y Table Mountain.",fotos:[], pais: "Sudáfrica" },
      { nombre: "Lisboa", descripcion: "Capital de Portugal, famosa por sus colinas y tranvías históricos.",fotos:[], pais: "Portugal" },
      { nombre: "Ámsterdam", descripcion: "Ciudad de los Países Bajos, conocida por sus canales y museos.",fotos:[], pais: "Países Bajos" },
      { nombre: "Venecia", descripcion: "Ciudad italiana construida sobre canales, famosa por sus góndolas.",fotos:[], pais: "Italia" }
    ];




        console.log('usuario autenticado:', auth.currentUser);
        async function fetchOfertas() {
            const user = auth.currentUser;
            if (!user) return;
          
            const token = await user.getIdToken(); // ✅ espera el token
          
            // Itera sobre todos los destinos y envía cada uno al backend
            for (const destino of destinos) {
              try {
                const response = await fetch('https://tfgback-production-3683.up.railway.app/api/destinos', {
                  method: "POST",
                  headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  }, 
                  credentials: 'include',
                  body: JSON.stringify(destino),
                });
          
                if (!response.ok) {
                  throw new Error(`Error al crear el destino: ${destino.nombre}`);
                }
          
                const data = await response.json();
                console.log(`Destino creado: ${destino.nombre}`, data);
              } catch (error) {
                console.error(`Error al crear el destino: ${destino.nombre}`, error);
              }
            }
          }
        fetchOfertas();
      }, []);
    
    return (
        <h1>LLega a ofertas</h1>
    );
}