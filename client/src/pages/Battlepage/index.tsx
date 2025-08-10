import Editor from '@monaco-editor/react';
import {fetchQuestion} from "../../api";
import { useState,useEffect } from 'react';

export default function BattlePage() {
  const [result,setResult] = useState("default");
   useEffect(() => {
    const getQuestion = async() => {
    try{
      const res = await fetchQuestion()
      setResult(res)
    }
    catch(e) {
      console.log(e);
    }
  }
    getQuestion()
  },[])
  
  return (
    <div>
     <Editor height="90vh" defaultLanguage="javascript" value = {result} onChange={(value) => setResult(value || "")}/> 
    </div>
  );
}
