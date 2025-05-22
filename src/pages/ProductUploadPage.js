import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProductUploadPage() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "lb",
    threshold: "",
    lastOrderedDate: ""
  });

  const units = ["%", "lb", "oz", "liter", "count"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inventory_items"), {
        ...product,
        quantity: parseFloat(product.quantity),
        threshold: parseFloat(product.threshold),
        lastUpdatedDate: serverTimestamp(),
      });
      alert("✅ Product added!");
      setProduct({
        name: "",
        category: "",
        quantity: "",
        unit: "lb",
        threshold: "",
        lastOrderedDate: ""
      });
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 600 }}>
        <h2 className="mb-4 display-6 text-primary">➕ Add New Product</h2>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Product Name</label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="e.g. Tomato"
              required
              className="form-control"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <input
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="e.g. Produce"
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Quantity</label>
            <input
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="e.g. 20"
              required
              type="number"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Unit</label>
            <select
              name="unit"
              value={product.unit}
              onChange={handleChange}
              className="form-select"
            >
              {units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Threshold</label>
            <input
              name="threshold"
              value={product.threshold}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              type="number"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Ordered Date</label>
            <input
              name="lastOrderedDate"
              value={product.lastOrderedDate}
              onChange={handleChange}
              type="date"
              className="form-control"
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
