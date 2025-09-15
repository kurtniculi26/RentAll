"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../style/NotificationScreen.css"

const mockNotifications = [
  { id: 1, type: "booking", title: "Booking Confirmation", message: "Your booking for the Cozy Cabin in the Woods has been confirmed.", isRead: false, icon: "✓" },
  { id: 2, type: "message", title: "New Message", message: "A new message from Alex regarding your stay at the Lakeside Villa.", isRead: false, icon: "✉" },
  { id: 3, type: "payment", title: "Payment Confirmation", message: "Your payment of $250 for the Mountain Retreat has been processed.", isRead: true, icon: "$" },
  { id: 4, type: "system", title: "System Alert", message: "Important updates regarding your upcoming stay at the Beach House.", isRead: false, icon: "🔔" },
  { id: 5, type: "booking", title: "Booking Confirmation", message: "Your booking for the Cozy Cabin in the Woods has been confirmed.", isRead: true, icon: "✓" },
  { id: 6, type: "message", title: "New Message", message: "A new message from Alex regarding your stay at the Lakeside Villa.", isRead: true, icon: "✉" },
  { id: 7, type: "payment", title: "Payment Confirmation", message: "Your payment of $250 for the Mountain Retreat has been processed.", isRead: true, icon: "$" },
  { id: 8, type: "system", title: "System Alert", message: "Important updates regarding your upcoming stay at the Beach House.", isRead: true, icon: "🔔" },
]

const NotificationScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNotifications(mockNotifications)
    }
    fetchNotifications()
  }, [])

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="notification-container">

      <div className="notification-header">
        <h1 className="notification-title">Notifications</h1>
      </div>

      <div className="notifications-main">
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.isRead ? "read" : "unread"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">{notification.icon}</div>
              <div className="notification-content">
                <div className="notification-title-text">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationScreen