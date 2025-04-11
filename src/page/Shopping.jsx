import { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Logo from '../images/Logo2.png';

const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setIsAdmin(snap.data().role === "admin");
      }
    };
    fetchRole();
  }, []);

  const handleAdd = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleDecrease = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (!exists) return;
    if (exists.quantity === 1) {
      setCart(cart.filter((i) => i.id !== item.id));
    } else {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
      alert("🗑️ Product deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product.");
    }
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newProduct = {
      title: form.title.value,
      price: parseFloat(form.price.value),
      description: form.description.value,
      category: form.category.value,
      image: form.image.value,
    };
    try {
      if (editProduct) {
        await updateDoc(doc(db, "products", editProduct.id), newProduct);
        alert("✅ Product updated!");
        setEditProduct(null);
      } else {
        await addDoc(collection(db, "products"), newProduct);
        alert("✅ Product added!");
      }
      form.reset();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save product.");
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ).toFixed(2);
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold flex items-center gap-2">
  <span className="text-primary">Shopping</span>
</h1>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search product"
            className="input input-bordered w-60"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowCart(!showCart)}
            className="btn btn-primary"
          >
            View Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </button>
        </div>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleProductFormSubmit}
          className="bg-base-200 p-6 rounded-xl shadow mb-10"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editProduct ? "✏️ Edit Product" : "🛠 Add New Product"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              name="title"
              placeholder="Title"
              className="input input-bordered"
              defaultValue={editProduct?.title || ""}
              required
            />
            <input
              name="price"
              placeholder="Price"
              type="number"
              className="input input-bordered"
              defaultValue={editProduct?.price || ""}
              required
            />
            <input
              name="category"
              placeholder="Category"
              className="input input-bordered"
              defaultValue={editProduct?.category || ""}
              required
            />
            <input
              name="image"
              placeholder="Image URL"
              className="input input-bordered md:col-span-2"
              defaultValue={editProduct?.image || ""}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered md:col-span-3"
              defaultValue={editProduct?.description || ""}
              required
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success w-full">
              {editProduct ? "Update Product" : "➕ Add Product"}
            </button>
            {editProduct && (
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="btn btn-outline w-full"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
          >
            <figure className="px-4 pt-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-40 object-contain"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
              <p className="font-bold text-primary">Price: ${item.price}</p>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => handleAdd(item)}
              >
                Add
              </button>
              {isAdmin && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditProduct(item)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteProduct(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-base-200 shadow-lg p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🛍 Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="btn btn-sm btn-error"
            >
              Close
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <>
              <ul className="space-y-3 mb-4">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-xs"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-xs"
                        onClick={() => handleAdd(item)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="font-bold text-lg mb-4">Total: ${total}</p>
              <button className="btn btn-success w-full">Checkout</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Shopping;
