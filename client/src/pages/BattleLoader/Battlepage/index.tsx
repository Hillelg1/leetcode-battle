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

    const user = JSON.parse(localStorage.getItem("user") || "{}").username;
    const question: any = match.question;
    const description = question.description;
    const example = question.example;
    const matchId = match.matchId;
    const questionId = question.id;
    const p1= match.p1;
    const p2 = match.p2;
    const startedAt = Number(match.startTime)

    const [code, setCode] = useState<string>(question.starterCode);
    const [testCases, setTestCases] = useState<testCase[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [passedAll, setPassedAll] = useState(false);
    const [battleState, setBattleState] = useState("BATTLE");
    const [won, setWon] = useState(false);

    const isLocked = timeUp || passedAll;

    const saveTimeoutRef = useRef<number | null>(null);

    const handleSubmit = async () => {
        try {
            const res = await runCode(questionId, code);
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

    return (
        <div className="battlepage">
            <div className="header">
                <h2>Battle Mode</h2>
                <button onClick={onQuit}>Quit</button>
                <button onClick={handleSubmit} disabled={timeUp}>
                    Submit
                </button>

                {questionId && (
                    <Timer initialSeconds={600} onComplete={timeOut} startTime={startedAt} won = {won} />
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
        </div>
    );
};

export default BattlePage;