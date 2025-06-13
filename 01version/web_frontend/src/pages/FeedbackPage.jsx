import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/FeedbackPage.css';

const FeedbackPage = () => {
  const [rating, setRating] = useState(3);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="feedback-wrapper">
      <header className="feedback-header">
        <motion.img 
          src="/logo.png" 
          alt="logo" 
          className="feedback-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </header>
      
      <motion.div 
        className="feedback-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2>Share Your Feedback</h2>
        
        <AnimatePresence>
          {isSubmitted ? (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3>Thank You!</h3>
              <p>Your feedback has been submitted.</p>
            </motion.div>
          ) : (
            <motion.form 
              className="feedback-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>How would you rate our app?</label>
                <div className="slider-section">
                  <div className="star-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        className={star <= rating ? 'star filled' : 'star'}
                        onClick={() => handleStarClick(star)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <div className="rating-feedback">
                    {rating === 1 && <motion.span className="emoji-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🌧 Terrible</motion.span>}
                    {rating === 2 && <motion.span className="emoji-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>😐 Okay</motion.span>}
                    {rating === 3 && <motion.span className="emoji-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🙂 Good</motion.span>}
                    {rating === 4 && <motion.span className="emoji-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>😊 Very Good</motion.span>}
                    {rating === 5 && <motion.span className="emoji-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🤩 Excellent</motion.span>}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Opinion Matters*</label>
                <textarea
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>

              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Feedback
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;