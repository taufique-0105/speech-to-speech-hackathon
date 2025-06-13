import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaPlay, FaPause } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/STSPage.css";

function STSPage() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Add USER'S voice message
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now(),
            sender: "user", 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            audioUrl,
            type: "voice" 
          },
        ]);

        // Simulate APP'S voice reply
        setTimeout(() => {
          const replyAudio = new Audio("/reply-sample.wav");
          replyAudio.onplay = () => setCurrentlyPlaying("app-" + Date.now());
          replyAudio.onended = () => setCurrentlyPlaying(null);
          replyAudio.play();

          setMessages((prev) => [
            ...prev,
            { 
              id: Date.now() + 1,
              sender: "app", 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              audioUrl: "/reply-sample.wav", 
              type: "voice" 
            },
          ]);
        }, 1500);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Play/pause audio
  const toggleAudio = (url, id) => {
    if (currentlyPlaying === `user-${id}`) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => setCurrentlyPlaying(`user-${id}`);
      audio.onended = () => setCurrentlyPlaying(null);
      audio.play();
    }
  };

  return (
    <motion.div 
      className="sts-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="sts-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img src="/vite.svg" alt="Logo" className="sts-logo" />
        <div className="header-content">
          <IoMdChatbubbles className="chat-icon" />
          <h1>Voice Chat</h1>
        </div>
      </motion.div>

      <motion.div 
        className="sts-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Speech-to-Speech</h2>
        <p>Talk naturally and get voice replies</p>
      </motion.div>

      <div className="sts-messages">
        {messages.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
          >
            Press and hold the microphone to start chatting
          </motion.div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`msg-bubble ${msg.sender}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button 
                className="play-btn"
                onClick={() => toggleAudio(msg.audioUrl, msg.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {currentlyPlaying === `user-${msg.id}` ? <FaPause /> : <FaPlay />}
              </motion.button>
              
              <div className="waveform">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bar"
                    animate={{
                      height: currentlyPlaying === `user-${msg.id}` 
                        ? `${Math.random() * 60 + 20}%` 
                        : '20%',
                      backgroundColor: currentlyPlaying === `user-${msg.id}`
                        ? msg.sender === 'user' ? '#ffffff' : '#003c5c'
                        : msg.sender === 'user' ? '#003c5c' : '#ffffff'
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: currentlyPlaying === `user-${msg.id}` ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  />
                ))}
              </div>
              
              <span className="msg-time">{msg.time}</span>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div 
        className="sts-controls"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.button
          className={`record-btn ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: isRecording ? [1, 1.05, 1] : 1,
            backgroundColor: isRecording ? "#ff3b30" : "#007aff"
          }}
          transition={{ 
            scale: isRecording ? { repeat: Infinity, duration: 1.5 } : {},
            backgroundColor: { duration: 0.3 }
          }}
        >
          {isRecording ? (
            <>
              <FaStop className="icon" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <FaMicrophone className="icon" />
              <span>Hold to Talk</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default STSPage;