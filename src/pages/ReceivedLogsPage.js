import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";

export default function ReceivedLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "inventory_logs"), where("action_type", "==", "restock"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const rawLogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const enriched = await Promise.all(
        rawLogs.map(async (log) => {
          try {
            const productRef = doc(db, "inventory_items", log.product_id);
            const snap = await getDoc(productRef);
            return {
              ...log,
              name: snap.exists() ? snap.data().name : "Unknown",
              category: snap.exists() ? snap.data().category : "—",
            };
          } catch {
            return { ...log, name: "Unknown", category: "—" };
          }
        })
      );

      setLogs(enriched);
    });

    return () => unsub();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">📥 Received Logs</h2>
      {logs.length === 0 ? (
        <div className="alert alert-info">No restocked items yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Received Qty</th>
                <th>Date</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.name}</td>
                  <td>{log.category}</td>
                  <td>{log.received_quantity}</td>
                  <td>{log.arrival_date || "—"}</td>
                  <td>{log.user || "manager@example.com"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
