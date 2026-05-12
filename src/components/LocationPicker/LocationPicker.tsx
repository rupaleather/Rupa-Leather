'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FiX, FiSearch, FiMapPin, FiLoader, FiInfo } from 'react-icons/fi';
import styles from './LocationPicker.module.css';

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className={styles.loadingText}>Memuat Peta...</div>
});

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, lat: number, lng: number, note: string) => void;
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  initialNote?: string;
}

export default function LocationPicker({ isOpen, onClose, onSelectLocation, initialAddress, initialLat, initialLng, initialNote }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInteractingWithMap, setIsInteractingWithMap] = useState(false);

  // Default to Tugu Yogyakarta if no initial location
  const [position, setPosition] = useState<[number, number]>([-7.7829, 110.3671]);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || '');
  const [note, setNote] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Sync with initial values when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedAddress(initialAddress || '');
      setNote(initialNote || '');
      if (initialLat && initialLng) {
        setPosition([initialLat, initialLng]);
      }
    }
  }, [isOpen, initialAddress, initialLat, initialLng, initialNote]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reverseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipReverseRef = useRef(false); // Flag to skip reverse geocode after search selection

  // Focus effect for search input
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen && isInteractingWithMap && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isInteractingWithMap]);

  // Initial geocode if address is empty when opening map
  useEffect(() => {
    if (isOpen && isInteractingWithMap && !selectedAddress) {
      handlePositionChangeEnd(position);
    }
  }, [isOpen, isInteractingWithMap]);

  // Handle Search Input (Forward Geocoding via Nominatim)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dashboard/geocode?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 800);
  };

  // Handle selecting a search result
  const handleSelectResult = (result: any) => {
    const newPos: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    skipReverseRef.current = true;
    setPosition(newPos);
    setSelectedAddress(result.display_name);
    setIsLoadingAddress(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Reverse Geocoding
  const handlePositionChangeEnd = (newPos: [number, number]) => {
    if (skipReverseRef.current) {
      skipReverseRef.current = false;
      return;
    }

    if (reverseTimeoutRef.current) clearTimeout(reverseTimeoutRef.current);

    setIsLoadingAddress(true);
    reverseTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dashboard/geocode?lat=${newPos[0]}&lon=${newPos[1]}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        if (data && data.display_name) {
          setSelectedAddress(data.display_name);
        } else {
          setSelectedAddress(`Lokasi: ${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`);
        }
      } catch (err) {
        console.error('Reverse geocode error', err);
        setSelectedAddress(`Lokasi: ${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`);
      } finally {
        setIsLoadingAddress(false);
      }
    }, 1200);
  };

  const handleSave = () => {
    onSelectLocation(selectedAddress, position[0], position[1], note);
    onClose();
  };

  return (
    <div className={`${styles.modalOverlay} ${!isOpen ? styles.hidden : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isInteractingWithMap ? 'Pilih Lokasi di Map' : 'Pengaturan Lokasi'}</h2>
          <button className={styles.closeBtn} onClick={() => {
            if (isInteractingWithMap) {
              setIsInteractingWithMap(false);
            } else {
              onClose();
            }
          }}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.body}>
          {!isInteractingWithMap ? (
            <>
              {/* Form View (Screenshot) */}
              <div className={styles.infoAlert}>
                <FiInfo size={20} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>Pastikan lokasi yang ditandai pada peta sudah sesuai dengan alamat</span>
              </div>

              <div>
                <label className={styles.innerLabel} style={{ marginBottom: '0.75rem' }}>Lokasi di Map*</label>
                <div className={styles.mapPreview}>
                  <span>Pilih alamat dalam peta</span>
                  <button className={styles.mapPreviewBtn} onClick={() => setIsInteractingWithMap(true)}>
                    Ubah Lokasi
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className={styles.labelContainer}>
                  <label>Alamat *</label>
                  <span className={styles.charCount}>{selectedAddress.length}/200</span>
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="Contoh: Jalan Sudirman No. B6"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  maxLength={200}
                />
              </div>

              <div>
                <div className={styles.labelContainer}>
                  <label>Catatan/Patokan <span className={styles.optionalBadge}>opsional</span></label>
                  <span className={styles.charCount}>{note.length}/100</span>
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="Contoh: Depan Kantor Cabang Mandiri Sudirman"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={100}
                />
              </div>
            </>
          ) : (
            <>
              {/* Map Interaction View */}
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Cari lokasi, alamat, atau nama jalan..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                {searchResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={styles.searchResultItem}
                        onClick={() => handleSelectResult(result)}
                      >
                        {result.display_name}
                      </div>
                    ))}
                  </div>
                )}
                {isSearching && (
                  <div className={styles.searchResults}>
                    <div className={styles.searchResultItem}>Mencari...</div>
                  </div>
                )}
              </div>

              <div className={styles.mapContainerWrapper}>
                <Map
                  position={position}
                  setPosition={setPosition}
                  onPositionChangeEnd={handlePositionChangeEnd}
                  isOpen={isOpen}
                />
                <div className={styles.centerMarkerOverlay}>
                  <button className={styles.floatingSaveBtn} onClick={() => setIsInteractingWithMap(false)}>
                    Pilih alamat ini
                  </button>
                  <img src="/images/logo/logo-maps.png" alt="Pin" className={styles.markerLogo} />
                </div>
              </div>

              <div className={styles.selectedAddress}>
                <FiMapPin className={styles.pinIcon} size={20} />
                <p className={styles.addressText}>
                  {isLoadingAddress ? 'Membaca lokasi...' : selectedAddress}
                </p>
              </div>
            </>
          )}
        </div>

        <div className={styles.footer} style={{ justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
          <button className={styles.batalLinkBtn} onClick={onClose}>Batal</button>
          <button className={styles.simpanSolidBtn} onClick={handleSave}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
