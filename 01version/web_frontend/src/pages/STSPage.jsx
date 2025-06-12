import React, { useState } from "react";
import "../styles/STSPage.css"
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";

function STSPage() {
  const [messages, setMessages] = useState([
    { sender: "user", time: "3:46 PM" },
    { sender: "app", time: "3:46 PM" },
  ]);

  return (
    <div className="sts-container">
      <div className="sts-header">
        <img src="/vite.svg" alt="Logo" className="sts-logo" />
        <IoMdChatbubbles className="chat-icon" />
      </div>

      <div className="sts-title">
        <h2>Speech to Speech</h2>
        <p>Record, convert, and play audio</p>
      </div>

      <div className="sts-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg-bubble ${msg.sender === "user" ? "left" : "right"}`}
          >
            <button className="play-btn">▶</button>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="sts-controls">
        <button className="record-btn">
          <FaMicrophone />
          <span>Start Recording ?</span>
        </button>
        <button className="send-btn">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default STSPage;