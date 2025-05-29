import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function CookUsagePage() {
  const [products, setProducts] = useState([]);
  const [usage, setUsage] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventory_items"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const cookCategories = ["Dairy", "Produce", "Dry", "Meat", "Misc"];
      const cookItems = items.filter((p) =>
        cookCategories.includes(p.category)
      );

      setProducts(cookItems);
    });
    return () => unsub();
  }, []);

  const handleChange = (id, value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    setUsage((prev) => ({
      ...prev,
      [id]: num,
    }));
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];

    // ❗ Validation: Prevent over-usage
    for (let p of products) {
      const usedQty = usage[p.id];
      if (usedQty && usedQty > parseFloat(p.quantity)) {
        alert(`❌ Cannot use more than available for "${p.name}". (Available: ${p.quantity}, Entered: ${usedQty})`);
        return;
      }
    }

    try {
      for (let p of products) {
        const usedQty = usage[p.id];
        if (!usedQty || usedQty <= 0) continue;

        const remaining = parseFloat(p.quantity) - usedQty;
        const docRef = doc(db, "inventory_items", p.id);

        await updateDoc(docRef, { quantity: remaining });

        await addDoc(collection(db, "inventory_logs"), {
          product_id: p.id,
          action_type: "usage",
          used_quantity: usedQty,
          remaining_quantity: remaining,
          user: "cook@example.com",
          date: today,
          timestamp: serverTimestamp(),
        });
      }

      alert("✅ Daily usage updated!");
      setUsage({});
    } catch (err) {
      alert("❌ Error updating usage: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 display-6 text-primary">
        🧑‍🍳 Daily Usage Update (Cook)
      </h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Available</th>
              <th>Used Today</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity} {p.unit}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={p.quantity}
                    value={usage[p.id] || ""}
                    onChange={(e) => handleChange(p.id, e.target.value)}
                    className="form-control form-control-sm w-75"
                    placeholder="Qty used"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-success mt-3"
      >
        ✅ Submit Usage
      </button>
    </div>
  );
}
