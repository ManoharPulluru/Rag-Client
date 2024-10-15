import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setResponses((prevResponses) => [...prevResponses, { user: input, bot: "" }]);

    setLoading(true);

    try {
      const response = await axios.post("https://manohar-rag-server.onrender.com/ask_query", { query: input });
      setResponses((prevResponses) => {
        const newResponses = [...prevResponses];
        newResponses[newResponses.length - 1].bot = response.data.response;
        return newResponses;
      });
      setInput("");
    } catch (error) {
      console.error("Error sending query:", error);
      setResponses((prevResponses) => [...prevResponses, { user: input, bot: "Error: Unable to get response" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  return (
    <div className="container">
      <div className="chatBotTitle">Chat Bot</div>
      <div className="chat-window">
        {responses.map((response, index) => (
          <div key={index} className="response">
            <div className="message">
              {response.user && (
                <div className="user-message">
                  <strong></strong> {response.user}
                </div>
              )}
              {response.bot && (
                <div className="bot-message">
                  <strong></strong> {response.bot}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" value={input} onChange={handleInputChange} placeholder="Type your message..." className="input" disabled={loading} />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default App;
