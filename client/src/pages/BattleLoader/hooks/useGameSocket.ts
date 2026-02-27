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

export function useGameSocket({ onMatchReceived, username}: UseGameSocketProps) {
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const publicSubRef = useRef<Stomp.Subscription | null>(null);
  const matchSubRef = useRef<Stomp.Subscription | null>(null);
  const [usernameScoped, setUsername] = useState<string | undefined>(username);


  const connect = () => {
    const user = username || JSON.parse(localStorage.getItem("user") || "{}").username
    setUsername(user);
    console.log("connected " + user)
    const socket = new SockJS("/ws");
    const client = Stomp.over(socket);
    stompClientRef.current = client;
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}").username;
    client.connect({}, () => {
      console.log("Connected to WebSocket as", user);

      // STEP 1: subscribe to public matchmaking
      publicSubRef.current = client.subscribe(`/topic/match/${user}`, (message) => {
        if (message.body) {
          
          const match: MatchesDTO = JSON.parse(message.body);
          console.log(match.toString())
          if(match.matchId !== ""){
            // Notify app - push up to battle loader to drill info into battle page
              onMatchReceived(match);   
          }

          //no rejoin
          else{
                client.send(
                  "/app/game/join",
                  {},
                  JSON.stringify({
                 sender: currentUser,
                 type: "JOIN",
                payload: ""
                })
            );
          }
           
        }
      });

      // Notify backend this user wants to join
      client.send(
        "/app/game/rejoin",
        {},
        JSON.stringify({
        sender: currentUser,
      })
      )
    });
  };
  
  //only calls for now when a client has passed all testcases, will have to configure to do so when i add a quit function as well

  const sendGameMessage = (matchId: string, type:string) =>{
      if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
              "/app/game/finish",
              {},
              JSON.stringify({ matchId: matchId, type: type, sender: usernameScoped})
          );
      }
  };
  const finish = (matchId: string) => {
    sendGameMessage(matchId, "FINISH");
  };

  const quit = (matchId: string) => {
    sendGameMessage(matchId, "QUIT");
  };

  const timeOut = (matchId: string) => {
      sendGameMessage(matchId, "TIMEOUT");
  }


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
  return { connect, disconnect, finish, quit, timeOut, client: stompClientRef.current };
}