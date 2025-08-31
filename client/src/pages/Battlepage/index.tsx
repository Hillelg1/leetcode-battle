import Editor from '@monaco-editor/react';
import {fetchQuestion, runCode} from "../../api";
import { useState,useEffect } from 'react';
import Results from './testCases';
import Timer from "./hooks/timer";
import GameSocket from '../../webSocket';
import "./style.css"
import type { testCase } from './testCases';

export default function BattlePage() {
  const [code,setCode] = useState("default");  //variable for users code
  const [description,setDescription] = useState("default"); //the description of the problem that we get 
  const [example, setExample] = useState("default"); //examples of the function working 
  const [questionId, setQuestionId] = useState(0); // for fetching the testcases based on teh questionID
  const [testCases, setTestCases] = useState<testCase[]>([]); // typed array
  const [submitted, setSubmitted] = useState(false); // wether or not to put testcases component 
  const [timeUp, setTimeUp] = useState(false)

// on page loading 
   useEffect(() => {
    const getQuestion = async() => {
    try{
      const res = await fetchQuestion() //imported
      console.log(res);
      setCode(res.starterCode);
      setDescription(res.description);
      setQuestionId(res.id);
      setExample(res.example);
    }
    catch(e) {
      console.log(e);
    }
  }
    getQuestion()
  },[])

//when the user hits submit with the code theyve written 
  const handleSubmit = async() => {
    try{
      const res = await runCode(questionId, code);
      console.log(JSON.stringify(res));
      setTestCases(res.results);
      setSubmitted(true);
    }
    catch(err){
      console.log(err);
    }
  }

  const timeOut = () =>{
    setTimeUp(true);
    handleSubmit();
  }
  
    return (
    <div className="battlepage"> {/* for the whole page */}
    <div className="header">
    <h2>Battle Mode</h2>
    {questionId !== 0 && (
      <Timer initialSeconds={1000} onComplete={timeOut} /> 
    )}
  </div>
      <div className="main-content">{/* align editor and descirption side by side */}
        <div className="editor">
          <Editor
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")} //this is building out the code
            options = {{readOnly: timeUp}}
            theme='vs-dark'
          />
        </div>
        <div className="description"> 
          <div>{description}</div>
          <div>{example}</div>
        </div>
      </div>
      <div className="buttonContainer">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {!submitted && (
        <div className="testcases">waiting for submition</div>
      )}
      {submitted && (
        <div>
        <div>testCases</div>
        <Results results = {testCases} />
        </div>
      )}
      <GameSocket />
    </div>
  );
}
