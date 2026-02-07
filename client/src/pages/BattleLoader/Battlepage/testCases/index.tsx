import './style.css'


export type testCase = {
    'case': number;
    'input': {
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
    <div className="testCaseContainer">
      <ul className="list-container">
        {firstHalf.map((tc, idx) => (
          <li
            key={idx}
            className={`testCase list-group-item d-flex justify-content-between ${
            tc.passed ? 'list-group-item-success' : 'list-group-item-danger'
      }`}
          >
            <p><strong>{idx}</strong></p>
            <p><strong>Input:</strong> {`${JSON.stringify(tc.input)}`}</p>
            <p><strong>Expected:</strong> {JSON.stringify(tc.expected)}</p>
            <p><strong>Output:</strong> {JSON.stringify(tc.output)}</p>
          </li>
        ))}
      </ul>

      <ul className="list-container">
        {secondHalf.map((tc, idx) => (
          <li
            key={idx + half}
            className={`testCase list-group-item d-flex justify-content-between ${
        tc.passed ? 'list-group-item-success' : 'list-group-item-danger'
      }`}
          >
          <p><strong>{idx}</strong></p>
           <p className={"tcInput"}><strong>Input:</strong> {`${JSON.stringify(tc.input)}`}</p>
            <p><strong>Expected:</strong> {JSON.stringify(tc.expected)}</p>
            <p><strong>Output:</strong> {JSON.stringify(tc.output)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}