import { useState, useEffect } from "react";
import BattlePage from "./Battlepage";
import type { MatchesDTO } from "../../dto/MatchesDTO"; // define this type

import { useGameSocket } from "./hooks/useGameSocket"; // a custom hook we'll create

const BattleLoader: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [match, setMatch] = useState<MatchesDTO | null>(null);

  // Custom hook handles socket connection and emits match
  const { connect, finish, client } = useGameSocket({
    onMatchReceived: (matchData: MatchesDTO) => {
      setMatch(matchData);
      setLoaded(true);
    },
  });

  useEffect(() => {
    connect(); // initiate socket connection on mount
  }, []);

    const onFinish = () => {
        if (match) finish(match.matchId);
    }

  if (!loaded) {
    return <div>Connecting to opponent...</div>;
  }

  return match ? (
    <BattlePage question={match.question} onFinish={onFinish} client = {client} matchId={match.matchId}/>
  ) : (
    <div>No match found</div>
  );
};

export default BattleLoader;