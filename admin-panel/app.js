let adminToken = "";

function apiBase() {
  return document.getElementById("apiBase").value.trim().replace(/\/$/, "");
}

function authHeaders() {
  return {
    "content-type": "application/json",
    "authorization": adminToken ? `Bearer ${adminToken}` : ""
  };
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const base = apiBase();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.token) adminToken = data.token;
  document.getElementById("loginResult").textContent = JSON.stringify(data, null, 2);
});

document.getElementById("createUserBtn").addEventListener("click", async () => {
  const base = apiBase();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value;
  const expire_at = document.getElementById("newExpireAt").value.trim();
  const max_devices = Number(document.getElementById("newMaxDevices").value || 1);

  const res = await fetch(`${base}/api/admin/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, password, expire_at, max_devices })
  });
  const data = await res.json();
  document.getElementById("createUserResult").textContent = JSON.stringify(data, null, 2);
});

document.getElementById("loadUsersBtn").addEventListener("click", async () => {
  const base = apiBase();
  const res = await fetch(`${base}/api/admin/users`, {
    headers: authHeaders()
  });
  const data = await res.json();
  document.getElementById("usersResult").textContent = JSON.stringify(data, null, 2);
});
