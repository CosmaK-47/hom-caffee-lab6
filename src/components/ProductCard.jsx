import { useState, useEffect } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setLiked(favorites.includes(product.id));
  }, [product.id]);

  const toggleLike = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(product.id)) {
      favorites = favorites.filter((id) => id !== product.id);
      setLiked(false);
    } else {
      favorites.push(product.id);
      setLiked(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>{product.price} MDL</p>

      <div className="product-actions">
        <button onClick={toggleLike}>
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>

        <input
          className="quantity-input"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button onClick={handleAdd}>Add to cart</button>
      </div>
    </div>
  );
}
