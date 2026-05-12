'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  onPositionChangeEnd: (pos: [number, number]) => void;
  isOpen?: boolean;
}

// Component to handle map size invalidation when modal opens
function MapResizer({ isOpen }: { isOpen?: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [isOpen, map]);
  return null;
}

// Component to handle map drag — only fires reverse geocode when user physically drags the map
function MapDragHandler({ setPosition, onPositionChangeEnd }: Omit<MapProps, 'position'>) {
  const isDragging = useRef(false);

  useMapEvents({
    dragstart() {
      isDragging.current = true;
    },
    dragend() {
      isDragging.current = false;
    },
    moveend(e) {
      // Only trigger reverse geocode for USER-initiated drags, not programmatic flyTo
      if (isDragging.current) {
        isDragging.current = false;
        const center = e.target.getCenter();
        setPosition([center.lat, center.lng]);
        onPositionChangeEnd([center.lat, center.lng]);
      }
    }
  });
  return null;
}

// Component to update map center when position changes externally (e.g. search result click)
function MapCenterUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  const prevPos = useRef<[number, number]>(position);

  useEffect(() => {
    // Only fly if the position actually changed (prevents loops)
    if (prevPos.current[0] !== position[0] || prevPos.current[1] !== position[1]) {
      prevPos.current = position;
      map.flyTo(position, 17, { duration: 1 });
    }
  }, [position, map]);

  return null;
}

export default function Map({ position, setPosition, onPositionChangeEnd, isOpen }: MapProps) {
  const initialPos = useRef(position);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={initialPos.current} 
        zoom={16} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapDragHandler setPosition={setPosition} onPositionChangeEnd={onPositionChangeEnd} />
        <MapCenterUpdater position={position} />
        <MapResizer isOpen={isOpen} />
      </MapContainer>
    </div>
  );
}
