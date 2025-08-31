import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

const GameSocket: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");
      setConnected(true);
      setStompClient(client);

      // Subscribe to hardcoded match "1234"
      client.subscribe("/topic/match/1234", (message) => {
        if (message.body) {
          const msg = JSON.parse(message.body);
          console.log("Received:", msg);
          setMessages((prev) => [
            ...prev,
            `${msg.sender}: ${msg.payload || msg.messageType}`,
          ]);
        }
      });

      // Send JOIN event
      client.send(
        "/app/game/join",
        {},
        JSON.stringify({
          sender: "frontend-user",
          type: "JOIN",
          payload: "Joined the match",
        })
      );
    });

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("Disconnected");
          setConnected(false);
        });
      }
    };
  }, []);
  

  // Handle "Finish" event
  const handleFinish = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/app/game/finish",
        {},
        JSON.stringify({
          sender: "frontend-user",
          type: "FINISH",
          payload: "Finished all test cases!",
        })
      );
    } else {
      console.warn("Not connected yet!");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid gray" }}>
      <h3>Game WebSocket: {connected ? "Connected" : "Disconnected"}</h3>
      <button onClick={handleFinish} disabled={!connected}>
        Finish Match
      </button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameSocket;
