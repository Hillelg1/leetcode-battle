import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type {MatchHistoryDTO} from "../../dto/MatchHistory.ts";
import './style.css'
type StoredUser = { username: string };

export default function HomePage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<MatchHistoryDTO | null>(null);

    const user = useMemo<StoredUser | null>(() => {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        try {
            return JSON.parse(raw) as StoredUser;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        fetch(`/api/match-history/${encodeURIComponent(user.username)}`)
            .then((r) => r.json())
            .then((dto: MatchHistoryDTO) => setHistory(dto))
            .catch(() => setHistory(null));
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="home-page">
            {/* Header */}
            <div className="home-header">
                <div>
                    <h1 className="home-title">Home</h1>
                    <p className="home-subtitle">
                        Welcome back, <span className="home-username">{user.username}</span>
                    </p>
                </div>
            </div>

            {/* Centered CTA under welcome */}
            <div className="home-cta-center">
                <button className="home-btn" onClick={() => navigate("/battle")}>
                    Start Battle
                </button>
                <button className="home-btn secondary" onClick={() => navigate("/history")}>
                    Match History
                </button>
            </div>

            <div className="home-grid">
                {/* Left column */}
                <div className="home-card">
                    <h3>How it works</h3>
                    <div className="how-lines">
                        <div className="how-line">
                            Click <b>Start Battle</b> to enter matchmaking.
                        </div>
                        <div className="how-line">
                            Solve the problem and submit your solution.
                        </div>
                        <div className="how-line">
                            Whoever solves the most testcases wins; if tied, whoever submitted less times wins.
                        </div>
                        <div className = "how-line">
                            If tied on submit count, whoever had fastest time wins.
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="home-card">
                    <h3>Your stats</h3>
                    {!history ? (
                        <p>Loading stats…</p>
                    ) : (
                        <div className="home-stats">
                            <div className="stat">
                                <div className="stat-label">TOTAL</div>
                                <div className="stat-value">{history.totalMatches}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-label">WINS</div>
                                <div className="stat-value">{history.winCount}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-label">LOSSES</div>
                                <div className="stat-value">{history.lossCount}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-label">DRAWS</div>
                                <div className="stat-value">{history.drawCount}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Full width rules */}
                <div className="home-card rules" style={{ gridColumn: "1 / -1" }}>
                    <details>
                        <summary>Rules & FAQ</summary>
                        <ul>
                            <li><b>Win condition:</b> whoever solves the most testcases wins.</li>
                            <li><b>Tiebreaker:</b> if both solve the same number of testcases, whoever solved it first wins.</li>
                            <li><b>Draw:</b> if both solve the same number of testcases and finish at the same time (or neither finishes), it’s a draw.</li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    );
}