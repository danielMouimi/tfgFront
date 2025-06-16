import { useState } from 'react'



import Error404 from './Error404'
import { Login } from './login'



import './App.css'
import foto from './assets/logo.png'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Ofertas } from './Ofertas'
import { Index } from '.'
import { useEffect } from 'react'
import { auth } from './firebase'
import { Acciones } from './Acciones'
import SaberMas from './SaberMas'
import Destinos from './Destinos'
import MisTours from './MisTours'
import EditReserva from './editReserva'
import { Pago } from './pago'
import { AdminPanel } from './AdminPanel'
import { CreateOffer } from './CreateOffer'
import { RutasPrivadas } from './RutasPrivadas'
import { CreateTour } from './CreateTour'




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar la aplicación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Si hay un usuario, establece `true`, de lo contrario `false`
    });

    return () => unsubscribe();
  }, []);




  return (
    <>
      <BrowserRouter>
      <div className='NavBar'>
      <nav className="navbar navbar-expand-lg navigator">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
              <img src={foto} alt="TourFlex logo" className='logo'></img>
              </Link>
      
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
      
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/ofertas">Ofertas</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/destinos">Destinos</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/tours">Mis tours</Link>
                  </li>
      


                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                    <FontAwesomeIcon icon={faUser} size='lg' style={{color: "#ffffff",}} />
                    </Link>
                    <ul className="dropdown-menu">
                    {isAuthenticated ? (
                        <>
                          <li>
                            <Link className="dropdown-item" to="/about-me">
                              About Me
                            </Link>
                          </li>
                          <hr className="dropdown-divider" />
                          <li>
                          <Link className="dropdown-item" to="/login">
                              Cerrar sesión
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link className="dropdown-item" to="/login">
                              Log in
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to="#">
                              Another action
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <Link className="dropdown-item" to="#">
                              Something else here
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          </div>



          <Routes>

          {/* <Route path='/' element={<Landing/>}></Route>
          <Route path='/login' element={<Login></Login>}/>

          <Route element={<RutasPrivadas></RutasPrivadas>}>
              <Route path='/showPokemon' element={<ShowPokemon/>}></Route>
          </Route>

          <Route element={<RutasPrivadas></RutasPrivadas>}>
              <Route path='/pkGame' element={<Game/>}></Route>
          </Route>

          <Route path='/detail' element={<Detail/>}/>
          <Route path='/checkwin' element={<WinOrLose/>}/>

          <Route path='/defensa' element={<Defensa></Defensa>}></Route>

          <Route path='/defensa/:id' element={<DefensaDetail/>}/> */}

          {/* <Route path='/' element={<Landing/>}></Route> */}
          <Route path='/' element={<Index/>}></Route>
          <Route path='/ofertas' element={<Ofertas/>}></Route>
          <Route path='/ofertas/:id' element={<SaberMas/>}></Route>
          <Route path='/login' element={<Login></Login>}/>
          <Route path='/acciones' element={<Acciones></Acciones>}/>
          <Route path='destinos' element={<Destinos/>}></Route>
          <Route path='/tours' element={<MisTours/>}></Route>
          <Route path='/reserva/:id' element={<EditReserva/>}></Route>
          <Route path='pagar/:id' element={<Pago/>}></Route>


          <Route element={<RutasPrivadas></RutasPrivadas>}>

            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/create-offer" element={<CreateOffer />} />
            <Route path="/create-tour" element={<CreateTour />} />

          </Route>



          <Route path='*' element={<Error404/>}></Route>

          </Routes>


      </BrowserRouter>
    </>
  )
}

export default App
