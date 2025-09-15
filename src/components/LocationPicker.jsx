"use client"

import { useState, useEffect } from "react"
import "../style/LocationPicker.css"

export default function LocationPicker({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  // Mock location data - in a real app, you'd use Google Places API or similar
  const mockLocations = [
    { id: 1, name: "Ayala Center Cebu", address: "Cebu Business Park, Cebu City, Cebu", lat: 10.3157, lng: 123.9054 },
    { id: 2, name: "SM City Cebu", address: "North Reclamation Area, Cebu City, Cebu", lat: 10.3181, lng: 123.9029 },
    { id: 3, name: "IT Park Cebu", address: "Lahug, Cebu City, Cebu", lat: 10.3272, lng: 123.9069 },
    {
      id: 4,
      name: "University of San Carlos",
      address: "P. del Rosario St, Cebu City, Cebu",
      lat: 10.2976,
      lng: 123.9018,
    },
    { id: 5, name: "Colon Street", address: "Colon St, Cebu City, Cebu", lat: 10.2935, lng: 123.9015 },
    { id: 6, name: "Capitol Site", address: "Capitol Site, Cebu City, Cebu", lat: 10.3099, lng: 123.8938 },
    { id: 7, name: "Banilad Town Centre", address: "Banilad, Cebu City, Cebu", lat: 10.3372, lng: 123.9123 },
    {
      id: 8,
      name: "Robinson's Galleria Cebu",
      address: "General Maxilom Avenue, Cebu City, Cebu",
      lat: 10.3115,
      lng: 123.8926,
    },
  ]

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true)
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockLocations.filter(
          (location) =>
            location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.address.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSuggestions(filtered)
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setSearchQuery(location.address)
    setIsOpen(false)
    setSuggestions([])

    // Pass the formatted data back to parent
    onChange({
      address: location.address,
      latitude: location.lat,
      longitude: location.lng,
      displayText: location.address,
    })
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // In a real app, you'd reverse geocode these coordinates to get an address
          const mockAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

          setSelectedLocation({
            name: "Current Location",
            address: mockAddress,
            lat: latitude,
            lng: longitude,
          })
          setSearchQuery(mockAddress)
          setIsLoading(false)

          onChange({
            address: mockAddress,
            latitude: latitude,
            longitude: longitude,
            displayText: "Current Location",
          })
        },
        (error) => {
          setIsLoading(false)
          alert("Unable to detect location. Please search manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="location-picker">
      <div className={`location-input-container ${error ? "error" : ""}`}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="location-input"
        />

        <button type="button" className="current-location-btn" onClick={handleUseCurrentLocation} disabled={isLoading}>
          <span className="location-icon">📍</span>
          {isLoading ? "Getting..." : "Current"}
        </button>
      </div>

      {isOpen && (searchQuery.length > 2 || suggestions.length > 0) && (
        <div className="location-dropdown">
          {isLoading ? (
            <div className="location-item loading">
              <span className="loading-spinner">⏳</span>
              Searching locations...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((location) => (
              <div key={location.id} className="location-item" onClick={() => handleLocationSelect(location)}>
                <div className="location-icon">📍</div>
                <div className="location-details">
                  <div className="location-name">{location.name}</div>
                  <div className="location-address">{location.address}</div>
                </div>
              </div>
            ))
          ) : searchQuery.length > 2 ? (
            <div className="location-item no-results">
              <span className="no-results-icon">🔍</span>
              No locations found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  )
}
