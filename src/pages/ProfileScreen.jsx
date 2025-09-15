"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/InboxScreen.css"; // Reuse the Inbox theme

const transactions = [
  { key: "Active Rental", icon: "🕒", color: "#FF9900" },
  { key: "Pending", icon: "⏳", color: "#FFB84C" },
  { key: "Completed", icon: "✅", color: "#4CAF50" },
  { key: "Activity", icon: "📋", color: "#888" },
];

const items = [
  { id: 1, title: "Modern Apartment", location: "City Center", date: "Aug 12, 2025", price: "$1200/mo", image: "/placeholder-mgs60.png" },
  { id: 2, title: "Cozy Studio", location: "Downtown", date: "Aug 10, 2025", price: "$800/mo", image: "/placeholder-sqjrr.png" },
  { id: 3, title: "Luxury Condo", location: "Uptown", date: "Aug 15, 2025", price: "$2000/mo", image: "/placeholder-lumi3.png" },
];

export default function ProfileDefault() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "User Name", id: "" });
  const [selectedTab, setSelectedTab] = useState("Overview");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user && !userError) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("first_name, last_name, user_id")
          .eq("user_id", user.id)
          .single();
        if (profile && !profileError) {
          setUserInfo({ name: `${profile.first_name} ${profile.last_name}`, id: profile.user_id });
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="inbox-screen">
      <div className="inbox-content">
        {/* Sidebar */}
        <aside className="inbox-sidebar">
          <h2 className="sidebar-title">Profile</h2>
          <nav className="sidebar-nav">
            {["Overview", "Transactions", "Items"].map((tab) => (
              <button
                key={tab}
                className={`sidebar-item ${selectedTab === tab ? "active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="inbox-main">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="avatar-row">
              <div className="avatar-circle">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="name-column">
                <h2 className="user-name">{userInfo.name}</h2>
                <button className="edit-btn" onClick={() => navigate("/edit-profile")}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {selectedTab === "Transactions" && (
            <div className="transaction-row">
              {transactions.map((t) => (
                <div className="transaction-item" key={t.key}>
                  <span className="transaction-icon" style={{ color: t.color }}>{t.icon}</span>
                  <p className="transaction-text">{t.key}</p>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "Items" && (
            <div className="items-list">
              {items.map((item) => (
                <div className="card" key={item.id}>
                  <img src={item.image} alt={item.title} className="card-image" />
                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-location">{item.location}</p>
                    <p className="card-date">{item.date}</p>
                    <div className="card-footer">
                      <span className="card-price">{item.price}</span>
                      <button className="wishlist-btn">❤️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Edit / Add Button */}
      <button className="create-button" onClick={() => navigate("/post-items")}>+</button>
    </div>
  );
}