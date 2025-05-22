import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function BuyingListPage() {
  const [buyList, setBuyList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "inventory_items"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((item) => {
        const qty = parseFloat(item.quantity);
        const threshold = parseFloat(item.threshold);
        return qty <= threshold + 5;
      });

      setBuyList(filtered);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsOrdered = async (item) => {
    const quantityStr = prompt(`Enter quantity received for "${item.name}":`);
    const arrivalDate = prompt(
      `Enter arrival date (YYYY-MM-DD):`,
      new Date().toISOString().split("T")[0]
    );

    const receivedQty = parseFloat(quantityStr);
    if (isNaN(receivedQty) || receivedQty <= 0) {
      alert("❌ Invalid quantity received.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) {
      alert("❌ Invalid date format. Use YYYY-MM-DD.");
      return;
    }

    const newQuantity = parseFloat(item.quantity) + receivedQty;
    const docRef = doc(db, "inventory_items", item.id);

    try {
      await updateDoc(docRef, {
        quantity: newQuantity,
        lastOrderedDate: arrivalDate,
        lastOrderedQty: receivedQty,
      });

      await addDoc(collection(db, "inventory_logs"), {
        product_id: item.id,
        action_type: "restock",
        received_quantity: receivedQty,
        old_quantity: item.quantity,
        new_quantity: newQuantity,
        arrival_date: arrivalDate,
        user: "manager@example.com",
        timestamp: serverTimestamp(),
      });

      alert(`✅ ${item.name} inventory updated.`);
    } catch (error) {
      alert("❌ Error updating inventory: " + error.message);
    }
  };

  const getRowClass = (quantity, threshold) => {
    if (quantity < threshold) return "table-danger";
    if (quantity <= threshold + 5) return "table-warning";
    return "";
  };

  const filtered = buyList
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛒 <strong>Buying List</strong> <small className="text-muted">(Threshold Alerts)</small></h2>

      <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-outline-primary"
          onClick={() => setSortAsc(!sortAsc)}
        >
          Sort by Name {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-success">✅ All products are above threshold.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Last Ordered Date</th>
                <th>Last Ordered Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className={getRowClass(item.quantity, item.threshold)}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.threshold}</td>
                  <td>{item.lastOrderedDate || "—"}</td>
                  <td>{item.lastOrderedQty || "—"}</td>
                  <td>
                    <button
                      onClick={() => handleMarkAsOrdered(item)}
                      className="btn btn-sm btn-primary"
                    >
                      Mark as Ordered
                    </button>
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
