import Editor from "@monaco-editor/react";
import { runCode } from "../../../api";
import { useState } from "react";
import Results from "./testCases";
import Timer from "./hooks/timer";
import "./style.css";
import type { testCase } from "./testCases";

interface BattlePageProps {
  question: any;
}

const BattlePage: React.FC<BattlePageProps> = ({ question }) => {
  if(!question) return <div>loading...</div>
  const [code, setCode] = useState(question.starterCode); // initialize from prop
  const [description] = useState(question.description);
  const [example] = useState(question.example);
  const [questionId] = useState(question.id); // immutable
  const [testCases, setTestCases] = useState<testCase[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [username, setUsername] = useState(() => {
    const usr = localStorage.getItem("user");
    return usr ? JSON.parse(usr).username : "";
  });

  // Handle submit
  const handleSubmit = async () => {
    try {
      const res = await runCode(questionId, code);
      console.log(JSON.stringify(res));
      setTestCases(res.results);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const timeOut = () => {
    setTimeUp(true);
    handleSubmit();
  };

  return (
    <div className="battlepage">
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
    </div>
  );
};

export default BattlePage;