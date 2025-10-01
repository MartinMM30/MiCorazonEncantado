import React, { useEffect, useState } from 'react';
import './Shockwave.css';

interface ShockwaveProps {
    onAnimationEnd: () => void; 
}

const Shockwave: React.FC<ShockwaveProps> = ({ onAnimationEnd }) => {
    
    const [shouldRender, setShouldRender] = useState(true);

    // Cuando el componente se monta, programamos su remoción
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(false);
            onAnimationEnd(); 
        }, 800); 

        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    if (!shouldRender) return null;

    return (
        
        <div className="shockwave-circle" />
    );
};

export default Shockwave;