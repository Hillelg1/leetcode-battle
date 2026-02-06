import type {Client} from "stompjs";

const subscribe = (user:string, client:Client, matchId:string, setBattleState: (battleState: string) => void, disconnect: ()=> void) =>{
    return client.subscribe(`/topic/match/${matchId}`, (msg: any) => {
      console.log("subscribed");
      if (msg.body) {
          const Match = JSON.parse(msg.body);
          const isMe = Match.sender === user;
          if (Match.type === "FINISH" && !isMe) {
              setBattleState("LOST") // opponent sent over the finished message meaning they solved all test cases
          } else if (Match.type === "FINISH" && isMe) {
              setBattleState("WON") //User sent finish message
              disconnect();
          } else if (Match.type === "QUIT" && !isMe) {
              setBattleState("QUIT") //opponent wants out
          } else if (Match.type === "QUIT" && isMe) {
              setBattleState("QUITTER")
              disconnect();
          }
          else if (Match.type === "TIMEOUT" && !isMe) {
              setBattleState("OPTIMEOUT")
          }
          else if (Match.type === "TIMEOUT" && isMe) {
              setBattleState("TIMEOUT")
              disconnect();
          }
      }
  });
}



export default subscribe;