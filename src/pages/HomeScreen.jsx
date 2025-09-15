"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/HomeScreen.css";

// Categories and corresponding IDs
const categories = [
  { name: "All", id: null },
  { name: "Tools", id: 1 },
  { name: "Car", id: 2 },
  { name: "Clothing & Accessories", id: 3 },
  { name: "Electronics", id: 4 },
];

const HomeScreen = ({ search }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("available", true)
        .eq("is_verified", true);

      if (error) {
        console.error("Error fetching items:", error.message);
        setItems([]);
        return;
      }

      let filteredItems = data || [];

      // Filter by category_id if a category is selected (except "All")
      const categoryObj = categories.find((c) => c.name === selectedCategory);
      if (categoryObj && categoryObj.id) {
        filteredItems = filteredItems.filter(
          (item) => item.category_id === categoryObj.id
        );
      }

      // Filter by search query
      if (search && search.trim() !== "") {
        filteredItems = filteredItems.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      setItems(filteredItems);
    } catch (err) {
      console.error("Unexpected error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, search]);

  return (
    <div className="home-container">
      {/* Categories Row */}
      <div className="categories-scroll">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`category-button ${selectedCategory === cat.name ? "active" : ""
              }`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Section */}
      <div className="home-content">
        <h2 className="items-title">Items</h2>
        {loading ? (
          <p className="empty-text">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="empty-text">
            No items found. Try a different search or category.
          </p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div
                className="item-card"
                key={item.item_id}
                onClick={() => navigate(`/items/${item.item_id}`)}
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="item-image"
                />
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-location">{item.location}</p>
                  <p className="item-date">Available now</p>
                  <p className="item-price">₱{item.price_per_day}/day</p>
                </div>
                <button className="rent-button">Rent Now</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>


  );
};

export default HomeScreen;