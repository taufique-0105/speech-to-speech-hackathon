import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop, FaPaperPlane, FaLanguage, FaVolumeUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/TTSPage.css';

const TTSPage = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese' },
  ];

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setError(null);

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: text,
      language: languages.find(lang => lang.code === language)?.name || 'English',
    };

    const botMsg = {
      id: Date.now() + 1,
      type: 'bot',
      audioText: text,
    };

    speakText(text);

    setMessages(prev => [...prev, userMsg, botMsg]);
    setText('');
  };

  const speakText = (textToSpeak) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      setError(`Speech error: ${e.error}`);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <motion.div 
      className="tts-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="tts-header">
        <motion.div 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring' }}
        >
          <FaVolumeUp className="logo" />
          <span>Text-to-Speech</span>
        </motion.div>
      </header>

      <div className="tts-wrapper">
        <motion.div 
          className="tts-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="tts-title">Text-to-Speech Converter</h2>
          
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
                        setLanguage(lang.code);
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

          <div className="tts-message-container">
            {messages.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.3 }}
              >
                Your converted messages will appear here
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`tts-message ${msg.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">{msg.text || msg.audioText}</div>
                  {msg.type === 'user' ? (
                    <div className="tts-lang">{msg.language}</div>
                  ) : (
                    <motion.button
                      className="tts-play-btn"
                      onClick={() => speakText(msg.audioText)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSpeaking}
                    >
                      {isSpeaking ? (
                        <>
                          <FaStop className="icon" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <FaPlay className="icon" />
                          <span>Play</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="tts-input-container">
            <input
              type="text"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="tts-input"
            />
            <motion.button 
              onClick={handleSend}
              className="tts-send-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!text.trim()}
            >
              <FaPaperPlane className="icon" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TTSPage;