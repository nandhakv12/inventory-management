import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container py-4">
      <h1 className="mb-4 display-5 fw-bold text-primary">
        🏠 Restaurant Inventory Dashboard
      </h1>

      <div className="row gy-4">
        {/* Cook Section */}
        <div className="col-md-6">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">
                🧑‍🍳 Cook Access
              </h5>
              <p className="card-text">Update daily usage of ingredients.</p>
              <Link to="/cook/usage" className="btn btn-outline-success">
                ➤ Update Daily Usage
              </Link>
            </div>
          </div>
        </div>

        {/* Manager Section */}
        <div className="col-md-6">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">
                👨‍💼 Manager Access
              </h5>
              <ul className="list-unstyled mt-3 mb-0">
                <li className="mb-2">
                  <Link to="/manager/list" className="btn btn-link p-0">
                    ➤ View Product List
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/manager/buying-list" className="btn btn-link p-0">
                    ➤ Buying List / Threshold Alerts
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/manager/usage" className="btn btn-link p-0">
                    ➤ Usage Logs
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/upload" className="btn btn-link p-0">
                    ➤ Add New Product
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
