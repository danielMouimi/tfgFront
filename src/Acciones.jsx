import { useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
export function Acciones() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      usuario_id: '',
      nombre: '',
      descuento: '',
      fecha_inicio: '',
      fecha_fin: '',
    });
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);
  
    // Fetch users for the dropdown
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://tfgback-production-3683.up.railway.app/api/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://tourflex-tfg.web.app/'
            },
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
          }
  
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
          setMessage('Hubo un problema al cargar los usuarios.');
        }
      };
  
      fetchUsers();
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validaciones de fechas
      const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
      if (formData.fecha_inicio < today) {
        setMessage('La fecha de inicio debe ser posterior al día de hoy.');
        return;
      }
  
      if (formData.fecha_fin <= formData.fecha_inicio) {
        setMessage('La fecha de fin debe ser posterior a la fecha de inicio.');
        return;
      }
  
      try {
        const response = await fetch('https://tfgback-production-3683.up.railway.app/api/destinos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tourflex-tfg.web.app/'
          },
          body: JSON.stringify(
            { nombre: "Madrid", descripcion: "Ciudad capital de España, famosa por su cultura y gastronomía.",fotos:[], pais: "España" },
          ),
        });
  
        if (!response.ok) {
          throw new Error('Error al crear la oferta');
        }
  
        const data = await response.json();
        console.log('Oferta creada:', data);
        setMessage('Oferta creada exitosamente.');
        navigate('/admin'); // Redirige al panel de administración
      } catch (error) {
        console.error('Error al crear la oferta:', error);
        setMessage('Hubo un problema al crear la oferta.');
      }
    };
  
    return (
      <div className="create-offer-container">
        <h1>Crear Nueva Oferta</h1>
        {message && <div className="alert">{message}</div>}
        <form onSubmit={handleSubmit} className="create-offer-form">
          <div className="form-group">
            <label htmlFor="usuario_id">Usuario:</label>
            <select
              id="usuario_id"
              name="usuario_id"
              value={formData.usuario_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la oferta:</label>
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
            <label htmlFor="descuento">Descuento (%):</label>
            <input
              type="number"
              id="descuento"
              name="descuento"
              value={formData.descuento}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fecha_inicio">Fecha de inicio:</label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fecha_fin">Fecha de fin:</label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="primary-button">
            Crear Oferta
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