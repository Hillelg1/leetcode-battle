import Editor from '@monaco-editor/react';
import {fetchQuestion, runCode} from "../../api";
import { useState,useEffect } from 'react';

import "./style.css"
export default function BattlePage() {
  const [code,setCode] = useState("default");
  const [description,setDescription] = useState("default");
  const [example, setExample] = useState("default");
  const [questionId, setQuestionId] = useState(0);
  
   useEffect(() => {
    const getQuestion = async() => {
    try{
      const res = await fetchQuestion()
      console.log(res);
      setCode(res.starterCode);
      setDescription(res.description);
      setQuestionId(res.id);
     
      if(res.example) setExample(res.example);
    }
    catch(e) {
      console.log(e);
    }
  }
    getQuestion()
  },[])

  const handleSubmit = async() => {
    try{
      const res = await runCode(questionId, code);
      console.log(res);
    }
    catch(err){
      console.log(err);
    }
  }
  
  return (
    <div className = "battlepage">
      <div className = "editor">
     <Editor  defaultLanguage="javascript" value = {code} onChange={(value) => setCode(value || "")}/> 
      </div>
      <div className="description">
        {description}
        {example}
      </div>
      <div className = 'buttonContainer'>
          <button onClick = {handleSubmit}>
            Submit 
          </button>
      </div>
    </div>
  );
}
