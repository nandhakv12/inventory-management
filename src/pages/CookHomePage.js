// src/pages/CookHomePage.js
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function CookHomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-success">👨‍🍳 Cook Dashboard</h1>
          <p className="text-muted">Access your daily tasks and inventory logs here.</p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h5 className="card-title text-success">📝 Daily Usage</h5>
              <p className="card-text">
                Update the ingredients used during today's kitchen operations.
              </p>
              <Link to="/cook/usage" className="btn btn-outline-success w-100">
                ➤ Update Daily Usage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
