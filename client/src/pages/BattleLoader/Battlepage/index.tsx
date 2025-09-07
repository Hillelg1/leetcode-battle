import Editor from "@monaco-editor/react";
import { runCode } from "../../../api";
import { useState, useEffect } from "react";
import Results from "./testCases";
import Timer from "./hooks/timer";
import "./style.css";
import type { testCase } from "./testCases";
//import type {Client} from "stompjs"; use this for typing the client in props
import subscribe from "./hooks/subscribeToMatch"


interface BattlePageProps {
  question: any;
  onFinish?: ()=> void;
  onQuit?: ()=>void;
  client: any;
  matchId: String;
}

const BattlePage: React.FC<BattlePageProps> = ({ question, onFinish, onQuit, client, matchId }) => {
  if(!question) return <div>loading...</div>
  const [code, setCode] = useState(question.starterCode); // initialize from prop
  const [description] = useState(question.description); 
  const [example] = useState(question.example);
  const [questionId] = useState(question.id); // immutable
  const [testCases, setTestCases] = useState<testCase[]>([]);
  const [submitted, setSubmitted] = useState(false); //display results 
  const [timeUp, setTimeUp] = useState(false); //automatically submit when time is up
  const [passedAll,setPassedAll] = useState(false); //if user passed all handle socket logic and alerts 
  const user = JSON.parse(localStorage.getItem("user") || "{}").username; 
  const [battleState,setBattleState] = useState("BATTLE"); //initial state
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
const subscription = subscribe(user, client, matchId, setBattleState);
  return () => subscription.unsubscribe();
}, [client, matchId, user]);

useEffect(()=> {
  if(battleState === "LOST")alert("opponent solved all test cases");
  else if(battleState === "WON") alert("Solved all testcases!");
  else if(battleState === "QUIT") alert("opponent quit!");
},[battleState])

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
      <>
        <div className="header">
          <h2>Battle Mode</h2>
          <button onClick={onQuit}>Quit</button>
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
  </div>
);
};

export default BattlePage;