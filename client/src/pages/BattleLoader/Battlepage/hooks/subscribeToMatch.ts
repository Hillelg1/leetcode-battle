import type { Client } from "stompjs";

const subscribe = (user:string, client:Client, matchId:String, setBattleState: (battleState: string) => void) =>{
const subscription = client.subscribe(`/topic/match/${matchId}`, (msg: any) => {
    console.log("subscribed");
    if (msg.body) {
      const Match = JSON.parse(msg.body);
      if (Match.type === "FINISH" && Match.sender !== user) {
        setBattleState("LOST") // opponent sent over the finished message meaning they solved all test cases
      } else if (Match.type === "FINISH") {
        setBattleState("WON") //User sent finish message
      }
      else if(Match.type === "QUIT" && Match.sender !==user){
          setBattleState("QUIT") //user wants out
      }
      else if(Match.type === "QUIT"){
        setBattleState("QUITTER")
      }
    }
  });
  return subscription;
}



export default subscribe;