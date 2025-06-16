import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

export function AdminPanel() {
  const navigate = useNavigate();

  const handleCreateOffer = () => {
    navigate('/create-offer'); // Redirige a la página para crear ofertas
  };

  const handleManageUsers = () => {
    navigate('/create-tour'); // Redirige a la página para gestionar usuarios
  };

  return (
    <div className="admin-panel-container">
      <h1>Panel de Administración</h1>
      <div className="admin-actions">
        <button className="primary-button" onClick={handleCreateOffer}>
          Crear Ofertas
        </button>
        <button className="primary-button" onClick={handleManageUsers}>
          Crear Tour
        </button>
      </div>
    </div>
  );
}