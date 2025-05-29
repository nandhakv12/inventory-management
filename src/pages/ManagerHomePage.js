// src/pages/ManagerHomePage.js
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function ManagerHomePage() {
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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold text-primary">👨‍💼 Manager Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>

      <div className="card border-primary shadow-sm">
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link to="/manager/list" className="btn btn-link">➤ Product List</Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/buying-list" className="btn btn-link">➤ Buying List / Threshold Alerts</Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/usage" className="btn btn-link">➤ Usage Logs</Link>
            </li>
            <li className="mb-2">
              <Link to="/upload" className="btn btn-link">➤ Add New Product</Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/ordered" className="btn btn-link">➤ Ordered Page</Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/ordered-logs" className="btn btn-link">➤ Ordered Logs (Pending)</Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/received-logs" className="btn btn-link">➤ Received Logs</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
