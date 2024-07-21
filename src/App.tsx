import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar"
import { Groq } from "groq-sdk";
import ReactMarkdown from 'react-markdown';
import "./App.css"

const groq = new Groq({ 
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

const Chat = () => {
  const [displayText, setDisplayText] = useState('');
  const [messages, setMessages] = useState([]);
  const [textOpening, setTextOpening] = useState('Halo, apa yang bisa saya lakukan hari ini?');
  const [input, setInput] = useState('');

  useEffect(() => {
    const typingSpeed = 25;
    let index = 0;
    let timeoutId;

    const typeWriter = () => {
      if (index < textOpening.length) {
        setDisplayText((prevDisplayText) => prevDisplayText + textOpening.charAt(index));
        index++;
        timeoutId = setTimeout(typeWriter, typingSpeed);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'ZesyAi',
            content: textOpening,
          },
        ]);
      }
    };

    typeWriter();

    return () => clearTimeout(timeoutId);
  }, [textOpening]);

  const handleSended = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'You',
        content: input,
      },
    ]);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
      model: 'mixtral-8x7b-32768',
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'ZesyAi',
        content: aiResponse,
      },
    ]);

    setInput('');
  };

  return (
    <>
      <div id="bodyChat" className="overflow-y-scroll" style={{ paddingBottom: "150px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`d-flex ${msg.sender === 'You' ? 'justify-content-end' : 'align-items-start'} mb-2`}>
            <div className={`d-flex flex-column ${msg.sender === 'You' ? 'bg-chat-me' : 'bg-chat-not-me'} p-2 rounded`}>
              <span className="small text-dark fw-bold">{msg.sender}</span>
              <ReactMarkdown className="small text-body">{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex position-fixed bg-light justify-content-center align-items-center m-0 w-100 container py-3 shadow-sm" style={{ left: "0", bottom: "0" }}>
        <input
          type="text"
          placeholder="Type a message..."
          className="form-control me-2 ipt-message"
          style={{ borderRadius: "0.375rem" }}
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <button
          type="button"
          className="btn text-primary d-flex justify-content-center align-items-center"
          style={{ background: "#DBEAFF" }}
          onClick={handleSended}
        >
          <span className="bi bi-send px-3"></span>
        </button>
      </div>
    </>
  );
};




const App = () => {
  return (
    <main className="w-100 vh-100">
      <Navbar/>
      <section className="w-100 pt-3 justify-content-center position-relative align-items-center overflow-y-scroll bg-light container" style={{height:"100%"}}>
         <Chat/>
      </section>
    </main>
  )
}

export default App