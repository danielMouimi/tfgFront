import { useEffect, useState } from "react";
import { auth } from "./firebase";
export function Ofertasejem() {

    useEffect(() => {
        console.log('usuario autenticado:', auth.currentUser);
        async function fetchOfertas() {
          const user = auth.currentUser;
          if (!user) return;
      
          const token = await user.getIdToken(); // ✅ espera el token
      
          fetch('http://localhost/api/ofertas', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            token: token, // ✅ incluye el token en la solicitud
            body: JSON.stringify({
                usuario_id: 1,
                nombre: 'Oferta de verano',
                descuento: 10,
                fecha_inicio: '2025-06-01',
                fecha_fin: '2025-06-15',
            }),
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
      
      }, []);

    return (
        <h1>LLega a ofertas</h1>
    );
}