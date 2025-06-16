import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function RutasPrivadas() {
    const [isAdmin, setIsAdmin] = useState(null); // Estado para verificar si el usuario es administrador
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Cambio en usuario");
                if (user.email === "admin@admin.com") {
                    setIsAdmin(true); // Usuario es administrador
                } else {
                    setIsAdmin(false); // Usuario no es administrador
                }
            } else {
                console.log("El usuario no está registrado, no entra");
                setIsAdmin(false); // Usuario no autenticado
            }
        });

        return () => unsubscribe(); // Limpia el listener al desmontar el componente
    }, []);

    if (isAdmin === null) {
        return <div>Cargando...</div>; // Muestra un mensaje mientras se verifica el estado
    }

    return isAdmin ? <Outlet /> : <Navigate to="/login" />; // Redirige según el estado del usuario
}