import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

const SocketTest: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Connect to your Spring Boot backend
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);

      // Subscribe to public topic
      stompClient.subscribe("/topic/public", (message) => {
        if (message.body) {
          setMessages((prev) => [...prev, message.body]);
        }
      });

      // Send JOIN message
      stompClient.send(
        "/app/chat/addUser",
        {},
        JSON.stringify({
          sender: "frontend-user",
          messageType: "JOIN",
        })
      );
    });

    // Cleanup on component unmount
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("❌ Disconnected");
          setConnected(false);
        });
      } else {
        console.log("⚠️ Tried to disconnect but no active WebSocket connection");
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", border: "1px solid gray" }}>
      <h3>
        WebSocket Connection:{" "}
        {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </h3>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocketTest;