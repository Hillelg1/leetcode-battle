const fs = require('fs');
const path = require('path');

// Read the test cases JSON
const testcasesPath = path.join(__dirname, 'testcases.json');
const testCases = JSON.parse(fs.readFileSync(testcasesPath, 'utf8'));

// Require the user-submitted code
// userCode.js must export { solution }
const { solution } = require('./userCode.js');

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let passedAll = false;
const results = testCases.map((tc, index) => {
  // Convert input object to array of arguments
  let args = Object.values(tc.input);

  try {
    const output = solution(...args);
    const passed = deepEqual(output, tc.expected);
    passedAll =(passed && passedAll;)
    return {
      case: index + 1,
      input: tc.input,
      expected: tc.expected,
      output,
      passed
    };
  } catch (err) {
    return {
      case: index + 1,
      input: tc.input,
      expected: tc.expected,
      output: String(err),
      passed: false,
      error: true
    };
  }
});

// Output results as JSON to stdout
console.log(JSON.stringify({ results }, null, 2));
process.exit(0); // ensure the Node process exits