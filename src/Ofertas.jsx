import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Importa Firebase Authentication
import { getUserID } from './login'; // Importa la función para obtener el ID del usuario
import './Ofertas.css';
import { useNavigate } from 'react-router-dom';

export function Ofertas() {
  const [offers, setOffers] = useState([]); // Estado para almacenar las ofertas
  const [userID, setUserID] = useState(null); // Estado para almacenar el ID del usuario

const navigate = useNavigate(); // Hook para la navegación

  function toSaberMas(id) {
    navigate(`/ofertas/${id}`); // Navega a la página de detalles de la oferta
    }
    


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Verifica si el usuario está autenticado
        const currentUser = auth.currentUser;
        let id = 1; // ID por defecto (invitado)

        if (currentUser) {
          // Obtén el ID del usuario autenticado
          const userData = await getUserID(currentUser.email);
          console.log('Datos del usuario:', userData);
          userData.viajes_realizados == 0 ? id = 1 : id = userData.id; // Si el usuario no tiene viajes, usa el ID del invitado
        }

        setUserID(id); // Actualiza el estado con el ID del usuario




        // Realiza la petición para obtener las ofertas
        const response = await fetch(`http://localhost/api/ofertasUs/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error al obtener las ofertas:', response.statusText);
          return;
        }

        const data = await response.json();
        setOffers(data); // Actualiza el estado con las ofertas obtenidas
        console.log('Ofertas obtenidas:', data);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchOffers();
  }, []);

  let precioBase = 70;
  console.log('Precio base:', offers);;
  return (
    <div className="offers-page">
<h2>Mis Ofertas</h2>
      <div className="offers-container">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <h3 className="offer-title">{offer.nombre}</h3>
              <p className="offer-duration">
                <strong>Duración:</strong> {offer.fecha_inicio} hasta {offer.fecha_fin}
              </p>
              <p className="offer-description">{offer.tours[0].descripcion}</p>
              <div className="offer-price">
                <p>
                  <span className="original-price">
                    <del>{precioBase * offer.tours[0].duracion_total}€</del>
                  </span>
                  <span className="discounted-price">
                    {((precioBase * offer.tours[0].duracion_total) - ((precioBase * offer.tours[0].duracion_total * offer.descuento) / 100))}€
                  </span>
                </p>
              </div>
              <button className="primary-button" onClick={() => toSaberMas(offer.id)}>Saber mas</button>
            </div>
          ))
        ) : (
          <p>No hay ofertas disponibles.</p>
        )}
      </div>
    </div>
  );
}