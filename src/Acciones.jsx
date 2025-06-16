import { useState } from "react";
import { auth } from "./firebase";

export function Acciones() {
  const [destino, setDestino] = useState({
    nombre: "",
    descripcion: "",
    fotos: [],
    pais: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestino((prevDestino) => ({
      ...prevDestino,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch("https://tfgback-production-3683.up.railway.app/api/destinos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(destino),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el destino: ${destino.nombre}`);
      }

      const data = await response.json();
      console.log(`Destino creado: ${destino.nombre}`, data);
      alert("Destino creado exitosamente");
      setDestino({ nombre: "", descripcion: "", fotos: [], pais: "" }); // Reinicia el formulario
    } catch (error) {
      console.error(`Error al crear el destino: ${destino.nombre}`, error);
      alert("Hubo un error al crear el destino");
    }
  };

  return (
    <div className="acciones-container">
      <h1>Crear un nuevo destino</h1>
      <form onSubmit={handleSubmit} className="destino-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del destino:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={destino.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={destino.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="pais">País:</label>
          <input
            type="text"
            id="pais"
            name="pais"
            value={destino.pais}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Crear destino
        </button>
      </form>
    </div>
  );
}