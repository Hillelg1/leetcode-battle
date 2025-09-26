import Editor from "@monaco-editor/react";
import { runCode } from "../../../api";
import { useState, useEffect } from "react";
import Results from "./testCases";
import Timer from "./hooks/timer";
import "./style.css";
import type { testCase } from "./testCases";
import subscribe from "./hooks/subscribeToMatch";
import { SplitPane } from "@rexxars/react-split-pane";

interface BattlePageProps {
  question: any;
  onFinish?: () => void;
  onQuit?: () => void;
  client: any;
  matchId: string;
}

const BattlePage: React.FC<BattlePageProps> = ({ question, onFinish, onQuit, client, matchId }) => {
  if (!question) return <div>Question not found...</div>;
  const [code, setCode] = useState(question.starterCode);
  const [description] = useState(question.description);
  const [example] = useState(question.example);
  const [questionId] = useState(question.id);
  const [testCases, setTestCases] = useState<testCase[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [passedAll, setPassedAll] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}").username;
  const [battleState, setBattleState] = useState("BATTLE");

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
    if (passedAll && onFinish) {
      onFinish();
    }
  }, [passedAll]);

  return (
    <div className="battlepage">
      <div className="header">
        <h2>Battle Mode</h2>
        <button onClick={onQuit}>Quit</button>
        <button onClick={handleSubmit} disabled={timeUp}>Submit</button>
        {questionId && <Timer initialSeconds={600} onComplete={timeOut} />}
      </div>

      {/* Outer split: top (editor+desc), bottom (testcases) */}
      <SplitPane split="horizontal" minSize={400} style={{position: "relative"}}>
        {/* Top: editor + description */}
        <SplitPane split="vertical" minSize={600}>
          <div className="editor">
            <Editor
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{ readOnly: timeUp }}
              theme="vs-dark"
            />
          </div>
          <div className="description">
            <div>{description}</div>
            <div>{example}</div>
          </div>
        </SplitPane>

        {/* Bottom: testcases */}
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