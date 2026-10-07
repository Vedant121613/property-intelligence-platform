import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Pureframe. Looking for property registration details, market price trends, or project verification?' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    // Dynamic intelligent bot response
    setTimeout(() => {
      let reply = "Thanks for your inquiry. Pureframe tracks registered transaction data from the Inspector General of Registration (IGR). Our property advisors will assist you shortly!";
      const lower = userText.toLowerCase();
      if (lower.includes('saswad') || lower.includes('heera')) {
        reply = "Heera Solitaire in Saswad Road has recorded recent transactions averaging around ₹ 42.50 Lac to ₹ 57 Lac across 3rd to 6th floors. Would you like a detailed deed verification report?";
      } else if (lower.includes('sell') || lower.includes('list')) {
        reply = "To list and sell verified properties on Pureframe with guaranteed pricing transparency, please enter your contact number or email!";
      } else if (lower.includes('price') || lower.includes('cost')) {
        reply = "Pureframe shows registered sales deed amounts rather than artificially inflated broker quotes. You can filter by 3, 6, 12 months or all historical data on any locality!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <>
      <aside className="floating-chat-container" aria-label="Customer Support">
        {!isOpen && (
          <div 
            className="chat-bubble-prompt"
            onClick={() => setIsOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            Welcome to Pureframe! How can we assist you today?
          </div>
        )}

        <button 
          type="button" 
          className="chat-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
          {!isOpen && (
            <span 
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                border: '2px solid #FFFFFF'
              }}
            >
              1
            </span>
          )}
        </button>
      </aside>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-window-header">
            <div className="chat-header-info">
              <div className="chat-bot-avatar">
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Pureframe Assistant</h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Online • Property Intelligence</span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              style={{ color: '#fff', padding: '4px' }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about properties, pricing, registrations..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send message">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
