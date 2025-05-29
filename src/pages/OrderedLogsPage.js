import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function OrderedLogsPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pending_orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">📋 Ordered Logs (Pending)</h2>
      {orders.length === 0 ? (
        <div className="alert alert-success">🎉 No pending orders.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity Ordered</th>
                <th>Ordered Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.name}</td>
                  <td>{order.category}</td>
                  <td>{order.ordered_quantity}</td>
                  <td>{order.ordered_date}</td>
                  <td>{order.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
