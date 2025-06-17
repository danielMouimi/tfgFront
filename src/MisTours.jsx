import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './MisTours.css';
import { getUserID } from './login';
import { auth } from './firebase'; // Importa Firebase Authentication
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación
import { onAuthStateChanged } from 'firebase/auth';


export default function MisTours() {
    const navigate = useNavigate(); // Hook para la navegación

  function toedit(reserva) {

    navigate(`/reserva/${reserva.id}`,
        { state: { reserva } }
    ); // Navega a la página de detalles de la oferta

    }
    function tobuy(reserva) {
    navigate(`/pagar/${reserva.id}`,
        { state: { reserva } }
    ); // Navega a la página de detalles de la oferta
    }
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
  const [reservas, setReservas] = useState([]); // Estado para almacenar las reservas
  const [destinos, setDestinos] = useState([]); // Estado para almacenar los destinos
  const [user, setUser] = useState(null); // Estado para almacenar el usuario actual
  const [emailVerified, setEmailVerified] = useState(false); // Estado para verificar el correo electrónico
  const [userID, setUserID] = useState(null); // Estado para almacenar el ID del usuario
  const [localTours, setLocalTours] = useState(()=>{
    const storedTours = localStorage.getItem('localTours');
    return storedTours ? JSON.parse(storedTours) : [];
  }); // Estado para almacenar los tours locales
  
  const [modalData, setModalData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    diasTotales: '',
    etapas: [], // Etapas del tour
  }); // Estado para el formulario del modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores de validación


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setEmailVerified(currentUser?.emailVerified || false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && emailVerified) {
      fetchReservas();
    }
  }, [user, emailVerified]);

  useEffect(() => {
    // Guarda los tours locales en localStorage cada vez que se actualice el estado
    localStorage.setItem('localTours', JSON.stringify(localTours));
    console.log('Tours locales guardados en localStorage:', localTours);
  }, [localTours]);


  const fetchReservas = async () => {
    const idUsuario = await getUserID(auth.currentUser.email);

    if (!idUsuario || !idUsuario.id) {
      throw new Error('No se pudo obtener el ID del usuario.');
    }
    try {
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/reservasusu/'+idUsuario.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/'
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener las reservas');
      }
  
      const reservas = await response.json();
      console.log('Reservas obtenidas:', reservas);
  
      // Para cada reserva, obtenemos los datos del tour asociado
      const reservasConDetalles = await Promise.all(
        reservas.map(async (reserva) => {
          if (reserva.tours && reserva.tours.length > 0) {
            const tourResponse = await fetch(`https://tfgback-production-3683.up.railway.app/api/tours/${reserva.tours[0].id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://tourflex-tfg.web.app/'
              },
            });
  
            if (!tourResponse.ok) {
              throw new Error('Error al obtener los detalles del tour');
            }
  
            const tourData = await tourResponse.json();
  console.log('Datos del tour obtenidos:', tourData);
            // Obtenemos las etapas del tour
            const etapasResponse = await fetch(`https://tfgback-production-3683.up.railway.app/api/etapas/${reserva.tours[0].id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://tourflex-tfg.web.app/'
              },
            });
  
            if (!etapasResponse.ok) {
              throw new Error('Error al obtener las etapas del tour');
            }
  
            const etapasData = await etapasResponse.json();
            console.log('Etapas del tour obtenidas:', etapasData);
            setLoading(false);
            // Agregamos las etapas y destinos al objeto de reserva
            return {
              ...reserva,
              tour: {
                ...tourData,
                etapas: etapasData.map((etapa) => ({
                  ...etapa,
                  destino: etapa.destino, // Incluye los datos del destino
                })),
              },
            };
          }
  
          return reserva; // Si no hay tour asociado, devolvemos la reserva tal cual
        })
      );
  
        setReservas(reservasConDetalles); // Actualiza el estado con las reservas y sus detalles
      return reservasConDetalles; // Devuelve las reservas con los detalles del tour
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      return [];
    }
  };




  useEffect(() => {
    
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
        console.error('Error en la solicitud:', error);
      }
    };


    fetchDestinos();
  }, []);

  const handleModalChange = (e) => {
    const { name, value } = e.target;

    // Actualiza el estado
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Si el campo modificado es 'fechaInicio' o 'diasTotales', calcula la fecha de fin directamente
    if (name === 'fechaInicio' || name === 'diasTotales') {
      const fechaInicio = new Date(name === 'fechaInicio' ? value : modalData.fechaInicio);
      const diasTotales = name === 'diasTotales' ? parseInt(value, 10) : parseInt(modalData.diasTotales, 10);

      if (fechaInicio && diasTotales) {
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + diasTotales);

        // Actualiza la fecha de fin en el estado
        setModalData((prevData) => ({
          ...prevData,
          fechaFin: fechaFin.toISOString().split('T')[0],
        }));
      } else {
        // Si no se puede calcular la fecha de fin, resetea el campo
        setModalData((prevData) => ({
          ...prevData,
          fechaFin: fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : '',
        }));
      }
    }
  };

  const addEtapa = () => {
    setModalData((prevData) => ({
      ...prevData,
      etapas: [...prevData.etapas, { destino: '', dias: '' }],
    }));
  };

  const removeEtapa = (index) => {
    const updatedEtapas = modalData.etapas.filter((_, i) => i !== index);
    setModalData((prevData) => ({
      ...prevData,
      etapas: updatedEtapas,
    }));
  };

  const handleEtapaChange = (index, field, value) => {
    const updatedEtapas = modalData.etapas.map((etapa, i) =>
      i === index ? { ...etapa, [field]: value } : etapa
    );

    // Calcula la suma de los días de todas las etapas
    const totalDiasEtapas = updatedEtapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0), 0);

    if (!modalData.diasTotales && totalDiasEtapas > 0) {
      setError('Por favor, especifica los días totales del tour antes de añadir etapas.');
      return;
    }
    // Verifica que la suma de los días no exceda los días totales del tour
    if (totalDiasEtapas > parseInt(modalData.diasTotales, 10)) {
      setError('La suma de los días de las etapas no puede exceder los días totales del tour.');
      return;
    }

    setError(null); // Limpia el error si todo está correcto
    setModalData((prevData) => ({
      ...prevData,
      etapas: updatedEtapas,
    }));
  };

  const validateForm = () => {
    const { nombre, fechaInicio, diasTotales, etapas } = modalData;
    const today = new Date().toISOString().split('T')[0];

    if (!nombre || !fechaInicio || !diasTotales || etapas.length === 0) {
      setError('Todos los campos son obligatorios.');
      return false;
    }

    if (fechaInicio < today) {
      setError('La fecha de inicio no puede ser anterior a la fecha actual.');
      return false;
    }

    for (const etapa of etapas) {
      if (!etapa.destino || !etapa.dias) {
        setError('Todos los destinos y días de las etapas deben estar completos.');
        return false;
      }
    }

    // Calcula la suma de los días de todas las etapas
    const totalDiasEtapas = etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0), 0);

    if (totalDiasEtapas > parseInt(diasTotales, 10)) {
      setError('La suma de los días de las etapas no puede exceder los días totales del tour.');
      return false;
    }

    setError(null); // Limpia el error si todo está correcto
    return true;
  };

  async function sacarIdDestino() {
    try {
      const idDestinos = await Promise.all(
        modalData.etapas.map(async (destino) => {
          const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/destinos/${destino.destino}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://tourflex-tfg.web.app/'
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
    async function guardarTourDevuelveId() {
        let idTour = '';
            try {
                const response = await fetch('https://tfgback-production-3683.up.railway.app/api/tours/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://tourflex-tfg.web.app/',
                    authorization: `Bearer ${auth.currentUser.getIdToken()}`,
                  },
                    body: JSON.stringify({
                        nombre: modalData.nombre,
                        duracion_total: modalData.diasTotales,
                        descripcion: 'Tour creado desde la aplicación',
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

    function crearRelacionTourReserva(tourId, ReservaID) {
        fetch('https://tfgback-production-3683.up.railway.app/api/reservas-tours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://tourflex-tfg.web.app/',
                authorization: `Bearer ${auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
                reserva_id: ReservaID,
                tour_id: tourId,
                precio_total: modalData.etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0) * 70, 0), // Asumiendo un precio base de 70 por día
                fecha_salida: modalData.fechaInicio,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la relación entre reserva y tour');
            }
            return response.json();
        })
        .then(data => {
            console.log('Relación creada correctamente:', data);
        })
        .catch(error => {
            console.error('Error al crear la relación:', error);
        });
    
    }

    function crearEtapa(tourId, destinoId, dias, hotel) {
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

  const handleCreateTour = async () => {
    if (!validateForm()) return;
    console.log(modalData);

if (user) {
    try {
        const idUsuario = await getUserID(auth.currentUser.email);

        if (!idUsuario || !idUsuario.id) {
          throw new Error('No se pudo obtener el ID del usuario.');
        }
    
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify(
            {
                usuario_id: idUsuario.id,
                fecha_reserva: modalData.fechaInicio,
                precio_total: modalData.etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0) * 70, 0), // Asumiendo un precio base de 70 por día 
                estado: 'pendiente', 
            }
        ),
      });

      if (!response.ok) {
        throw new Error('Error al crear el tour');
        
      }

      const data = await response.json();
      console.log('Tour creado:', data);
        const reservaId = data.data.id; // Obtiene el ID de la reserva creada
        const idDestinos = await sacarIdDestino(); // Obtiene los IDs de los destinos
        const tourId = await guardarTourDevuelveId(); // Obtiene el ID del tour creado
        crearRelacionTourReserva(tourId, reservaId); // Crea la relación entre la reserva y el tour
        for (let i = 0; i < idDestinos.length; i++) {
            crearEtapa(tourId, idDestinos[i], modalData.etapas[i].dias, null); // Crea las etapas restantes del tour
        }

            // Actualiza las reservas del usuario
            const updatedReservas = await fetchReservas();
            setReservas(updatedReservas);


    } catch (error) {
      console.error('Error al crear el tour:', error);
    }
}else {
    const newTour = {
        ...modalData,
        precio_total: modalData.etapas.reduce((sum, etapa) => sum + (parseInt(etapa.dias, 10) || 0) * 70, 0),
      };
    setLocalTours((prevTours) => [...prevTours, newTour]);
}
    // Cierra el modal
    document.getElementById('createTourModal').classList.remove('show');
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop').remove();
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="mis-tours-page">
      <h1>Mis tours</h1>
      <button
        className="create-tour-button"
        data-bs-toggle="modal"
        data-bs-target="#createTourModal"
      >
        <FontAwesomeIcon icon={faPlus} /> Crear Tour
      </button>
      <div className="reservas-container">
  {user ? (
    reservas.length > 0 ? (
      reservas.map((reserva) => (
        <div key={reserva.id} className="reserva-card">
          <h2>{reserva.nombre}</h2>
          <p>
            <strong>Duración:</strong> {reserva.tour?.duracion_total || 'No especificada'} días
          </p>
          <p>
            <strong>Fecha de inicio:</strong> {reserva.fecha_reserva || 'No especificada'}
          </p>
          <p>
            <strong>Fecha de fin:</strong>{' '}
            {reserva.fecha_reserva && reserva.tour?.duracion_total
              ? new Date(new Date(reserva.fecha_reserva).getTime() + reserva.tour.duracion_total * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
              : 'No especificada'}
          </p>
          <p>
            <strong>Precio:</strong> {reserva.precio_total || 'No especificado'}€
          </p>
          <h3>Etapas del tour:</h3>
          {reserva.tour?.etapas?.length > 0 ? (
            <ul>
              {reserva.tour.etapas.map((etapa, index) => (
                <li key={index}>
                  <p>
                    <strong>Destino:</strong> {etapa.destino.nombre}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {etapa.destino.descripcion}
                  </p>
                  <p>
                    <strong>País:</strong> {etapa.destino.pais}
                  </p>
                  <p>
                    <strong>Días:</strong> {etapa.dias}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay etapas asociadas.</p>
          )}
          {reserva.fecha_reserva < today ? (
            <button className="action-button" onClick={() => toedit(reserva)}>
              Editar
            </button>
          ) : (
            <>
              <button className="action-button" onClick={() => toedit(reserva)}>
                Editar
              </button>
              {reserva.estado === 'pendiente' ? (
                <button className="action-button" onClick={() => tobuy(reserva)}>
                  Proceder al pago
                </button>
              ) : reserva.estado === 'pagado' ? (
                <button className="action-button">Repetir</button>
              ) : null}
            </>
          )}
        </div>
      ))
    ) : (
      <p>No hay reservas disponibles.</p>
    )
  ) : (
    localTours.length > 0 ? (
      localTours.map((reserva, index) => (
        <div key={index} className="reserva-card">
          <h2>{reserva.nombre}</h2>
          <p>
            <strong>Duración:</strong> {reserva.diasTotales || 'No especificada'} días
          </p>
          <p>
            <strong>Fecha de inicio:</strong> {reserva.fechaInicio || 'No especificada'}
          </p>
          <p>
            <strong>Fecha de fin:</strong>{' '}
            {reserva.fechaFin || 'No especificada'}
          </p>
          <p>
            <strong>Precio:</strong> {reserva.precio_total || 'No especificado'}€
          </p>
          <h3>Etapas del tour:</h3>
          {reserva.etapas?.length > 0 ? (
            <ul>
              {reserva.etapas.map((etapa, etapaIndex) => (
                <li key={etapaIndex}>
                  <p>
                    <strong>Destino:</strong> {etapa.destino}
                  </p>
                  <p>
                    <strong>Días:</strong> {etapa.dias}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay etapas asociadas.</p>
          )}


  <>
    
      <button
        className="action-button"
        onClick={() =>
          navigate('/login', {
            state: { reserva }, // Pasar la información de la reserva al componente de login
          })
        }
      >
        Proceder al pago
      </button>
  </>
        </div>
      ))
    ) : (
      <p>No hay tours locales disponibles.</p>
    )
  )}
</div>


      {/* Modal para crear un nuevo tour */}
      <div
        className="modal fade"
        id="createTourModal"
        tabIndex="-1"
        aria-labelledby="createTourModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createTourModalLabel">
                Crear nuevo tour
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del tour
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={modalData.nombre}
                    onChange={handleModalChange}
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
                    value={modalData.fechaInicio}
                    onChange={handleModalChange}
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
                    value={modalData.diasTotales}
                    onChange={handleModalChange}
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
                    value={modalData.fechaFin}
                    readOnly
                  />
                </div>
                <div className="etapas-container">
                  <h5>Etapas del tour</h5>
                  {modalData.etapas.map((etapa, index) => (
                    <div key={index} className="etapa-item">
                      <select
                        className="form-select"
                        value={etapa.destino}
                        onChange={(e) =>
                          handleEtapaChange(index, 'destino', e.target.value)
                        }
                      >
                        <option value="">Seleccionar destino</option>
                        {destinos.map((destino) => (
                          <option key={destino.id} value={destino.nombre}>
                            {destino.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Días"
                        value={etapa.dias}
                        onChange={(e) =>
                          handleEtapaChange(index, 'dias', e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeEtapa(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar etapa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addEtapa}
                  >
                    Añadir etapa
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateTour}
              >
                Crear Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}