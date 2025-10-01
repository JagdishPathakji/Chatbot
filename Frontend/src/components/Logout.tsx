export default async function HandleLogout(email: string) {
  const response = await fetch("https://chatbot-backend-t13q.onrender.com/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
    credentials: "include" // ensures cookies are sent
  });

  const res = await response.json()
  if(res.success === true) {
    alert(`${res.message}`)
    window.location.href = "/login";
  }
  else {
    alert(`Logout Failed, ${res.message}`)
  }
};
