import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-warning bg-opacity-25">
        <h1 className="display-5 fw-bold mb-4">Welcome Home User 🎉</h1>
        <button
          onClick={handleLogout}
          className="btn btn-danger px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
