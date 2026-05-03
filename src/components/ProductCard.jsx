import { useState, useEffect } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);

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

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>{product.price} MDL</p>

      <button onClick={toggleLike}>
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>

      <button onClick={() => onAddToCart(product)}>
        Add to cart
      </button>
    </div>
  );
}
