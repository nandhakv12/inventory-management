import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

export default function OrderedPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pending_orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });
    return () => unsub();
  }, []);

  const handleMarkAsReceived = async (order) => {
    const date = prompt("Enter date received (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    const qtyStr = prompt(`Enter quantity received for "${order.name}":`, order.ordered_quantity);
    const receivedNote = prompt("Enter any notes about this delivery (optional):", "");

    const qty = parseFloat(qtyStr);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(qty) || qty <= 0) {
      alert("❌ Invalid input.");
      return;
    }

    const docRef = doc(db, "inventory_items", order.product_id);
    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) throw new Error("Inventory item not found");

      const currentQty = snap.data().quantity;

      // Update quantity in inventory
      await updateDoc(docRef, {
        quantity: currentQty + qty,
        lastOrderedDate: date,
        lastOrderedQty: qty,
      });

      // Add to inventory_logs
      await addDoc(collection(db, "inventory_logs"), {
        product_id: order.product_id,
        action_type: "restock",
        received_quantity: qty,
        old_quantity: currentQty,
        new_quantity: currentQty + qty,
        arrival_date: date,
        user: "manager@example.com",
        timestamp: serverTimestamp(),
        notes: receivedNote || "", // store note
      });

      // Remove from pending_orders
      await deleteDoc(doc(db, "pending_orders", order.id));

      alert(`✅ ${order.name} restocked.`);
    } catch (err) {
      alert("❌ Error updating inventory: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📦 Ordered Products</h2>
      {orders.length === 0 ? (
        <div className="alert alert-success">🎉 No pending deliveries!</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Ordered Qty</th>
              <th>Ordered Date</th>
              <th>Notes</th>
              <th>Action</th>
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
                <td>
                  <button
                    onClick={() => handleMarkAsReceived(order)}
                    className="btn btn-success btn-sm"
                  >
                    Mark as Received
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
