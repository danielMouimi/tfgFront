import { useEffect, useState } from "react";
import { auth } from "./firebase";
export function Acciones() {

    useEffect(() => {
        const destinos = [
            { nombre: "Madrid", descripcion: "Ciudad capital de España, famosa por su cultura y gastronomía.", pais: "España" },
            { nombre: "Barcelona", descripcion: "Ciudad costera conocida por su arquitectura modernista y playas.", pais: "España" },
            { nombre: "París", descripcion: "La ciudad del amor, hogar de la Torre Eiffel y el Louvre.", pais: "Francia" },
            { nombre: "Roma", descripcion: "Ciudad eterna con una rica historia y monumentos como el Coliseo.", pais: "Italia" },
            { nombre: "Londres", descripcion: "Capital de Inglaterra, famosa por el Big Ben y el Palacio de Buckingham.", pais: "Reino Unido" },
            { nombre: "Nueva York", descripcion: "La Gran Manzana, conocida por Times Square y la Estatua de la Libertad.", pais: "Estados Unidos" },
            { nombre: "Tokio", descripcion: "Capital de Japón, mezcla de tradición y modernidad.", pais: "Japón" },
            { nombre: "Sídney", descripcion: "Ciudad australiana famosa por la Ópera de Sídney y sus playas.", pais: "Australia" },
            { nombre: "Buenos Aires", descripcion: "Capital de Argentina, conocida por el tango y su vibrante vida nocturna.", pais: "Argentina" },
            { nombre: "Ciudad de México", descripcion: "Capital de México, rica en historia y cultura.", pais: "México" },
            { nombre: "El Cairo", descripcion: "Ciudad egipcia famosa por las pirámides y la Esfinge.", pais: "Egipto" },
            { nombre: "Bangkok", descripcion: "Capital de Tailandia, conocida por sus templos y vida nocturna.", pais: "Tailandia" },
            { nombre: "Dubái", descripcion: "Ciudad de los Emiratos Árabes Unidos, famosa por su lujo y arquitectura moderna.", pais: "Emiratos Árabes Unidos" },
            { nombre: "Moscú", descripcion: "Capital de Rusia, hogar del Kremlin y la Plaza Roja.", pais: "Rusia" },
            { nombre: "Pekín", descripcion: "Capital de China, conocida por la Ciudad Prohibida y la Gran Muralla.", pais: "China" },
            { nombre: "Río de Janeiro", descripcion: "Ciudad brasileña famosa por el Cristo Redentor y sus carnavales.", pais: "Brasil" },
            { nombre: "Cape Town", descripcion: "Ciudad sudafricana conocida por su belleza natural y Table Mountain.", pais: "Sudáfrica" },
            { nombre: "Lisboa", descripcion: "Capital de Portugal, famosa por sus colinas y tranvías históricos.", pais: "Portugal" },
            { nombre: "Ámsterdam", descripcion: "Ciudad de los Países Bajos, conocida por sus canales y museos.", pais: "Países Bajos" },
            { nombre: "Venecia", descripcion: "Ciudad italiana construida sobre canales, famosa por sus góndolas.", pais: "Italia" }
          ];




        console.log('usuario autenticado:', auth.currentUser);
        async function fetchOfertas() {
          const user = auth.currentUser;
          if (!user) return;
      
        let idTour = '';
            try {
                const response = await fetch('http://localhost/api/tours/9', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${user.getIdToken()}`, 
                  }, 
                //   body: JSON.stringify({
                //     tour_id: 6,
                //     destino_id: 2,                    
                //     dias: 2,
                //     hotel: null
                //   }),
                });
          
                if (!response.ok) {
                  throw new Error('Error al crear el tour');
                  
                }
          
                const data = await response.json();
                console.log('Se crea el tour', data.data.id);
                idTour = data.id; 
                console.log('ID del tour creado:', idTour);
              } catch (error) {
                console.error('Error al crear el tour:', error);
              }
        }
        fetchOfertas();
      }, []);
    
    return (
        <h1>LLega a ofertas</h1>
    );
}