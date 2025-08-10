export async function createUser(username: String, password: string) {
  const res = await fetch('/api/users/createUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function loginUser(username: String, password: string) {
  const res = await fetch('/api/users/fetchUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('failed to login user');
    return res.json();
}

export async function fetchQuestion(){
  const res = await fetch('/api/leetcode/question',{
    method: 'GET',
    headers: {'Content-type': 'application/json'},
  });
  if(!res.ok)throw new Error("couldnt get question");
    return res.text();
}