import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinIcon, XIcon, SearchIcon, LocateFixedIcon } from "lucide-react";

const DEFAULT_CENTER: [number, number] = [-1.9441, 30.0619]; // Kigali

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number }) => void;
  onClose: () => void;
}

function MapModal({ value, onChange, onClose }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const moveTo = (lat: number, lng: number, zoom = 16) => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    map.setView([lat, lng], zoom);
    marker.setLatLng([lat, lng]);
    onChange({ lat, lng });
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const start: [number, number] = value ? [value.lat, value.lng] : DEFAULT_CENTER;
    const map = L.map(containerRef.current).setView(start, 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);

    const marker = L.marker(start, { icon: markerIcon, draggable: true }).addTo(map);
    markerRef.current = marker;
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChange({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng);
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    setTimeout(() => map.invalidateSize(), 100);

    // If no pin has been set yet, try to center on the shopper's real location.
    if (!value && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => moveTo(position.coords.latitude, position.coords.longitude, 16),
        () => undefined,
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveTo(position.coords.latitude, position.coords.longitude, 16);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const runSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=rw&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (result: SearchResult) => {
    moveTo(parseFloat(result.lat), parseFloat(result.lon));
    setResults([]);
    setQuery(result.display_name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b border-burgundy-100 px-5 py-4">
          <p className="font-serif text-lg font-semibold text-ink">Drop a pin at your delivery location</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink/50 hover:bg-burgundy-50">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-burgundy-100 p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    runSearch();
                  }
                }}
                placeholder="Search for a place or address in Rwanda..."
                className="w-full rounded-xl border border-burgundy-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

            </div>
            <button
              type="button"
              onClick={() => runSearch()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-burgundy-200 bg-white px-3 py-2.5 text-sm font-medium text-burgundy-800 hover:bg-burgundy-50">

              <SearchIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-burgundy-200 bg-white px-3 py-2.5 text-sm font-medium text-burgundy-800 hover:bg-burgundy-50 disabled:opacity-60">

              <LocateFixedIcon className="h-4 w-4" />
              {locating ? "Locating…" : "My location"}
            </button>
          </div>
          {searching && <p className="mt-1.5 text-xs text-ink/50">Searching…</p>}
          {results.length > 0 &&
          <ul className="mt-2 max-h-40 divide-y divide-burgundy-50 overflow-y-auto rounded-xl border border-burgundy-100">
              {results.map((result) =>
            <li key={`${result.lat}-${result.lon}`}>
                  <button
                type="button"
                onClick={() => pickResult(result)}
                className="w-full px-3 py-2 text-left text-xs text-ink/70 hover:bg-burgundy-50">

                    {result.display_name}
                  </button>
                </li>
            )}
            </ul>
          }
        </div>

        <div ref={containerRef} className="h-96 w-full" />
        <div className="flex items-center justify-between gap-3 border-t border-burgundy-100 px-5 py-4">
          <p className="text-xs text-ink/50">Search, use your location, tap the map, or drag the pin to set it exactly.</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-burgundy-800 px-5 py-2 text-sm font-semibold text-cream hover:bg-burgundy-900">

            Done
          </button>
        </div>
      </div>
    </div>);

}

export function LocationPicker({ value, onChange }: {value: {lat: number;lng: number;} | null;onChange: (value: {lat: number;lng: number;}) => void;}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-burgundy-200 bg-white px-4 py-2 text-sm font-medium text-burgundy-800 hover:bg-burgundy-50">

        <MapPinIcon className="h-4 w-4" />
        {value ? "Pin set — tap to adjust" : "Set your exact delivery location"}
      </button>
      {value &&
      <p className="mt-1.5 text-xs text-ink/50">
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      }
      {open &&
      <MapModal value={value} onChange={onChange} onClose={() => setOpen(false)} />
      }
    </div>);

}
