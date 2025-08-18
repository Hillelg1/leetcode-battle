import Editor from '@monaco-editor/react';
import {fetchQuestion} from "../../api";
import { useState,useEffect } from 'react';

import "./style.css"
export default function BattlePage() {
  const [starterText,setStarterText] = useState("default");
  const [description,setDescription] = useState("default");
  const [example, setExample] = useState("default");
   useEffect(() => {
    const getQuestion = async() => {
    try{
      const res = await fetchQuestion()
      console.log(res);
      setStarterText(res.starterCode);
      setDescription(res.description);
      if(res.example) setExample(res.example);
    }
    catch(e) {
      console.log(e);
    }
  }
    getQuestion()
  },[])
  
  return (
    <div className = "battlepage">
      <div className = "editor">
     <Editor  defaultLanguage="javascript" value = {starterText} onChange={(value) => setStarterText(value || "")}/> 
      </div>
      <div className="description">
        {description}
        {example}
      </div>
    </div>
  );
}
