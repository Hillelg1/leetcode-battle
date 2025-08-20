export type testCase = {
    'case': number;
    'input': {
        'arr': any[],
        'target': number
    };
    'expected': [];
    'output': [];
    'passed': boolean;
}

export default function Results({results}: {results: testCase[]}){
    if(!results || results.length==0)return (
        <div>no test cases available atm</div>
    )
  const half = Math.ceil(results.length / 2);
  const firstHalf = results.slice(0, half);
  const secondHalf = results.slice(half);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <ul className="space-y-2">
        {firstHalf.map((tc, idx) => (
          <li
            key={idx}
            className={`p-2 rounded ${
              tc.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p><strong>Input:</strong> {`arr = ${tc.input.arr} target = ${tc.input.target}`}</p>
            <p><strong>Expected:</strong> {tc.expected}</p>
            <p><strong>Output:</strong> {tc.output}</p>
          </li>
        ))}
      </ul>

      <ul className="space-y-2">
        {secondHalf.map((tc, idx) => (
          <li
            key={idx + half}
            className={`p-2 rounded ${
              tc.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
           <p><strong>Input:</strong> {`arr = ${tc.input.arr} target = ${tc.input.target}`}</p>
            <p><strong>Expected:</strong> {tc.expected}</p>
            <p><strong>Output:</strong> {tc.output}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}