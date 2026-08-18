import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinIcon, XIcon } from "lucide-react";

const DEFAULT_CENTER: [number, number] = [-1.9441, 30.0619]; // Kigali

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface LocationPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number }) => void;
  onClose: () => void;
}

function MapModal({ value, onChange, onClose }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

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

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b border-burgundy-100 px-5 py-4">
          <p className="font-serif text-lg font-semibold text-ink">Drop a pin at your delivery location</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink/50 hover:bg-burgundy-50">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div ref={containerRef} className="h-96 w-full" />
        <div className="flex items-center justify-between gap-3 border-t border-burgundy-100 px-5 py-4">
          <p className="text-xs text-ink/50">Tap the map or drag the pin to set your exact location.</p>
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
        {value ? "Pin set — tap to adjust" : "Drop a pin on the map (optional)"}
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
