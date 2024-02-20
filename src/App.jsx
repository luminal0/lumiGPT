import React, { useState } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = {
      role: "user",
      content: input,
    };

    setChatHistory((prevChatHistory) => [...prevChatHistory, userMessage]);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        userMessage,
      ],
      max_tokens: 256,
    });

    const botMessage = {
      role: "bot",
      content: response.choices[0].message.content,
    };

    setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
    setInput("");
  };

  return (
    <div className="bg-gray-900 text-gray-100 h-screen flex flex-col dark:bg-gray-800 dark:text-gray-50">
      <div className="flex-1 overflow-y-scroll">
        <div className="flex justify-center">
          <img src="Lumipedia.svg" alt="logo" className=" w-96 h-auto" />
        </div>
        <div className="flex justify-start mt-2 ml-3">
          <div className="bg-green-700 rounded-lg px-4 py-2 text-white max-w-sm ml-3">
            Hi there! I'm a LumiGPT chatbot. Ask me anything!
          </div>
        </div>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex justify-${
              message.role === "user" ? "end" : "start"
            } mt-2 ${message.role === "user" ? "ml-3" : "mr-3"}`}
          >
            <div
              className={`bg-${
                message.role === "user" ? "blue-600" : "green-700"
              } rounded-lg px-4 py-2 text-white max-w-sm`}
            >
              <strong>{message.role === "user" ? "You" : "LumiGPT"}:</strong>{" "}
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <input
            type="text"
            className="w-full rounded-lg py-2 px-4 dark:bg-gray-700 dark:text-gray-200 ml-2 mb-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your question here..."
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 rounded-lg px-2 py-4 text-white ml-2 w-20 h-11 mr-5 flex items-center justify-center mb-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
