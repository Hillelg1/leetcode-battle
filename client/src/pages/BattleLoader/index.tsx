import { useState, useEffect } from "react";
import BattlePage from "./Battlepage";
import type { MatchesDTO } from "../../dto/MatchesDTO"; // define this type
import { useGameSocket } from "./hooks/useGameSocket"; // a custom hook
import { useNavigate } from "react-router-dom";

type BattleState = "LOADING" | "MATCHED" | "NOMATCH";

const BattleLoader: React.FC = () => {
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchesDTO | null>(null);
  const [battleState, setBattleState] = useState<BattleState>("LOADING");

  const { connect, finish, disconnect, quit, client } = useGameSocket({ //get functions for the socket connections to then prop drill into battlepage
    onMatchReceived: (matchData: MatchesDTO) => {
      setMatch(matchData);
      setBattleState("MATCHED");
    },
  });

  useEffect(() => {
    connect(); // initiate socket connection on mount 
  }, []);

  const onFinish = () => {
    if (match) finish(match.matchId); // prop drill onfinish to battlepage
  };

  const onQuit = () =>{
    if(match) quit(match.matchId);
    disconnect();
    setBattleState("LOADING");
    navigate("/")
  }

  if (battleState === "LOADING") {
    return <div>Connecting to opponent...</div>;
  }
  if (battleState === "MATCHED" && match) {
    return (
      <div style={{ flex: 1, height: "100vh", width: "100vw"}}>
      <BattlePage
        question={match.question}
        onFinish={onFinish}
        onQuit={onQuit}
        client={client}
        matchId={match.matchId}
      />
    </div>
    );
  }
  if (battleState === "NOMATCH") {
    return <div>No match found</div>;
  }
};

export default BattleLoader;
