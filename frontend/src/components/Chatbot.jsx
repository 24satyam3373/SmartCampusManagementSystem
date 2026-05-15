import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm the Galgotias AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let botResponse = "I'm still learning about Galgotias University. Could you please rephrase that or contact our support team?";
      
      const query = input.toLowerCase();
      if (query.includes('admission')) {
        botResponse = "Admissions for the 2026-27 session are currently open! You can find the application form on our official portal.";
      } else if (query.includes('courses') || query.includes('programs')) {
        botResponse = "We offer over 200 programs across 20+ specialized schools including CSE, Business, Law, and more.";
      } else if (query.includes('location') || query.includes('where')) {
        botResponse = "Galgotias University is located on Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Gautam Buddh Nagar, Uttar Pradesh.";
      } else if (query.includes('fee')) {
        botResponse = "Fee structures vary by course. You can check the detailed fee breakdown in the Fees section of the student dashboard.";
      } else if (query.includes('hello') || query.includes('hi')) {
        botResponse = "Hello! How can I assist you with your campus queries today?";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset messages after animation finishes (approx 300ms)
    setTimeout(() => {
      setMessages([
        { text: "Hi there! I'm the Galgotias AI Assistant. How can I help you today?", isBot: true }
      ]);
    }, 300);
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="chat-header">
              <div className="bot-info">
                <div className="bot-avatar">🤖</div>
                <div>
                  <h4>Campus Assistant</h4>
                  <span className="status">Online</span>
                </div>
              </div>
              <button className="close-btn" onClick={handleClose}>×</button>
            </div>

            <div className="chat-body" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`msg-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="msg-bubble bot typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              )}
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">➤</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={`chat-toggle ${isOpen ? 'active' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '↓' : '💬'}
      </motion.button>
    </div>
  );
}
