// Chatbot.jsx
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const botResponse = getBotResponse(input);

    setMessages([...messages, userMessage, botResponse]);
    setInput('');
  };

  const getBotResponse = (message) => {
    // Simple rule-based response
    const msg = message.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) {
      return { sender: 'bot', text: 'Hello there! 👋' };
    }
    if (msg.includes('help')) {
      return { sender: 'bot', text: 'Sure! I can assist with general queries.' };
    }
    return { sender: 'bot', text: "I'm not sure how to respond to that 🤔" };
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-xl rounded-2xl bg-white">
      <h2 className="text-xl font-bold mb-4">💬 Chatbot</h2>
      <div className="h-64 overflow-y-auto border rounded-lg p-2 mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l-lg px-3 py-2 outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;