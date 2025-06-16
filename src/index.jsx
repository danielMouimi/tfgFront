import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faMapMarkerAlt, faHouse, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { auth } from './firebase'; // Importa Firebase Authentication
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Ofertas } from './Ofertas';
import { Link } from 'react-router-dom';


export function Index() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          if (currentUser.email === 'admin@admin.com') {
            navigate('/admin'); // Redirige al panel de administración si es el administrador
          }
        }
      return () => unsubscribe(); // Limpia el listener al desmontar el componente

      });
  
    }, [navigate]);

  

    const [currentOffer, setCurrentOffer] = useState(0); // Estado para controlar el carrusel en móvil

    const offers = [
      {
        title: 'Oferta nuevos clientes',
        duration: '7 días',
        destinations: 'España, Francia, Londres',
        price: '350€',
      },
      {
        title: 'Oferta de Verano',
        duration: '15 días',
        destinations: 'Francia, Londres, Italia, Marruecos, Grecia',
        price: '900€',
      },      {
        title: 'Oferta de Verano',
        duration: '15 días',
        destinations: 'Francia, Londres, Italia, Marruecos, Grecia',
        price: '900€',
      },      {
        title: 'Oferta de Verano',
        duration: '15 días',
        destinations: 'Francia, Londres, Italia, Marruecos, Grecia',
        price: '900€',
      },      {
        title: 'Oferta de Verano',
        duration: '15 días',
        destinations: 'Francia, Londres, Italia, Marruecos, Grecia',
        price: '900€',
      },      {
        title: 'Oferta de Verano',
        duration: '15 días',
        destinations: 'Francia, Londres, Italia, Marruecos, Grecia',
        price: '900€',
      },
      // Agrega más ofertas aquí si es necesario
    ];
  
    const handleNext = () => {
      setCurrentOffer((prev) => (prev + 1) % offers.length); // Avanza al siguiente
    };
  
    const handlePrev = () => {
      setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length); // Retrocede al anterior
    };

    
  return (
    <div className="index-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>¡Tu viaje, a tu manera!</h1>
        <div className="hero-buttons">
          
          <Link to="/tours" className="primary-button">Crear mis Tour</Link>
          <Link to="/ofertas" className="primary-button">Ver Ofertas</Link>
        </div>
      </section>

      {/* Ofertas Section */}
      <section className="offers">
        <div className="offers-container">
          {/* Vista móvil: Carrusel */}
          <div className="offer-card-mobile">
            <Ofertas/>
            <div className="mobile-buttons">
              <button onClick={handlePrev} className="secondary-button">Oferta Anterior</button>
              <button onClick={handleNext} className="secondary-button">Siguiente Oferta</button>
            </div>
          </div>

          {/* Vista escritorio: Scroll horizontal */}
          <div className="offers-scroll">
          <Ofertas />
          </div>
        </div>
      </section>


      

      {/* ¿Cómo funciona? Section */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <div className="steps-container">
          <div className="step">
            <span className="icon">
                <FontAwesomeIcon icon={faCalendar} size='lg' style={{color: "#ffffff",}} />
            </span>
            <p>Primero se elige la duración y la fecha</p>
          </div>
          <div className="step">
            <span className="icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} size='lg' style={{color: "#ffffff",}} />
            </span>
            <p>Luego se eligen los distintos destinos a visitar</p>
          </div>
          <div className="step">
            <span className="icon">
                <FontAwesomeIcon icon={faHouse} size='lg' style={{color: "#ffffff",}} />
            </span>
            <p>Y por último se elige el lugar de residencia (opcional)</p>
          </div>
        </div>
      </section>

      {/* Reseñas Section */}
      <section className="reviews">
        <h2>Reseñas</h2>
        <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
                <div className="carousel-item active">
                <div className="review-card">
                    <p>Daniel Amin Mouimi Romero</p>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>Muy buena experiencia en mi primer tour.</p>
                    </div>
                </div>
                <div className="carousel-item">
                <div className="review-card">
                    <p>Usuario de TopFlex</p>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>Excelente servicio.</p>
                    </div>
                </div>
                <div className="carousel-item">
                <div className="review-card">
                    <p>Otro usuario</p>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>Destinos fantasticos.</p>
                    </div>
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
      </section>



    </div>
  );
}