"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/InboxScreen.css"

const InboxScreen = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("Inbox")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock message data
  const messages = {
    today: [
      {
        id: 1,
        sender: "Sarah Miller",
        avatar: "/woman-profile.jpg",
        message:
          "Hi, I'm interested in renting your apartment. Could you provide more details about the lease terms and availability?",
        time: "10:30 AM",
        unread: true,
      },
      {
        id: 2,
        sender: "David Lee",
        avatar: "/placeholder-mgs60.png",
        message:
          "I'm planning a trip to the city next month and your place looks perfect. Are the dates of July 15th to 22nd available?",
        time: "9:45 AM",
        unread: true,
      },
      {
        id: 3,
        sender: "Emily Chen",
        avatar: "/placeholder-sqjrr.png",
        message:
          "I'm interested in your property. Could you share more photos of the interior and exterior?",
        time: "8:15 AM",
        unread: false,
      },
      {
        id: 7,
        sender: "Alex Johnson",
        avatar: "/placeholder-alex.png",
        message: "Could you provide the floor plan for the apartment?",
        time: "11:20 AM",
        unread: true,
      },
      {
        id: 8,
        sender: "Rachel Adams",
        avatar: "/placeholder-rachel.png",
        message: "Is the apartment pet-friendly?",
        time: "10:50 AM",
        unread: false,
      },
      {
        id: 9,
        sender: "Tommy Nguyen",
        avatar: "/placeholder-tommy.png",
        message: "I would like to schedule a visit this weekend.",
        time: "10:10 AM",
        unread: true,
      },
      {
        id: 10,
        sender: "Sophia Patel",
        avatar: "/placeholder-sophia.png",
        message: "Can you confirm the monthly rent and utilities?",
        time: "9:55 AM",
        unread: false,
      },
      {
        id: 11,
        sender: "Liam Carter",
        avatar: "/placeholder-liam.png",
        message: "Is parking included in the lease?",
        time: "9:30 AM",
        unread: true,
      },
      {
        id: 12,
        sender: "Olivia Martinez",
        avatar: "/placeholder-olivia.png",
        message: "Do you provide furniture or is it unfurnished?",
        time: "8:50 AM",
        unread: false,
      },
      {
        id: 13,
        sender: "Ethan Wilson",
        avatar: "/placeholder-ethan.png",
        message: "Are there nearby public transport options?",
        time: "8:20 AM",
        unread: true,
      },
    ],
    yesterday: [
      {
        id: 4,
        sender: "Michael Brown",
        avatar: "/placeholder-lumi3.png",
        message:
          "I'm interested in your property. Could you share more photos of the interior and exterior?",
        time: "5:30 PM",
        unread: false,
      },
      {
        id: 5,
        sender: "Jessica Wong",
        avatar: "/placeholder-ndwem.png",
        message:
          "I'm interested in your property. Could you share more photos of the interior and exterior?",
        time: "2:15 PM",
        unread: false,
      },
      {
        id: 6,
        sender: "Daniel Kim",
        avatar: "/placeholder-qno2y.png",
        message:
          "I'm interested in your property. Could you share more photos of the interior and exterior?",
        time: "11:00 AM",
        unread: false,
      },
      {
        id: 14,
        sender: "Grace Lee",
        avatar: "/placeholder-grace.png",
        message: "Is the apartment available for immediate move-in?",
        time: "4:45 PM",
        unread: true,
      },
      {
        id: 15,
        sender: "Henry Scott",
        avatar: "/placeholder-henry.png",
        message: "Can I negotiate the lease terms?",
        time: "3:20 PM",
        unread: false,
      },
      {
        id: 16,
        sender: "Mia Chen",
        avatar: "/placeholder-mia.png",
        message: "Are utilities included in the rent?",
        time: "2:50 PM",
        unread: true,
      },
      {
        id: 17,
        sender: "Noah Davis",
        avatar: "/placeholder-noah.png",
        message: "Is there a security deposit required?",
        time: "1:30 PM",
        unread: false,
      },
      {
        id: 18,
        sender: "Ava Thompson",
        avatar: "/placeholder-ava.png",
        message: "Can I bring my pet cat?",
        time: "12:45 PM",
        unread: true,
      },
      {
        id: 19,
        sender: "James Walker",
        avatar: "/placeholder-james.png",
        message: "Is the apartment furnished or unfurnished?",
        time: "11:30 AM",
        unread: false,
      },
      {
        id: 20,
        sender: "Isabella Hall",
        avatar: "/placeholder-isabella.png",
        message: "Are there grocery stores nearby?",
        time: "10:15 AM",
        unread: true,
      },
    ],
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleCreateMessage = () => {
    console.log("Create new message")
  }

  return (
    <div className="inbox-screen">
      {/* Header */}

      <div className="inbox-content">
        {/* Sidebar */}
        <aside className="inbox-sidebar">
          <h2 className="sidebar-title">Messages</h2>
          <nav className="sidebar-nav">
            <button
              className={`sidebar-item ${selectedCategory === "Inbox" ? "active" : ""}`}
              onClick={() => handleCategorySelect("Inbox")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              Inbox
            </button>
            <button
              className={`sidebar-item ${selectedCategory === "Sent" ? "active" : ""}`}
              onClick={() => handleCategorySelect("Sent")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
              Sent
            </button>
            <button
              className={`sidebar-item ${selectedCategory === "Drafts" ? "active" : ""}`}
              onClick={() => handleCategorySelect("Drafts")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
              Drafts
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="inbox-main">
          <div className="inbox-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search inbox"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inbox-search-input"
                aria-label="Search inbox"
              />
              {/* Move the icon after the input */}
              <svg
                className="search-icon-right"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>



          {/* Messages List */}
          <div className="messages-list">
            {/* Today Section */}
            <div className="message-section">
              <h3 className="section-title">Today</h3>
              {messages.today.map((message) => (
                <div key={message.id} className={`message-item ${message.unread ? "unread" : ""}`}>
                  <img src={message.avatar || "/placeholder.svg"} alt={message.sender} className="message-avatar" />
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender-name">{message.sender}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <p className="message-preview">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Yesterday Section */}
            <div className="message-section">
              <h3 className="section-title">Yesterday</h3>
              {messages.yesterday.map((message) => (
                <div key={message.id} className={`message-item ${message.unread ? "unread" : ""}`}>
                  <img src={message.avatar || "/placeholder.svg"} alt={message.sender} className="message-avatar" />
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender-name">{message.sender}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <p className="message-preview">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <button className="create-button" onClick={handleCreateMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1" />
            </svg>
            Create
          </button>
        </main>
      </div>
    </div>
  )
}

export default InboxScreen
