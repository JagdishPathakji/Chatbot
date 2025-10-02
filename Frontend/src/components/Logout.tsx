import { useNavigate } from "react-router-dom";

export default async function HandleLogout(email: string) {
  const navigate = useNavigate();
  const response = await fetch("https://chatbot-backend-t13q.onrender.com/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
    credentials: "include" // ensures cookies are sent
  });

  const res = await response.json()
  if(res.success === true) {
    alert(`${res.message}`)
    navigate("/login");
  }
  else {
    alert(`Logout Failed, ${res.message}`)
  }
};
