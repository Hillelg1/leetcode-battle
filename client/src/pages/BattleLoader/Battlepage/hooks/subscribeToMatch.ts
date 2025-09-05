import type { Client } from "stompjs";

const subscribe = (user:any, client:Client, matchId:any, setWon: (won:boolean)=>void) =>{
const subscription = client.subscribe(`/topic/match/${matchId}`, (msg: any) => {
    console.log("subscribed");
    if (msg.body) {
      const finishedMatch = JSON.parse(msg.body);
      if (finishedMatch.type === "FINISH" && finishedMatch.sender !== user) {
        setWon(false);
      } else if (finishedMatch.type === "FINISH") {
        setWon(true);
      }
    }
  });
  return subscription;
}

export default subscribe;