"use client"

import { useState, useEffect, useRef } from "react"
import "../style/MapLocationPicker.css"

export default function MapLocationPicker({ value, onChange, error }) {
  const mapRef = useRef(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mapType, setMapType] = useState("terrain") // terrain, satellite, roadmap
  const [mapCenter, setMapCenter] = useState({ lat: 8.475, lng: 124.65 }) // Added map center state for panning
  const [isDragging, setIsDragging] = useState(false) // Added dragging state
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }) // Added drag start position

  // CDO city bounds
  const cdoBounds = {
    north: 8.55,
    south: 8.4,
    east: 124.75,
    west: 124.55,
  }

  useEffect(() => {
    initializeMap()
  }, [mapType, mapCenter]) // Added mapCenter dependency

  const initializeMap = () => {
    if (!mapRef.current) return

    // Clear existing map
    mapRef.current.innerHTML = ""

    // Create map container
    const mapContainer = document.createElement("div")
    mapContainer.className = "leaflet-map-container"
    mapContainer.style.width = "100%"
    mapContainer.style.height = "300px"
    mapContainer.style.borderRadius = "8px"
    mapContainer.style.overflow = "hidden"
    mapContainer.style.position = "relative"
    mapContainer.style.cursor = "grab" // Changed cursor to grab for panning

    const tileContainer = document.createElement("div")
    tileContainer.style.position = "relative"
    tileContainer.style.width = "100%"
    tileContainer.style.height = "100%"
    tileContainer.style.backgroundImage = getMapTileBackground()
    tileContainer.style.backgroundSize = "cover"
    tileContainer.style.backgroundPosition = "center"

    tileContainer.addEventListener("mousedown", handleMouseDown)
    tileContainer.addEventListener("mousemove", handleMouseMove)
    tileContainer.addEventListener("mouseup", handleMouseUp)
    tileContainer.addEventListener("mouseleave", handleMouseUp)

    // Add map type selector overlay
    const mapTypeSelector = document.createElement("div")
    mapTypeSelector.className = "map-type-selector"
    mapTypeSelector.innerHTML = `
      <button class="map-type-btn ${mapType === "terrain" ? "active" : ""}" data-type="terrain">Terrain</button>
      <button class="map-type-btn ${mapType === "satellite" ? "active" : ""}" data-type="satellite">Satellite</button>
      <button class="map-type-btn ${mapType === "roadmap" ? "active" : ""}" data-type="roadmap">Roadmap</button>
    `

    // Add click handlers for map type buttons
    mapTypeSelector.addEventListener("click", (e) => {
      if (e.target.classList.contains("map-type-btn")) {
        setMapType(e.target.dataset.type)
      }
    })

    tileContainer.addEventListener("click", (e) => {
      if (!isDragging) {
        const rect = tileContainer.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Convert pixel coordinates to lat/lng
        const lat = mapCenter.lat - ((y - 150) / 150) * 0.05 // Use mapCenter for calculations
        const lng = mapCenter.lng + ((x - 250) / 250) * 0.1

        handleLocationSelect(lat, lng, x, y)
      }
    })

    mapContainer.appendChild(tileContainer)
    mapContainer.appendChild(mapTypeSelector)
    mapRef.current.appendChild(mapContainer)
  }

  const handleMouseDown = (e) => {
    setIsDragging(false)
    setDragStart({ x: e.clientX, y: e.clientY })
    e.target.style.cursor = "grabbing"
  }

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      // Left mouse button is pressed
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setIsDragging(true)

        // Update map center based on drag
        const newLat = mapCenter.lat + deltaY * 0.0001
        const newLng = mapCenter.lng - deltaX * 0.0001

        // Keep within CDO bounds
        const boundedLat = Math.max(cdoBounds.south, Math.min(cdoBounds.north, newLat))
        const boundedLng = Math.max(cdoBounds.west, Math.min(cdoBounds.east, newLng))

        setMapCenter({ lat: boundedLat, lng: boundedLng })
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }
  }

  const handleMouseUp = (e) => {
    e.target.style.cursor = "grab"
    setTimeout(() => setIsDragging(false), 100) // Small delay to prevent click after drag
  }

  const getMapTileBackground = () => {
    const zoom = 13
    const centerTileX = Math.floor(((mapCenter.lng + 180) / 360) * Math.pow(2, zoom)) // Use mapCenter
    const centerTileY = Math.floor(
      ((1 -
        Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) /
        2) *
        Math.pow(2, zoom),
    )

    switch (mapType) {
      case "satellite":
        return `url('https://mt1.google.com/vt/lyrs=s&x=${centerTileX}&y=${centerTileY}&z=${zoom}')`
      case "terrain":
        return `url('https://mt1.google.com/vt/lyrs=p&x=${centerTileX}&y=${centerTileY}&z=${zoom}')`
      case "roadmap":
      default:
        return `url('https://mt1.google.com/vt/lyrs=m&x=${centerTileX}&y=${centerTileY}&z=${zoom}')`
    }
  }

  const handleLocationSelect = async (lat, lng, x, y) => {
    setIsLoading(true)

    // Add visual marker
    const mapContainer = mapRef.current.querySelector(".leaflet-map-container")
    const existingMarker = mapContainer.querySelector(".location-marker")
    if (existingMarker) {
      existingMarker.remove()
    }

    const marker = document.createElement("div")
    marker.className = "location-marker"
    marker.style.position = "absolute"
    marker.style.left = `${x - 12}px`
    marker.style.top = `${y - 24}px`
    marker.style.width = "24px"
    marker.style.height = "24px"
    marker.style.backgroundImage =
      "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjRUY0NDQ0Ii8+Cjwvc3ZnPgo=')"
    marker.style.backgroundSize = "contain"
    marker.style.pointerEvents = "none"
    marker.style.zIndex = "1000"

    mapContainer.appendChild(marker)

    const mockAddress = await reverseGeocode(lat, lng)

    const locationData = {
      address: mockAddress,
      latitude: lat,
      longitude: lng,
      displayText: mockAddress,
    }

    setSelectedLocation(locationData)
    onChange(locationData)
    setIsLoading(false)
  }

  const reverseGeocode = async (lat, lng) => {
    // Determine area based on coordinates within CDO
    let area = "Cagayan de Oro City"

    if (lat > 8.48 && lng < 124.63) {
      area = "Barangay Carmen"
    } else if (lat > 8.48 && lng > 124.67) {
      area = "Barangay Lapasan"
    } else if (lat < 8.46 && lng < 124.63) {
      area = "Barangay Nazareth"
    } else if (lat < 8.46 && lng > 124.67) {
      area = "Barangay Kauswagan"
    } else if (lat > 8.47 && lng >= 124.63 && lng <= 124.67) {
      area = "Barangay Macasandig"
    } else {
      area = "Barangay Bulua"
    }

    return `${area}, Cagayan de Oro City, Misamis Oriental`
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Check if location is within CDO bounds
          if (
            latitude >= cdoBounds.south &&
            latitude <= cdoBounds.north &&
            longitude >= cdoBounds.west &&
            longitude <= cdoBounds.east
          ) {
            // Convert lat/lng to pixel coordinates
            const mapContainer = mapRef.current.querySelector(".leaflet-map-container")
            const x = ((longitude - cdoBounds.west) / (cdoBounds.east - cdoBounds.west)) * mapContainer.offsetWidth
            const y = ((cdoBounds.north - latitude) / (cdoBounds.north - cdoBounds.south)) * mapContainer.offsetHeight

            handleLocationSelect(latitude, longitude, x, y)
          } else {
            alert("Your current location is outside Cagayan de Oro City. Please select a location on the map.")
          }
          setIsLoading(false)
        },
        (error) => {
          setIsLoading(false)
          alert("Unable to detect location. Please select a location on the map.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="map-location-picker">
      <div className="map-header">
        <h3>Select Your Location in Cagayan de Oro</h3>
        <button type="button" className="current-location-btn" onClick={handleUseCurrentLocation} disabled={isLoading}>
          <span className="location-icon">📍</span>
          {isLoading ? "Getting..." : "Use Current"}
        </button>
      </div>

      <div className="map-container" ref={mapRef}>
        {/* Real map tiles will be inserted here */}
      </div>

      {selectedLocation && (
        <div className="selected-location">
          <div className="location-icon">📍</div>
          <div className="location-details">
            <div className="location-name">Selected Location</div>
            <div className="location-address">{selectedLocation.address}</div>
            <div className="location-coords">
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </div>
          </div>
        </div>
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  )
}
