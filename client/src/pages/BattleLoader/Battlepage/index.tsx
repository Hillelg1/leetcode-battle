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
}

const BattlePage: React.FC<BattlePageProps> = ({ onFinish, onQuit, client, match }) => {
    if (!match.question) return <div>Question not found...</div>;

    const user = JSON.parse(localStorage.getItem("user") || "{}").username;

    // If match can change, useMemo would be cleaner; keeping your style for minimal diff
    const [question] = useState<any>(match.question);
    const [code, setCode] = useState<string>(question.starterCode);

    const [description] = useState(question.description);
    const [example] = useState(question.example);

    const [matchId] = useState(match.matchId);
    const [questionId] = useState(question.id);

    const [p1] = useState(match.p1);
    const [p2] = useState(match.p2);

    // make sure your DTO field is actually startedAt (epoch seconds). If it's startTime, keep that.
    const [startedAt] = useState<number>(
        // @ts-expect-error support both names during transition
        (match.startedAt ?? match.startTime) as number
    );

    const [testCases, setTestCases] = useState<testCase[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [passedAll, setPassedAll] = useState(false);
    const [battleState, setBattleState] = useState("BATTLE");

    const saveTimeoutRef = useRef<number | null>(null);

    const handleSubmit = async () => {
        try {
            const res = await runCode(questionId, code);
            setPassedAll(res.passedAll);
            setTestCases(res.results);
            setSubmitted(true);
        } catch (err) {
            console.log(err);
        }
    };

    const storeCode = (value?: string) => {
        const nextCode = value ?? "";
        setCode(nextCode);

        // Only store for the current user (optional gate; remove if you store for both)
        // If you want to store for both, delete this entire if.
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
        const subscription = subscribe(user, client, matchId, setBattleState);
        return () => subscription.unsubscribe();
    }, [client, matchId, user]);

    useEffect(() => {
        if (battleState === "LOST") alert("opponent solved all test cases");
        else if (battleState === "WON") alert("Solved all testcases!");
        else if (battleState === "QUIT") alert("opponent quit!");
    }, [battleState]);

    const timeOut = () => {
        console.log("timed out");
        setTimeUp(true);
        handleSubmit();
    };

    useEffect(() => {
        if (passedAll && onFinish) onFinish();
    }, [passedAll, onFinish]);

    const determineStarterCode = () => {
        console.log(match.p2Code);
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

                {questionId && Number.isFinite(startedAt) && (
                    <Timer initialSeconds={600} onComplete={timeOut} startTime={startedAt} />
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