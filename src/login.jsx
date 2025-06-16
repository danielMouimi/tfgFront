import { GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GithubAuthProvider, onAuthStateChanged} from "firebase/auth";
import { auth } from "./firebase";
import foto from './assets/google.png'
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import './login.css';
export async function getUserID(email) {
    try {
      const response = await fetch(`https://tfgback-production-3683.up.railway.app/api/user-by-email/${email}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/'
        },
      });
  
      if (!response.ok) {
        const Usuario = {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            password: 'google-auth', // Contraseña ficticia, ya que Google maneja la autenticación
            password_confirmation: 'google-auth',
          };
        await CreateUser(Usuario);
        console.error('Error al obtener el usuario:', response.statusText);
        return null;
      }
  
      const data = await response.json();
      console.log('Usuario obtenido:', data);
      return data; // Devuelve los datos del usuario
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return null;
    }
  }

export function Login() {

  const [user, setUser] = useState(null);
  const [mail,setMail] = useState('');
  const [password,setPassword] = useState('');
  const [password2,setPassword2] = useState('');
  const [message,setMessage] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmailVerified(currentUser.emailVerified);
  
        if (!currentUser.emailVerified) {
          setError('El correo electrónico no está verificado.');
        } else {
          try {
            // Forzar la actualización del estado del usuario
            await currentUser.reload();
            setEmailVerified(currentUser.emailVerified);
            if (currentUser.emailVerified) {
              setMessage('Tu correo ha sido verificado correctamente.');
              setError(null); // Limpia el error si el correo ya está verificado
            }
          } catch (error) {
            console.error('Error al recargar el estado del usuario:', error.message);
          }
        }
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });
  
    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, [navigate]);


  async function CreateUser(usuario) {
    try {        
    fetch('https://tfgback-production-3683.up.railway.app/api/register', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://tourflex-tfg.web.app/'
      },
      body: JSON.stringify(usuario),
  });
  
  if (!response.ok) {
    throw new Error('Error al registrar el usuario');
  }

  const data = await response.json();
  console.log('Usuario registrado exitosamente:', data);
} catch (error) {
  console.error('Error al registrar el usuario:', error);
  setMessage('Hubo un problema al registrar el usuario.');
}
}





const googleAuthProvider = new GoogleAuthProvider()

const [register,setRegister] = useState(false);



function toggleRegister() {
  setRegister(!register);
}

async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      console.log('Autenticación correcta');
  
      const Usuario = {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        password: 'google-auth', // Contraseña ficticia, ya que Google maneja la autenticación
        password_confirmation: 'google-auth',
      };

      CreateUser(Usuario);
      
  
    //   const exist = await getUserID(Usuario.email); 
    //   if (!exist) {
        
    //     await CreateUser(Usuario);
    //     await sendEmailVerification(userCredential.user);
    //     setMessage('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');
    //     auth.currentUser.id = exist.id;
    //     console.log('ID de usuario:', auth.currentUser.id);
    //     console.log(auth.currentUser);
    //   } else {
    //     console.log('Usuario ya existe, no se creará de nuevo');
    //     auth.currentUser.id = exist.id; 
    //     console.log('ID de usuario:', auth.currentUser.id);
    //     console.log(auth.currentUser);
    //   }
  
    } catch (error) {
      console.error('Error:', error);
    }
  }

function logout() {
  signOut(auth)
    .then(() => {
      console.log('Cierre de sesión exitoso');
      navigate('/')
    })
    .catch((error) => console.error('Error:', error))
}

async function handleFormSubmit() {
    if (register) {
      // Registro
      if (password === password2) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
          console.log('Usuario registrado correctamente:', userCredential.user);
          const Usuario = {
            name: mail.split('@')[0], // Nombre de usuario basado en el email
            email: auth.currentUser.email,
            password: password,
            password_confirmation: password2,
          };
          CreateUser(Usuario)
          // Enviar correo de verificación
          await sendEmailVerification(userCredential.user);
          setMessage('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');

          
        } catch (error) {
          console.error('Error al registrar:', error.message);
          setMessage('Hubo un problema al registrar el usuario.');
        }
      } else {
        setMessage('Las contraseñas no coinciden.');
      }
    } else {
      // Inicio de sesión
      try {
        await signInWithEmailAndPassword(auth, mail, password);
        console.log('Inicio de sesión exitoso');
        navigate('/');
      } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        setMessage('Hubo un problema al iniciar sesión.');
      }
    }
  }

  async function handlePasswordReset() {
    try {
      await sendPasswordResetEmail(auth, mail);
      setMessage('Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error.message);
      setMessage('Hubo un problema al enviar el correo de recuperación.');
    }
  }

  const resendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('Correo de verificación enviado nuevamente. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar el correo de verificación:', error.message);
      setMessage('Hubo un problema al enviar el correo de verificación.');
    }
}

  function toggleRegister() {
    setRegister(!register);
  }

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      console.log('Autenticación correcta');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hubo un problema al iniciar sesión con Google.');
    }
  }

  function logout() {
    signOut(auth)
      .then(() => {
        console.log('Cierre de sesión exitoso');
        navigate('/');
      })
      .catch((error) => console.error('Error:', error));
  }


  return (
    
    <>
    

    <div className='Pokemons'>
        <div className='contPoke'>
        <div className="form-container">
        <div className='form-container-inner'>
        <NavLink to={-1} className="primary-button back-btn">Atras</NavLink>
        {error && (
            <div>
                <div className="error-message">
                <h2>{error}</h2>
                </div>
                <div className="verification-container">
                <button className="secondary-button" onClick={resendVerificationEmail}>
                    Reenviar correo de verificación
                </button>
                </div>
            </div>
        )}
        {message && <div className="error-message"><h2>{message}</h2></div>}

        {!user ? (
          <>
        <div className='auth-form'>
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          type="email"
          placeholder="ejemplo@algoMas.algo"
          value={mail} 
          onChange={(e) => setMail(e.target.value)} 
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Evita el envío del formulario si es necesario
              handleFormSubmit();
            }
          }}
          required
        />


        {register && (
        <>
            <label htmlFor="password2">Repite la contraseña:</label>
            <input
            name="password2"
            type="password"
            placeholder="Repite la contraseña"
            value={password2} 
            onChange={(e) => setPassword2(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Evita el envío del formulario si es necesario
                handleFormSubmit();
              }
            }}
            required
            />
        </>
        )}


        <button className="primary-button" onClick={handleFormSubmit}>
          { register ? "Registrarme" : "Iniciar sesión" }
        </button>
        <button onClick={toggleRegister} className="primary-button">
          { register ? "Ya tengo cuenta" : "Registrarme" }
        </button>
        {!register && (
                      <button onClick={handlePasswordReset} className="secondary-button rnv">
                        Recuperar contraseña
                      </button>
                    )}
        </div>
            <div className='actions'>
            <button onClick={loginWithGoogle} className='secondary-button'>
                <img src={foto} alt='Google logo' className='google-logo'/>
                Iniciar sesión con Google</button>
            </div>
            </>
          ) : 
          <div className='logout'>
            <p className='h1'>¿Desea cerrar sesion?</p>
          <button onClick={logout} className='primary-button'>Cerrar Sesion</button>
          </div>
          }
          </div>
          </div>
        </div>  
    </div>

    </>

  )

}