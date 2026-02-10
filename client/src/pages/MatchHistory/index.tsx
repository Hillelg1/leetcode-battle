import { useEffect, useState } from "react";
import type {MatchHistory} from "../../dto/MatchHistory.ts";
import "./style.css";


const MatchHistoryPage: React.FC = () => {
    const username = JSON.parse(localStorage.getItem("user") || "{}").username;
    const [matches, setMatches] = useState<MatchHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("username", username);
        fetch(`/api/match-history/${username}`)
            .then(res => res.json())
            .then(data => setMatches(data))
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) return <p>Loading match history...</p>;

    if (matches.length === 0) {
        return <p>No matches played yet.</p>;
    }

    return (
        <div className="match-history-page">
            <h2>Match History</h2>

            <div className="match-list">
                {matches.map(match => {
                    const isP1 = match.p1 === username;
                    const opponent = isP1 ? match.p2 : match.p1;

                    const mySolved = isP1
                        ? match.p1TestcasesSolved
                        : match.p2TestcasesSolved;

                    const myTime = isP1
                        ? match.p1FinishedAt
                        : match.p2FinishedAt;

                    const result =
                        match.won === "Draw"
                            ? "Draw"
                            : match.won === username
                                ? "Win"
                                : "Loss";

                    return (
                        <div
                            key={match.matchId}
                            className={`match-card ${result.toLowerCase()}`}
                            onClick={() => {
                                console.log("Clicked match", match.matchId);
                                // later: navigate(`/match-history/${match.matchId}`)
                            }}
                        >
                            <div className="match-header">
                                <span className="question">{match.questionTitle}</span>
                                <span className={`result ${result.toLowerCase()}`}>
                                    {result}
                                </span>
                            </div>

                            <div className="match-body">
                                <div className="player-row you">
                                    <span className="player-label">You</span>
                                    <span className="player-stats">
                                    <span>Testcases: {mySolved}</span>
                                    <span>Time: {myTime}</span>
                                    </span>
                                </div>

                                <div className="player-row opponent">
                                    <span className="player-label">{opponent}</span>
                                    <span className="player-stats">
            <span>
                Testcases: {isP1 ? match.p2TestcasesSolved : match.p1TestcasesSolved}
            </span>
            <span>
                Time: {isP1 ? match.p2FinishedAt : match.p1FinishedAt}
            </span>
        </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MatchHistoryPage;