import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const units = ["%", "lb", "oz", "liter", "count"];

  useEffect(() => {
    const loadProduct = async () => {
      const docRef = doc(db, "inventory_items", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        alert("❌ Product not found.");
        navigate("/manager/list");
      }
      setLoading(false);
    };
    loadProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "inventory_items", id);
    try {
      await updateDoc(docRef, {
        ...product,
        quantity: parseFloat(product.quantity),
        threshold: parseFloat(product.threshold),
        lastUpdatedDate: serverTimestamp(),
      });
      alert("✅ Product updated successfully!");
      navigate("/manager/list");
    } catch (error) {
      alert("❌ Update failed: " + error.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return null;

  return (
    <div className="container py-4">
      <h2 className="mb-4 display-6 text-primary">✏️ Edit Product</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Quantity</label>
          <input
            name="quantity"
            type="number"
            value={product.quantity}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Unit</label>
          <select
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="form-select"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Threshold</label>
          <input
            name="threshold"
            type="number"
            value={product.threshold}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Ordered Date</label>
          <input
            name="lastOrderedDate"
            type="date"
            value={product.lastOrderedDate || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            ✅ Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
