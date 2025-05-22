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

export default function UsageTrackingPage() {
  const [usageLogs, setUsageLogs] = useState([]);
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const q = query(
      collection(db, "inventory_logs"),
      where("action_type", "==", "usage"),
      where("date", "==", date)
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const rawLogs = snapshot.docs.map((doc) => doc.data());

      const enrichedLogs = await Promise.all(
        rawLogs.map(async (log) => {
          let productName = "Unknown";
          let unit = "";
          try {
            const productRef = doc(db, "inventory_items", log.product_id);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const data = productSnap.data();
              productName = data.name;
              unit = data.unit || "";
            }
          } catch (e) {
            console.error("Error fetching product:", log.product_id);
          }

          return {
            ...log,
            productName,
            unit,
          };
        })
      );

      setUsageLogs(enrichedLogs);
    });

    return () => unsub();
  }, [date]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-6 text-primary">📊 Daily Usage Summary</h2>
        <div>
          <label className="form-label me-2 fw-bold">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control d-inline-block"
            style={{ width: "200px" }}
          />
        </div>
      </div>

      {usageLogs.length === 0 ? (
        <div className="alert alert-info">ℹ️ No usage logs found for this date.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Used Quantity</th>
                <th>Remaining</th>
                <th>User</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {usageLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.productName}</td>
                  <td>{log.used_quantity} {log.unit}</td>
                  <td>{log.remaining_quantity?.toFixed(2)} {log.unit}</td>
                  <td>{log.user || "cook@example.com"}</td>
                  <td>
                    {log.timestamp?.toDate
                      ? new Date(log.timestamp.toDate()).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
