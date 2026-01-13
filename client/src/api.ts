export async function createUser(username: string, password: string) {
  try {
    const res = await fetch('/api/users/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Backend returned an error (e.g., username exists)
      throw new Error(data.message || 'Failed to create user');
    }

    return data; // success, return the created user
  } catch (err: any) {
    console.error('Error creating user:', err);
    throw err; // rethrow so calling code can handle it
  }
}

export async function loginUser(username: string, password: string) {
  const res = await fetch('/api/users/fetchUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: username,
      password: password,
    }),
  });
  if (!res.ok) throw new Error('failed to login user');
  return res.json();
}

export async function createTestCases(questionId: number,input: String, output: String){
  try{
    const res = await fetch('api/testcases',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({questionId, input, output})
    })
    return res.json();
  }
  catch (err){
    alert(err)
  }
}

export async function runCode(questionId: number, userCode: string){
  console.log(userCode);  
  try{
    const res = await fetch('api/code/submit',{
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({questionId, userCode})
    });
    return res.json();
  }
  catch(err){
    alert(err)
  }
}