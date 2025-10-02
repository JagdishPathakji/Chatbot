import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function LogoutButton({ email, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const res = await response.json();

      if (res.success) {
        alert(res.message);
        setIsAuthenticated(false); // update App auth state
        navigate("/login");       // SPA redirect
      } else {
        alert(`Logout Failed: ${res.message}`);
      }
    } catch (err) {
      alert("Something went wrong during logout");
    }
  };

  return (
    <div className="userIconDiv" onClick={handleLogout} style={{ cursor: "pointer" }}>
      <LogOut className="w-5 h-5" />
      Logout
    </div>
  );
}
