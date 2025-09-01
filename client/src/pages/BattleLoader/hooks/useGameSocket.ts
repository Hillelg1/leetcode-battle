// hooks/useGameSocket.ts
import { useRef } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import type { MatchesDTO } from "../../../dto/MatchesDTO";

interface UseGameSocketProps {
  onMatchReceived: (match: MatchesDTO) => void;
  username?: string;
}

export function useGameSocket({ onMatchReceived, username }: UseGameSocketProps) {
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const subscriptionRef = useRef<Stomp.Subscription | null>(null);

  const connect = () => {
    const user = username || JSON.parse(localStorage.getItem("user") || "{}").username;
    if (!user) {
      console.error("No username found in localStorage");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("Connected to WebSocket as", user);

      // Subscribe to the public match topic
      subscriptionRef.current = client.subscribe("/topic/match/public", (message) => {
        if (message.body) {
          const match: MatchesDTO = JSON.parse(message.body);
          console.log("Match received:", match);
          onMatchReceived(match);

          // Optionally, unsubscribe if you only care about the first match assignment
          subscriptionRef.current?.unsubscribe();
        }
      });

      // Notify backend this user wants to join
      client.send(
        "/app/game/join",
        {},
        JSON.stringify({
          sender: user,
          type: "JOIN",
          payload: ""
        })
      );
    });
  };

  const disconnect = () => {
    subscriptionRef.current?.unsubscribe();
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    }
  };

  return { connect, disconnect, client: stompClientRef.current };
}