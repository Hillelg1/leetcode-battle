import Editor from "@monaco-editor/react";
import { runCode } from "../../../api";
import { useState, useEffect } from "react";
import Results from "./testCases";
import Timer from "./hooks/timer";
import "./style.css";
import type { testCase } from "./testCases";

//import type {Client} from "stompjs"; use this for typing the client in props


interface BattlePageProps {
  question: any;
  onFinish?: ()=> void;
  client: any;
  matchId: String;
}

const BattlePage: React.FC<BattlePageProps> = ({ question, onFinish, client, matchId }) => {
  if(!question) return <div>loading...</div>
  const [code, setCode] = useState(question.starterCode); // initialize from prop
  const [description] = useState(question.description);
  const [example] = useState(question.example);
  const [questionId] = useState(question.id); // immutable
  const [testCases, setTestCases] = useState<testCase[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [passedAll,setPassedAll] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}").username;
  const [won, setWon] = useState<null|boolean>(null);
  // Handle submit
  const handleSubmit = async () => {
    try {
      const res = await runCode(questionId, code);
      setPassedAll(res.passedAll)
      setTestCases(res.results);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  if (!client || !matchId) return;
  const subscription = client.subscribe(`/topic/match/${matchId}`, (msg: any) => {
    console.log("subscribed");
    if (msg.body) {
      const finishedMatch = JSON.parse(msg.body);
      if (finishedMatch.type === "FINISH" && finishedMatch.sender !== user) {
        setWon(false);
      } else if (finishedMatch.type === "FINISH") {
        setWon(true);
      }
    }
  });
  return () => subscription.unsubscribe();
}, [client, matchId, user]);

  const timeOut = () => {
    setTimeUp(true);
    handleSubmit();
  };

  useEffect(() => {
    if(passedAll && onFinish){
        console.log('finishing battlepage')
        onFinish()
      }
      else console.log("ERROR");
  },[passedAll]);

  return (
  <div className="battlepage">
    {(won == true) && (
      <div className="victory-screen">
        <h2>All test cases passed!</h2>
        <p>Waiting for opponent...</p>
      </div>
    )}
    { 
    (won == null) && (
      <>
        <div className="header">
          <h2>Battle Mode</h2>
          {questionId && <Timer initialSeconds={600} onComplete={timeOut} />}
        </div>
        <div className="main-content">
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
        </div>
        <div className="buttonContainer">
          <button onClick={handleSubmit} disabled={timeUp}>
            Submit
          </button>
        </div>
        {!submitted && <div className="testcases">Waiting for submission...</div>}
        {submitted && (
          <div>
            <div>Test Cases</div>
            <Results results={testCases} />
          </div>
        )}
      </>
    )}
    {(won == false) &&(
      <>
      <div className="loser-page">
        <h2>ooooooh you lost</h2>
      </div>
      </>
    )}
  </div>
);
};

export default BattlePage;