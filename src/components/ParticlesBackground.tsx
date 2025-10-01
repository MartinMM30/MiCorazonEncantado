import React from 'react';
import './ParticlesBackground.css';

interface ParticlesProps {
    isActive: boolean;
    shootingStars?: boolean; // <-- NUEVA PROP
}

const ParticlesBackground: React.FC<ParticlesProps> = ({ isActive, shootingStars }) => {
    const particleCount = 50;
    const particles = Array.from({ length: particleCount }, (_, i) => i);

    if (!isActive) return null;

    return (
        <div className="particles-container">
            {particles.map(index => (
                <div 
                    key={index} 
                    // Cambiar la clase si es el modo de estrellas fugaces
                    className={shootingStars ? "shooting-star-particle" : "particle"} // <-- CAMBIO AQUÍ
                    style={{
                        '--size': `${Math.random() * 3 + 1}px`,
                        '--left-pos': `${Math.random() * 100}vw`,
                        '--top-pos': `${Math.random() * 100}vh`,
                        '--duration': `${Math.random() * 10 + 5}s`,
                        '--delay': `-${Math.random() * 15}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

export default ParticlesBackground;