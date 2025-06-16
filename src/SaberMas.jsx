import React, { useState, useEffect } from 'react';
import './SaberMas.css';
import { useParams, useNavigate } from 'react-router-dom';

export default function SaberMas() {
  const [offerDetails, setOfferDetails] = useState(null); // Estado para los detalles de la oferta
  const [etapas, setEtapas] = useState([]); // Estado para las etapas del tour
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const { id } = useParams(); // Obtiene el ID de la oferta desde la URL
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        // Petición para obtener los detalles de la oferta
        const offerResponse = await fetch(`http://localhost/api/ofertas/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!offerResponse.ok) {
          throw new Error('Error al obtener los detalles de la oferta');
        }

        const offerData = await offerResponse.json();
        setOfferDetails(offerData);

        // Petición para obtener las etapas del tour asociado a la oferta
        const etapasResponse = await fetch(`http://localhost/api/etapas/${offerData.tours[0].id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!etapasResponse.ok) {
          throw new Error('Error al obtener las etapas del tour');
        }

        const etapasData = await etapasResponse.json();
        setEtapas(etapasData);
        console.log('Etapas obtenidas:', etapasData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [id]);

  const tobuy = (oferta) => {
    navigate(`/pagar/${oferta.id}`, { state: { oferta } });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="saber-mas-container">
      <h1 className="offer-title">{offerDetails.nombre}</h1>
      <p className="offer-duration">
        <strong>Duración:</strong> {offerDetails.fecha_inicio} hasta {offerDetails.fecha_fin}
      </p>
      <p className="offer-description">{offerDetails.tours[0].descripcion}</p>
      <div className="offer-price">
        <p>
          <span className="original-price">
            <del>{offerDetails.tours[0].duracion_total * 70}€</del>
          </span>
          <span className="discounted-price">
            {offerDetails.tours[0].duracion_total * 70 -
              (offerDetails.tours[0].duracion_total * 70 * offerDetails.descuento) / 100}€
          </span>
        </p>
      </div>
      <div className="etapas-details">
        <h2>Destinos del Tour</h2>
        {etapas.map((etapa, index) => (
          <div key={index} className="etapa-card">
            <h3>
              {etapa.destino.nombre}, {etapa.destino.pais}
            </h3>
            <p>{etapa.destino.descripcion}</p>
            <p>
              <strong>Días:</strong> {etapa.dias}
            </p>
          </div>
        ))}
      </div>
      <button className="primary-button" onClick={() => tobuy(offerDetails)}>
        Comprar Oferta
      </button>
    </div>
  );
}