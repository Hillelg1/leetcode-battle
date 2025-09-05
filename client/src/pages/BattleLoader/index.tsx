import { useState, useEffect } from "react";
import BattlePage from "./Battlepage";
import type { MatchesDTO } from "../../dto/MatchesDTO"; // define this type
import { useGameSocket } from "./hooks/useGameSocket"; // a custom hook

type BattleState = "LOADING" | "MATCHED" | "NOMATCH";

const BattleLoader: React.FC = () => {
  const [match, setMatch] = useState<MatchesDTO | null>(null);
  const [battleState, setBattleState] = useState<BattleState>("LOADING");
  // Custom hook handles socket connection and emits match
  const { connect, finish, client } = useGameSocket({
    onMatchReceived: (matchData: MatchesDTO) => {
      setMatch(matchData);
      setBattleState("MATCHED");
    },
  });

  useEffect(() => {
    connect(); // initiate socket connection on mount
  }, []);

  const onFinish = () => {
    if (match) finish(match.matchId);
  };

  if (battleState === "LOADING") {
    return <div>Connecting to opponent...</div>;
  }
  if (battleState === "MATCHED" && match) {
    return (
      <BattlePage
        question={match.question}
        onFinish={onFinish}
        client={client}
        matchId={match.matchId}
      />
    );
  }
  if (battleState === "NOMATCH") {
    return <div>No match found</div>;
  }
};

export default BattleLoader;
