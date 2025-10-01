import React, { useEffect, useState } from 'react';
import './Shockwave.css';

interface ShockwaveProps {
    onAnimationEnd: () => void; // Función que se llamará cuando la animación termine
}

const Shockwave: React.FC<ShockwaveProps> = ({ onAnimationEnd }) => {
    // Usamos el estado para saber cuándo debe comenzar la animación de salida/desmontaje
    const [shouldRender, setShouldRender] = useState(true);

    // Cuando el componente se monta, programamos su remoción
    useEffect(() => {
        // La animación dura 0.8s, así que removemos el componente justo después
        const timer = setTimeout(() => {
            setShouldRender(false);
            onAnimationEnd(); // Opcional: notificar al padre que la animación ha terminado
        }, 800); 

        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    if (!shouldRender) return null;

    return (
        // Se aplica la clase shockwave-circle que tiene la animación
        <div className="shockwave-circle" />
    );
};

export default Shockwave;