'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiRotateCcw, FiRotateCw, FiRepeat } from 'react-icons/fi';
import styles from './ImageEditor.module.css';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  onSave: (editedImage: string) => void;
}

export default function ImageEditor({ isOpen, onClose, image, onSave }: ImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setIsMirrored(false);
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent, handle: string | null = null) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart({ 
      x: e.clientX, 
      y: e.clientY, 
      cropX: crop.x, 
      cropY: crop.y,
      cropW: crop.width,
      cropH: crop.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

      setCrop(prev => {
        let { x, y, width, height } = { ...prev };

        if (!activeHandle) { // Dragging the whole box
          x = Math.max(0, Math.min(100 - width, dragStart.cropX + dx));
          y = Math.max(0, Math.min(100 - height, dragStart.cropY + dy));
        } else {
          if (activeHandle.includes('t')) {
            const newY = Math.max(0, Math.min(dragStart.cropY + dragStart.cropH - 5, dragStart.cropY + dy));
            height = dragStart.cropH - (newY - dragStart.cropY);
            y = newY;
          }
          if (activeHandle.includes('b')) {
            height = Math.max(5, Math.min(100 - dragStart.cropY, dragStart.cropH + dy));
          }
          if (activeHandle.includes('l')) {
            const newX = Math.max(0, Math.min(dragStart.cropX + dragStart.cropW - 5, dragStart.cropX + dx));
            width = dragStart.cropW - (newX - dragStart.cropX);
            x = newX;
          }
          if (activeHandle.includes('r')) {
            width = Math.max(5, Math.min(100 - dragStart.cropX, dragStart.cropW + dx));
          }
        }

        return { x, y, width, height };
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, activeHandle]);

  const handleSave = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const size = Math.max(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      if (isMirrored) ctx.scale(-1, 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const finalCanvas = document.createElement('canvas');
      const cropW = (crop.width * size) / 100;
      const cropH = (crop.height * size) / 100;

      // Aggressive resize for logos to stay well under 10MB limit
      const MAX_SIZE = 800;
      let finalW = cropW;
      let finalH = cropH;

      if (cropW > MAX_SIZE || cropH > MAX_SIZE) {
        if (cropW > cropH) {
          finalW = MAX_SIZE;
          finalH = (cropH / cropW) * MAX_SIZE;
        } else {
          finalH = MAX_SIZE;
          finalW = (cropW / cropH) * MAX_SIZE;
        }
      }

      finalCanvas.width = finalW;
      finalCanvas.height = finalH;
      const finalCtx = finalCanvas.getContext('2d');
      if (finalCtx) {
        finalCtx.drawImage(
          canvas,
          (crop.x * size) / 100,
          (crop.y * size) / 100,
          cropW,
          cropH,
          0,
          0,
          finalW,
          finalH
        );
        // Use JPEG 0.7 for maximum safety
        onSave(finalCanvas.toDataURL('image/jpeg', 0.7));
      }
    };
  };

  if (!isOpen || !image) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 style={{ fontFamily: 'serif', fontSize: '1.5rem', fontWeight: 700 }}>Potong Gambar</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.editorWrapper} ref={containerRef}>
            <div className={styles.imageContainer}>
              <img 
                src={image} 
                className={styles.image} 
                style={{ 
                  transform: `rotate(${rotation}deg) scaleX(${isMirrored ? -1 : 1})` 
                }} 
              />
              <div 
                className={styles.cropBox}
                style={{ 
                  left: `${crop.x}%`, 
                  top: `${crop.y}%`, 
                  width: `${crop.width}%`, 
                  height: `${crop.height}%` 
                }}
                onMouseDown={(e) => handleMouseDown(e)}
              >
                <div className={styles.cropGrid}></div>
                <div 
                  className={`${styles.handle} ${styles.tl}`} 
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'tl'); }}
                ></div>
                <div 
                  className={`${styles.handle} ${styles.tr}`} 
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'tr'); }}
                ></div>
                <div 
                  className={`${styles.handle} ${styles.bl}`} 
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'bl'); }}
                ></div>
                <div 
                  className={`${styles.handle} ${styles.br}`} 
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'br'); }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <button onClick={() => setRotation(r => r - 90)} className={styles.controlBtn}>
              <FiRotateCcw /> <span>Putar Kiri</span>
            </button>
            <button onClick={() => setRotation(r => r + 90)} className={styles.controlBtn}>
              <FiRotateCw /> <span>Putar Kanan</span>
            </button>
            <button onClick={() => setIsMirrored(!isMirrored)} className={styles.controlBtn}>
              <FiRepeat /> <span>Mirroring</span>
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Batal</button>
          <button className={styles.saveBtn} onClick={handleSave}>Simpan</button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
