import React, { useState, useEffect } from 'react';
import './Destinos.css';
import { getUserID } from './login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import amsterdam1 from './assets/amsterdam/amsterdam1.jpg';
import amsterdam2 from './assets/amsterdam/amsterdam2.jpg';
import amsterdam3 from './assets/amsterdam/amsterdam3.jpg';

import bangkok1 from './assets/bangkok/bangkok1.jpg';
import bangkok2 from './assets/bangkok/bangkok2.jpg';
import bangkok3 from './assets/bangkok/bangkok3.jpg';

import barcelona1 from './assets/barcelona/barcelona1.jpg';
import barcelona2 from './assets/barcelona/barcelona2.jpg';
import barcelona3 from './assets/barcelona/barcelona3.jpg';

import buenosAires1 from './assets/buenos-aires/buenos-aires1.jpg';
import buenosAires2 from './assets/buenos-aires/buenos-aires2.jpg';
import buenosAires3 from './assets/buenos-aires/buenos-aires3.jpg';

import capeTown1 from './assets/cape-town/cape-town1.jpg';
import capeTown2 from './assets/cape-town/cape-town2.jpg';
import capeTown3 from './assets/cape-town/cape-town3.jpg';

import ciudadDeMexico1 from './assets/ciudad-de-mexico/ciudad-de-mexico1.jpg';
import ciudadDeMexico2 from './assets/ciudad-de-mexico/ciudad-de-mexico2.jpg';
import ciudadDeMexico3 from './assets/ciudad-de-mexico/ciudad-de-mexico3.jpg';

import dubai1 from './assets/dubai/dubai1.jpg';
import dubai2 from './assets/dubai/dubai2.jpg';
import dubai3 from './assets/dubai/dubai3.jpg';

import elCairo1 from './assets/el-cairo/el-cairo1.jpg';
import elCairo2 from './assets/el-cairo/el-cairo2.jpg';
import elCairo3 from './assets/el-cairo/el-cairo3.jpg';

import lisboa1 from './assets/lisboa/lisboa1.jpg';
import lisboa2 from './assets/lisboa/lisboa2.jpg';
import lisboa3 from './assets/lisboa/lisboa3.jpg';

import londres1 from './assets/londres/londres1.jpg';
import londres2 from './assets/londres/londres2.jpg';
import londres3 from './assets/londres/londres3.jpg';

import madrid1 from './assets/madrid/madrid1.jpg';
import madrid2 from './assets/madrid/madrid2.jpg';
import madrid3 from './assets/madrid/madrid3.jpg';

import moscu1 from './assets/moscu/moscu1.jpg';
import moscu2 from './assets/moscu/moscu2.jpg';
import moscu3 from './assets/moscu/moscu3.jpg';

import nuevaYork1 from './assets/nueva-york/nueva-york1.jpg';
import nuevaYork2 from './assets/nueva-york/nueva-york2.jpg';
import nuevaYork3 from './assets/nueva-york/nueva-york3.jpg';

import paris1 from './assets/paris/paris1.jpg';
import paris2 from './assets/paris/paris2.jpg';
import paris3 from './assets/paris/paris3.jpg';

import pekin1 from './assets/pekin/pekin1.jpg';
import pekin2 from './assets/pekin/pekin2.jpg';
import pekin3 from './assets/pekin/pekin3.jpg';

import rioDeJaneiro1 from './assets/rio-de-janeiro/rio-de-janeiro1.jpg';
import rioDeJaneiro2 from './assets/rio-de-janeiro/rio-de-janeiro2.jpg';
import rioDeJaneiro3 from './assets/rio-de-janeiro/rio-de-janeiro3.jpg';

import roma1 from './assets/roma/roma1.jpg';
import roma2 from './assets/roma/roma2.jpg';
import roma3 from './assets/roma/roma3.jpg';

import sidney1 from './assets/sidney/sidney1.jpg';
import sidney2 from './assets/sidney/sidney2.jpg';
import sidney3 from './assets/sidney/sidney3.jpg';

import tokio1 from './assets/tokio/tokio1.jpg';
import tokio2 from './assets/tokio/tokio2.jpg';
import tokio3 from './assets/tokio/tokio3.jpg';

import venecia1 from './assets/venecia/venecia1.jpg';
import venecia2 from './assets/venecia/venecia2.jpg';
import venecia3 from './assets/venecia/venecia3.jpg';

const imagesByDestino = {
    ámsterdam: [amsterdam1, amsterdam2, amsterdam3],
  bangkok: [bangkok1, bangkok2, bangkok3],
  barcelona: [barcelona1, barcelona2, barcelona3],
  'buenos-aires': [buenosAires1, buenosAires2, buenosAires3],
  'cape-town': [capeTown1, capeTown2, capeTown3],
  'ciudad-de-méxico': [ciudadDeMexico1, ciudadDeMexico2, ciudadDeMexico3],
  dubái: [dubai1, dubai2, dubai3],
  'el-cairo': [elCairo1, elCairo2, elCairo3],
  lisboa: [lisboa1, lisboa2, lisboa3],
  londres: [londres1, londres2, londres3],
  madrid: [madrid1, madrid2, madrid3],
  moscú: [moscu1, moscu2, moscu3],
  'nueva-york': [nuevaYork1, nuevaYork2, nuevaYork3],
  parís: [paris1, paris2, paris3],
  pekín: [pekin1, pekin2, pekin3],
  'río-de-janeiro': [rioDeJaneiro1, rioDeJaneiro2, rioDeJaneiro3],
  roma: [roma1, roma2, roma3],
  sídney: [sidney1, sidney2, sidney3],
  tokio: [tokio1, tokio2, tokio3],
  venecia: [venecia1, venecia2, venecia3],
};

export default function Destinos() {
  const [destinos, setDestinos] = useState([]); // Estado para almacenar los destinos
  const [search, setSearch] = useState(''); // Estado para el campo de búsqueda
  const [selectedDestino, setSelectedDestino] = useState(null); // Estado para el destino seleccionado
  const [selectedDestinoImg, setSelectedDestinoImg] = useState(null);
  const [images, setImages] = useState([]); // Estado para las imágenes del destino
  const [reservas, setReservas] = useState([]); // Estado para las reservas del usuario
  const [selectedReserva, setSelectedReserva] = useState(null); // Estado para la reserva seleccionada
  const [diasEtapa, setDiasEtapa] = useState(''); // Estado para los días de la etapa
  const [localTours, setLocalTours] = useState(null);
  const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false); // Estado para verificar el correo electrónico


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
        } else {
          const storedTours = localStorage.getItem('localTours');
          if (storedTours) {
            try {
              const parsedTours = JSON.parse(storedTours); // Convierte el string a un objeto
              setReservas(parsedTours); // Actualiza el estado con los tours locales
            } catch (error) {
              console.error('Error al parsear los tours locales desde localStorage:', error);
            }
          } else {
            console.log('No hay tours locales en localStorage.');
            setReservas([]); // Si no hay datos en localStorage, establece un array vacío
          }
        }
      }, [user, emailVerified]);
      
      // Para verificar el estado actualizado de reservas
      useEffect(() => {
        console.log('Reservas actualizadas:', reservas);
      }, [reservas]);
  

    // useEffect(() => {
    //   // Guarda los tours locales en localStorage cada vez que se actualice el estado
    //   localStorage.setItem('localTours', JSON.stringify(localTours));
    //   console.log('Tours locales guardados en localStorage:', localTours);
    // }, [localTours]);


  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/destinos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los destinos');
        }

        const data = await response.json();
        setDestinos(data); // Actualiza el estado con los destinos obtenidos
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    fetchDestinos();
},[]);

    const fetchReservas = async () => {

        const idUsuario = await getUserID(auth.currentUser.email);

        if (!idUsuario || !idUsuario.id) {
          throw new Error('No se pudo obtener el ID del usuario.');
        }
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/reservas'+idUsuario.id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();
        console.log('Reservas obtenidas:', data);
        setReservas(data); // Actualiza el estado con las reservas obtenidas
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };




  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredDestinos = destinos.filter((destino) =>
    destino.nombre
  .toLowerCase()
  .normalize('NFD') // Descompone caracteres acentuados
  .replace(/[\u0300-\u036f]/g, '') // Elimina marcas diacríticas
  .includes(
    search
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Aplica lo mismo al texto de búsqueda
  )
  );
  console.log(filteredDestinos);

  const handleViewGallery = (destino) => {
    setSelectedDestinoImg(destino);
    const folderName = destino.nombre.toLowerCase().replace(/\s+/g, '-'); // Reemplaza espacios por guiones
    const imagesArray = imagesByDestino[folderName] || []; // Obtiene las imágenes del destino
    setImages(imagesArray);
  };

  const handleCloseGallery = () => {
    setSelectedDestinoImg(null);
    setImages([]);
  };

  const handleAddEtapa = (destino) => {
    setSelectedDestino(destino);
  };

  const handleCloseAddEtapa = () => {
    setSelectedDestino(null);
    setSelectedReserva(null);
    setDiasEtapa('');
  };

  const handleAddEtapaToTour = async () => {
    if (!selectedReserva || !diasEtapa) {
      alert('Por favor, selecciona una reserva y especifica los días de la etapa.');
      return;
    }

    try {
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/tours/'+selectedReserva.tours[0].id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          nombre: selectedReserva.tours[0].nombre,
          duracion_total: parseInt(diasEtapa, 10) + selectedReserva.tours[0].duracion_total,
          descripcion: selectedReserva.tours[0].descripcion,
          oferta_id: null
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir la etapa al tour');
      }

      const data = await response.json();
      console.log('Se añaden los dias y el precio', data);
    } catch (error) {
      console.error('Error al añadir los dias:', error);
    }

    try {
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/reservas/'+selectedReserva.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          usuario_id: selectedReserva.usuario_id,
          fecha_reserva: selectedReserva.fecha_reserva,
          estado: selectedReserva.estado,
          precio_total: parseInt(diasEtapa, 10) * 70 + parseInt(selectedReserva.precio_total),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir la etapa al tour');
      }

      const data = await response.json();
      console.log('Se añaden los dias y el precio', data);
    } catch (error) {
      console.error('Error al añadir el precio', error);
    }


    

    try {
      const response = await fetch('https://tfgback-production-3683.up.railway.app/api/etapas-tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/',
          authorization: `Bearer ${auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          tour_id: selectedReserva.tours[0].id,
          destino_id: selectedDestino.id,
          dias: parseInt(diasEtapa, 10),
          hotel: null
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir la etapa al tour');
      }

      const data = await response.json();
      console.log('Etapa añadida correctamente:', data);
      handleCloseAddEtapa();
    } catch (error) {
      console.log(selectedDestino, selectedReserva, diasEtapa);
      console.error('Error al añadir la etapa al tour:', error);
    }
  };

  return (
    <div className="destinos-page">
      <h1>Destinos disponibles</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Escribe el destino..."
          value={search}
          onChange={handleSearch}
        />
        <button className="search-button">Buscar</button>
      </div>
      <div className="destinos-container">
        {filteredDestinos.map((destino) => (
            <div className='destino-cont'
            style={{
                backgroundImage: `url(${imagesByDestino[destino.nombre.toLowerCase().replace(/\s+/g, '-')][0] || ''})`,
            }}
            >
          <div key={destino.id} className="destino-card">
            <h2>{destino.nombre}</h2>
            <div className="destino-actions">
              <button className="action-button">Ver vuelos</button>
              <button className="action-button">Ver hoteles</button>
              <button
                className="action-button"
                onClick={() => handleViewGallery(destino)}
              >
                Ver galería de fotos
              </button>
              {user && emailVerified && 
              <button
                  className="action-button"
                  onClick={() => handleAddEtapa(destino)}
                >
                  Añadir a un tour
                </button>
                    }
            </div>
          </div>
          </div>
        ))}
      </div>

      {/* Modal para la galería de fotos */}
      {selectedDestinoImg && (
        <div className="modal-gallery">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseGallery}>
              &times;
            </button>
            <h2 className='galeriaDe'>Galería de {selectedDestinoImg.nombre}</h2>




            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <img src={images[0]} className="d-block w-100" alt="..."/>
                    </div>
                    <div className="carousel-item">
                    <img src={images[1]} className="d-block w-100" alt="..."/>
                    </div>
                    <div className="carousel-item">
                    <img src={images[2]} className="d-block w-100" alt="..."/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
                </div>


          </div>
        </div>
      )}





{/* Modal para añadir etapa */}
{selectedDestino && (
          <div className="modal-add-etapa">
            <div className="modal-content">
              <button className="close-button" onClick={handleCloseAddEtapa}>
                &times;
              </button>
              <h2>Añadir etapa a un tour</h2>
              <p>Destino: {selectedDestino.nombre}</p>
              <div className="form-group">
                <label htmlFor="reserva">Selecciona una reserva:</label>
                <select
                  id="reserva"
                  className="form-select"
                  value={selectedReserva?.id || ''}
                  onChange={(e) =>{
                    if (user && emailVerified) {
                      // Usuario autenticado: buscar la reserva por ID
                      const selectedId = parseInt(e.target.value, 10);
                      const reservaEncontrada = reservas.find((reserva) => reserva.id === selectedId);
                      if (reservaEncontrada) {
                        setSelectedReserva(reservaEncontrada);
                      } else {
                        console.error('No se encontró la reserva con el ID:', selectedId);
                      }
                    } else {
                      // Usuario no autenticado: manejar tours locales
                      const selectedIndex = parseInt(e.target.value, 10);
                      const reservaLocal = reservas[selectedIndex]; // Accede al tour local por índice
                      if (reservaLocal) {
                        setSelectedReserva(reservaLocal);
                      } else {
                        console.error('No se encontró el tour local en el índice:', selectedIndex);
                      }
                    }
                  }}
                >
                <option value="">Selecciona una reserva</option>
                {user && emailVerified ? (
                // Usuario registrado: mostrar reservas con estado 'pendiente'
                reservas.map((reserva) => (
                    reserva.estado === 'pendiente' && (
                    <option key={reserva.id} value={reserva.id}>
                        {reserva.tours[0]?.nombre || reserva.nombre} - {reserva.fecha_reserva || reserva.fechaInicio}
                    </option>
                    )
                ))
                ) : (
                // Usuario no registrado: mostrar tours locales
                reservas.map((reserva, index) => (
                    <option key={index} value={index}>
                    {reserva.nombre} - {reserva.fechaInicio || 'Sin fecha'}
                    </option>
                ))
                )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="diasEtapa">Número de días:</label>
                <input
                  type="number"
                  id="diasEtapa"
                  className="form-control"
                  value={diasEtapa}
                  onChange={(e) => setDiasEtapa(e.target.value)}
                />
              </div>
              <button className="action-button" onClick={handleAddEtapaToTour}>
                Añadir etapa
              </button>
            </div>
          </div>
        )}
      </div>

  );
}







// export default function Destinos() {
//     const [destinos, setDestinos] = useState([]); // Estado para almacenar los destinos
//     const [search, setSearch] = useState(''); // Estado para el campo de búsqueda
//     const [selectedDestino, setSelectedDestino] = useState(null); // Estado para el destino seleccionado
//     const [images, setImages] = useState([]); // Estado para las imágenes del destino
    // const [reservas, setReservas] = useState([]); // Estado para las reservas del usuario
    // const [selectedReserva, setSelectedReserva] = useState(null); // Estado para la reserva seleccionada
    // const [diasEtapa, setDiasEtapa] = useState(''); // Estado para los días de la etapa
  
  
//     const handleSearch = (e) => {
//       setSearch(e.target.value);
//     };
  
//     const filteredDestinos = destinos.filter((destino) =>
//       destino.nombre
//         .toLowerCase()
//         .normalize('NFD') // Descompone caracteres acentuados
//         .replace(/[\u0300-\u036f]/g, '') // Elimina marcas diacríticas
//         .includes(
//           search
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '') // Aplica lo mismo al texto de búsqueda
//         )
//     );
  
//     const handleAddEtapa = (destino) => {
//       setSelectedDestino(destino);
//     };
  
//     const handleCloseAddEtapa = () => {
//       setSelectedDestino(null);
//       setSelectedReserva(null);
//       setDiasEtapa('');
//     };
  
//     const handleAddEtapaToTour = async () => {
//       if (!selectedReserva || !diasEtapa) {
//         alert('Por favor, selecciona una reserva y especifica los días de la etapa.');
//         return;
//       }

//       try {
//         const response = await fetch('https://tfgback-production-3683.up.railway.app/api/tours/'+selectedReserva.tours[0].id, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: `Bearer ${auth.currentUser.getIdToken()}`,
//           },
//           body: JSON.stringify({
//             nombre: selectedReserva.tours[0].nombre,
//             duracion_total: parseInt(diasEtapa, 10) + selectedReserva.tours[0].duracion_total,
//             descripcion: selectedReserva.tours[0].descripcion,
//             oferta_id: null
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Error al añadir la etapa al tour');
//         }
  
//         const data = await response.json();
//         console.log('Se añaden los dias y el precio', data);
//       } catch (error) {
//         console.error('Error al añadir los dias:', error);
//       }

//       try {
//         const response = await fetch('https://tfgback-production-3683.up.railway.app/api/reservas/'+selectedReserva.id, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: `Bearer ${auth.currentUser.getIdToken()}`,
//           },
//           body: JSON.stringify({
//             usuario_id: selectedReserva.usuario_id,
//             fecha_reserva: selectedReserva.fecha_reserva,
//             estado: selectedReserva.estado,
//             precio_total: parseInt(diasEtapa, 10) * 70 + parseInt(selectedReserva.precio_total),
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Error al añadir la etapa al tour');
//         }
  
//         const data = await response.json();
//         console.log('Se añaden los dias y el precio', data);
//       } catch (error) {
//         console.error('Error al añadir el precio', error);
//       }


      
  
//       try {
//         const response = await fetch('https://tfgback-production-3683.up.railway.app/api/etapas-tours', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: `Bearer ${auth.currentUser.getIdToken()}`,
//           },
//           body: JSON.stringify({
//             tour_id: selectedReserva.tours[0].id,
//             destino_id: selectedDestino.id,
//             dias: parseInt(diasEtapa, 10),
//             hotel: null
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Error al añadir la etapa al tour');
//         }
  
//         const data = await response.json();
//         console.log('Etapa añadida correctamente:', data);
//         handleCloseAddEtapa();
//       } catch (error) {
//         console.log(selectedDestino, selectedReserva, diasEtapa);
//         console.error('Error al añadir la etapa al tour:', error);
//       }
//     };
//     const handleViewGallery = (destino) => {
//         const destinoImages = imagesByDestino[destino.nombre.toLowerCase()];
//         if (destinoImages) {
//           setImages(destinoImages);
//           setSelectedDestino(destino);
//         } else {
//           alert('No hay imágenes disponibles para este destino.');
//         }
//       };
  
//     return (
//       <div className="destinos-page">
//         <h1>Destinos disponibles</h1>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Escribe el destino..."
//             value={search}
//             onChange={handleSearch}
//           />
//           <button className="search-button">Buscar</button>
//         </div>
//         <div className="destinos-container">
//           {filteredDestinos.map((destino) => (
//             <div key={destino.id} className="destino-card">
//               <h2>{destino.nombre}</h2>
//               <div className="destino-actions">
//                 <button className="action-button">Ver vuelos</button>
//                 <button className="action-button">Ver hoteles</button>
//                 <button
//                   className="action-button"
//                   onClick={() => handleViewGallery(destino)}
//                 >
//                   Ver galería de fotos
//                 </button>
//                 <button
//                   className="action-button"
//                   onClick={() => handleAddEtapa(destino)}
//                 >
//                   Añadir a un tour
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
  
        
//     );
//   }