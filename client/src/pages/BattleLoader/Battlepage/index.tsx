import Editor from "@monaco-editor/react";
import { runCode } from "../../../api";
import { useEffect, useRef, useState } from "react";
import Results from "./testCases";
import Timer from "./hooks/timer";
import "./style.css";
import type { testCase } from "./testCases";
import subscribe from "./hooks/subscribeToMatch";
import { SplitPane } from "@rexxars/react-split-pane";
import type { MatchesDTO } from "../../../dto/MatchesDTO.ts";
import { useNavigate } from "react-router-dom";

interface BattlePageProps {
    match: MatchesDTO;
    onFinish?: () => void;
    onQuit?: () => void;
    client: any;
    onTimeOut?: () => void;
    disconnect: () => void;
}

const BattlePage: React.FC<BattlePageProps> = ({ onFinish, onQuit, client, onTimeOut, match, disconnect}) => {
    if (!match.question) return <div>Question not found...</div>;

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}").username;
    const question: any = match.question;
    const description = question.description;
    const example = question.example;
    const matchId = match.matchId;
    const questionId = question.id;
    const p1= match.p1;
    const p2 = match.p2;
    const startedAt = Number(match.startTime)
    const isP1 = user === p1;

    const [code, setCode] = useState<string>(question.starterCode);
    const [testCases, setTestCases] = useState<testCase[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [passedAll, setPassedAll] = useState(false);
    const [battleState, setBattleState] = useState("BATTLE");
    const [won, setWon] = useState(false);
    const [submissionCount, setSubmissionCount] = useState(isP1 ? match.p1SubmissionCount : match.p2SubmissionCount);
    const [showQuitSummary, setShowQuitSummary] = useState(false);

    const isLocked = timeUp || passedAll;
    const opponent = isP1 ? p2 : p1;
    const opponentSubmissionCount = isP1 ? match.p2SubmissionCount : match.p1SubmissionCount;
    const localPassedCount = testCases.filter((tc) => tc.passed).length;
    const elapsedSeconds = Math.max(0, Math.floor(Date.now() / 1000) - startedAt);
    const elapsedDisplay = `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

    const saveTimeoutRef = useRef<number | null>(null);

    const handleSubmit = async () => {
        try {
            const res = await runCode(questionId, code);
            setSubmissionCount((c) => c + 1);
            setPassedAll(res.passedAll);
            setTestCases(res.results);
            setSubmitted(true);
            if (res.passedAll) onFinish?.();
        } catch (err) {
            console.log(err);
        }
    };

    const storeCode = (value?: string) => {
        if(isLocked) return;

        const nextCode = value ?? "";
        setCode(nextCode);

        if (!user) return;

        // Debounce saves to avoid spamming backend on every keystroke
        if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = window.setTimeout(async () => {
            try {
                const res = await fetch("/api/code/store", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userName: user,
                        code: nextCode
                    }),
                });

                if (!res.ok) {
                    const msg = await res.text();
                    console.error("Failed to store code:", res.status, msg);
                }
            } catch (err) {
                console.error("Error storing code:", err);
            }
        }, 500);
    };

    useEffect(() => {
        // cleanup debounce timer on unmount
        return () => {
            if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!client || !matchId) return;
        const subscription = subscribe(user, client, matchId, setBattleState, disconnect);
        return () => subscription.unsubscribe();
    }, [client, matchId, user]);

    useEffect(() => {
        if (battleState === "LOST") alert("opponent solved all test cases");
        if (battleState == "OPTIMEOUT") alert("Opponent timed out!");
        if (battleState === "WON") alert("Solved all testcases!");
        if (battleState === "QUIT") alert("opponent quit!");
        if (battleState === "TIMEOUT") alert("Time is up!");

    }, [battleState]);

    const timeOut = () => {
        console.log("timed out");
        setTimeUp(true);
        handleSubmit();
        if (!passedAll && onTimeOut)onTimeOut();
    };

    useEffect(() => {
        if ((passedAll||timeUp) && onFinish) {
            onFinish();
            setTimeUp(true);
        }
        if (passedAll)setWon(true);
    }, [passedAll, onFinish, timeUp]);

    const determineStarterCode = () => {
        if (p1 === user && match.p1Code) setCode(match.p1Code);
        else if (p2 === user && match.p2Code) setCode(match.p2Code);
        else setCode(question.starterCode);

    };

    useEffect(() => {
        determineStarterCode();
    }, []);

    const openQuitSummary = () => {
        setShowQuitSummary(true);
    };

    const closeQuitSummary = () => {
        setShowQuitSummary(false);
    };

    const exitToHome = () => {
        onQuit?.();
        disconnect();
        navigate("/");
    };

    return (
        <div className="battlepage">
            <div className="header">
                <h2>Battle Mode</h2>

                {/* NEW: submission count */}
                <span className="stat-pill">Submissions: {submissionCount}</span>

                <button onClick={openQuitSummary}>Quit</button>

                <button onClick={handleSubmit} disabled={timeUp}>
                    Submit
                </button>

                {questionId && (
                    <Timer
                        initialSeconds={600}
                        onComplete={timeOut}
                        startTime={startedAt}
                        won={won}
                    />
                )}
            </div>

            <SplitPane split="horizontal" minSize={400} style={{ position: "relative" }}>
                <SplitPane split="vertical" minSize={600}>
                    <div className="editor">
                        <Editor
                            defaultLanguage="javascript"
                            value={code}
                            onChange={storeCode}
                            options={{ readOnly: timeUp }}
                            theme="vs-dark"
                        />
                    </div>

                    <div className="description">
                        <div>{description}</div>
                        <div>{example}</div>
                    </div>
                </SplitPane>

                <div className="testcases">
                    {!submitted && <div>Waiting for submission...</div>}
                    {submitted && (
                        <div>
                            <div>Test Cases</div>
                            <Results results={testCases} />
                        </div>
                    )}
                </div>
            </SplitPane>

            {showQuitSummary && (
                <div className="quit-overlay">
                    <div className="quit-modal">
                        <h3>Match Stats</h3>
                        <div className="quit-stats-grid">
                            <div className="quit-stat">
                                <span>Your submissions</span>
                                <strong>{submissionCount}</strong>
                            </div>
                            <div className="quit-stat">
                                <span>{opponent}'s submissions</span>
                                <strong>{opponentSubmissionCount}</strong>
                            </div>
                            <div className="quit-stat">
                                <span>Your latest pass count</span>
                                <strong>{localPassedCount}</strong>
                            </div>
                            <div className="quit-stat">
                                <span>Elapsed time</span>
                                <strong>{elapsedDisplay}</strong>
                            </div>
                        </div>
                        <div className="quit-actions">
                            <button onClick={closeQuitSummary}>Keep Playing</button>
                            <button onClick={exitToHome} className="danger">Exit to Home</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattlePage;
