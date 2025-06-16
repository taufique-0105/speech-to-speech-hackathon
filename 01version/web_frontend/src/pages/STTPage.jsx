import { useState, useEffect, useRef } from 'react';
import '../styles/STTPage.css';
import { FaMicrophone, FaStop, FaTrash, FaLanguage } from 'react-icons/fa';
import { RiSoundModuleFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const STTPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0);
  const transcriptEndRef = useRef(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese' },
  ];

  let recognition = useRef(null);
  let volumeInterval = useRef(null);

  useEffect(() => {
    // Scroll to bottom when transcript updates
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = language;

    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript + interimTranscript);
      
      // Simulate volume levels when speaking
      if (interimTranscript.trim().length > 0) {
        const newVolume = Math.min(100, Math.floor(interimTranscript.length * 3));
        setVolume(newVolume);
      } else {
        setVolume(0);
      }
    };

    recognition.current.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
      clearInterval(volumeInterval.current);
      setVolume(0);
    };

    recognition.current.onend = () => {
      if (isListening) {
        recognition.current.start();
      } else {
        clearInterval(volumeInterval.current);
        setVolume(0);
      }
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      clearInterval(volumeInterval.current);
    };
  }, [language, isListening]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
      clearInterval(volumeInterval.current);
      setVolume(0);
    } else {
      setError(null);
      recognition.current.start();
      setIsListening(true);
      
      // Simulate volume animation when waiting for speech
      volumeInterval.current = setInterval(() => {
        setVolume(prev => {
          if (prev > 0) return Math.max(0, prev - 10);
          return Math.floor(Math.random() * 15) + 5; // Random low volume when waiting
        });
      }, 300);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setError(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (isListening) {
      recognition.current.stop();
      recognition.current.start();
    }
  };

  return (
    <motion.div 
      className="stt-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="header"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <RiSoundModuleFill className="logo" />
        <h1>Voice Transcriber</h1>
        <p>Convert your speech to text in real-time</p>
      </motion.div>
      
      {!isSupported ? (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your browser doesn't support speech recognition. Try Chrome or Edge.
        </motion.div>
      ) : (
        <>
          <div className="controls">
            <motion.button
              onClick={toggleListening}
              className={`mic-button ${isListening ? 'listening' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 1 }}
              animate={{ 
                scale: isListening ? [1, 1.05, 1] : 1,
                boxShadow: isListening 
                  ? '0 0 20px rgba(0, 150, 255, 0.5)' 
                  : '0 0 0 rgba(0, 150, 255, 0)'
              }}
              transition={{ 
                scale: isListening ? { repeat: Infinity, duration: 1.5 } : {},
                boxShadow: { duration: 0.3 }
              }}
            >
              {isListening ? (
                <>
                  <FaStop className="icon" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <FaMicrophone className="icon" />
                  <span>Start</span>
                </>
              )}
            </motion.button>
            
            <motion.button 
              onClick={handleClear}
              disabled={!transcript && !error}
              className="clear-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash className="icon" />
              <span>Clear</span>
            </motion.button>
            
            <motion.div 
              className="language-selector"
              animate={{ 
                height: isExpanded ? 'auto' : '50px',
                borderRadius: isExpanded ? '12px' : '25px'
              }}
            >
              <button 
                className="language-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <FaLanguage className="icon" />
                <span>{languages.find(l => l.code === language)?.name}</span>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    className="language-dropdown"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setIsExpanded(false);
                        }}
                        className={language === lang.code ? 'active' : ''}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          <div className="volume-indicator">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className={`bar ${volume > i * 10 ? 'active' : ''}`}
                animate={{
                  height: `${volume > i * 10 ? Math.min(100, volume - (i * 10)) * 0.8 : 5}%`,
                  backgroundColor: volume > i * 10 
                    ? `hsl(${200 + (volume * 0.6)}, 80%, 50%)` 
                    : 'rgba(0, 150, 255, 0.2)'
                }}
                transition={{ type: 'spring', damping: 10 }}
              />
            ))}
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="transcript-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="transcript-header">
              <h2>Live Transcript</h2>
              <div className="status">
                {isListening ? (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Listening...
                  </motion.span>
                ) : (
                  <span>Ready</span>
                )}
              </div>
            </div>
            
            <div className="transcript-text">
              {transcript || (
                <motion.p 
                  className="placeholder"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isListening 
                    ? "Speak now, I'm listening..." 
                    : "Press the microphone button to start"}
                </motion.p>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default STTPage;