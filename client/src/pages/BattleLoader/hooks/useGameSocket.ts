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
  const publicSubRef = useRef<Stomp.Subscription | null>(null);
  const matchSubRef = useRef<Stomp.Subscription | null>(null);

  const connect = () => {
    const user =
      username || JSON.parse(localStorage.getItem("user") || "{}").username;
    if (!user) {
      console.error("No username found in localStorage");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("Connected to WebSocket as", user);

      // STEP 1: subscribe to public matchmaking
      publicSubRef.current = client.subscribe("/topic/match/public", (message) => {
        if (message.body) {
          const match: MatchesDTO = JSON.parse(message.body);
          console.log("Match received:", match);

          // Notify app
          onMatchReceived(match);

          // STEP 2: unsubscribe from public queue
          publicSubRef.current?.unsubscribe();

          // STEP 3: subscribe to match-specific updates
          matchSubRef.current = client.subscribe(`/topic/match/${match.matchId}`, (msg) => {
            if (msg.body) {
              const finishedMatch = JSON.parse(msg.body);
              if(finishedMatch.type === "FINISH" && finishedMatch.sender !== username){
                console.log("lost");
              }
              else {console.log("won!");}
            }
          });
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

  const finish = (matchId: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send(
        "/app/game/finish",
        {},
        JSON.stringify({ matchId, type: "FINISH", sender: username })
      );
    }
  };

  const disconnect = () => {
    publicSubRef.current?.unsubscribe();
    matchSubRef.current?.unsubscribe();
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    }
  };

  return { connect, disconnect, finish, client: stompClientRef.current };
}