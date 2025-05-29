import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function BuyingListPage() {
  const [buyList, setBuyList] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "inventory_items"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const pendingSnap = await getDocs(collection(db, "pending_orders"));
      const pending = pendingSnap.docs.map((doc) => doc.data().product_id);
      setPendingIds(pending);

      const filtered = data.filter((item) => {
        const qty = parseFloat(item.quantity);
        const threshold = parseFloat(item.threshold);
        return qty <= threshold + 5 && !pending.includes(item.id);
      });

      setBuyList(filtered);
    });

    return () => unsub();
  }, []);

  const handleMarkAsOrdered = async (item) => {
    const quantityStr = prompt(`Enter quantity to order for "${item.name}":`);
    const orderedDate = prompt("Enter ordered date (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    const notes = prompt("Enter any special notes (optional):", "");

    const orderedQty = parseFloat(quantityStr);
    if (isNaN(orderedQty) || orderedQty <= 0) {
      alert("❌ Invalid quantity.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(orderedDate)) {
      alert("❌ Invalid date format.");
      return;
    }

    try {
      await addDoc(collection(db, "pending_orders"), {
        product_id: item.id,
        name: item.name,
        category: item.category,
        ordered_quantity: orderedQty,
        ordered_date: orderedDate,
        notes,
      });

      alert(`✅ Order logged for ${item.name}.`);
    } catch (error) {
      alert("❌ Failed to log order: " + error.message);
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
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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
        <div className="alert alert-success">✅ All products are above threshold or already ordered.</div>
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
