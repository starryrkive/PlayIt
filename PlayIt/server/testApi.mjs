// testApi.mjs
const baseURL = "http://localhost:5001/api";
let token = "";

// helper to send JSON requests
async function sendJSON(url, method, body, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${baseURL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`\n👉 [${method}] ${url}`);
  console.log("Response:", data);
  return data;
}

// test flow
(async () => {
  // 1️⃣ Register a new user
  const newUser = await sendJSON("/auth/register", "POST", {
    username: "veronica",
    email: "veronica@example.com",
    password: "123456",
  });

  // 2️⃣ Login the same user
  const login = await sendJSON("/auth/login", "POST", {
    email: "veronica@example.com",
    password: "123456",
  });
  token = login.token;

  // 3️⃣ Get all songs (none yet)
  await sendJSON("/songs", "GET");

  // 4️⃣ Display token info
  console.log("\n✅ Your token:", token);
})();
