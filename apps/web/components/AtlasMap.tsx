"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

type AtlasMapProps = {
  center?: [number, number];
  zoom?: number;
};

export default function AtlasMap({ center = [0, 20], zoom = 1.8 }: AtlasMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) {
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, [center, zoom]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
