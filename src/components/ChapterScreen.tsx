import { useState, useEffect } from 'react'; // <-- AÑADIR useRef
import './ChapterScreen.css'; 

// La misma interfaz del App.tsx debe ser copiada aquí o exportada
interface ChapterData {
    id: number;
    text: string[];
    buttonText?: string;
    style: string;
}

// Interfaz para las propiedades (Props) del componente
interface ChapterScreenProps {
    chapterData: ChapterData;
    onNext: () => void;
    isLastChapter: boolean;
}


export default function ChapterScreen({ chapterData, onNext, isLastChapter }: ChapterScreenProps) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const currentText = chapterData.text[currentLineIndex];
    // Función de utilidad para esperar un número de milisegundos
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


     // Efecto de tipado lento para el texto
    // Efecto de tipado lento para el texto (¡Ahora Asincrónico!)
    useEffect(() => {
        if (!currentText) return;
        
        let shouldStopTyping = false;
        
        const typeText = async () => {
            // 1. LIMPIEZA INICIAL
            setDisplayText(''); // Limpiar completamente el texto al inicio
            setIsTyping(true);
            
            // 2. PAUSA DE AMORTIGUACIÓN (100ms)
            // Esperar un momento para que el navegador estabilice el contenedor
            await wait(100); 
            
            let currentDisplay = '';
            
            // 3. BUCLE DE TIPADO LETRA POR LETRA
            for (let i = 0; i < currentText.length; i++) {
                if (shouldStopTyping) break;
                
                // Agregar la letra actual
                currentDisplay += currentText.charAt(i);
                setDisplayText(currentDisplay);
                
                // Pausa entre letras (25ms)
                await wait(40); 
            }

            // 4. FINALIZACIÓN
            if (!shouldStopTyping) {
                setIsTyping(false);
                setDisplayText(currentText); // Asegura el texto final perfecto
                
                // Pausa de lectura final (el setTimeout anterior)
                const pauseTimer = setTimeout(() => {}, 4000); 
                return () => clearTimeout(pauseTimer);
            }
        };

        typeText();

        // 5. FUNCIÓN DE LIMPIEZA (Para el clic de salto)
        return () => {
            shouldStopTyping = true; // Detiene el bucle for si el componente desmonta o se actualiza
            setIsTyping(false);
        };
    }, [currentLineIndex, currentText]);


    // Maneja el clic en la pantalla (Ajuste para la nueva lógica)
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        
        if (isTyping) {
            // LÓGICA DE SALTO
            // Al hacer clic, el useEffect anterior se limpiará (shouldStopTyping = true)
            
            // Mostrar el texto completo y corregido
            setDisplayText(currentText); 
            setIsTyping(false);

        } else if (currentLineIndex < chapterData.text.length - 1) {
            // Avanza a la siguiente línea
            setCurrentLineIndex(prev => prev + 1);
        } else {
            // Avanza al siguiente capítulo
            if (isLastChapter) {
                 onNext(); 
                setTimeout(() => {
                    }, 3000)
                    } else {
                         onNext();
        }
        }
    };
    

    return (
        <div className="chapter-screen" onClick={handleClick}>
            <div className={`narrative-container ${chapterData.style}`}>
                <p className="typed-text">{displayText}</p> 
                
                {!isTyping && (
                    <div className={`next-indicator ${isLastChapter ? '' : ''}`}> 
                        {isLastChapter ? 'Toca para volver a ver' : 'Toca para continuar...'} 
                    </div>
                )}
            </div>
        </div>
    );
}