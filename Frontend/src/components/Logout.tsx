import { useNavigate } from "react-router-dom";

function LogoutButton({ email }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("https://chatbot-backend-t13q.onrender.com/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    const res = await response.json();
    if (res.success) {
      alert(res.message);
      navigate("/login"); // works safely
    } else {
      alert(`Logout Failed: ${res.message}`);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
