// hooks/useGameSocket.ts
import { useRef } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import type { MatchesDTO } from "../../../dto/MatchesDTO";
import { useState } from "react";

interface UseGameSocketProps {
  onMatchReceived: (match: MatchesDTO) => void;
  username?: string;
}

export function useGameSocket({ onMatchReceived, username }: UseGameSocketProps) {
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const publicSubRef = useRef<Stomp.Subscription | null>(null);
  const matchSubRef = useRef<Stomp.Subscription | null>(null);
  const [user, setUser] = useState("");

  const connect = () => {
    
    setUser(username || JSON.parse(localStorage.getItem("user") || "{}").username);
    console.log("connected " + user)
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    stompClientRef.current = client;
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}").username;
    client.connect({}, () => {
      console.log("Connected to WebSocket as", user);

      // STEP 1: subscribe to public matchmaking
      publicSubRef.current = client.subscribe("/topic/match/public", (message) => {
        if (message.body) {
          const match: MatchesDTO = JSON.parse(message.body);
          // Notify app - push up to battleloader to drill info into battle page 
          onMatchReceived(match);

          // STEP 2: unsubscribe from public queue
          publicSubRef.current?.unsubscribe();

        
        }
      });

      // Notify backend this user wants to join
      client.send(
        "/app/game/join",
        {},
        JSON.stringify({
          sender: currentUser,
          type: "JOIN",
          payload: ""
        })
      );
    });
  };
  //only calls for now when a client has passed all testcases, will have to configure to do so when i add a quit function as well 
  const finish = (matchId: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send(
        "/app/game/finish",
        {},
        JSON.stringify({ matchId: matchId, type: "FINISH", sender: user })
      );
    }
  };

  const quit = (matchId: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send(
        "/app/game/quit",
        {},
        JSON.stringify({ matchId: matchId, type: "QUIT", sender: user })
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
  // push connect and finish to be called in the battloader andn client to be set up in battle page will serperate the logic after
  return { connect, disconnect, finish, quit, client: stompClientRef.current };
}