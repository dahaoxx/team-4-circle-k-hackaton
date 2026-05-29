import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { KvilPlace } from '../lib/types'
import { api } from '../lib/api'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE as string | undefined
const TILES_OVERRIDE = import.meta.env.VITE_MAP_TILES_URL as string | undefined

const NORWAY_CENTER: [number, number] = [64.5, 13]
const NORWAY_ZOOM = 4

// Free, no-token light basemap that suits Kvil's neutral chrome.
const CARTO_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const CARTO_ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

/**
 * Resolve the raster tile layer.
 *  - VITE_MAP_TILES_URL set        → use it verbatim (escape hatch)
 *  - Mapbox token + style set      → designer's Studio theme as raster tiles
 *  - otherwise                     → free CARTO light basemap (no token)
 *
 * Leaflet can't render Mapbox GL *vector* styles, so a Studio theme is consumed
 * via the Static Tiles API (raster). The style URL may be a full
 * `mapbox://styles/<user>/<id>` or a bare `<user>/<id>`.
 */
function tileLayer(): L.TileLayer {
  if (TILES_OVERRIDE) {
    return L.tileLayer(TILES_OVERRIDE, { attribution: CARTO_ATTRIB })
  }
  if (MAPBOX_TOKEN && MAPBOX_STYLE) {
    const path = MAPBOX_STYLE.replace('mapbox://styles/', '')
    return L.tileLayer(
      `https://api.mapbox.com/styles/v1/${path}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
      },
    )
  }
  return L.tileLayer(CARTO_LIGHT, { attribution: CARTO_ATTRIB })
}

// POI markers from the design (public/poi-*.svg). Both SVGs are 56×68 with the
// pin tip at (28, 45.5) — i.e. 50% across, ~67% down — so the anchors below put
// the tip exactly on the coordinate.
//  • poi-new — the white "K" pin for curated Kvil places (prominent)
//  • poi-ck  — the red Circle K pin for every other station (smaller)
const KVIL_ICON = L.icon({
  iconUrl: '/poi-new.svg',
  iconSize: [34, 41],
  iconAnchor: [17, 27],
  tooltipAnchor: [0, -26],
})
const CK_ICON = L.icon({
  iconUrl: '/poi-ck.svg',
  iconSize: [22, 27],
  iconAnchor: [11, 18],
  tooltipAnchor: [0, -16],
})

/** RouteScreen map hero — Kvil places on a free Leaflet basemap (or the designer's theme). */
export function KvilMap({ places }: { places: KvilPlace[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const stationsLayerRef = useRef<L.LayerGroup | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: NORWAY_CENTER,
      zoom: NORWAY_ZOOM,
      zoomControl: true,
      attributionControl: true,
    })
    tileLayer().addTo(map)
    // Add the generic-stations layer FIRST so branded Kvil pins stack on top.
    stationsLayerRef.current = L.layerGroup().addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
      stationsLayerRef.current = null
    }
  }, [])

  // Fetch every real Circle K station once and draw them as small muted dots.
  // Offline-proof: getStations() returns [] on failure, so the map still works.
  useEffect(() => {
    let cancelled = false
    api.getStations().then((stations) => {
      const group = stationsLayerRef.current
      if (cancelled || !group) return
      group.clearLayers()
      stations.forEach((s) => {
        if (!s.lat || !s.lng) return // skip missing/zero coords
        L.marker([s.lat, s.lng], { icon: CK_ICON, title: s.name, opacity: 0.95 })
          .bindTooltip(s.name, { direction: 'top' })
          .addTo(group)
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Keep markers in sync with the place list (re-runs when places load from the API).
  useEffect(() => {
    const map = mapRef.current
    const group = layerRef.current
    if (!map || !group || !places.length) return

    group.clearLayers()
    places.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: KVIL_ICON, title: p.name })
        .bindTooltip(p.name, { direction: 'top' })
        .on('click', () => navigate(`/place/${p.id}`))
        .addTo(group)
    })

    map.fitBounds(
      L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])),
      { padding: [28, 28] },
    )
  }, [places, navigate])

  return (
    <div
      ref={containerRef}
      className="h-60 w-full overflow-hidden rounded-2xl border border-[var(--kvil-line)]"
    />
  )
}
