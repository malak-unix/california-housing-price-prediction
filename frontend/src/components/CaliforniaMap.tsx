import { useEffect, useRef, useState } from "react"
import {
  Map as MapLibreMap,
  type MapMouseEvent,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import mapLibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"

import { AlertTriangle, Crosshair } from "lucide-react"

const DEFAULT_MAP_STYLE = "https://tiles.openfreemap.org/styles/dark"
const CALIFORNIA_CENTER: [number, number] = [-119.6, 36.7]

setWorkerUrl(mapLibreWorkerUrl)

type CaliforniaMapProps = {
  latitude: number
  longitude: number
  onCoordinatesChange: (latitude: number, longitude: number) => void
}

function areValidCoordinates(latitude: number, longitude: number) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

function normalizeCoordinate(value: number) {
  return Number(value.toFixed(5))
}

function createMarkerElement() {
  const element = document.createElement("button")
  element.type = "button"
  element.className =
    "grid size-9 place-items-center rounded-full border border-[#c4ffe8]/80 bg-[#53e3ac]/15 shadow-[0_0_0_8px_rgba(83,227,172,0.10),0_0_24px_rgba(83,227,172,0.55)] backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#53e3ac]"
  element.setAttribute(
    "aria-label",
    "Selected historical census-area coordinates. Drag to adjust.",
  )

  const core = document.createElement("span")
  core.className =
    "block size-3 rounded-full border-2 border-[#dfffee] bg-[#53e3ac] shadow-[0_0_14px_rgba(83,227,172,0.9)]"
  element.appendChild(core)

  return element
}

export function CaliforniaMap({
  latitude,
  longitude,
  onCoordinatesChange,
}: CaliforniaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const callbackRef = useRef(onCoordinatesChange)
  const initialCenterRef = useRef<[number, number]>(
    areValidCoordinates(latitude, longitude)
      ? [longitude, latitude]
      : CALIFORNIA_CENTER,
  )
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    callbackRef.current = onCoordinatesChange
  }, [onCoordinatesChange])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const initialCenter = initialCenterRef.current

    let map: MapLibreMap

    try {
      map = new MapLibreMap({
        container: containerRef.current,
        style: import.meta.env.VITE_MAP_STYLE_URL || DEFAULT_MAP_STYLE,
        center: initialCenter,
        zoom: 5.15,
        minZoom: 3,
        maxZoom: 16,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      })
    } catch {
      const errorTimer = window.setTimeout(() => setMapError(true), 0)
      return () => window.clearTimeout(errorTimer)
    }

    const marker = new Marker({
      element: createMarkerElement(),
      draggable: true,
      anchor: "center",
    })
      .setLngLat(initialCenter)
      .addTo(map)

    const publishCoordinates = (nextLatitude: number, nextLongitude: number) => {
      callbackRef.current(
        normalizeCoordinate(nextLatitude),
        normalizeCoordinate(nextLongitude),
      )
    }

    const handleMapClick = (event: MapMouseEvent) => {
      marker.setLngLat(event.lngLat)
      publishCoordinates(event.lngLat.lat, event.lngLat.lng)
    }

    const handleMarkerDrag = () => {
      const position = marker.getLngLat()
      publishCoordinates(position.lat, position.lng)
    }

    const handleMapLoad = () => setMapError(false)
    const loadTimer = window.setTimeout(() => {
      if (!map.isStyleLoaded()) setMapError(true)
    }, 10_000)

    map.addControl(new NavigationControl({ showCompass: false }), "top-right")
    map.on("click", handleMapClick)
    map.on("load", handleMapLoad)
    marker.on("dragend", handleMarkerDrag)

    mapRef.current = map
    markerRef.current = marker

    return () => {
      marker.off("dragend", handleMarkerDrag)
      map.off("click", handleMapClick)
      map.off("load", handleMapLoad)
      window.clearTimeout(loadTimer)
      marker.remove()
      map.remove()
      markerRef.current = null
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!areValidCoordinates(latitude, longitude)) return

    const nextCenter: [number, number] = [longitude, latitude]
    markerRef.current?.setLngLat(nextCenter)

    const map = mapRef.current
    if (map && !map.getBounds().contains(nextCenter)) {
      map.easeTo({ center: nextCenter, duration: 600 })
    }
  }, [latitude, longitude])

  return (
    <div className="relative min-h-[25rem] overflow-hidden rounded-[0.9rem] border border-white/[0.08] bg-[#090d0f]">
      <div
        ref={containerRef}
        className="absolute inset-0"
        role="application"
        aria-label="Interactive map for selecting California census-area coordinates"
      />

      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[15rem] rounded-lg border border-white/10 bg-[#080b0d]/85 px-3 py-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#53e3ac]">
          <Crosshair aria-hidden="true" className="size-3.5" />
          Coordinate selector
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">
          Click the map or drag the marker to update the model inputs.
        </p>
      </div>

      {mapError ? (
        <div
          className="absolute inset-x-4 bottom-8 z-10 flex items-start gap-3 rounded-lg border border-amber-300/20 bg-[#15130e]/95 p-3 text-xs leading-relaxed text-amber-100 shadow-2xl backdrop-blur-md"
          role="status"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Map tiles are unavailable right now. You can still set latitude and
            longitude in the prediction form.
          </span>
        </div>
      ) : null}
    </div>
  )
}

