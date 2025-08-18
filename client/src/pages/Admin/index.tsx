import { useState } from "react"
import { createTestCases } from "../../api";

export default function Admin(){
    const [input, setInput] = useState("");
    const [Id, setId] = useState(0);
    const [output,setOutput] = useState("")
    const handleSubmit = async(e: any) => {
        e.preventDefault();
        try{
        const res = await createTestCases(Id, input, output);
        alert(res) 
        }
        catch (err){
            alert(err)
        }
    }
    return (
        <form className="createQuestions" onSubmit={handleSubmit} >
           <label>
          Question ID:
          <input
            type="text"
            name="Id"
            onChange={(e: any) => setId(e.target.value)}
          />
        </label>
        <br />
        <label>
            Input: 
            <input 
            type = "text"
            name = "input"
            onChange={(e: any) => setInput(e.target.value)}
            />
        </label>
        <br />
        <label>
            Expected output:
            <input 
            type="text"
            name = "output"
            onChange={(e: any) => setOutput(e.target.value)}
             />
        </label>
        <br />
        <button type="submit"> 
            Submit
        </button>
        </form>
    )
}