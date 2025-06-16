import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Importa Firebase Authentication

export default function EditReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reserva } = location.state || {}; // Obtiene la reserva desde el estado
  const [formData, setFormData] = useState({
    nombre: reserva?.tour?.nombre || '', // Obtiene el nombre de la reserva desde el nombre del tour
    fechaInicio: reserva?.fecha_reserva || '',
    diasTotales: reserva?.tour?.duracion_total || '',
    fechaFin: reserva?.fecha_reserva
      ? new Date(new Date(reserva.fecha_reserva).getTime() + reserva.tour?.duracion_total * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      : '',
    etapas: reserva?.tour?.etapas.map((etapa) => ({
      destino_id: etapa.destino_id, // Obtiene el destino_id
      destino: '', // Se llenará con el nombre del destino tras la petición
      dias: etapa.dias,
    })) || [],
  });
  console.log('Reserva a editar:', reserva);
  const [destinos, setDestinos] = useState([]); // Almacena todos los destinos disponibles
  const [error, setError] = useState(null);

  // Carga todos los destinos disponibles
  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/destinos');
        if (!response.ok) {
          throw new Error('Error al cargar los destinos');
        }
        const data = await response.json();
        setDestinos(data);
      } catch (error) {
        console.error('Error al cargar los destinos:', error);
        setError('Hubo un problema al cargar los destinos.');
      }
    };

    fetchDestinos();
  }, []);

  // Carga los nombres de los destinos para las etapas
  useEffect(() => {
    const fetchEtapaDestinos = async () => {
      try {
        const updatedEtapas = await Promise.all(
          formData.etapas.map(async (etapa) => {
            const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/destinosname/${etapa.destino_id}`);
            if (!response.ok) {
              throw new Error(`Error al cargar el destino con ID ${etapa.destino_id}`);
            }
            const destinoData = await response.json();
            return { ...etapa, destino: destinoData.nombre }; // Actualiza el nombre del destino
          })
        );
        setFormData((prevData) => ({
          ...prevData,
          etapas: updatedEtapas,
        }));
      } catch (error) {
        console.error('Error al cargar los nombres de los destinos:', error);
        setError('Hubo un problema al cargar los nombres de los destinos.');
      }
    };

    fetchEtapaDestinos();
  }, []);

  // Actualiza la fecha de fin automáticamente
  useEffect(() => {
    if (formData.fechaInicio && formData.diasTotales) {
      const fechaInicioDate = new Date(formData.fechaInicio);
      const fechaFinDate = new Date(fechaInicioDate.getTime() + formData.diasTotales * 24 * 60 * 60 * 1000);
      setFormData((prevData) => ({
        ...prevData,
        fechaFin: fechaFinDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.fechaInicio, formData.diasTotales]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEtapaChange = (index, field, value) => {
    const updatedEtapas = [...formData.etapas];
    updatedEtapas[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      etapas: updatedEtapas,
    }));
  };

  const addEtapa = () => {
    setFormData((prevData) => ({
      ...prevData,
      etapas: [...prevData.etapas, { destino_id: '', destino: '', dias: '' }],
    }));
  };

  const removeEtapa = (index) => {
    const updatedEtapas = formData.etapas.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      etapas: updatedEtapas,
    }));
  };
  const validateForm = () => {
    const { nombre, fechaInicio, diasTotales, etapas } = formData;
    const today = new Date().toISOString().split('T')[0];
  
    // Validar que los campos obligatorios estén completos
    if (!nombre || !fechaInicio || !diasTotales || etapas.length === 0) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
  
    // Validar que la fecha de inicio no sea anterior a la fecha actual
    if (fechaInicio < today) {
      setError('La fecha de inicio no puede ser anterior a la fecha actual.');
      return false;
    }
  
    // Validar que todas las etapas tengan destino y días completos
    for (const etapa of etapas) {
      if (!etapa.destino_id || !etapa.dias) {
        setError('Todos los destinos y días de las etapas deben estar completos.');
        return false;
      }
    }
  
    // Validar que la suma de los días de las etapas no exceda los días totales del tour
    const totalDiasEtapas = etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0), 0);
    if (totalDiasEtapas > parseInt(diasTotales, 10)) {
      setError('La suma de los días de las etapas no puede exceder los días totales del tour.');
      return false;
    }
  
    // Si todo está correcto, limpiar el error y devolver true
    setError(null);
    return true;
  };

  async function sacarIdDestino() {
    try {
      const idDestinos = await Promise.all(
        formData.etapas.map(async (destino) => {
          const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/destinos/${destino.destino}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://tourflex-tfg.web.app/',
            },
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener el ID del destino');
          }
  
          const data = await response.json();
          console.log('Devuelto el ID correctamente:', data);
          return data.id; // Devuelve el ID del destino
        })
      );
  
      console.log('Destinos IDs obtenidos:', idDestinos);
      return idDestinos; // Devuelve el array de IDs
    } catch (error) {
      console.error('Error al obtener los IDs de los destinos:', error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llama a la función
    }
  }

  async function ActualizarTour() {
    let idTour = '';
        try {
            const response = await fetch('https://tfgback-production-3683.up.railway.app/api/tours/'+reserva.tour.id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://tourflex-tfg.web.app/',
                authorization: `Bearer ${auth.currentUser.getIdToken()}`,
              },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    duracion_total: formData.diasTotales,
                    descripcion: 'Tour actualizado desde la aplicación',
                    oferta_id: null,
                }),
            });
      
            if (!response.ok) {
              throw new Error('Error al crear el tour');
              
            }
      
            const data = await response.json();
            console.log('Se crea el tour', data);
            idTour = data.data.id; 
            return idTour;
          } catch (error) {
            console.error('Error al crear el tour:', error);
          }
        
}
const eliminarEtapasExistentes = async (tourId) => {
    try {
      const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/etapas-tours-rm/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${auth.currentUser.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar las etapas existentes del tour');
      }

      console.log('Etapas eliminadas correctamente');
    } catch (error) {
      console.error('Error al eliminar las etapas existentes:', error);
      throw error;
    }
  };
function ActualizarEtapa(tourId, destinoId, dias, hotel) {
    fetch('https://tfgback-production-3683.up.railway.app/api/etapas-tours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/',
            authorization: `Bearer ${auth.currentUser.getIdToken()}`, // Asegúrate de incluir el token de autenticación
        },
        body: JSON.stringify({
            tour_id: tourId,
            destino_id: destinoId,
            dias: dias,
            hotel: hotel || null, // Si no se proporciona hotel, se envía null
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la etapa');
        }
        return response.json();
    })
    .then(data => {
        console.log('Etapa creada correctamente:', data);
    })
    .catch(error => {
        console.error('Error al crear la etapa:', error);
    });
}

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!validateForm()) return;

    try {
      const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/reservas/${reserva.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/'
        },
        body: JSON.stringify({
            usuario_id: reserva.usuario_id, // Mantiene el ID del usuario de la reserva original
            fecha_reserva: formData.fechaInicio,
            estado: reserva.estado,
            precio_total: formData.etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0) * 70, 0),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }

      const data = await response.json();
      console.log('Reserva actualizada:', data);


      await eliminarEtapasExistentes(reserva.tour.id); // Elimina las etapas existentes del tour
      await ActualizarTour();
      const idDestinos = await sacarIdDestino(); // Obtiene los IDs de los destinos
      for (let i = 0; i < idDestinos.length; i++) {
          ActualizarEtapa(reserva.tour.id, idDestinos[i], formData.etapas[i].dias, null); // Crea las etapas restantes del tour
      }


      // Navega de vuelta a la lista de reservas
      navigate('/tours');
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      console.log('Datos del formulario:', formData);
      console.log({            usuario_id: reserva.usuario_id, // Mantiene el ID del usuario de la reserva original
        fecha_reserva: formData.fechaInicio,
        estado: reserva.estado,
        precio_total: formData.etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0) * 70, 0)});
      setError('Hubo un problema al actualizar la reserva.');
    }
  };

  return (
    <div className="edit-reserva-container">
      <h1>Editar Reserva</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre de la reserva
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            readOnly // El nombre de la reserva no se puede editar
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fechaInicio" className="form-label">
            Fecha de inicio
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="diasTotales" className="form-label">
            Días totales
          </label>
          <input
            type="number"
            className="form-control"
            id="diasTotales"
            name="diasTotales"
            value={formData.diasTotales}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fechaFin" className="form-label">
            Fecha de fin
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaFin"
            name="fechaFin"
            value={formData.fechaFin}
            readOnly
          />
        </div>
        <div className="etapas-container">
          <h5>Etapas del tour</h5>
          {formData.etapas.map((etapa, index) => (
            <div key={index} className="etapa-item">
              <select
                className="form-select"
                value={etapa.destino_id}
                onChange={(e) => handleEtapaChange(index, 'destino_id', e.target.value)}
              >
                <option value="">Seleccionar destino</option>
                {destinos.map((destino) => (
                  <option key={destino.id} value={destino.id}>
                    {destino.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Días"
                value={etapa.dias}
                onChange={(e) => handleEtapaChange(index, 'dias', e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeEtapa(index)}
              >
                Eliminar etapa
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addEtapa}>
            Añadir etapa
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/reservas')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}