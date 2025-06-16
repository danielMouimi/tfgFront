import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTour.css';
import { auth } from './firebase';

export function CreateTour() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    duracion_total: '',
    descripcion: '',
    oferta_id: '',
  });
  const [offers, setOffers] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch offers and destinations for the dropdowns
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/ofertas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/'
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las ofertas');
        }

        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error('Error al obtener las ofertas:', error);
        setMessage('Hubo un problema al cargar las ofertas.');
      }
    };

    const fetchDestinos = async () => {
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/destinos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/'
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los destinos');
        }

        const data = await response.json();
        setDestinos(data);
      } catch (error) {
        console.error('Error al obtener los destinos:', error);
        setMessage('Hubo un problema al cargar los destinos.');
      }
    };

    fetchOffers();
    fetchDestinos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Si se selecciona una oferta, calcula automáticamente la duración total
    if (name === 'oferta_id') {
      const selectedOffer = offers.find((offer) => offer.id === parseInt(value, 10));
      if (selectedOffer) {
        const fechaInicio = new Date(selectedOffer.fecha_inicio);
        const fechaFin = new Date(selectedOffer.fecha_fin);
        const duracionTotal = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)); // Calcula la duración en días
        setFormData((prevData) => ({
          ...prevData,
          duracion_total: duracionTotal +1,
        }));
      }
    }
  };

  const handleAddEtapa = () => {
    const nuevaEtapa = {
      destino_id: '',
      dias: '',
      hotel: '',
    };
    setEtapas((prevEtapas) => [...prevEtapas, nuevaEtapa]);
  };

  const handleEtapaChange = (index, field, value) => {
    const updatedEtapas = [...etapas];
    updatedEtapas[index][field] = value;
    setEtapas(updatedEtapas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de etapas
    const totalDiasEtapas = etapas.reduce((sum, etapa) => sum + parseInt(etapa.dias || 0, 10), 0);
    if (totalDiasEtapas > formData.duracion_total) {
      setMessage('La suma de los días de las etapas no puede exceder la duración total del tour.');
      return;
    }

    try {
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el tour');
      }

      const data = await response.json();
      console.log('Tour creado:', data);

      // Crear etapas
      console.log('Creando etapas para el tour:', data);
      console.log('Etapas:', etapas);
      etapas.forEach((etapa) => {
        crearEtapa(data.data.id, etapa.destino_id, etapa.dias, etapa.hotel);
      });

      // Crear relación entre el tour y la oferta
      if (formData.oferta_id) {
        crearRelacionTourOferta(data.data.id, formData.oferta_id);
      }

      setMessage('Tour creado exitosamente.');
      navigate('/admin'); // Redirige al panel de administración
    } catch (error) {
      console.error('Error al crear el tour:', error);
      setMessage('Hubo un problema al crear el tour.');
    }
  };

  const crearEtapa = (tourId, destinoId, dias, hotel) => {
    fetch('https://tfgback-production-3683.up.railway.app/api/etapas-tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tourflex-tfg.web.app/',
        authorization: `Bearer ${auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({
        tour_id: tourId,
        destino_id: destinoId,
        dias: dias,
        hotel: hotel || null,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear la etapa');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Etapa creada correctamente:', data);
      })
      .catch((error) => {
        console.error('Error al crear la etapa:', error);
      });
  };

  const crearRelacionTourOferta = (tourId, ofertaId) => {
    fetch('https://tfgback-production-3683.up.railway.app/api/ofertas-tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tourflex-tfg.web.app/',
        authorization: `Bearer ${auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({
        tour_id: tourId,
        oferta_id: ofertaId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear la relación entre tour y oferta');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Relación creada correctamente:', data);
      })
      .catch((error) => {
        console.error('Error al crear la relación:', error);
      });
  };

  return (
    <div className="create-tour-container">
      <h1>Crear Nuevo Tour</h1>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit} className="create-tour-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del tour:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duracion_total">Duración total (días):</label>
          <input
            type="number"
            id="duracion_total"
            name="duracion_total"
            value={formData.duracion_total}
            onChange={handleInputChange}
            required
            readOnly={!!formData.oferta_id} // Solo editable si no hay oferta seleccionada
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="oferta_id">Oferta asociada (opcional):</label>
          <select
            id="oferta_id"
            name="oferta_id"
            value={formData.oferta_id}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar oferta</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.nombre} (Del {offer.fecha_inicio} al {offer.fecha_fin})
              </option>
            ))}
          </select>
        </div>
        <div className="etapas-container">
          <h2>Etapas del tour</h2>
          {etapas.map((etapa, index) => (
            <div key={index} className="etapa-form-group">
              <div className="form-group">
                <label htmlFor={`destino_id_${index}`}>Destino:</label>
                <select
                  id={`destino_id_${index}`}
                  value={etapa.destino_id}
                  onChange={(e) => handleEtapaChange(index, 'destino_id', e.target.value)}
                  required
                >
                  <option value="">Seleccionar destino</option>
                  {destinos.map((destino) => (
                    <option key={destino.id} value={destino.id}>
                      {destino.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`dias_${index}`}>Días:</label>
                <input
                  type="number"
                  id={`dias_${index}`}
                  value={etapa.dias}
                  onChange={(e) => handleEtapaChange(index, 'dias', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`hotel_${index}`}>Hotel (opcional):</label>
                <input
                  type="text"
                  id={`hotel_${index}`}
                  value={etapa.hotel}
                  onChange={(e) => handleEtapaChange(index, 'hotel', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" className="secondary-button" onClick={handleAddEtapa}>
            Añadir etapa
          </button>
        </div>
        <button type="submit" className="primary-button">
          Crear Tour
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate('/admin')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}