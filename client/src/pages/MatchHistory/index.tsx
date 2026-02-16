import { useEffect, useMemo, useState } from "react";
import type { MatchHistoryDTO, MatchHistory, MatchHistorySingleDTO } from "../../dto/MatchHistory.ts";
import {fetchMatchFullDetails} from "../../api.ts";
import "./style.css";

type Tab = "wins" | "loses" | "draws";
const MatchHistoryPage: React.FC = () => {
    const username = JSON.parse(localStorage.getItem("user") || "{}").username;

    const [history, setHistory] = useState<MatchHistoryDTO | null>(null);
    const [tab, setTab] = useState<Tab>("wins");
    const [loading, setLoading] = useState(true);

    // NEW: modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<MatchHistory | null>(null);
    const [fullDetails, setFullDetails] = useState<MatchHistorySingleDTO | null>(null);

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

    const draws: MatchHistory[] = useMemo(() => {
        const raw = history?.draws ?? [];
        return raw.filter((m): m is MatchHistory => m != null);
    }, [history]);

    const matchesToShow =
        tab === "wins" ? wins :
            tab === "loses" ? loses :
                draws;

    async function openMatchModal(match: MatchHistory) {
        setSelectedMatch(match);
        setIsModalOpen(true);

        setFullDetails(null);
        setDetailsError(null);
        setDetailsLoading(true);

        try {
            const dto = await fetchMatchFullDetails(match.matchId, match.questionTitle);
            setFullDetails(dto);
        } catch (e: any) {
            setDetailsError(e?.message ?? "Failed to load match details");
        } finally {
            setDetailsLoading(false);
        }
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedMatch(null);
        setFullDetails(null);
        setDetailsError(null);
    }

    if (loading) return <p>Loading match history...</p>;

    if (!history) return <p>No match history found.</p>;

    if ((history.totalMatches ?? 0) === 0) return <p>No matches played yet.</p>;

    return (
        <div className="match-history-page">
            <h2>Match History</h2>

            {/* Summary + Toggle */}
            <div className="match-history-controls">
                <div className="match-history-summary">
                    <span data-label="TOTAL">{history.totalMatches}</span>
                    <span data-label="WINS">{history.winCount}</span>
                    <span data-label="LOSSES">{history.lossCount}</span>
                    <span data-label="DRAWS">{history.drawCount}</span>
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
                    <button
                        className={`toggle-btn ${tab === "draws" ? "active" : ""}`}
                        onClick={() => setTab("draws")}
                    >
                        Draws
                    </button>
                </div>
            </div>

            {/* Empty state per-tab */}
            {matchesToShow.length === 0 ? (
                <p>
                    {tab === "wins"
                        ? "No wins yet."
                        : tab === "loses"
                            ? "No losses yet."
                            : "No draws yet."}
                </p>
            ) : (
                <div className="match-list">
                    {matchesToShow.map((match) => {
                        const isP1 = match.p1 === username;
                        const opponent = isP1 ? match.p2 : match.p1;

                        const mySolved = isP1 ? match.p1TestcasesSolved : match.p2TestcasesSolved;
                        const myTime = isP1 ? match.p1FinishedAt : match.p2FinishedAt;

                        const result =
                            match.won === "Draw" ? "Draw" : match.won === username ? "Win" : "Loss";

                        return (
                            <div
                                key={match.matchId}
                                className={`match-card ${result.toLowerCase()}`}
                                onClick={() => openMatchModal(match)} // NEW
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

            {/* NEW: Modal */}
            {isModalOpen && (
                <div className="mh-modal-backdrop" onClick={closeModal}>
                    <div className="mh-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mh-modal-header">
                            <div className="mh-modal-title">
                                {selectedMatch?.questionTitle ?? "Match details"}
                            </div>
                            <button className="mh-modal-close" onClick={closeModal}>
                                ✕
                            </button>
                        </div>

                        {detailsLoading && <p>Loading details...</p>}
                        {detailsError && <p className="mh-error">{detailsError}</p>}

                        {fullDetails && (
                            <div className="mh-modal-content">
                                <div className="mh-row">
                                    <b>Winner:</b> {fullDetails.winner}
                                </div>
                                <div className="mh-row">
                                    <b>Match ID:</b> {fullDetails.matchId}
                                </div>

                                {/* Code panes */}
                                <div className="mh-code-grid">
                                    <div className="mh-code-pane">
                                        <div className="mh-code-title">P1 Code</div>
                                        <pre className="mh-code">{fullDetails.p1Code}</pre>
                                    </div>
                                    <div className="mh-code-pane">
                                        <div className="mh-code-title">P2 Code</div>
                                        <pre className="mh-code">{fullDetails.p2Code}</pre>
                                    </div>
                                </div>

                                {/* Solution link */}
                                {fullDetails.solution ? (
                                    <a className="mh-solution-link" href={fullDetails.solution} target="_blank" rel="noreferrer">
                                        Watch solution
                                    </a>
                                ) : (
                                    <p style={{ opacity: 0.7 }}>No solution link available for this problem yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchHistoryPage;