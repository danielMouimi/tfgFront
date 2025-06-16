import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './pago.css';

export function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reserva, oferta } = location.state || {}; // Obtiene la reserva o la oferta desde el estado
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [user,setUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);

//     useEffect(() => {
//       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//         setUser(currentUser);
//         setEmailVerified(currentUser?.emailVerified || false);
//       });
  
//       return () => unsubscribe();
//     }, []);


//   useEffect(() => {
//           if (user && emailVerified) {
//             fetchUsuario();
//           } else {

//             nav
//           }
//         }, [user, emailVerified]);


    if (!reserva && !oferta) {
      console.error('No se ha recibido una reserva o una oferta válida.');
      navigate('/'); // Redirige a la página principal si no hay reserva ni oferta
      return;
    }

    if (reserva) {
      const fetchUsuario = async () => {
        try {
          const token = await auth.currentUser.getIdToken(); // Obtiene el token de forma asíncrona
          const response = await fetch(`http://localhost/api/users/${reserva.usuario_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${token}`, // Usa el token obtenido
            },
          });

          if (!response.ok) {
            console.error('Error al obtener el usuario:', response.statusText);
            setError('Hubo un problema al obtener los datos del usuario.');
            return;
          }

          const user = await response.json(); // Espera la respuesta JSON
          console.log('Usuario obtenido:', user);
        } catch (error) {
          console.error('Error en la solicitud:', error);
          setError('Hubo un problema al obtener los datos del usuario.');
        }
      };
    }

  const handleApprove = async (orderId) => {
    try {
      if (reserva) {
        const response = await fetch(`http://localhost/api/reservas/${reserva.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${auth.currentUser.getIdToken()}`,
          },
          body: JSON.stringify({
            usuario_id: reserva.usuario_id,
            fecha_reserva: reserva.fecha_reserva,
            estado: 'pagado',
            precio_total: reserva.precio_total,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la reserva');
        }

        const data = await response.json();
        console.log('Reserva actualizada:', data);
      }

      console.log('Pago aprobado con ID:', orderId);
      setSuccess(true);
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
    }
  };

  const handleError = (err) => {
    console.error('Error en el pago:', err);
    setError('Hubo un problema al procesar el pago.');
  };

  const calcularFechaFin = () => {
    if (reserva?.fecha_reserva && reserva.tour?.duracion_total) {
      const fechaInicio = new Date(reserva.fecha_reserva);
      const fechaFin = new Date(fechaInicio.getTime() + reserva.tour.duracion_total * 24 * 60 * 60 * 1000);
      return fechaFin.toISOString().split('T')[0];
    }
    return 'No especificada';
  };

  return (
    <div className="pago-container">
      <h1>Realizar Pago</h1>
      {success ? (
        <div className="alert alert-success">
          ¡Pago realizado con éxito! Gracias por tu compra.
        </div>
      ) : (
        <>
          {reserva ? (
            <div className="reserva-detalles">
              <h2>Detalles de la Reserva</h2>
              <p><strong>Nombre del Tour:</strong> {reserva.tour?.nombre || 'No especificado'}</p>
              <p><strong>Fecha de Inicio:</strong> {reserva.fecha_reserva || 'No especificada'}</p>
              <p><strong>Fecha de Fin:</strong> {calcularFechaFin()}</p>
              <p className="price"><strong>Precio Total:</strong> {reserva.precio_total || 'No especificado'}€</p>
            </div>
          ) : oferta ? (
            <div className="oferta-detalles">
              <h2>Detalles de la Oferta</h2>
              <p><strong>Nombre de la Oferta:</strong> {oferta.nombre}</p>
              <p><strong>Duración:</strong> {oferta.tours[0].duracion_total} días</p>
              <p><strong>Fecha de Inicio:</strong> {oferta.fecha_inicio}</p>
              <p><strong>Fecha de Fin:</strong> {oferta.fecha_fin}</p>
              <p><strong>Descripción del Tour:</strong> {oferta.tours[0].descripcion}</p>
              <p className="price">
                <strong>Precio Original:</strong> <del>{oferta.tours[0].duracion_total * 70}€</del>
              </p>
              <p className="price">
                <strong>Precio con Descuento:</strong> {oferta.tours[0].duracion_total * 70 -
                  (oferta.tours[0].duracion_total * 70 * oferta.descuento) / 100}€
              </p>
            </div>
          ) : null}
          <PayPalScriptProvider
            options={{
              'client-id': 'AUFWTCflYNZPlF_WnvQIQhqS-sWNLCI6QIri2X5NUAWGiXy2AWIxuyp298vzxNrNeHHX07_S1FjBufnz', // Reemplaza con tu Client ID de PayPal Sandbox
              currency: 'EUR',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: reserva ? reserva.precio_total : oferta.tours[0].duracion_total * 70 -
                          (oferta.tours[0].duracion_total * 70 * oferta.descuento) / 100,
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  handleApprove(data.orderID);
                });
              }}
              onError={(err) => {
                handleError(err);
              }}
            />
          </PayPalScriptProvider>
          <button
            className="btn btn-secondary volver-btn"
            onClick={() => navigate(-1)} // Navega hacia atrás
          >
            Volver
          </button>
        </>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}