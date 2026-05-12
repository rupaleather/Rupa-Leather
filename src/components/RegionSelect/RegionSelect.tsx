'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import styles from './RegionSelect.module.css';

interface RegionSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  showSearch?: boolean;
}

export default function RegionSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Pilih',
  disabled = false,
  required = false,
  loading = false,
  showSearch = true
}: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = (options || []).filter(opt => {
    if (opt === null || opt === undefined) return false;
    const optStr = String(opt);
    return optStr.toLowerCase().includes((search || '').toLowerCase());
  });

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      
      <div 
        className={`${styles.selectTrigger} ${isOpen ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value === 'Pilih' || !value ? styles.placeholder : styles.value}>
          {value || placeholder}
        </span>
        <FiChevronDown className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {showSearch && (
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder={`Cari ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            {search && (
              <FiX className={styles.clearIcon} onClick={() => setSearch('')} />
            )}
          </div>
          )}
          
          <div className={styles.optionsList}>
            {loading ? (
              <div className={styles.noResults}>Memuat data...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => (
                <div 
                  key={i} 
                  className={`${styles.option} ${value === opt ? styles.selected : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>Tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
