import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import socket from "../api/socket";

export default function Chat() {
  const [tempName, setTempName] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    // Fetch all persisted messages
    fetch(`${import.meta.env.VITE_BASE_URL}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(console.error);

    // Connect WebSocket
    socket.connect();
    socket.emit("join", { username });

    // Listen for new messages and join notices
    socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("userJoined", (note) =>
      setMessages((prev) => [...prev, { system: true, text: note }])
    );

    return () => {
      socket.off("newMessage");
      socket.off("userJoined");
      socket.disconnect();
    };
  }, [joined, username]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    const name = tempName.trim();
    if (!name) return;
    setUsername(name);
    setJoined(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    socket.emit("sendMessage", { username, text: content });
    setText("");
  };

  // Joining form
  if (!joined) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-20 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome to LetsChat
        </h2>
        <form onSubmit={handleJoin} className="flex flex-col space-y-4">
          <input
            className="text-lg border rounded-lg px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your name…"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="text-lg bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg transition"
          >
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  // Chatting interface
  return (
    <div className="h-screen w-full flex items-center justify-center bg-indigo-50">
      <div className="w-full max-w-5xl h-5/6 bg-white shadow-2xl rounded-2xl p-8 flex flex-col">
        <h1 className="text-4xl font-extrabold mb-6 text-center">LetsChat</h1>
        <div className="flex-1 overflow-auto mb-6 space-y-4">
          {messages.map((m, i) => {
            if (m.system) {
              return (
                <div
                  key={i}
                  className="text-center italic text-sm text-gray-500"
                >
                  {m.text}
                </div>
              );
            }
            const isMe = m.username === username;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-lg max-w-xl break-words ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="font-semibold mb-1">{m.username}</div>
                  <div className="text-lg">{m.text}</div>
                </div>
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            ref={inputRef}
            className="flex-grow text-lg border rounded-l-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-r-xl text-lg transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
