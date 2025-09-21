const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Deep equality check
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

app.post("/run", (req, res) => {
  console.log("Received request to /run");
  const { userCode, testCases } = req.body;

  // Write user code to a file
  const codeFile = path.join("/tmp", "userCode.js");
  fs.writeFileSync(
    codeFile,
    userCode + "\nmodule.exports = { solution };", // ensure export
    "utf8"
  );

  // Write test cases to file
  const tcFile = path.join("/tmp", "testcases.json");
  fs.writeFileSync(tcFile, JSON.stringify(testCases), "utf8");

  try {
    // Dynamically load user code
    delete require.cache[require.resolve(codeFile)];
    const { solution } = require(codeFile);

    let passedAll = true;
    const results = testCases.map((tc, index) => {
      const args = Object.values(tc.input);
      try {
        const output = solution(...args);
        const passed = deepEqual(output, tc.expected);
        passedAll = passedAll && passed;

        return {
          case: index + 1,
          input: tc.input,
          expected: tc.expected,
          output,
          passed,
        };
      } catch (err) {
        passedAll = false;
        return {
          case: index + 1,
          input: tc.input,
          expected: tc.expected,
          output: String(err),
          passed: false,
          error: true,
        };
      }
    });

    // Send structured results back
    return res.json({ results, passedAll });
  } catch (err) {
    console.error("Execution error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

app.listen(4000, () => {
  console.log("Runner service listening on port 4000");
});