'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import styles from './Gallery.module.css';

type Photo = { id: string; width: number; height: number; alt: string };
const PAGE_SIZE = 18;

function PhotoViewer({ photos, initialIndex, onClose }: { photos: Photo[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  const move = (direction: number) => setIndex(current => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={dialog} className={styles.dialog} aria-label="Pregled fotografija"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
    <div className={styles.viewer}>
      <div className={styles.viewerHeader}>
        <span aria-live="polite" aria-atomic="true">Fotografija {index + 1} / {photos.length}</span>
        <button type="button" className={styles.viewerButton} onClick={onClose} aria-label="Zatvori fotografiju" autoFocus><X size={23} /></button>
      </div>
      <div className={styles.stage}>
        {/* Originals retain their full framing; thumbnails are used only in the grid. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo.id} src={`/gallery/${photo.id}.jpg`} width={photo.width} height={photo.height} alt={photo.alt} />
      </div>
      <div className={styles.viewerFooter}>
        <button type="button" className={styles.viewerButton} onClick={() => move(-1)} aria-label="Prethodna fotografija"><ChevronLeft size={24} /></button>
        <p>{photo.alt}</p>
        <button type="button" className={styles.viewerButton} onClick={() => move(1)} aria-label="Sljedeća fotografija"><ChevronRight size={24} /></button>
      </div>
    </div>
  </dialog>;
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const firstNewPhoto = useRef<HTMLButtonElement>(null);
  const focusNewPhoto = useRef(false);

  useEffect(() => {
    if (focusNewPhoto.current) {
      firstNewPhoto.current?.focus({ preventScroll: true });
      focusNewPhoto.current = false;
    }
  }, [visibleCount]);

  return <>
    <div className={styles.toolbar}><h2>Detalji s terena</h2><span>{photos.length} fotografija</span></div>
    <div className={styles.grid}>
      {photos.slice(0, visibleCount).map((photo, index) => <button
        ref={index === visibleCount - PAGE_SIZE ? firstNewPhoto : undefined}
        className={styles.tile} type="button" key={photo.id}
        aria-label={`Otvori fotografiju: ${photo.alt}`} aria-haspopup="dialog"
        onClick={() => setSelectedIndex(index)}>
        {/* Pre-sized local thumbnails avoid loading full originals in the grid. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/gallery/${photo.id}-thumb.jpg`} width={photo.width} height={photo.height} alt={photo.alt} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
        <span className={styles.expand} aria-hidden="true"><Expand size={19} /></span>
      </button>)}
    </div>
    <div className={styles.more}>
      <p role="status">Prikazano {Math.min(visibleCount, photos.length)} od {photos.length} fotografija</p>
      {visibleCount < photos.length && <button type="button" className="btn secondary" onClick={() => {
        focusNewPhoto.current = true;
        setVisibleCount(current => current + PAGE_SIZE);
      }}>Prikaži više fotografija</button>}
    </div>
    {selectedIndex !== null && <PhotoViewer photos={photos} initialIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />}
  </>;
}
