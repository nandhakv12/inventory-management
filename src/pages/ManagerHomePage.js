// src/pages/ManagerHomePage.js
import { Link } from "react-router-dom";

export default function ManagerHomePage() {
  return (
    <div className="container py-4">
      <h1 className="mb-4 display-5 fw-bold text-primary">
        👨‍💼 Manager Dashboard
      </h1>

      <div className="card border-primary shadow-sm">
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link to="/manager/list" className="btn btn-link">
                ➤ Product List
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/buying-list" className="btn btn-link">
                ➤ Buying List / Threshold Alerts
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/usage" className="btn btn-link">
                ➤ Usage Logs
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/upload" className="btn btn-link">
                ➤ Add New Product
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/ordered" className="btn btn-link">
                ➤ Ordered Page
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/ordered-logs" className="btn btn-link">
                ➤ Ordered Logs (Pending)
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/manager/received-logs" className="btn btn-link">
                ➤ Received Logs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
