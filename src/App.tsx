import { useState, useEffect, useRef } from 'react';
import './App.css'; 
import ChapterScreen from './components/ChapterScreen';
import ParticlesBackground from './components/ParticlesBackground';
import Shockwave from './components/Shockwave';

// Asegúrate de tener este archivo y el global.d.ts
const audioFile = '/Micorazonencantado.mp3'; 

// --- Interfaz de TypeScript para la estructura de los datos ---
interface ChapterData {
  id: number;
  text: string[];
  buttonText?: string;
  style: string;
}

const STORY_CHAPTERS: ChapterData[] = [
  // ... (Tu arreglo STORY_CHAPTERS completo va aquí) ...
  { 
    id: 0, 
    text: ["Para la dueña de mi Corazón Encantado..."], 
    buttonText: "Descubrir",
    style: "invitation"
  },
  { 
    id: 1, 
    text: [
         "Antes de ti, mis días eran... diferentes.",
        "Había color, sí, pero le faltaba ese brillo que solo tú podías traer.",
        "Una parte de mí esperaba, sin saber qué.",
        // AÑADIR ESTA PAUSA:
        "Esperaba esa luz sin igual que un día cambiaría mi vida para siempre."
    ],
    style: "grayscale"
  },
  { 
    id: 2, 
    text: [
      "Y entonces, llegaste tú.",
      "Como una luz que disipa la niebla, una melodía que lo cambia todo.",
      "Mi mundo, de repente, se llenó de un color que nunca supe que faltaba."
    ], 
    style: "color-reveal"
  },
  { 
    id: 3, 
    text: [
       "Cada parte de ti es el amor que me ha dado el valor para ser yo mismo.",
        "Tu risa, que ilumina cualquier día.",
        "Tu fuerza, que me inspira a ser mejor.",
        "Tu ternura, que calma cualquier tormenta.",
        // AÑADIR NUEVAS LÍNEAS AQUÍ:
        "Y es tu bondad silenciosa, la que más me encanta.",
        "Es tu forma de amar sin pedir nada a cambio...",
        "Lo que me recuerda lo afortunado que soy.",
    ],
    style: "essence"
  },
  { 
    id: 4, 
    text: [
      "Y así, mi corazón quedó encantado.",
      "Vibra por ti, con una fuerza que nunca imaginé.",
      "Porque tú eres esa luz sin igual en mi vida."
    ],
    style: "confession"
  },
  { 
    id: 5, 
    text: [
      "No tengo fotos para mostrarte aquí,",
      "Pero cada palabra, cada detalle en este pequeño universo digital...",
      "Está hecho con el mismo amor incondicional que siento por ti, hoy y siempre.",
      "Gracias por hacerme el hombre más feliz del mundo.",
      "Siempre estaré para ti, en cada paso, en cada sueño.",
      "Mi corazón es tuyo, y seguirá encantado por toda la eternidad."
    ],
    style: "future"
  }
];

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentChapterData = STORY_CHAPTERS[currentChapter];



  useEffect(() => {
    console.log("App mounted"); 
  }, []); 
   // --- NUEVA FUNCIÓN DE FADE-OUT ---
  const fadeOutAndStop = (audioElement: HTMLAudioElement) => {
      const fadeDuration = 3000; // 3 segundos para el fade-out
      const steps = 100;
      const stepTime = fadeDuration / steps;
      let currentVolume = audioElement.volume;
      const volumeStep = currentVolume / steps;

      const fadeInterval = setInterval(() => {
          currentVolume -= volumeStep;
          if (currentVolume <= volumeStep) {
              audioElement.volume = 0;
              audioElement.pause();
              audioElement.currentTime = 0;
              clearInterval(fadeInterval);
          } else {
              audioElement.volume = currentVolume;
          }
      }, stepTime);
  };
 


  const handleNextChapter = () => {
    if (currentChapter < STORY_CHAPTERS.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
        // REINICIO SUAVE: Si es el último capítulo, vuelve al inicio
        
        // Detener la música con FADE-OUT
        if (audioRef.current) {
            fadeOutAndStop(audioRef.current); // <-- USAR FADE-OUT AQUÍ
        }
        
        // Reiniciar la aplicación después del fade-out
        setTimeout(() => {
            setCurrentChapter(0);
            setHasStarted(false);
        }, 3000); // Esperar la duración del fade (3000ms) antes de reiniciar el estado
    } 
  };

  const handleTransition = () => {
      if (isTransitioning) return;
      
      // Si NO es el último capítulo, hacemos la transición normal.
      if (currentChapter < STORY_CHAPTERS.length - 1) {
          setIsTransitioning(true);

          setTimeout(() => {
              handleNextChapter(); 
              setIsTransitioning(false);
          }, 700);
      } else {
          // Si es el ÚLTIMO CAPÍTULO, usamos la transición para cubrir el reinicio.
          setIsTransitioning(true); // Iniciar Shockwave

          if (audioRef.current) {
             fadeOutAndStop(audioRef.current);
          }
        
          // Reiniciar el estado del APP después de que Shockwave y FadeOut terminen (3 segundos)
          setTimeout(() => {
              handleNextChapter(); // Esto llamará a la lógica de reinicio
              setIsTransitioning(false); 
          }, 3000); 
      }
  }

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(error => {
            console.log("Audio play failed, waiting for next user interaction:", error);
        });
    }
    handleTransition(); // Llama a la transición
  };

  const handleInteraction = currentChapter === 0 ? handleStart : handleTransition;


  if (!hasStarted && currentChapter === 0) {
    // Pantalla de invitación/entrada
    return (
        <div className={`app-container ${currentChapterData.style}`}>
            <h1>{currentChapterData.text[0]}</h1>
            <button className="start-button" onClick={handleStart}>
                {currentChapterData.buttonText || "Comenzar"}
            </button>
            <audio ref={audioRef} src={audioFile} loop />
        </div>
    );
  }

  // Pantallas de la historia
  return (
    <div 
        className={`app-container ${currentChapterData.style}`}
        
    >
      <ParticlesBackground 
          isActive={currentChapter >= 3} 
          shootingStars={currentChapter === 5}
      />
      
      {/* RENDERIZAR LA ONDA DE CHOQUE SI ESTAMOS EN TRANSICIÓN */}
      {isTransitioning && <Shockwave onAnimationEnd={() => setIsTransitioning(false)} />}
      
      <audio ref={audioRef} src={audioFile} loop />
      <ChapterScreen 
        key={currentChapterData.id}
        chapterData={currentChapterData} 
        onNext={handleInteraction} 
        isLastChapter={currentChapter === STORY_CHAPTERS.length - 1}
      />
    </div>
  );
}