import { useEffect, useMemo, useState } from "react";
import type { MatchHistoryDTO, MatchHistory } from "../../dto/MatchHistory.ts";
import "./style.css";

type Tab = "wins" | "loses";

const MatchHistoryPage: React.FC = () => {
    const username = JSON.parse(localStorage.getItem("user") || "{}").username;

    const [history, setHistory] = useState<MatchHistoryDTO | null>(null);
    const [tab, setTab] = useState<Tab>("wins");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        fetch(`/api/match-history/${username}`)
            .then((res) => res.json())
            .then((data: MatchHistoryDTO) => setHistory(data))
            .finally(() => setLoading(false));
    }, [username]);

    const wins: MatchHistory[] = useMemo(() => {
        const raw = history?.wins ?? [];
        return raw.filter((m): m is MatchHistory => m != null);
    }, [history]);

    const loses: MatchHistory[] = useMemo(() => {
        const raw = history?.loses ?? [];
        return raw.filter((m): m is MatchHistory => m != null);
    }, [history]);

    const matchesToShow = tab === "wins" ? wins : loses;

    if (loading) return <p>Loading match history...</p>;

    // If the DTO didn't come back for some reason
    if (!history) {
        return <p>No match history found.</p>;
    }

    // If totalMatches says none (or lists are empty)
    if ((history.totalMatches ?? 0) === 0) {
        return <p>No matches played yet.</p>;
    }

    return (
        <div className="match-history-page">
            <h2>Match History</h2>

            {/* Summary + Toggle */}
            <div className="match-history-controls">
                <div className="match-history-summary">
                    <span data-label="TOTAL">{history.totalMatches}</span>
                    <span data-label="WINS">{history.winCount}</span>
                    <span data-label="LOSSES">{history.lossCount}</span>
                </div>

                <div className="match-history-toggle">
                    <button
                        className={`toggle-btn ${tab === "wins" ? "active" : ""}`}
                        onClick={() => setTab("wins")}
                    >
                        Wins
                    </button>
                    <button
                        className={`toggle-btn ${tab === "loses" ? "active" : ""}`}
                        onClick={() => setTab("loses")}
                    >
                        Losses
                    </button>
                </div>
            </div>

            {/* Empty state per-tab */}
            {matchesToShow.length === 0 ? (
                <p>{tab === "wins" ? "No wins yet." : "No losses yet."}</p>
            ) : (
                <div className="match-list">
                    {matchesToShow.map((match) => {
                        const isP1 = match.p1 === username;
                        const opponent = isP1 ? match.p2 : match.p1;

                        const mySolved = isP1 ? match.p1TestcasesSolved : match.p2TestcasesSolved;
                        const myTime = isP1 ? match.p1FinishedAt : match.p2FinishedAt;

                        // Keep your original truth logic (works even if backend categorization changes)
                        const result =
                            match.won === "Draw" ? "Draw" : match.won === username ? "Win" : "Loss";

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
                                    <span className={`result ${result.toLowerCase()}`}>{result}</span>
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
            )}
        </div>
    );
};

export default MatchHistoryPage;